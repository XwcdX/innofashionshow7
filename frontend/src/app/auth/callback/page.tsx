'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function AuthCallback() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (status !== 'authenticated') return;

        (async () => {
            try {
                const category = localStorage.getItem('category')
                if (!category) throw new Error('No category selected')

                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: session.user!.email,
                        name: session.user!.name,
                        category
                    })
                })

                if (!res.ok) {
                    const err = await res.json().catch(() => ({}))
                    throw new Error(err.message || res.statusText)
                }

                router.replace('/')
            } catch (err: any) {
                console.error('Auth callback error:', err)
                setError(err.message || 'Unknown error')
            }
        })()
    }, [status, session, router])

    if (status === 'loading') return <p>Validating session…</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>
    return <p>Signing you in…</p>
}