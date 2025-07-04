'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Megaphone, Presentation } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { RegistrationForm } from '@/app/components/RegistrationForm';
import PixelCard from '@/app/components/PixelCard';
import { talkshowSchema as baseTalkshowSchema } from '@/config/forms/talkshowSchema';
import {
    type FormData as RegistrationFormData,
    RegistrationType,
    type TalkshowCategory,
    FormSchema,
} from '@/types/registration';
import BackButton from '@/app/components/BackButton';

const EVENT_REGISTRATION_TYPE: RegistrationType = 'talkshow';

interface UserCategorySubmissionStatus {
    webinarSubmit: boolean;
    talk1Submit: boolean;
    talk2Submit: boolean;
}

const getCategorySubmissionStatuses = async (userEmail: string | undefined | null): Promise<UserCategorySubmissionStatus | null> => {
    if (!userEmail) return null;
    try {
        const res = await fetch(`/api/talkshow/profile`);
        if (res.ok) {
            const data = await res.json();
            if (data && typeof data.webinarSubmit === 'boolean' && typeof data.talk1Submit === 'boolean' && typeof data.talk2Submit === 'boolean') {
                return data;
            }
            return { webinarSubmit: false, talk1Submit: false, talk2Submit: false };
        } else if (res.status === 404) {
            return { webinarSubmit: false, talk1Submit: false, talk2Submit: false };
        }
        return null;
    } catch (error) {
        console.error("[TalkshowPage] Error fetching category submission statuses:", error);
        return null;
    }
};

interface CategorySelectorProps {
    onSelectCategory: (category: TalkshowCategory) => void;
    submissionStatus: UserCategorySubmissionStatus | null;
}

