import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function AuthCallback() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (status !== 'authenticated') return;

        (async () => {
            try {
                const category = localStorage.getItem('category');
                if (!category) throw new Error('No category in localStorage');
                console.log(`${API_URL}/auth/login`);

                const base = API_URL ?? (typeof window !== 'undefined' && window.location.origin);
                const res = await fetch(`${base}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: session.user!.email,
                        name: session.user!.name,
                        category,
                    }),
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.message || res.statusText);
                }
                const { token } = await res.json();
                localStorage.setItem('ACCESS_TOKEN', token);
                router.replace('/dashboard');
            } catch (err: any) {
                console.error('Login fetch error:', err);
                setError(`Network or CORS error: ${err.message}`);
            }
        })();
    }, [status, session]);


    if (status === 'loading') return <p>Validating session…</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>
    return <p>Signing you in…</p>
}
