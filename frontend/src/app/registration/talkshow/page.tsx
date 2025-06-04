'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Megaphone, Presentation } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { RegistrationForm } from '@/app/components/RegistrationForm';
import PixelCard from '@/app/components/PixelCard';
import { talkshowSchema as baseTalkshowSchema } from '@/config/forms/talkshowSchema';
import {
    type FormData,
    RegistrationType,
    type TalkshowCategory,
    FormSchema,
    FormSection
} from '@/types/registration';
import BackButton from '@/app/components/BackButton';

const getDraftStorageKey = (email: string | undefined | null, regType: RegistrationType): string | null => {
    if (!email) return null;
    return `${regType}-draft-${email}`;
};

// --- Updated API Endpoints for Talkshow ---
const getValidateStatus = async (registrationType: RegistrationType, userEmail: string | undefined | null) => {
    if (!userEmail) return null;
    try {
        // Example: /api/talkshow/status?email=user@example.com
        // You might need to pass registrationType and category if your backend differentiates further
        const res = await fetch(`/api/${registrationType}/getValidate`); // Adjust endpoint
        if (res.ok) {
            const data = await res.json();
            console.log("Received validation status:", data);
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
const getSubmittedStatus = async (registrationType: RegistrationType, userEmail: string | undefined | null) => {
    if (!userEmail) return null;
    try {
        const res = await fetch(`/api/${registrationType}/getSubmitted`); // Adjust endpoint
        if (res.ok) {
            const data = await res.json();
            console.log("Received submission status:", data);
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
    onSelectCategory: (category: TalkshowCategory) => void;
}

function CategorySelector({ onSelectCategory }: CategorySelectorProps) {
    const handleSelect = (category: TalkshowCategory) => {
        onSelectCategory(category);
    };

    const cardBaseClasses =
        "w-full lg:h-full text-white font-semibold text-[20px] lg:text-[35px] px-6 py-8 rounded-[25px] shadow-xl focus:outline-none transition-all duration-200 ease-in-out transform hover:-translate-y-1.5 bg-black/10 backdrop-blur-md border !border-violet-500 !border-2 !shadow-lg !shadow-violet-500/50";

    return (
        <div className='fixed inset-0 w-screen h-screen z-[50] bg-gray-900/70 backdrop-blur-md'>
            <div
                className="h-screen w-screen flex flex-col items-center justify-center p-4 sm:p-6 md:!p-16 lg:!p-8 selection:bg-purple-500 selection:text-white overflow-auto"
                style={{
                    color: '#a6ff4d',
                    fontFamily: 'Nephilm, sans-serif',
                }}
            >
                <h1
                    className="text-3xl sm:text-4xl lg:!text-[60px] xl:!text-[75px] font-extrabold tracking-tight text-white text-center mb-10 sm:mb-12 lg:!mb-16 xl:!mb-24 [text-shadow:_0_0_6px_rgba(255,255,255,0.7)]"
                    style={{ fontStyle: 'italic' }}
                >
                    Choose Your Event
                </h1>

                <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 lg:gap-8 xl:gap-10 lg:!h-auto xl:!h-[45vh]">
                    {/* Webinar */}
                    <PixelCard
                        variant="blue"
                        onClick={() => handleSelect('WEBINAR')}
                        className={`${cardBaseClasses} lg:h-52 lg:h-60 focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 bg-[linear-gradient(to_bottom,#5A97CE_0%,transparent_40%,transparent_60%,#5A97CE_100%)]`}
                    >
                        Webinar
                    </PixelCard>

                    {/* Talkshow 1 */}
                    <PixelCard
                        variant="purple"
                        onClick={() => handleSelect('TALKSHOW_1')}
                        className={`${cardBaseClasses} lg:h-52 lg:h-60 focus-visible:ring-4 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 bg-[linear-gradient(to_bottom,#9009A3_0%,transparent_40%,transparent_60%,#9009A3_100%)]`}
                    >
                        Talkshow 1
                    </PixelCard>

                    {/* Talkshow 2 */}
                    <PixelCard
                        variant="teal"
                        onClick={() => handleSelect('TALKSHOW_2')}
                        className={`${cardBaseClasses} lg:h-52 lg:h-60 focus-visible:ring-4 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 bg-[linear-gradient(to_bottom,#949087_0%,transparent_40%,transparent_60%,#949087_100%)]`}
                    >
                        Talkshow 2
                    </PixelCard>
                </div>
            </div>
        </div>
    );
}

// Since all are free and use the same schema, this function is very simple.
const getCurrentTalkshowSchema = (): FormSchema => {
    // Return a deep copy to prevent accidental modifications to the imported schema
    return JSON.parse(JSON.stringify(baseTalkshowSchema));
};

// --- Main Page Component ---
export default function TalkshowRegistrationPage() { // Renamed component
    const { data: session, status } = useSession();
    const router = useRouter();
    const userEmail = session?.user?.email;
    const registrationType: RegistrationType = 'talkshow'; // Explicitly 'talkshow'

    const [selectedTalkshowCategory, setSelectedTalkshowCategory] = useState<TalkshowCategory | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [validationStatus, setValidationStatus] = useState<boolean | null>(null);
    const [submittedStatus, setSubmittedStatus] = useState<boolean | null>(null);

    const resetRegistrationState = useCallback(() => {
        setValidationStatus(null);
        setSubmittedStatus(null);
        // Optionally clear selectedTalkshowCategory from localStorage here if needed on full reset
        // const storageKey = getDraftStorageKey(userEmail, registrationType);
        // if (storageKey) {
        //    const rawDraft = localStorage.getItem(storageKey);
        //    if (rawDraft) {
        //        let draftData = JSON.parse(rawDraft);
        //        delete draftData.talkshowCategory; // or category
        //        localStorage.setItem(storageKey, JSON.stringify(draftData));
        //    }
        // }
        // setSelectedTalkshowCategory(null);
    }, [/* userEmail, registrationType */]); // Add deps if used inside

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            if (status === 'loading') {
                // Session is loading, wait for it
                return;
            }

            if (status === 'unauthenticated') {
                const nextUrl = encodeURIComponent(`/registration/${registrationType}`);
                router.replace(`/login?next=${nextUrl}`);
                // setIsLoading(false) // No need, redirecting
                return;
            }

            if (status === 'authenticated' && userEmail) {
                try {
                    // Pass registrationType and potentially selectedCategory if your API needs them
                    const [validateData, submittedData] = await Promise.all([
                        getValidateStatus(registrationType, userEmail),
                        getSubmittedStatus(registrationType, userEmail)
                    ]);
                    setValidationStatus(validateData?.validateStatus ?? null);
                    setSubmittedStatus(submittedData?.submittedStatus ?? null);
                } catch (error) {
                    console.error("Error during fetching status data", error);
                    // Set to defaults or handle error state
                    setValidationStatus(null);
                    setSubmittedStatus(null);
                }

                const storageKey = getDraftStorageKey(userEmail, registrationType);
                let foundCategory: TalkshowCategory | null = null;

                if (storageKey) {
                    try {
                        const rawDraft = localStorage.getItem(storageKey);
                        if (rawDraft) {
                            // Use a more specific type for parsing if your draft saves more than just FormData
                            const parsedDraft: Partial<FormData & { talkshowCategory?: TalkshowCategory, category?: TalkshowCategory }> = JSON.parse(rawDraft);
                            const categoryFromDraft = parsedDraft.talkshowCategory || parsedDraft.category; // Check both common names

                            if (categoryFromDraft && ['WEBINAR', 'TALKSHOW_1', 'TALKSHOW_2'].includes(categoryFromDraft)) {
                                foundCategory = categoryFromDraft;
                            }
                        }
                    } catch (error) {
                        console.error('Error reading or parsing localStorage draft:', error);
                    }
                }
                setSelectedTalkshowCategory(foundCategory);
            }
            setIsLoading(false);
        };

        fetchAllData();
        // IMPORTANT: Removed validationStatus and submittedStatus from deps to prevent re-fetch loops.
        // These statuses are results of the fetch, not triggers for it in this effect.
    }, [status, userEmail, registrationType, router]);


    const handleTalkshowCategorySelect = useCallback((category: TalkshowCategory) => {
        if (!userEmail) {
            console.error("Cannot save category: user email is missing.");
            return;
        }
        const storageKey = getDraftStorageKey(userEmail, registrationType);
        if (!storageKey) {
            console.error("Cannot save category: could not generate storage key.");
            return;
        }

        try {
            const rawDraft = localStorage.getItem(storageKey);
            let draftData: Partial<FormData & { talkshowCategory: TalkshowCategory }> = {}; // Ensure talkshowCategory field
            if (rawDraft) {
                try {
                    draftData = JSON.parse(rawDraft);
                    if (typeof draftData !== 'object' || draftData === null) draftData = {};
                } catch {
                    draftData = {}; // Reset if parsing fails
                }
            }
            draftData.talkshowCategory = category; // Store specifically as talkshowCategory
            localStorage.setItem(storageKey, JSON.stringify(draftData));
            setSelectedTalkshowCategory(category);
        } catch (error) {
            console.error("Error saving talkshow category to localStorage:", error);
        }
    }, [userEmail, registrationType]);

    const handleTalkshowCategoryReset = useCallback(() => {
        if (!userEmail) return;
        const storageKey = getDraftStorageKey(userEmail, registrationType);
        if (!storageKey) return;

        try {
            const rawDraft = localStorage.getItem(storageKey);
            let draftData: Partial<FormData & { talkshowCategory?: TalkshowCategory }> = {};
            if (rawDraft) {
                try {
                    draftData = JSON.parse(rawDraft);
                    if (typeof draftData !== 'object' || draftData === null) draftData = {};
                } catch { draftData = {}; }
            }
            delete draftData.talkshowCategory; // Remove the specific category
            // Consider if other form fields tied to this category selection should also be cleared
            localStorage.setItem(storageKey, JSON.stringify(draftData));
            setSelectedTalkshowCategory(null);
        } catch (error) {
            console.error("Error updating localStorage during category reset:", error);
        }
    }, [userEmail, registrationType]);


    if (isLoading) { // Simplified loading check
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold animate-pulse">Loading...</p>;
    }

    if (status !== 'authenticated' || !userEmail) {
        // This case should be handled by the useEffect redirect, but as a fallback:
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold">Redirecting to login...</p>;
    }

    const eventName = selectedTalkshowCategory ? selectedTalkshowCategory.replace('_', ' ') : 'the event';

    if (!validationStatus && submittedStatus) {
        return (
            <>
                <BackButton href='/registration' />
                <div className="flex flex-col justify-center items-center min-h-screen text-lg font-semibold text-white text-center space-y-4 p-4">
                    <span>Your registration for {eventName} has been submitted and is awaiting validation.</span>
                    <a
                        href="https://chat.whatsapp.com/YOUR_TALKSHOW_WHATSAPP_LINK" // UPDATE THIS LINK
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center font-semibold text-pink-400 hover:text-pink-300 underline underline-offset-4 transition-colors duration-300"
                    >
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.134.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.206-.242-.581-.487-.502-.67-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.291.173-1.413-.074-.123-.273-.198-.57-.347z" /><path d="M20.52 3.48A11.962 11.962 0 0012 0C5.373 0 0 5.373 0 12c0 2.12.555 4.122 1.609 5.916L0 24l6.27-1.646A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.194-1.247-6.208-3.48-8.52zM12 21.75c-1.826 0-3.61-.49-5.18-1.416l-.37-.218-3.725.976.996-3.63-.24-.373C2.525 15.153 2.25 13.592 2.25 12c0-5.376 4.374-9.75 9.75-9.75 2.604 0 5.048 1.016 6.875 2.855S21.75 9.396 21.75 12c0 5.376-4.374 9.75-9.75 9.75z" /></svg>
                        Join WhatsApp Group for updates
                    </a>
                </div>
            </>
        );
    }
    if (validationStatus && submittedStatus) {
        return (
            <>
                <BackButton href='/registration' />
                <div className="flex flex-col justify-center items-center min-h-screen text-lg font-semibold text-white text-center space-y-4 p-4">
                    <span>Your registration for {eventName} has been validated! We look forward to seeing you.</span>
                    <a
                        href="https://chat.whatsapp.com/YOUR_TALKSHOW_WHATSAPP_LINK" // UPDATE THIS LINK
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center font-semibold text-pink-400 hover:text-pink-300 underline underline-offset-4 transition-colors duration-300"
                    >
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.134.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.206-.242-.581-.487-.502-.67-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.291.173-1.413-.074-.123-.273-.198-.57-.347z" /><path d="M20.52 3.48A11.962 11.962 0 0012 0C5.373 0 0 5.373 0 12c0 2.12.555 4.122 1.609 5.916L0 24l6.27-1.646A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.194-1.247-6.208-3.48-8.52zM12 21.75c-1.826 0-3.61-.49-5.18-1.416l-.37-.218-3.725.976.996-3.63-.24-.373C2.525 15.153 2.25 13.592 2.25 12c0-5.376 4.374-9.75 9.75-9.75 2.604 0 5.048 1.016 6.875 2.855S21.75 9.396 21.75 12c0 5.376-4.374 9.75-9.75 9.75z" /></svg>
                        Join WhatsApp Group for updates
                    </a>
                </div>
            </>
        );
    }

    const currentSchemaForForm = getCurrentTalkshowSchema(); // Schema is static

    return (
        <div className="min-h-screen py-8 relative z-10"> {/* Ensure parent has z-index if needed for fixed CategorySelector */}
            <BackButton href='/registration' /> {/* Adjust as needed */}
            {!selectedTalkshowCategory ? (
                <CategorySelector onSelectCategory={handleTalkshowCategorySelect} />
            ) : (
                <>
                    <div className="max-w-4xl mx-auto mb-4 p-4 bg-white/10 backdrop-filter backdrop-blur-sm border border-slate-300 rounded-md flex justify-between items-center shadow-sm">
                        <span className="text-indigo-200 font-semibold">
                            Selected Event: <strong className="uppercase">{selectedTalkshowCategory.replace('_', ' ')}</strong> (Free)
                        </span>
                        <button
                            onClick={handleTalkshowCategoryReset}
                            className="text-sm !text-red-400 hover:!text-red-600 font-medium focus:outline-none"
                            title="Change Event"
                            aria-label="Reset selected event">
                            Change
                        </button>
                    </div>

                    <RegistrationForm
                        registrationType={registrationType}
                        formSchema={currentSchemaForForm}
                        onSuccessRedirectPath={`/registration/${registrationType}`} // e.g. /registration/talkshow
                        initialCategory={selectedTalkshowCategory} // Pass this to form if it needs to know which specific event
                        onRegistrationReset={resetRegistrationState}
                    // Pass userType if RegistrationForm needs it for conditions
                    // userType={session?.user?.type as UserType | undefined}
                    />
                </>
            )}
        </div>
    );
}