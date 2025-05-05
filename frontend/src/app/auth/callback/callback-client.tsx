'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthCallbackClient() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (status !== 'authenticated') return;
        (async () => {
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: session.user!.email,
                        name: session.user!.name
                    })
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}))
                    throw new Error(err.message || res.statusText)
                }
                const nextPath = searchParams?.get('next');
                router.replace(nextPath ?? '/');
            } catch (err: any) {
                console.error('Auth callback error:', err)
                setError(err.message || 'Unknown error')
            }
        })();
    }, [status, session, router, searchParams]);

    if (status === 'loading') return <p>Validating session…</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>
    return <p>Signing you in…</p>
}