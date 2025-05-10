'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { RegistrationForm } from '@/app/components/RegistrationForm';
import { contestSchema } from '@/config/forms/contestSchema';
import { type FormData, RegistrationType, Category } from '@/types/registration';

const getDraftStorageKey = (email: string | undefined | null, regType: RegistrationType): string | null => {
    if (!email) return null;
    return `${regType}-draft-${email}`;
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
            <h2 className="text-2xl font-semibold mb-8 text-gray-700">Choose Your Contest Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-xl">
                <button
                    onClick={() => handleSelect('INTERMEDIATE')}
                    className="relative group aspect-video bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label="Select Intermediate Category">
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center h-full">
                        <span className="text-white text-2xl font-bold tracking-wider uppercase">Intermediate</span>
                    </div>
                </button>

                <button
                    onClick={() => handleSelect('ADVANCED')}
                    className="relative group aspect-video bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    aria-label="Select Advanced Category">
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center h-full">
                        <span className="text-white text-2xl font-bold tracking-wider uppercase">Advanced</span>
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

    useEffect(() => {
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

    return (
        <div className="min-h-screen py-8 relative z-10">
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
                            className="text-sm text-red-400 hover:text-red-800 font-medium focus:outline-none"
                            title="Change Category"
                            aria-label="Reset selected category">
                            Change
                        </button>
                    </div>

                    {/* Render the actual form */}
                    <RegistrationForm
                        registrationType={registrationType}
                        formSchema={contestSchema}
                        onSuccessRedirectPath="/"
                        initialCategory={selectedCategory}
                    />
                </>
            )}
        </div>
    );
}