function CategorySelector({ onSelectCategory, submissionStatus }: CategorySelectorProps) {
    const handleSelect = (category: TalkshowCategory) => {
        // if (category === 'TALKSHOW_1' || category === 'TALKSHOW_2') {
        //     Swal.fire({
        //         title: 'Not Open Yet!',
        //         text: `Registration for ${category.replace('_', ' ')} is not open yet. Please stay tuned for updates!`,
        //         icon: 'info',
        //         confirmButtonText: 'Got It!',
        //         background: '#1F2937',
        //         color: '#FFFFFF',
        //         confirmButtonColor: '#8B5CF6',
        //         customClass: {
        //             popup: 'border border-violet-500 rounded-2xl shadow-lg',
        //             confirmButton: 'font-semibold',
        //         },
        //     });
        // } else {
        onSelectCategory(category);
        // }
    };

    const cardBaseClasses =
        "w-full lg:h-full text-white font-semibold text-[20px] lg:text-[35px] px-6 py-8 rounded-[25px] shadow-xl focus:outline-none transition-all duration-200 ease-in-out transform hover:-translate-y-1.5 bg-black/10 backdrop-blur-md border !border-violet-500 !border-2 !shadow-lg !shadow-violet-500/50";

    const getStatusKey = (category: TalkshowCategory): keyof UserCategorySubmissionStatus => {
        if (category === 'WEBINAR') return 'webinarSubmit';
        if (category === 'TALKSHOW_1') return 'talk1Submit';
        if (category === 'TALKSHOW_2') return 'talk2Submit';
        return 'webinarSubmit';
    };

    const getCardClassName = (variantColor: 'blue' | 'purple' | 'teal', category: TalkshowCategory) => {
        let classes = `${cardBaseClasses} lg:h-52 lg:h-60 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900`;
        if (variantColor === 'blue') classes += ` focus-visible:ring-4 focus-visible:ring-blue-400 bg-[linear-gradient(to_bottom,#5A97CE_0%,transparent_40%,transparent_60%,#5A97CE_100%)]`;
        if (variantColor === 'purple') classes += ` focus-visible:ring-4 focus-visible:ring-purple-400 bg-[linear-gradient(to_bottom,#9009A3_0%,transparent_40%,transparent_60%,#9009A3_100%)]`;
        if (variantColor === 'teal') classes += ` focus-visible:ring-4 focus-visible:ring-teal-400 bg-[linear-gradient(to_bottom,#949087_0%,transparent_40%,transparent_60%,#949087_100%)]`; // Your teal gradient

        const statusKey = getStatusKey(category);
        if (submissionStatus && submissionStatus[statusKey]) {
            classes += " opacity-70 cursor-not-allowed grayscale";
        }
        return classes;
    };

    const getCardContent = (title: string, description: string, icon: React.ReactNode, category: TalkshowCategory) => {
        const statusKey = getStatusKey(category);
        const isSubmitted = !!(submissionStatus && submissionStatus[statusKey]);
        return (
            <div className="flex flex-col items-center justify-center h-full group">
                {icon}
                <span className="uppercase tracking-wider text-xl md:text-2xl font-bold group-hover:scale-105 transition-transform duration-300">{title}</span>
                <p className="text-xs md:text-sm text-white/80 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out px-2 text-center">
                    {isSubmitted ? "Already Registered!" : description}
                </p>
            </div>
        );
    };

    return (
        <div className='fixed inset-0 w-screen h-screen z-[50] bg-gray-900/30 backdrop-blur-md'>
            <div
                className="h-screen w-screen flex flex-col items-center justify-center p-4 sm:p-6 md:!p-16 lg:!p-8 selection:bg-purple-500 selection:text-white overflow-auto"
                style={{ color: '#a6ff4d', fontFamily: 'Nephilm, sans-serif' }}
            >
                <h1
                    className="text-3xl sm:text-4xl lg:!text-[60px] xl:!text-[75px] font-extrabold tracking-tight text-white text-center mb-10 sm:mb-12 lg:!mb-16 xl:!mb-24 [text-shadow:_0_0_6px_rgba(255,255,255,0.7)]"
                    style={{ fontStyle: 'italic' }}
                >
                    Choose Your Event
                </h1>
                <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 lg:gap-8 xl:gap-10 lg:!h-auto xl:!h-[45vh]">
                    <PixelCard
                        variant="blue"
                        onClick={() => handleSelect('WEBINAR')}
                        className={getCardClassName('blue', 'WEBINAR')}
                    >
                        {getCardContent(
                            "Webinar",
                            "Insightful discussions. (Free)",
                            <Users size={44} className="mb-3 opacity-80 group-hover:opacity-100 text-sky-100 transition-transform duration-300 group-hover:scale-110" />,
                            'WEBINAR'
                        )}
                    </PixelCard>
                    <PixelCard
                        variant="purple"
                        onClick={() => handleSelect('TALKSHOW_1')}
                        className={getCardClassName('purple', 'TALKSHOW_1')}
                    >
                        {getCardContent(
                            "Talkshow 1",
                            "Expert conversations. (Free)",
                            <Megaphone size={44} className="mb-3 opacity-80 group-hover:opacity-100 text-purple-100 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-5deg]" />,
                            'TALKSHOW_1'
                        )}
                    </PixelCard>
                    <PixelCard
                        variant="teal"
                        onClick={() => handleSelect('TALKSHOW_2')}
                        className={getCardClassName('teal', 'TALKSHOW_2')}
                    >
                        {getCardContent(
                            "Talkshow 2",
                            "Inspiring sessions. (Free)",
                            <Presentation size={44} className="mb-3 opacity-80 group-hover:opacity-100 text-teal-100 transition-transform duration-300 group-hover:scale-110" />,
                            'TALKSHOW_2'
                        )}
                    </PixelCard>
                </div>
            </div>
        </div>
    );
}

const WHATSAPP_LINKS: Record<TalkshowCategory, string> = {
    WEBINAR: "https://chat.whatsapp.com/BgBKTJTlnH6FuT5gjqwrJv",
    TALKSHOW_1: "https://chat.whatsapp.com/DXZQpnIRRm8DNUERklba3M?mode=r_t",
    TALKSHOW_2: "https://chat.whatsapp.com/B4tkd0t7NslH43j7bcxVij?mode=ac_c",
};

