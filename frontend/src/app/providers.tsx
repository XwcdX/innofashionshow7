'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider
    refetchInterval={60}
    refetchOnWindowFocus={true}
    session={undefined}>
    {children}
  </SessionProvider>
}