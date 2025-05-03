'use client'

import { useSession } from 'next-auth/react'

export default function HomePage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {status === 'loading' ? (
        <p className="text-lg text-gray-600">Loading…</p>
      ) : session ? (
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome, {session.user?.name}!
        </h1>
      ) : (
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Innofashionshow7
        </h1>
      )}
    </div>
  )
}