export default function TalkshowRegistrationPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const userEmail = session?.user?.email;
    const registrationType: RegistrationType = EVENT_REGISTRATION_TYPE;

    const [selectedTalkshowCategory, setSelectedTalkshowCategory] = useState<TalkshowCategory | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [categorySubmissionStatus, setCategorySubmissionStatus] = useState<UserCategorySubmissionStatus | null>(null);

    const fetchCategoryStatuses = useCallback(async () => {
        if (userEmail && status === 'authenticated') {
            setIsLoading(true);
            const statuses = await getCategorySubmissionStatuses(userEmail);
            setCategorySubmissionStatus(statuses);
            setIsLoading(false);
        } else if (status !== 'loading') {
            setIsLoading(false);
            setCategorySubmissionStatus({ webinarSubmit: false, talk1Submit: false, talk2Submit: false }); // Default if not logged in
        }
    }, [userEmail, status]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            const nextUrl = encodeURIComponent(`/registration/${registrationType}`);
            router.replace(`/login?next=${nextUrl}`);
            return;
        }
        fetchCategoryStatuses();
    }, [status, registrationType, router, fetchCategoryStatuses]);

    const handleTalkshowCategorySelect = useCallback((category: TalkshowCategory) => {
        setSelectedTalkshowCategory(category);
    }, []);

    const handleBackToCategorySelection = useCallback(() => {
        setSelectedTalkshowCategory(null);
    }, []);

    const handleRegistrationSuccess = useCallback(() => {
        fetchCategoryStatuses();
        setSelectedTalkshowCategory(null);
    }, [fetchCategoryStatuses]);

    if (isLoading || status === 'loading') {
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold animate-pulse">Loading ...</p>;
    }

    if (status !== 'authenticated' || !userEmail) {
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold">Redirecting to login...</p>;
    }

    let isAlreadySubmittedForSelectedCategory = false;
    if (selectedTalkshowCategory && categorySubmissionStatus) {
        if (selectedTalkshowCategory === 'WEBINAR') isAlreadySubmittedForSelectedCategory = categorySubmissionStatus.webinarSubmit;
        else if (selectedTalkshowCategory === 'TALKSHOW_1') isAlreadySubmittedForSelectedCategory = categorySubmissionStatus.talk1Submit;
        else if (selectedTalkshowCategory === 'TALKSHOW_2') isAlreadySubmittedForSelectedCategory = categorySubmissionStatus.talk2Submit;
    }

    if (selectedTalkshowCategory && isAlreadySubmittedForSelectedCategory) {
        const eventName = selectedTalkshowCategory.replace('_', ' ');
        const currentWhatsappLink = WHATSAPP_LINKS[selectedTalkshowCategory];
        return (
            <>
                <div className="fixed top-4 left-4 z-20 px-4 py-2 rounded-full backdrop-blur-md bg-white/20 text-white border border-white/30 shadow-md hover:bg-white/30 transition">
                    <button
                        onClick={handleBackToCategorySelection}
                    >
                        ← Choose Another Event
                    </button>
                </div>
                <div className="flex flex-col justify-center items-center min-h-screen text-lg font-semibold text-white text-center space-y-4 p-4">
                    <span>You have successfully registered for {eventName}. Thank you!</span>
                    <a
                        href={currentWhatsappLink}
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

    const schemaForTalkshowForm = baseTalkshowSchema;

    return (
        <div className="min-h-screen py-8 relative z-10">
            {selectedTalkshowCategory && !isAlreadySubmittedForSelectedCategory ? (
                <div className="fixed top-4 left-4 z-20 px-4 py-2 rounded-full backdrop-blur-md bg-white/20 text-white border border-white/30 shadow-md hover:bg-white/30 transition">
                    <button
                        onClick={handleBackToCategorySelection}
                    >
                        ← Choose Another Event
                    </button>
                </div>
            ) : (
                !selectedTalkshowCategory && <BackButton href='/registration' />
            )}

            {!selectedTalkshowCategory ? (
                <CategorySelector
                    onSelectCategory={handleTalkshowCategorySelect}
                    submissionStatus={categorySubmissionStatus}
                />
            ) : (
                <RegistrationForm
                    registrationType={registrationType}
                    formSchema={schemaForTalkshowForm}
                    onSuccessRedirectPath={`/registration/${registrationType}`}
                    initialCategory={selectedTalkshowCategory}
                    onRegistrationReset={handleRegistrationSuccess}
                />
            )}
        </div>
    );
}