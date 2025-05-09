'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    RegistrationType,
    UserType,
    FormSchema,
    FormField,
    type FormData,
    UploadedFilePaths,
    Category,
} from '@/types/registration';
import { InputField } from './InputField';
declare const Swal: any;

interface RegistrationFormProps {
    registrationType: RegistrationType;
    formSchema: FormSchema;
    onSuccessRedirectPath?: string;
    initialCategory?: Category | null;
}

// --- Helper Functions ---
const determineUserType = (email: string | null | undefined): UserType => {
    if (!email) return 'EXTERNAL';
    const [localPart, domain] = email.split('@');
    const isInternal =
        localPart && domain === 'john.petra.ac.id' && /^[A-Za-z]\d{8}$/.test(localPart);
    return isInternal ? 'INTERNAL' : 'EXTERNAL';
};

const getDraftStorageKey = (email: string | undefined | null, regType: RegistrationType): string | null => {
    if (!email) return null;
    return `${regType}-draft-${email}`;
};

// --- Main Component ---
export function RegistrationForm({
    registrationType,
    formSchema,
    onSuccessRedirectPath = '/',
    initialCategory,
}: RegistrationFormProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const userEmail = session?.user?.email;
    const userName = session?.user?.name;
    const userType = useMemo(() => determineUserType(userEmail), [userEmail]);

    const [isInitializing, setIsInitializing] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({});
    const [uploadedFilePaths, setUploadedFilePaths] = useState<UploadedFilePaths>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const hasInitialized = useRef(false);
    const initialLoadComplete = useRef(false);

    // --- API URLs ---
    const profileApiUrl = `/api/${registrationType}/profile`;
    const draftApiUrl = `/api/${registrationType}/draft`;
    const submitApiUrl = `/api/${registrationType}/submit`;
    const uploadApiUrl = `/api/upload`;

    // --- Helper to get default form data from schema ---
    const getDefaultFormData = useCallback((schema: FormSchema): FormData => {
        const defaults: FormData = {};
        schema.forEach(section => {
            const shouldRenderSection = !section.condition || section.condition(defaults, userType);
            if (!shouldRenderSection) return

            section.fields.forEach(field => {
                const shouldRenderField = !field.condition || field.condition(defaults, userType);

                if (shouldRenderField) {
                    defaults[field.id] = field.defaultValue ?? (field.type === 'checkbox' ? false : '');
                    if (field.id === 'email' && field.type === 'readonly') {
                        defaults[field.id] = userEmail || '';
                    }
                    if (field.id === 'name' && field.type === 'readonly') {
                        defaults[field.id] = userName || '';
                    }
                }
            });
        });
        return defaults;
    }, [userType, userEmail, userName]);

    // --- Fetch Initial Data (Profile/Draft) ---
    const fetchServerData = useCallback(async (): Promise<Partial<FormData> | null> => {
        console.log(`[${registrationType}] Attempting fetch initial server data...`);
        try {
            const res = await fetch(profileApiUrl);
            if (res.ok) {
                const data = await res.json();
                console.log(`[${registrationType}] Received initial server data:`, data);
                if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
                    return data as Partial<FormData>;
                } else {
                    console.warn(`[${registrationType}] Server profile OK but data not object:`, data);
                    return null;
                }
            } else if (res.status === 404) {
                console.log(`[${registrationType}] Initial server data fetch 404 (No profile/draft found).`);
                return null;
            } else {
                const errorText = await res.text();
                console.error(`[${registrationType}] Failed fetch server data (${res.status}): ${errorText}`);
                return null;
            }
        } catch (error) {
            console.error(`[${registrationType}] Client error fetching server data:`, error);
            return null;
        }
    }, [profileApiUrl, registrationType]);

    // --- Initialization Effect ---
    useEffect(() => {
        if (status === 'unauthenticated') {
            const nextUrl = encodeURIComponent(`/registration/${registrationType}`);
            router.replace(`/login?next=${nextUrl}`);
            return;
        }

        if (status === 'loading') {
            if (!isInitializing) setIsInitializing(true);
            return;
        }

        if (status === 'authenticated' && userEmail && !hasInitialized.current) {
            console.log(`[${registrationType}] INIT: User ${userEmail} authenticated. Starting initialization.`);
            setIsInitializing(true);
            hasInitialized.current = true;
            initialLoadComplete.current = false;

            const storageKey = getDraftStorageKey(userEmail, registrationType);
            let localDraftData: Partial<FormData> | null = null;
            if (storageKey) {
                console.log(`[${registrationType}] INIT: Checking local storage key: ${storageKey}`);
                try {
                    const rawDraft = localStorage.getItem(storageKey);
                    if (rawDraft) {
                        const parsedDraft = JSON.parse(rawDraft);
                        if (typeof parsedDraft === 'object' && parsedDraft !== null && !Array.isArray(parsedDraft)) {
                            console.log(`[${registrationType}] INIT: Found valid local storage draft.`, parsedDraft);
                            localDraftData = parsedDraft;
                        } else {
                            console.warn(`[${registrationType}] INIT: Local storage data is invalid format. Removing.`);
                            localStorage.removeItem(storageKey);
                        }
                    } else {
                        console.log(`[${registrationType}] INIT: No data found in local storage.`);
                    }
                } catch (error) {
                    console.error(`[${registrationType}] INIT: Error reading/parsing local storage. Removing potentially corrupt data.`, error);
                    localStorage.removeItem(storageKey);
                }
            }

            console.log(`[${registrationType}] INIT: Fetching server data...`);
            fetchServerData().then((serverData) => {
                console.log(`[${registrationType}] INIT: Server fetch complete. Server Data:`, serverData);
                console.log(`[${registrationType}] INIT: Local Draft available for merge:`, localDraftData);

                const defaultFormState = getDefaultFormData(formSchema);
                let mergedFormState: FormData = { ...defaultFormState };
                let mergedFilePaths: UploadedFilePaths = {};

                if (serverData) {
                    console.log(`[${registrationType}] INIT: Merging Server data over defaults...`);
                    formSchema.forEach(section => {
                        section.fields.forEach(field => {
                            if (serverData.hasOwnProperty(field.id)) {
                                const serverValue = serverData[field.id as keyof typeof serverData];
                                mergedFormState[field.id] = serverValue ?? defaultFormState[field.id];
                                if (field.type === 'file' && typeof serverValue === 'string' && serverValue) {
                                    mergedFilePaths[field.id] = serverValue;
                                }
                            }
                        });
                    });
                }

                if (localDraftData) {
                    console.log(`[${registrationType}] INIT: Merging Local data over current state...`);
                    formSchema.forEach(section => {
                        section.fields.forEach(field => {
                            if (localDraftData!.hasOwnProperty(field.id) && localDraftData![field.id] !== undefined) {
                                const localValue = localDraftData![field.id];
                                mergedFormState[field.id] = localValue;

                                if (field.type === 'file') {
                                    if (typeof localValue === 'string' && localValue) {
                                        mergedFilePaths[field.id] = localValue;
                                    } else {
                                        delete mergedFilePaths[field.id];
                                    }
                                }
                            }
                        });
                    });
                }

                let finalCategory = mergedFormState.category;
                if (initialCategory !== undefined) {
                    console.log(`[${registrationType}] INIT: Applying category from prop: ${initialCategory}`);
                    finalCategory = initialCategory;
                }
                if (finalCategory && !(finalCategory === 'INTERMEDIATE' || finalCategory === 'ADVANCED')) {
                    console.warn(`[${registrationType}] INIT: Final category '${finalCategory}' is invalid. Removing.`);
                    finalCategory = null;
                }

                if (finalCategory) {
                    mergedFormState.category = finalCategory;
                } else {
                    delete mergedFormState.category;
                }

                console.log(`[${registrationType}] INIT: Setting final merged state:`, mergedFormState);
                console.log(`[${registrationType}] INIT: Setting final file paths:`, mergedFilePaths);
                setFormData(mergedFormState);
                setUploadedFilePaths(mergedFilePaths);

                if (storageKey) {
                    const draftToSave = { ...mergedFormState };
                    formSchema.forEach(section => {
                        section.fields.forEach(field => {
                            if (field.type === 'file') {
                                draftToSave[field.id] = mergedFilePaths[field.id] || null;
                            }
                        });
                    });

                    console.log(`[${registrationType}] INIT: Saving final merged state to LS key ${storageKey}:`, draftToSave);
                    localStorage.setItem(storageKey, JSON.stringify(draftToSave));
                }

                setIsInitializing(false);
                initialLoadComplete.current = true;
                console.log(`[${registrationType}] INIT: Initialization complete (merged).`);

            }).catch(error => {
                console.error(`[${registrationType}] INIT: Error during server data fetch or merging process.`, error);
                setIsInitializing(false);
                const fallbackState = localDraftData ? { ...localDraftData } : getDefaultFormData(formSchema);
                let fallbackPaths: UploadedFilePaths = {};
                if (localDraftData) {
                    console.log(`[${registrationType}] INIT (Error Fallback): Extracting file paths from local draft...`);
                    formSchema.forEach(section => {
                        section.fields.forEach(field => {
                            const localValue = localDraftData![field.id];
                            if (field.type === 'file' && typeof localValue === 'string' && localValue) {
                                fallbackPaths[field.id] = localValue;
                            }
                        });
                    });
                }
                if (initialCategory !== undefined) {
                    if (initialCategory) fallbackState.category = initialCategory;
                    else delete fallbackState.category;
                }
                setFormData(fallbackState as FormData);
                setUploadedFilePaths(fallbackPaths);
                initialLoadComplete.current = true;
            });

        } else if (status === 'authenticated' && !userEmail && !hasInitialized.current) {
            console.warn(`[${registrationType}] INIT: Status authenticated but user email is missing. Cannot initialize.`);
            setIsInitializing(false);
        }
    }, [status, userEmail, registrationType, fetchServerData, getDefaultFormData, formSchema, router, initialCategory]);


    // --- Save Draft to Local Storage ---
    useEffect(() => {
        if (isInitializing || !initialLoadComplete.current || status !== 'authenticated' || !userEmail) {
            return;
        }

        const key = getDraftStorageKey(userEmail, registrationType);
        if (!key) return;

        const draftData = { ...formData };
        formSchema.forEach(section => {
            section.fields.forEach(field => {
                if (field.type === 'file') {
                    draftData[field.id] = uploadedFilePaths[field.id] || null;
                }
            });
        });


        console.log(`[${registrationType}] DRAFT SAVE (LS): Saving for key ${key}`, draftData);
        localStorage.setItem(key, JSON.stringify(draftData));

    }, [formData, uploadedFilePaths, registrationType, isInitializing, status, userEmail]);

    // --- Periodic Sync Draft with Server ---
    useEffect(() => {
        if (isInitializing || status !== 'authenticated' || !userEmail) return;

        console.log(`[${registrationType}] SYNC: Setting up periodic draft sync interval.`);
        const interval = setInterval(async () => {
            const storageKey = getDraftStorageKey(userEmail, registrationType);
            if (!storageKey) return;

            const raw = localStorage.getItem(storageKey);
            if (!raw) {
                console.log(`[${registrationType}] SYNC: No draft in LS to sync.`);
                return;
            }

            try {
                const parsedDraft = JSON.parse(raw);
                if (typeof parsedDraft !== 'object' || parsedDraft === null || Array.isArray(parsedDraft)) {
                    console.error(`[${registrationType}] SYNC: Invalid data in LS draft. Skipping sync.`, parsedDraft);
                    localStorage.removeItem(storageKey);
                    return;
                }

                const allowedDraftKeys = [
                    'category', 'age', 'whatsapp', 'proofOfPayment', 'ktmPath',
                    'idCardPath', 'nrp', 'batch', 'major', 'instance'
                ];
                const draftToSend: Partial<FormData> = {};
                for (const key of allowedDraftKeys) {
                    if (parsedDraft.hasOwnProperty(key) && parsedDraft[key] !== undefined && parsedDraft[key] !== null) {
                        draftToSend[key] = parsedDraft[key];
                    }
                }

                if (Object.keys(draftToSend).length > 0) {
                    console.log(`[${registrationType}] SYNC: Syncing draft to server (${draftApiUrl}):`, draftToSend);
                    const res = await fetch(draftApiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(draftToSend),
                    });

                    if (!res.ok) {
                        const errorText = await res.text();
                        console.error(`[${registrationType}] SYNC: Draft sync failed (${res.status}): ${errorText}`);
                    } else {
                        console.log(`[${registrationType}] SYNC: Draft sync successful.`);
                    }
                } else {
                    console.log(`[${registrationType}] SYNC: Draft is empty after cleaning, skipping server sync.`);
                }
            } catch (e) {
                console.error(`[${registrationType}] SYNC: Failed to process/sync draft:`, e);
            }
        }, 60_000);

        return () => {
            console.log(`[${registrationType}] SYNC: Clearing periodic sync interval.`);
            clearInterval(interval);
        };
    }, [isInitializing, status, userEmail, registrationType, draftApiUrl]);

    const isSubmitDisabled = useMemo(() => {
        if (isSubmitting) return true;

        return formSchema.some(section => {
            const isSectionVisible = !section.condition || section.condition(formData, userType);
            if (!isSectionVisible) {
                return false;
            }

            return section.fields.some(field => {
                const isFieldVisible = !field.condition || field.condition(formData, userType);
                if (!isFieldVisible) {
                    return false;
                }

                if (!field.required) {
                    return false;
                }

                if (field.type === 'file') {
                    return !uploadedFilePaths[field.id];
                }
                if (field.type === 'checkbox') {
                    return !formData[field.id];
                }
                const value = formData[field.id];
                return value === null || value === undefined || String(value).trim() === '';
            });
        });
    }, [isSubmitting, formSchema, formData, userType, uploadedFilePaths]);

    // --- File Upload Handler ---
    const handleFileUpload = useCallback(async (fieldId: string, file: File, fieldConfig: FormField) => {
        if (!userEmail || !userName) {
            console.error("User email or name missing for upload");
            alert("Cannot upload file: User information missing.");
            return null;
        }
        if (!fieldConfig.filePurpose) {
            console.error(`File field '${fieldId}' missing 'filePurpose' in schema.`);
            alert(`Configuration error: Cannot determine purpose for file ${file.name}.`);
            return null;
        }

        const prevPath = uploadedFilePaths[fieldId] || undefined;
        const registrationTypeValue = registrationType;
        const filePurposeValue = fieldConfig.filePurpose;

        console.log(`Uploading file for field ${fieldId}, purpose: ${filePurposeValue}, prevPath: ${prevPath}`);

        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('registrationType', registrationTypeValue);
            fd.append('filePurpose', filePurposeValue);
            fd.append('email', userEmail);
            fd.append('name', userName);
            if (prevPath) fd.append('prevPath', prevPath);

            const res = await fetch(uploadApiUrl, { method: 'POST', body: fd });

            if (!res.ok) {
                let errorMsg = 'Server error during upload.';
                try { errorMsg = (await res.json()).message || errorMsg; } catch (e) { errorMsg = await res.text() || errorMsg; }
                console.error(`Upload failed for ${filePurposeValue} (${res.status}): ${errorMsg}`);
                alert(`Upload failed: ${errorMsg}`);
                return null;
            }

            const data = await res.json();
            if (data?.path && typeof data.path === 'string') {
                console.log(`Upload success for ${fieldId}. New path: ${data.path}`);
                setUploadedFilePaths(prev => ({ ...prev, [fieldId]: data.path }));
                setFormData(prev => ({ ...prev, [fieldId]: data.path }));
                setFormErrors(prev => {
                    const next = { ...prev };
                    delete next[fieldId];
                    return next;
                });
                return data.path;
            } else {
                console.error(`Upload response missing path for ${filePurposeValue}:`, data);
                alert(`Upload for ${filePurposeValue} succeeded but path was missing.`);
                return null;
            }
        } catch (error) {
            console.error(`Client-side error during upload for ${filePurposeValue}:`, error);
            alert(`An error occurred trying to upload ${file.name}.`);
            return null;
        }
    }, [userEmail, userName, registrationType, uploadApiUrl, uploadedFilePaths]);

    // --- Form Input Change Handler ---
    const handleInputChange = useCallback((fieldId: string, value: any) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
        if (formErrors[fieldId]) {
            setFormErrors(prev => {
                const next = { ...prev };
                delete next[fieldId];
                return next;
            });
        }
    }, [formErrors]);

    // --- Form Submission Validator ---
    const validateForm = useCallback((): boolean => {
        console.log("Starting validation for userType:", userType);
        const errors: Record<string, string> = {};
        let isValid = true;

        formSchema.forEach(section => {
            const isSectionVisible = !section.condition || section.condition(formData, userType);
            if (!isSectionVisible) return;

            section.fields.forEach(field => {
                const isVisible = !field.condition || field.condition(formData, userType);
                if (!isVisible) return;

                const value = formData[field.id];
                const filePath = uploadedFilePaths[field.id];
                console.log(`Validating visible field: ${field.id}, Required: ${field.required}, Value: ${value}, FilePath: ${filePath}`);

                // A. Required Check
                if (field.required) {
                    if (field.type === 'file') {
                        if (!filePath) {
                            console.log(`Validation fail (Missing File): ${field.id}`);
                            errors[field.id] = `${field.label} is required. Please upload a file.`;
                            isValid = false;
                        }
                    } else if (field.type === 'checkbox') {
                        if (!value) {
                            console.log(`Validation fail (Checkbox unchecked): ${field.id}`);
                            errors[field.id] = `You must accept ${field.label}.`;
                            isValid = false;
                        }
                    }
                    else if (value === null || value === undefined || String(value).trim() === '') {
                        console.log(`Validation fail (Empty Value): ${field.id}`);
                        errors[field.id] = `${field.label} is required.`;
                        isValid = false;
                    }
                }

                // B. Pattern Check
                if (field.pattern && value && !new RegExp(field.pattern).test(String(value))) {
                    console.log(`Validation fail (Pattern Mismatch): ${field.id}`);
                    errors[field.id] = field.title || `Invalid format for ${field.label}.`;
                    isValid = false;
                }

                // C. Number Range Check
                if (field.type === 'number') {
                    if (value !== null && value !== undefined && String(value).trim() !== '') {
                        const numValue = Number(value);
                        if (field.min !== undefined && numValue < Number(field.min)) {
                            console.log(`Validation fail (Min Value): ${field.id}`);
                            errors[field.id] = `${field.label} must be at least ${field.min}.`;
                            isValid = false;
                        }
                        if (field.max !== undefined && numValue > Number(field.max)) {
                            console.log(`Validation fail (Max Value): ${field.id}`);
                            errors[field.id] = `${field.label} must be no more than ${field.max}.`;
                            isValid = false;
                        }
                    }
                }
            });
        });

        console.log("Performing user-type specific checks...");

        // FIX: Compare userType variable against string literals 'INTERNAL' or 'EXTERNAL'
        if (userType === 'INTERNAL') {
            console.log("Checking INTERNAL specific fields...");
            if (!formData.nrp || String(formData.nrp).trim() === '') { errors.nrp = 'NRP is required for Internal users.'; isValid = false; console.log("Validation fail (Missing INTERNAL nrp)"); }
            if (formData.batch === null || formData.batch === undefined || String(formData.batch).trim() === '') { errors.batch = 'Batch is required for Internal users.'; isValid = false; console.log("Validation fail (Missing INTERNAL batch)"); } // More robust check for number/empty
            if (!formData.major || String(formData.major).trim() === '') { errors.major = 'Major is required for Internal users.'; isValid = false; console.log("Validation fail (Missing INTERNAL major)"); }
            if (!uploadedFilePaths.ktmPath) { errors.ktmPath = 'KTM is required for Internal users.'; isValid = false; console.log("Validation fail (Missing INTERNAL ktmPath)"); }
        } else if (userType === 'EXTERNAL') {
            console.log("Checking EXTERNAL specific fields...");
            if (!formData.instance || String(formData.instance).trim() === '') { errors.instance = 'Institution/School is required for External users.'; isValid = false; console.log("Validation fail (Missing EXTERNAL instance)"); }
            if (!uploadedFilePaths.idCardPath) { errors.idCardPath = 'ID Card (KTP/Student Card) is required for External users.'; isValid = false; console.log("Validation fail (Missing EXTERNAL idCardPath)"); }
        }

        console.log("Validation finished. isValid:", isValid, "Errors:", errors);
        setFormErrors(errors);
        return isValid;

    }, [formSchema, formData, uploadedFilePaths, userType]);

    // --- Final Form Submission Handler ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = validateForm();
        if (!isValid) {
            console.log("Form validation failed:", formErrors);
            Swal.fire({
                title: 'Invalid Input',
                text: 'Please correct the errors marked in the form.',
                icon: 'warning',
                confirmButtonColor: '#6366f1'
            });
            return;
        }
        if (!userEmail || !userName) {
            Swal.fire({
                title: 'Error',
                text: 'User session information missing. Please log out and log back in.',
                icon: 'error',
            });
            return;
        }

        setIsSubmitting(true);
        setFormErrors({});

        const submissionPayload: FormData = {};
        formSchema.forEach(section => {
            section.fields.forEach(field => {
                const isVisible = !field.condition || field.condition(formData, userType);
                if (isVisible) {
                    if (field.id === 'category') {
                        submissionPayload.category = formData.category;
                    } else if (field.type === 'file') {
                        submissionPayload[field.id] = uploadedFilePaths[field.id] || null;
                    } else if (field.type === 'number' && formData[field.id] !== '') {
                        submissionPayload[field.id] = parseInt(String(formData[field.id]), 10);
                        if (isNaN(submissionPayload[field.id])) {
                            console.warn(`Could not parse number for field ${field.id}, value: ${formData[field.id]}. Sending original.`);
                            submissionPayload[field.id] = formData[field.id];
                        }
                    } else if (field.type !== 'readonly') {
                        submissionPayload[field.id] = formData[field.id];
                    }
                }
            });
        });

        if (!submissionPayload.hasOwnProperty('category') && formData.category) {
            submissionPayload.category = formData.category;
        }

        console.log(`[${registrationType}] Submitting data to ${submitApiUrl}:`, submissionPayload);

        try {
            const res = await fetch(submitApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionPayload),
            });

            if (res.ok) {
                console.log(`[${registrationType}] Submission successful!`);
                const key = getDraftStorageKey(userEmail, registrationType);
                if (key) {
                    console.log(`[${registrationType}] Clearing local storage draft key ${key} after submission.`);
                    localStorage.removeItem(key);
                }
                await Swal.fire({
                    title: 'Success!',
                    text: 'Registration submitted successfully!',
                    icon: 'success',
                    confirmButtonColor: '#4f46e5'
                });
                router.push(onSuccessRedirectPath);
            } else {
                let errorText = 'Submission failed due to a server error.';
                let errorDetails: Record<string, string> | null = null;
                try {
                    const errorData = await res.json();
                    if (typeof errorData.message === 'string') {
                        errorText = errorData.message;
                    } else if (Array.isArray(errorData.message)) {
                        errorText = "Validation failed. Please check the form.";
                        errorDetails = errorData.message.reduce((acc: Record<string, string>, msg: string) => {
                            const fieldName = msg.split(' ')[0];
                            if (fieldName) {
                                acc[fieldName] = msg;
                            }
                            return acc;
                        }, {});

                    }
                } catch (e) {
                    errorText = await res.text() || errorText;
                }

                console.error(`[${registrationType}] Submission failed (${res.status}):`, errorText, errorDetails);
                Swal.fire({
                    title: 'Submission Failed',
                    text: errorText,
                    icon: 'error',
                });

                if (errorDetails) {
                    setFormErrors(errorDetails);
                } else {
                    setFormErrors({ general: errorText });
                }
            }
        } catch (error) {
            console.error(`[${registrationType}] Client-side error during submission:`, error);
            Swal.fire({
                title: 'Error',
                text: 'An unexpected error occurred while submitting. Please try again.',
                icon: 'error',
            });
            setFormErrors({ general: 'An unexpected error occurred.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Render Logic ---
    if (status === 'loading' || isInitializing) {
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold animate-pulse">Loading Registration...</p>;
    }

    if (status !== 'authenticated' || !userEmail) {
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold">Redirecting to login...</p>;
    }

    return (
        <div className="min-h-screen w-full pt-0 pb-8 px-0 md:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white backdrop-blur-md p-6 md:p-8 shadow-xl rounded-lg border border-gray-200">
                <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6 capitalize">
                    {registrationType} Registration
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {formSchema.map(section => {
                        const shouldRenderSection = !section.condition || section.condition(formData, userType);
                        if (!shouldRenderSection) {
                            return null;
                        }
                        return (
                            <fieldset key={section.id} className="border border-gray-300 p-4 rounded-md space-y-4 shadow-sm contents">
                                {section.title && (
                                    <legend className="text-sm font-semibold text-gray-700 px-2 -ml-2">{section.title}</legend>
                                )}
                                {section.fields.map(field => {
                                    const shouldRenderField = !field.condition || field.condition(formData, userType);
                                    if (!shouldRenderField) return null;

                                    return (
                                        <InputField
                                            key={field.id}
                                            field={field}
                                            value={(field.id === 'category' && initialCategory) ? initialCategory : formData[field.id]}
                                            uploadedFilePath={field.type === 'file' ? uploadedFilePaths[field.id] : undefined}
                                            error={formErrors[field.id]}
                                            onChange={handleInputChange}
                                            onFileChange={handleFileUpload}
                                            disabled={isSubmitting || (field.id === 'category' && !!initialCategory)}
                                        />
                                    );
                                })}
                            </fieldset>
                        );
                    })}

                    <button
                        type="submit"
                        className="w-full mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isSubmitDisabled}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                    </button>
                    {Object.keys(formErrors).length > 0 && (
                        <p className="text-sm text-red-600 text-center mt-2">Please fix the errors marked above.</p>
                    )}
                </form>
            </div>
        </div>
    );
}