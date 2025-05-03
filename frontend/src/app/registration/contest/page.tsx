'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FilePurpose, RegistrationType } from '@/types/registration'

type Category = 'INTERMEDIATE' | 'ADVANCED'
type UserType = 'INTERNAL' | 'EXTERNAL'

interface UserProfileData {
    category?: Category | null;
    age?: number | null;
    whatsapp?: string | null;
    proofPath?: string | null;
    nrp?: string | null;
    batch?: number | null;
    major?: string | null;
    ktmPath?: string | null;
    instance?: string | null;
    idCardPath?: string | null;
}

const getDraftStorageKey = (email: string | undefined | null): string | null => {
    if (!email) return null;
    return `contest-draft-${email}`;
}

const loadDraftFromStorage = (email: string | undefined | null) => {
    if (typeof window === 'undefined' || !email) return null;
    const key = getDraftStorageKey(email);
    if (!key) return null;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        return typeof parsed === 'object' ? parsed : null;
    } catch (e) {
        console.error("Failed to parse contest draft from localStorage for key:", key, e);
        localStorage.removeItem(key);
        return null;
    }
}

export default function ContestPage() {
    const { data: session, status } = useSession()
    const userEmail = session?.user?.email;
    const router = useRouter()

    // --- State ---
    const [isInitializing, setIsInitializing] = useState(true);
    const [category, setCategory] = useState<Category | null>(null);

    // Form field states
    const [age, setAge] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [nrp, setNrp] = useState('');
    const [batch, setBatch] = useState('');
    const [major, setMajor] = useState('');
    const [instance, setInstance] = useState('');
    const [uploadedProofPath, setUploadedProofPath] = useState<string | null>(null);
    const [uploadedKtmPath, setUploadedKtmPath] = useState<string | null>(null);
    const [uploadedIdCardPath, setUploadedIdCardPath] = useState<string | null>(null);

    // State for file inputs (transient)
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [ktmFile, setKtmFile] = useState<File | null>(null);
    const [idCardFile, setIdCardFile] = useState<File | null>(null);


    const hasInitialized = useRef(false);

    // --- API Call Function for Initial Data ---
    const fetchServerData = useCallback(async (): Promise<UserProfileData | null> => {
        console.log("Attempting to fetch initial server profile data...");
        try {
            const res = await fetch('/api/contest/profile');
            if (res.ok) {
                const data = await res.json();
                console.log("Received initial server data:", data);
                if (typeof data === 'object' && data !== null) {
                    return data as UserProfileData;
                } else {
                    console.log("Server returned OK but data is not an object:", data);
                    return null;
                }
            } else if (res.status === 404) {
                console.log("Initial server data fetch returned 404 (No profile found).");
                return null;
            }
            else {
                console.error(`Failed to fetch initial server data (${res.status}): ${await res.text()}`);
                return null;
            }
        } catch (error) {
            console.error("Client-side error fetching initial server data:", error);
            return null;
        }
    }, []);

    // 1. Check Authentication & Redirect
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace(`/login?next=${encodeURIComponent('/registration/contest')}`);
        }
    }, [status, router]);

    // 2. Load Initial Draft (including Category) from localStorage ON MOUNT
    useEffect(() => {
        if (status === 'authenticated' && userEmail && !hasInitialized.current) {
            console.log(`CONTEST PAGE INIT: User ${userEmail} authenticated. Starting initialization.`);
            setIsInitializing(true);
            hasInitialized.current = true;

            const storageKey = getDraftStorageKey(userEmail);
            if (storageKey) {
                console.log(`CONTEST PAGE INIT: Clearing local storage draft for key: ${storageKey}`);
                localStorage.removeItem(storageKey);
            }

            fetchServerData().then((serverData) => {
                console.log("CONTEST PAGE INIT: Server fetch completed. Data:", serverData);
                const draftToSave: UserProfileData = {};

                if (serverData && typeof serverData === 'object' && Object.keys(serverData).length > 0) {
                    console.log("CONTEST PAGE INIT: Applying server data to state.");
                    const serverCategory = serverData.category ?? null;
                    const serverAge = serverData.age != null ? String(serverData.age) : '';
                    const serverWhatsapp = serverData.whatsapp ?? '';
                    const serverProofPath = serverData.proofPath ?? null;
                    const serverNrp = serverData.nrp ?? '';
                    const serverBatch = serverData.batch != null ? String(serverData.batch) : '';
                    const serverMajor = serverData.major ?? '';
                    const serverKtmPath = serverData.ktmPath ?? null;
                    const serverInstance = serverData.instance ?? '';
                    const serverIdCardPath = serverData.idCardPath ?? null;

                    setCategory(serverCategory); draftToSave.category = serverCategory;
                    setAge(serverAge); draftToSave.age = serverData.age ?? null;
                    setWhatsapp(serverWhatsapp); draftToSave.whatsapp = serverWhatsapp;
                    setUploadedProofPath(serverProofPath); draftToSave.proofPath = serverProofPath;
                    setNrp(serverNrp); draftToSave.nrp = serverNrp;
                    setBatch(serverBatch); draftToSave.batch = serverData.batch ?? null;
                    setMajor(serverMajor); draftToSave.major = serverMajor;
                    setUploadedKtmPath(serverKtmPath); draftToSave.ktmPath = serverKtmPath;
                    setInstance(serverInstance); draftToSave.instance = serverInstance;
                    setUploadedIdCardPath(serverIdCardPath); draftToSave.idCardPath = serverIdCardPath;

                } else {
                    console.log("CONTEST PAGE INIT: No server data found or fetch failed. Resetting state to defaults.");
                    setCategory(null); draftToSave.category = null;
                    setAge(''); draftToSave.age = null;
                    setWhatsapp(''); draftToSave.whatsapp = null;
                    setUploadedProofPath(null); draftToSave.proofPath = null;
                    setNrp(''); draftToSave.nrp = null;
                    setBatch(''); draftToSave.batch = null;
                    setMajor(''); draftToSave.major = null;
                    setUploadedKtmPath(null); draftToSave.ktmPath = null;
                    setInstance(''); draftToSave.instance = null;
                    setUploadedIdCardPath(null); draftToSave.idCardPath = null;
                    setProofFile(null);
                    setKtmFile(null);
                    setIdCardFile(null);
                }

                if (storageKey) {
                    console.log(`CONTEST PAGE INIT: Saving initialized draft to local storage key ${storageKey}:`, draftToSave);
                    localStorage.setItem(storageKey, JSON.stringify(draftToSave));
                }

                console.log("CONTEST PAGE INIT: Initialization complete.");
                setIsInitializing(false);
            });
        } else if (status !== 'loading' && !userEmail && !hasInitialized.current) {
            console.warn("CONTEST PAGE INIT: Status is not loading, but user email is missing or already initialized.");
            setIsInitializing(false);
        } else if (status === 'loading') {
            console.log("CONTEST PAGE INIT: Session status is loading...");
            setIsInitializing(true);
        }

    }, [status, userEmail, fetchServerData]);

    // 3. Save Draft to localStorage whenever relevant state changes
    useEffect(() => {
        if (isInitializing || status !== 'authenticated' || !userEmail) {
            return;
        }

        const key = getDraftStorageKey(userEmail);
        if (!key) return;

        const draft: UserProfileData = {
            category,
            age: parseInt(age, 10) || null,
            whatsapp,
            nrp,
            batch: parseInt(batch, 10) || null,
            major,
            instance,
            proofPath: uploadedProofPath,
            ktmPath: uploadedKtmPath,
            idCardPath: uploadedIdCardPath
        };

        console.log(`CONTEST PAGE DRAFT SAVE: Saving draft for key ${key}`, draft);
        localStorage.setItem(key, JSON.stringify(draft));

    }, [
        category, age, whatsapp, nrp, batch, major, instance,
        uploadedProofPath, uploadedKtmPath, uploadedIdCardPath,
        isInitializing, userEmail, status
    ]);

    // Effect 4: Periodic Sync Draft with Server (FIXED Cleaning Logic)
    useEffect(() => {
        if (isInitializing || status !== 'authenticated' || !userEmail) return;

        console.log("CONTEST PAGE SYNC: Setting up periodic draft sync interval.");
        const interval = setInterval(async () => {
            const storageKey = getDraftStorageKey(userEmail);
            if (!storageKey) return;

            const raw = localStorage.getItem(storageKey);
            if (!raw) {
                console.log("CONTEST PAGE SYNC: No draft found in local storage to sync.");
                return;
            }

            try {
                const parsedDraft = JSON.parse(raw);
                if (typeof parsedDraft !== 'object' || parsedDraft === null) {
                    console.error("CONTEST PAGE SYNC: Invalid data found in local storage draft. Skipping sync.", parsedDraft);
                    localStorage.removeItem(storageKey);
                    return;
                }

                const cleanedDraftToSend: Record<string, any> = {};
                console.log("CONTEST PAGE SYNC: Raw parsed draft from storage:", parsedDraft);

                for (const key in parsedDraft) {
                    if (Object.prototype.hasOwnProperty.call(parsedDraft, key)) {
                        const value = parsedDraft[key as keyof UserProfileData];

                        if (value !== null && value !== undefined) {
                            if ((key === 'major' || key === 'instance') && value === '') {
                                console.log(`CONTEST PAGE SYNC: Skipping empty string for key: ${key}`);
                                continue;
                            }
                            if (key === 'nrp' && value === '') {
                                console.log(`CONTEST PAGE SYNC: Skipping empty string for key: ${key}`);
                                continue;
                            }

                            cleanedDraftToSend[key] = value;
                        }
                    }
                }

                if (Object.keys(cleanedDraftToSend).length > 0) {
                    console.log(`CONTEST PAGE SYNC: Syncing *cleaned* draft to server for key ${storageKey}:`, cleanedDraftToSend);
                    const res = await fetch('/api/contest/draft', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(cleanedDraftToSend),
                    });

                    if (!res.ok) {
                        try {
                            const errorData = await res.json();
                            console.error(`CONTEST PAGE SYNC: Draft sync failed (${res.status}):`, errorData);
                        } catch (e) {
                            const errorText = await res.text();
                            console.error(`CONTEST PAGE SYNC: Draft sync failed (${res.status}): ${errorText}`);
                        }
                    } else {
                        console.log(`CONTEST PAGE SYNC: Draft sync successful for key ${storageKey}.`);
                    }
                } else {
                    console.log(`CONTEST PAGE SYNC: Cleaned draft is empty, skipping sync for key ${storageKey}.`);
                }
            } catch (e) {
                console.error(`CONTEST PAGE SYNC: Failed to process/sync draft for key ${storageKey}:`, e);
            }
        }, 60_000);

        return () => {
            console.log("CONTEST PAGE SYNC: Clearing periodic draft sync interval.");
            clearInterval(interval);
        };
    }, [isInitializing, status, userEmail]);

    // --- Handlers ---
    const handleSelectCategory = (selectedCategory: Category) => {
        setCategory(selectedCategory);
    };

    const handleChangeCategory = () => {
        setCategory(null);
    };

    // Reusable Upload Function (using shared types)
    async function uploadFile(
        file: File,
        registrationType: RegistrationType,
        filePurpose: FilePurpose,
        email: string,
        name: string,
        prevPath?: string
    ): Promise<string | null> {
        if (!email || !name) {
            console.error("Email or name missing for upload");
            alert("Cannot upload file: User information is missing.");
            return null;
        }
        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('registrationType', registrationType);
            fd.append('filePurpose', filePurpose);
            fd.append('email', email);
            fd.append('name', name);
            if (prevPath) fd.append('prevPath', prevPath);

            const res = await fetch(`/api/upload`, { method: 'POST', body: fd });

            if (!res.ok) {
                let errorMsg = 'Server error during upload.';
                try {
                    const errorData = await res.json();
                    errorMsg = errorData.message || errorMsg;
                } catch (e) {
                    errorMsg = res.statusText || errorMsg;
                }
                console.error(`Upload failed for ${filePurpose}: ${res.status}`, errorMsg);
                alert(`Upload failed: ${errorMsg}. Please check file type/size and try again.`);
                return null;
            }

            const data = await res.json();
            if (data?.path) {
                return data.path as string;
            } else {
                console.error(`Upload response missing path for ${filePurpose}:`, data);
                alert(`Upload for ${filePurpose} succeeded but path was missing in response.`);
                return null;
            }

        } catch (error) {
            console.error(`Client-side error during upload for ${filePurpose}:`, error);
            alert(`An error occurred while trying to upload for ${filePurpose}. Check console.`);
            return null;
        }
    }

    // Final Form Submission Handler
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!category) {
            alert("Category not selected."); return;
        }
        if (!age || !whatsapp) {
            alert('Please fill in Age and WhatsApp number.'); return;
        }
        if (!uploadedProofPath) {
            alert('Please upload Proof of Payment.'); return;
        }
        const currentEmail = session?.user?.email;
        const currentName = session?.user?.name;
        if (!currentEmail || !currentName) {
            alert("User session information is missing. Please try logging out and back in.");
            return;
        }
        const userType = determineUserType(currentEmail);

        if (userType === 'INTERNAL' && !uploadedKtmPath) {
            alert('Please upload your KTM (Student ID Card).'); return;
        }
        if (userType === 'EXTERNAL' && !uploadedIdCardPath) {
            alert('Please upload your ID Card (KTP/Student Card).'); return;
        }
        if (userType === 'INTERNAL' && (!nrp || !batch || !major)) {
            alert('Please fill all Petra Student details (NRP, Batch, Major).'); return;
        }
        if (userType === 'EXTERNAL' && !instance) {
            alert('Please fill in your Institution/School name.'); return;
        }

        const submissionPayload = {
            // name: currentName,
            // email: currentEmail,
            // type: userType,
            category,
            age: parseInt(age, 10),
            whatsapp,
            proofPath: uploadedProofPath,
            nrp: userType === 'INTERNAL' ? nrp : undefined,
            batch: userType === 'INTERNAL' ? (parseInt(batch, 10) || undefined) : undefined,
            major: userType === 'INTERNAL' ? major : undefined,
            ktmPath: userType === 'INTERNAL' ? uploadedKtmPath : undefined,
            instance: userType === 'EXTERNAL' ? instance : undefined,
            idCardPath: userType === 'EXTERNAL' ? uploadedIdCardPath : undefined,
        };

        Object.keys(submissionPayload).forEach(key =>
            (submissionPayload as any)[key] === undefined && delete (submissionPayload as any)[key]
        );

        // --- Send to Final Submission API ---
        try {
            const res = await fetch('/api/contest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionPayload),
            });

            if (res.ok) {
                console.log("Submission successful!");
                const key = getDraftStorageKey(userEmail);
                if (key) {
                    console.log(`Clearing local storage draft for key ${key} after submission.`);
                    localStorage.removeItem(key);
                }
                router.push('/');
            } else {
                let errorText = 'Submission failed due to a server error.';
                try {
                    const errorData = await res.json();
                    errorText = errorData.message || errorText;
                } catch (e) { /* ignore parsing error */ }
                console.error("Submission failed:", res.status, errorText);
                alert(`Submission failed: ${errorText}`);
            }
        } catch (error) {
            console.error("Client-side error during submission:", error);
            alert("An error occurred while submitting your registration. Check console.");
        }
    }

    // --- Helper to determine user type ---
    const determineUserType = (email: string | null | undefined): UserType => {
        if (!email) return 'EXTERNAL';
        const [localPart, domain] = email.split('@');
        const isInternal =
            localPart && domain === 'john.petra.ac.id' && /^[A-Za-z]\d{8}$/.test(localPart);
        return isInternal ? 'INTERNAL' : 'EXTERNAL';
    };

    if (status === 'loading' || isInitializing) {
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold animate-pulse">Loading Registration...</p>;
    }

    if (status !== 'authenticated' || !userEmail) {
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold">Redirecting to login...</p>;
    }

    // Show Category Selection Screen if not yet chosen
    if (!category) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-gradient-to-br from-gray-50 to-gray-200 p-4">
                <h1 className="text-3xl font-bold text-gray-800 text-center">Select Contest Tier</h1>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                    <button
                        onClick={() => handleSelectCategory('INTERMEDIATE')}
                        className="px-8 py-4 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition duration-200 shadow-lg transform hover:scale-105 text-lg font-medium"
                    >
                        Intermediate
                    </button>
                    <button
                        onClick={() => handleSelectCategory('ADVANCED')}
                        className="px-8 py-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition duration-200 shadow-lg transform hover:scale-105 text-lg font-medium"
                    >
                        Advanced
                    </button>
                </div>
            </div>
        );
    }

    // --- Render the Main Form ---
    const currentRegistrationType: RegistrationType = 'contest';
    const name = session!.user!.name!;
    const email = session!.user!.email!;
    const userType = determineUserType(email);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 shadow-xl rounded-lg border border-gray-200">
                <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
                    Contest Registration
                </h1>

                {/* --- Category Display & Change Button --- */}
                <div className="mb-6 p-3 bg-indigo-50 border border-indigo-200 rounded-md flex items-center justify-between shadow-sm">
                    <div>
                        <span className="block text-xs font-medium text-indigo-600">Selected Tier:</span>
                        <span className="text-lg font-semibold text-indigo-900">{category}</span>
                    </div>
                    <button
                        onClick={handleChangeCategory}
                        title="Change category"
                        className="text-indigo-500 hover:text-indigo-800 font-bold text-2xl px-2 rounded-full hover:bg-indigo-100 transition duration-150 leading-none"
                        aria-label="Change category"
                    >
                        × {/* Better 'X' symbol */}
                    </button>
                </div>

                {/* --- Form --- */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Fieldset for Read Only Info */}
                    <fieldset className="border border-gray-300 p-4 rounded-md space-y-3 shadow-sm">
                        <legend className="text-sm font-semibold text-gray-700 px-2 -ml-2">Your Information</legend>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                            <input value={name} readOnly className="w-full bg-gray-100 border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:outline-none cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <input value={email} readOnly className="w-full bg-gray-100 border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:outline-none cursor-not-allowed" />
                        </div>
                    </fieldset>

                    {/* Fieldset for Shared Details */}
                    <fieldset className="border border-gray-300 p-4 rounded-md space-y-4 shadow-sm">
                        <legend className="text-sm font-semibold text-gray-700 px-2 -ml-2">Contact & Payment</legend>
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age <span className="text-red-500">*</span></label>
                            <input
                                id="age" type="number" value={age} min="1"
                                onChange={e => setAge(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp <span className="text-red-500">*</span></label>
                            <input
                                id="whatsapp" type="tel" placeholder="+62 8XX XXXX XXXX" value={whatsapp}
                                onChange={e => setWhatsapp(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                                required pattern="^\+?[0-9\s\-()]*$" title="Enter a valid phone number"
                            />
                        </div>
                        <div>
                            <label htmlFor="proof" className="block text-sm font-medium text-gray-700 mb-1">Proof of Payment <span className="text-red-500">*</span></label>
                            <input
                                id="proof" type="file" accept="image/jpeg,image/png,image/gif,application/pdf"
                                onChange={async e => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setProofFile(file);
                                    const newPath = await uploadFile(file, currentRegistrationType, 'payment', email, name, uploadedProofPath ?? undefined);
                                    if (newPath) setUploadedProofPath(newPath);
                                    else setProofFile(null);
                                }}
                                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer"
                                required={!uploadedProofPath}
                            />
                            {uploadedProofPath && (
                                <div className="text-xs text-green-700 mt-1 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                    Uploaded: {uploadedProofPath.split('/').pop()}
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Max file size: 2MB. Allowed types: JPG, PNG, GIF, PDF.</p>
                        </div>
                    </fieldset>

                    {/* Fieldset for Conditional Fields */}
                    {userType === 'INTERNAL' ? (
                        <fieldset className="border border-gray-300 p-4 rounded-md space-y-4 shadow-sm">
                            <legend className="text-sm font-semibold text-gray-700 px-2 -ml-2">Petra Student Details</legend>
                            {/* NRP, Batch, Major Inputs */}
                            <div>
                                <label htmlFor="nrp" className="block text-sm font-medium text-gray-700 mb-1">NRP <span className="text-red-500">*</span></label>
                                <input id="nrp" value={nrp} onChange={e => setNrp(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition" required pattern="^[A-Za-z]\d{8}$" title="Enter NRP (e.g., c14200001)" />
                            </div>
                            <div>
                                <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">Batch <span className="text-red-500">*</span></label>
                                <input id="batch" type="number" placeholder="e.g., 2022" value={batch} onChange={e => setBatch(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition" required min="2000" max="2024" />
                            </div>
                            <div>
                                <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">Major <span className="text-red-500">*</span></label>
                                <input id="major" value={major} onChange={e => setMajor(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition" required />
                            </div>
                            {/* KTM File Input */}
                            <div>
                                <label htmlFor="ktm" className="block text-sm font-medium text-gray-700 mb-1">KTM (Student ID Card) <span className="text-red-500">*</span></label>
                                <input
                                    id="ktm" type="file" accept="image/jpeg,image/png,image/gif,application/pdf"
                                    onChange={async e => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setKtmFile(file);
                                        const newPath = await uploadFile(file, currentRegistrationType, 'ktm', email, name, uploadedKtmPath ?? undefined);
                                        if (newPath) setUploadedKtmPath(newPath);
                                        else setKtmFile(null);
                                    }}
                                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer"
                                    required={!uploadedKtmPath}
                                />
                                {uploadedKtmPath && (
                                    <div className="text-xs text-green-700 mt-1 flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                        Uploaded: {uploadedKtmPath.split('/').pop()}
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-1">Max file size: 2MB. Allowed types: JPG, PNG, GIF, PDF.</p>
                            </div>
                        </fieldset>
                    ) : (
                        <fieldset className="border border-gray-300 p-4 rounded-md space-y-4 shadow-sm">
                            <legend className="text-sm font-semibold text-gray-700 px-2 -ml-2">External User Details</legend>
                            {/* Institution Input */}
                            <div>
                                <label htmlFor="instance" className="block text-sm font-medium text-gray-700 mb-1">Institution/School <span className="text-red-500">*</span></label>
                                <input id="instance" value={instance} onChange={e => setInstance(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition" required />
                            </div>
                            {/* ID Card File Input */}
                            <div>
                                <label htmlFor="idCard" className="block text-sm font-medium text-gray-700 mb-1">ID Card (KTP/Student Card) <span className="text-red-500">*</span></label>
                                <input
                                    id="idCard" type="file" accept="image/jpeg,image/png,image/gif,application/pdf"
                                    onChange={async e => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setIdCardFile(file);
                                        const newPath = await uploadFile(file, currentRegistrationType, 'idCard', email, name, uploadedIdCardPath ?? undefined);
                                        if (newPath) setUploadedIdCardPath(newPath);
                                        else setIdCardFile(null);
                                    }}
                                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer"
                                    required={!uploadedIdCardPath}
                                />
                                {uploadedIdCardPath && (
                                    <div className="text-xs text-green-700 mt-1 flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                        Uploaded: {uploadedIdCardPath.split('/').pop()}
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-1">Max file size: 2MB. Allowed types: JPG, PNG, GIF, PDF.</p>
                            </div>
                        </fieldset>
                    )}

                    {/* --- Submission Button --- */}
                    <button
                        type="submit"
                        className="w-full mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={
                            !age || !whatsapp || !uploadedProofPath ||
                            (userType === 'INTERNAL' && (!nrp || !batch || !major || !uploadedKtmPath)) ||
                            (userType === 'EXTERNAL' && (!instance || !uploadedIdCardPath))
                        }
                    >
                        Submit Registration
                    </button>
                </form>
            </div>
        </div>
    );
}