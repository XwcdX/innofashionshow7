'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import BrandedLoader from '@/app/components/BrandedLoader';

export default function AuthCallbackClient() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(true);

    useEffect(() => {
        if (status === 'loading' || status === 'unauthenticated') {
            setProcessing(status === 'loading');
            return;
        }

        setProcessing(true);

        (async () => {
            try {
                if (!session?.user?.email || !session?.user?.name) {
                    throw new Error('User session data is incomplete.');
                }
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: session.user.email,
                        name: session.user.name,
                    }),
                });

                if (!res.ok) {
                    const errData = await res.json().catch(() => ({ message: res.statusText || 'API Error' }));
                    throw new Error(errData.message || `Server responded with ${res.status}`);
                }

                const nextPath = searchParams?.get('next');
                router.replace(nextPath ?? '/registration');

            } catch (err: any) {
                console.error('Auth callback error:', err);
                setError(err.message || 'An unknown error occurred during sign-in.');
                setProcessing(false);
            }
        })();
    }, [status, session, router, searchParams]);

    if (error) {
        return (
            <div className="fixed inset-0 z-[9998] bg-black/70 flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-2xl text-red-500 mb-4">Sign-In Error</h2>
                <p className="text-lg text-red-300">{error}</p>
                <button 
                    onClick={() => router.replace('/login')}
                    className="mt-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (status === 'loading' || processing) {
        let loaderMessage = 'Validating session...';
        if (status === 'authenticated' && processing && !error) {
            loaderMessage = 'Finalizing sign-in...';
        }
        return <BrandedLoader isLoading={true} message={loaderMessage} />;
    }
    
    if (status === 'unauthenticated' && !error) {
      return <BrandedLoader isLoading={true} message="Waiting for authentication..." />;
    }

    return <BrandedLoader isLoading={true} message="Please wait..." />;
}