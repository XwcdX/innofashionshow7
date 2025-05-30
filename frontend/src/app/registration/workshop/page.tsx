'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { RegistrationForm } from '@/app/components/RegistrationForm';
import { workshopSchema } from '@/config/forms/workshopSchema';
import { type FormData, RegistrationType, FormSchema } from '@/types/registration';
import BackButton from '@/app/components/BackButton';


const getDraftStorageKey = (email: string | undefined | null, regType: RegistrationType): string | null => {
    if (!email) return null;
    return `${regType}-draft-${email}`;
};
const getValidateStatus = async () => {
    try {
        // Make the API request to get the validation status
        const res = await fetch('/api/workshop/getValidate');

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
        const res = await fetch('/api/workshop/getSubmitted');

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

export default function WorkshopRegistrationPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const userEmail = session?.user?.email;
    const registrationType: RegistrationType = 'workshop';

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [validationStatus, setValidationStatus] = useState<boolean | null>(null);
    const [submittedStatus, setSubmittedStatus] = useState<boolean | null>(null);

    const resetRegistrationState = useCallback(() => {
        setValidationStatus(null);
        setSubmittedStatus(null);
    }, []);

    useEffect(() => {
        const fetchAllData = async () => {
            if (status === 'loading') {
                setIsLoading(true);
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
                setIsLoading(true);
                const storageKey = getDraftStorageKey(userEmail, registrationType);

                if (storageKey) {
                    try {
                        const rawDraft = localStorage.getItem(storageKey);
                        if (rawDraft) {
                            const parsedDraft: Partial<FormData> = JSON.parse(rawDraft);
                        } else {
                            console.log('No draft found in localStorage for key:', storageKey);
                        }
                    } catch (error) {
                        console.error('Error reading or parsing localStorage draft:', error);
                    }
                } else {
                    console.log('Could not generate storage key (no email?).');
                }

                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        }
        fetchAllData();

    }, [status, userEmail, registrationType, router, validationStatus, submittedStatus]);
// --- Render Logic ---
    if (status === 'loading' || isLoading) {
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold animate-pulse">Loading...</p>;
    }

    if (status !== 'authenticated' || !userEmail) {
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold">Redirecting to login...</p>;
    }

    if (status === 'authenticated' && !validationStatus && submittedStatus) {
        return (
            <>
                <BackButton
                    href='/registration' />
                <div className="flex flex-col justify-center items-center min-h-screen text-lg font-semibold text-white text-center space-y-4">
                    <span>Your registration has been submitted and is waiting for validation.</span>
                    
                    <a
                        href="https://chat.whatsapp.com/JQliuxYGAQAHRgmRod3PsX"
                        className="inline-flex items-center font-semibold text-pink-400 hover:text-pink-300 underline underline-offset-4 transition-colors duration-300"
                    >
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.134.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.206-.242-.581-.487-.502-.67-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.291.173-1.413-.074-.123-.273-.198-.57-.347z" />
                            <path d="M20.52 3.48A11.962 11.962 0 0012 0C5.373 0 0 5.373 0 12c0 2.12.555 4.122 1.609 5.916L0 24l6.27-1.646A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.194-1.247-6.208-3.48-8.52zM12 21.75c-1.826 0-3.61-.49-5.18-1.416l-.37-.218-3.725.976.996-3.63-.24-.373C2.525 15.153 2.25 13.592 2.25 12c0-5.376 4.374-9.75 9.75-9.75 2.604 0 5.048 1.016 6.875 2.855S21.75 9.396 21.75 12c0 5.376-4.374 9.75-9.75 9.75z" />
                        </svg>
                        Join our WhatsApp Group for the next information
                    </a>
                </div>
            </>
        )
    }
    if (status === 'authenticated' && validationStatus && submittedStatus) {
        return (
            <>
                <BackButton
                    href='/registration' />
                <div className="flex flex-col justify-center items-center min-h-screen text-lg font-semibold text-white text-center space-y-4">
                    <span>
                        Your registration has been submitted and validated.
                    </span>
                    <span className="flex items-center gap-2">
                        <a href="https://chat.whatsapp.com/JQliuxYGAQAHRgmRod3PsX" className="inline-flex items-center font-semibold text-pink-400 hover:text-pink-300 underline underline-offset-4 transition-colors duration-300">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.134.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.206-.242-.581-.487-.502-.67-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.291.173-1.413-.074-.123-.273-.198-.57-.347z" />
                                <path d="M20.52 3.48A11.962 11.962 0 0012 0C5.373 0 0 5.373 0 12c0 2.12.555 4.122 1.609 5.916L0 24l6.27-1.646A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.194-1.247-6.208-3.48-8.52zM12 21.75c-1.826 0-3.61-.49-5.18-1.416l-.37-.218-3.725.976.996-3.63-.24-.373C2.525 15.153 2.25 13.592 2.25 12c0-5.376 4.374-9.75 9.75-9.75 2.604 0 5.048 1.016 6.875 2.855S21.75 9.396 21.75 12c0 5.376-4.374 9.75-9.75 9.75z" />
                            </svg>
                            &nbsp;Join our WhatsApp Group for the next information
                        </a>
                    </span>
                </div>

            </>
        )
    }

    return (
        <>
            <BackButton
                    href='/registration' />
            <RegistrationForm
                registrationType="workshop"
                formSchema={workshopSchema}
                onSuccessRedirectPath = '/registration/workshop'
            />
        </>
    );
}