'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Scissors, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { RegistrationForm } from '@/app/components/RegistrationForm';
import { contestSchema } from '@/config/forms/contestSchema';
import { type FormData, RegistrationType, Category } from '@/types/registration';
import BackButton from '@/app/components/BackButton';

const getDraftStorageKey = (email: string | undefined | null, regType: RegistrationType): string | null => {
    if (!email) return null;
    return `${regType}-draft-${email}`;
};

const getValidateStatus = async () => {
    try {
        // Make the API request to get the validation status
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
const getSubmittedStatus = async () => {
    try {
        // Make the API request to get the submission status
        const res = await fetch('/api/lomba/getSubmitted');
        
        // Check if the response is OK (status 200)
        if (res.ok) {
            const data = await res.json();  // Assuming the response is JSON
            console.log("Received submission status:", data);

            // You can return the category or use it directly
            return data;
        } else {
            console.error("Failed to fetch submission status. Response not OK:", res.status);
            return null;
        }
    } catch (error) {
        console.error("Error fetching submission status:", error);
        return null;
    }
};

interface CategorySelectorProps {
    onSelectCategory: (category: Category) => void;
}

function CategorySelector({ onSelectCategory }: CategorySelectorProps) {
    const handleSelect = (category: Category) => {
        console.log('Category selected:', category);
        onSelectCategory(category);
    };

    return (
        <div className="fixed w-screen h-screen top-0 left-0 flex flex-col text-center items-center justify-center p-4 md:p-8 overflow-hidden bg-gray-900/50 backdrop-blur-sm"> {/* Optional: Added a slight background blur to the whole overlay */}
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-12 text-gray-100">
                Choose Your Fashion Contest Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-md md:max-w-3xl">
                <button
                    onClick={() => handleSelect('INTERMEDIATE')}
                    className="relative group aspect-[4/3] md:aspect-video !bg-gradient-to-br !from-blue-400 !to-indigo-600 rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:!scale-105 hover:shadow-2xl hover:shadow-indigo-500/40 focus:outline-none focus:ring-4 focus:ring-indigo-500/60 focus:ring-offset-2 focus:ring-offset-gray-900"
                    aria-label="Select Intermediate Category"
                >
                    <div className="absolute inset-0 bg-black !opacity-30 group-hover:!opacity-10 transition-opacity duration-300 ease-in-out pointer-events-none"></div>
                    <div className="relative flex flex-col items-center justify-center h-full p-4 text-white">
                        <Scissors size={44} className="mb-3 opacity-70 group-hover:opacity-90 transition-all duration-300 group-hover:rotate-[-10deg]" />
                        <span className="text-xl md:text-2xl font-bold tracking-wider uppercase transition-transform duration-300 group-hover:scale-105">
                            Intermediate
                        </span>
                        <p className="text-xs md:text-sm text-indigo-100/80 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out px-2">
                            Showcase your emerging talent and essential design skills.
                        </p>
                    </div>
                </button>

                <button
                    onClick={() => handleSelect('ADVANCED')}
                    className="relative group aspect-[4/3] md:aspect-video !bg-gradient-to-br !from-purple-500 !to-pink-600 rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:!scale-105 hover:shadow-2xl hover:shadow-pink-500/40 focus:outline-none focus:ring-4 focus:ring-pink-500/60 focus:ring-offset-2 focus:ring-offset-gray-900"
                    aria-label="Select Advanced Category"
                >
                    <div className="absolute inset-0 bg-black !opacity-30 group-hover:!opacity-10 transition-opacity duration-300 ease-in-out pointer-events-none"></div>
                    <div className="relative flex flex-col items-center justify-center h-full p-4 text-white">
                        <Sparkles size={44} className="mb-3 opacity-70 group-hover:opacity-90 transition-all duration-300 group-hover:scale-110" />
                        <span className="text-xl md:text-2xl font-bold tracking-wider uppercase transition-transform duration-300 group-hover:scale-105">
                            Advanced
                        </span>
                        <p className="text-xs md:text-sm text-pink-100/80 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out px-2">
                            Unleash your innovative vision and mastery of couture.
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );
}

// --- Main Page Component ---
export default function ContestRegistrationPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const userEmail = session?.user?.email;
    const registrationType: RegistrationType = 'contest';

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isLoadingCategory, setIsLoadingCategory] = useState<boolean>(true);
    
    const [validationStatus, setValidationStatus] = useState<boolean | null>(null);
    const [submittedStatus, setSubmittedStatus] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            if (status === 'loading') {
                setIsLoadingCategory(true);
                return;
            }

            if (status === 'unauthenticated') {
                const nextUrl = encodeURIComponent(`/registration/${registrationType}`);
                router.replace(`/login?next=${nextUrl}`);
                return;
            }

            if (status === 'authenticated' && userEmail) {
                try {
                    const [validateData, submittedData] = await Promise.all([
                        getValidateStatus(),
                        getSubmittedStatus()
                    ]);
    
                    setValidationStatus(validateData?.validateStatus ?? null);
                    setSubmittedStatus(submittedData?.submittedStatus ?? null);
                } catch (error) {
                    console.error("Error during fetching status data", error);
                }
                console.log('Authenticated, checking localStorage for category...');
                setIsLoadingCategory(true);
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

                setSelectedCategory(foundCategory);
                setIsLoadingCategory(false);
            } else {
                setIsLoadingCategory(false);
            }
        }
        fetchAllData();

    }, [status, userEmail, registrationType, router]);
    const handleCategorySelect = useCallback((category: Category) => {
        if (!userEmail) {
            console.error("Cannot save category: user email is missing.");
            return;
        }
        const storageKey = getDraftStorageKey(userEmail, registrationType);
        if (!storageKey) {
            console.error("Cannot save category: could not generate storage key.");
            return;
        }

        console.log(`Saving selected category '${category}' to localStorage key: ${storageKey}`);
        try {
            const rawDraft = localStorage.getItem(storageKey);
            let draftData: Partial<FormData> = {};
            if (rawDraft) {
                try {
                    draftData = JSON.parse(rawDraft);
                    if (typeof draftData !== 'object' || draftData === null) draftData = {};
                } catch {
                    draftData = {};
                }
            }
            draftData.category = category;
            localStorage.setItem(storageKey, JSON.stringify(draftData));
            setSelectedCategory(category);
        } catch (error) {
            console.error("Error saving category to localStorage:", error);
        }

    }, [userEmail, registrationType]);

    // --- Handler for resetting the category ---
    const handleCategoryReset = useCallback(() => {
        if (!userEmail) {
            console.error("Cannot reset category: user email is missing.");
            return;
        }
        const storageKey = getDraftStorageKey(userEmail, registrationType);
        if (!storageKey) {
            console.error("Cannot reset category: could not generate storage key.");
            return;
        }

        console.log(`Resetting category, updating localStorage key: ${storageKey}`);
        try {
            const rawDraft = localStorage.getItem(storageKey);
            let draftData: Partial<FormData> = {};
            if (rawDraft) {
                try {
                    draftData = JSON.parse(rawDraft);
                    if (typeof draftData !== 'object' || draftData === null) draftData = {};
                } catch {
                    draftData = {};
                }
            }
            delete draftData.category;
            localStorage.setItem(storageKey, JSON.stringify(draftData));
            setSelectedCategory(null);
        } catch (error) {
            console.error("Error updating localStorage during category reset:", error);
        }
    }, [userEmail, registrationType]);

    // --- Render Logic ---
    if (status === 'loading' || isLoadingCategory) {
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold animate-pulse">Loading...</p>;
    }

    if (status !== 'authenticated' || !userEmail) {
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold">Redirecting to login...</p>;
    }

    if (status === 'authenticated' && !validationStatus && submittedStatus){
        return (
        <>
            <BackButton
                    href='/registration'/>
            <p className="flex justify-center items-center min-h-screen text-lg font-semibold text-white">Your registration has been submitted and waiting for validation.</p>;
        </>
        )
    }

    if (status === 'authenticated' && validationStatus && submittedStatus){
        return (
        <>
            <BackButton
                    href='/registration'/>
            <p className="flex justify-center items-center min-h-screen text-lg font-semibold text-white">Your registration has been submitted and validated. Now you can submit your creation&nbsp; <a href="/contest" className="inline-block font-semibold text-pink-400 hover:text-pink-300 underline underline-offset-4 transition-colors duration-300">here</a>.</p>;
        </>
        )
    }

    return (
        <div className="min-h-screen py-8 relative z-10">
            <BackButton
                    href='/registration'/>
            {!selectedCategory ? (
                <CategorySelector onSelectCategory={handleCategorySelect} />
            ) : (
                <>
                    <div className="max-w-4xl mx-auto mb-4 p-4 bg-white/10 backdrop-filter backdrop-blur-sm border border-slate-300 rounded-md flex justify-between items-center shadow-sm">
                        <span className="text-indigo-200 font-semibold">
                            Selected Category: <strong className="uppercase">{selectedCategory}</strong>
                        </span>
                        <button
                            onClick={handleCategoryReset}
                            className="text-sm !text-red-400 hover:!text-red-800 font-medium focus:outline-none"
                            title="Change Category"
                            aria-label="Reset selected category">
                            Change
                        </button>
                    </div>

                    {/* Render the actual form */}
                    <RegistrationForm
                        registrationType={registrationType}
                        formSchema={contestSchema}
                        onSuccessRedirectPath="/registration/contest"
                        initialCategory={selectedCategory}
                    />
                </>
            )}
        </div>
    );
}