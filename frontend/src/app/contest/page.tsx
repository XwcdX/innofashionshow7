'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SubmissionForm } from '@/app/components/SubmissionForm';
import { contestSubmitSchema } from '@/config/forms/contestSchema';
import { type FormData, RegistrationType, Category } from '@/types/registration';

const getDraftStorageKey = (email: string | undefined | null, regType: RegistrationType): string | null => {
    if (!email) return null;
    return `${regType}-draft-${email}`;
};

const getCategory = async () => {
    try {
        // Make the API request to get the category
        const res = await fetch('/api/lomba/getCategory');
        
        // Check if the response is OK (status 200)
        if (res.ok) {
            const data = await res.json();  // Assuming the response is JSON
            console.log("Received category:", data);

            // You can return the category or use it directly
            return data;
        } else {
            console.error("Failed to fetch category. Response not OK:", res.status);
            return null;
        }
    } catch (error) {
        console.error("Error fetching category:", error);
        return null;
    }
};

const getValidateStatus = async () => {
    try {
        // Make the API request to get the category
        const res = await fetch('/api/lomba/getValidate');
        
        // Check if the response is OK (status 200)
        if (res.ok) {
            const data = await res.json();  // Assuming the response is JSON
            console.log("Received validation status:", data);

            // You can return the category or use it directly
            return data;
        } else {
            console.error("Failed to fetch validation status. Response not OK:", res.status);
            return null;
        }
    } catch (error) {
        console.error("Error fetching validation status:", error);
        return null;
    }
};

const getSubmissionStatus = async () => {
    try {
        const res = await fetch('/api/creation/getCreationStatus');
        
        // Check if the response is OK (status 200)
        if (res.ok) {
            const data = await res.json();  // Assuming the response is JSON
            console.log("Received submission data:", data);

            return data;
        } else {
            console.error("Failed to fetch submission data. Response not OK:", res.status);
            return null;
        }
    } catch (error) {
        console.error("Error fetching submission data:", error);
        return null;
    }
};

// --- Main Page Component ---
export default function ContestSubmissionPage() {
    const [validationStatus, setValidationStatus] = useState<boolean | null>(null);
    // if (!validationStatus){
    //     return (
    //         <div></div>
    //     );
    // }

    const { data: session, status } = useSession();
    const router = useRouter();
    const userEmail = session?.user?.email;
    const registrationType: RegistrationType = 'contest';

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [creationStatus, setCreationStatus] = useState<Boolean | null>(null);
    const [isLoadingAll, setIsLoadingAll] = useState(true); // New flag

    useEffect(() => {
        const fetchAllData = async () => {
            if (status === 'loading') {
                setIsLoadingAll(true);
                return;
            }

            if (status === 'unauthenticated') {
                const nextUrl = encodeURIComponent(`/registration/${registrationType}`);
                router.replace(`/login?next=${nextUrl}`);
                return;
            }

            if (status === 'authenticated' && userEmail) {
                setIsLoadingAll(true); // Start loading all
                (async () => {
                    const serverData = await getValidateStatus(); // Await async function
                    if (serverData?.validateStatus) {
                        console.log('Found validation status from server:', serverData.validateStatus);
                        setValidationStatus(serverData.validateStatus)
                    } else {
                        console.log('No valid category found on server.');
                    }
                })();
                (async () => {
                    const serverData = await getSubmissionStatus(); // Await async function
                    if (serverData?.creationStatus) {
                        console.log('Found submission status from server:', serverData.creationStatus);
                        setCreationStatus(serverData.creationStatus)
                    } else {
                        console.log('No submission status found on server.');
                    }
                })();
                console.log('Authenticated, checking localStorage for category...');
                setIsLoadingAll(true);
                const storageKey = getDraftStorageKey(userEmail, registrationType);
                let foundCategory: Category | null = null;

                if (storageKey) {
                    try {
                        const rawDraft = localStorage.getItem(storageKey);
                        if (rawDraft) {
                            const parsedDraft: Partial<FormData> = JSON.parse(rawDraft);
                            if (parsedDraft.category && (parsedDraft.category === 'INTERMEDIATE' || parsedDraft.category === 'ADVANCED')) {
                                console.log('Found category in localStorage draft:', parsedDraft.category);
                                foundCategory = parsedDraft.category;
                            } else {
                                console.log('Draft found, but no valid category property.');
                            }
                        } else {
                            console.log('No draft found in localStorage for key:', storageKey);
                        }
                    } catch (error) {
                        console.error('Error reading or parsing localStorage draft:', error);
                    }
                } else {
                    console.log('Could not generate storage key (no email?).');
                }
                if (!foundCategory) {
                    const serverCategory = await getCategory();
                    if (serverCategory?.category === 'INTERMEDIATE' || serverCategory?.category === 'ADVANCED') {
                        foundCategory = serverCategory.category;
                    }
                }
                setSelectedCategory(foundCategory);
                setIsLoadingAll(false); // Done loading
            } else {
                setIsLoadingAll(false);
            }
        };
        fetchAllData();

    }, [status, userEmail, registrationType, router]);

    // --- Render Logic ---

    if (status === 'loading' || isLoadingAll) {
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold animate-pulse">Loading...</p>;
    }

    if (status !== 'authenticated' || !userEmail) {
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold">Redirecting to login...</p>;
    }

    if (status === 'authenticated' && !validationStatus){
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold text-white">Your registration has not been validated yet. </p>;
    }

    if (status === 'authenticated' && creationStatus){
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold text-white">Your submission has been received and will now proceed to the judging process. </p>;
    }

    return (
        <div className="min-h-screen py-8 px-4 relative z-10">
                <>
                    {/* Render the actual form */}
                    <SubmissionForm
                        registrationType='contest'
                        formSchema={contestSubmitSchema}
                        onSuccessRedirectPath="/contest"
                        initialCategory={selectedCategory}
                    />
                </>
        </div>
    );
}