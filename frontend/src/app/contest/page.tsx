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

// --- Main Page Component ---
export default function ContestSubmissionPage() {
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
            const fetchAndSetCategory = async () => {
                const serverData = await getCategory(); // Await async function
                if (serverData?.category === 'INTERMEDIATE' || serverData?.category === 'ADVANCED') {
                    foundCategory = serverData.category;
                    console.log('Found category from server:', foundCategory);
                } else {
                    console.log('No valid category found on server.');
                }
            }
            setSelectedCategory(foundCategory);
            setIsLoadingCategory(false);
        } else {
             setIsLoadingCategory(false);
        }

    }, [status, userEmail, registrationType, router]);

    // --- Render Logic ---

    if (status === 'loading' || isLoadingCategory) {
         return <p className="flex justify-center items-center min-h-screen text-lg font-semibold animate-pulse">Loading...</p>;
    }

     if (status !== 'authenticated' || !userEmail) {
         return <p className="flex justify-center items-center min-h-screen text-lg font-semibold">Redirecting to login...</p>;
    }

    return (
        <div className="min-h-screen py-8 px-4 relative z-10">
                <>
                    {/* Render the actual form */}
                    <SubmissionForm
                        registrationType='contest'
                        formSchema={contestSubmitSchema}
                        onSuccessRedirectPath="/"
                        initialCategory={selectedCategory}
                    />
                </>
        </div>
    );
}