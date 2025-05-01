'use client'
import { signIn } from 'next-auth/react'

export default function AdminLoginPage() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
        }}>
            <button
                onClick={() =>
                    signIn('google', {
                        callbackUrl: '/admin/auth/callback'
                    })
                }
                style={{
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    backgroundColor: '#4285F4',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer'
                }}
            >
                Login as Admin
            </button>
        </div>
    )
}
