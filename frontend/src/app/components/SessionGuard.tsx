'use client'
import { useSession, signIn } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

export default function SessionGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/'
  const isAdmin  = pathname.startsWith('/admin')
  const router   = useRouter()

  const { status } = useSession({
    required: false
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      if (isAdmin) {
        router.replace('/admin?next=' + encodeURIComponent(pathname))
      } else {
        signIn(undefined, {
          callbackUrl: '/login?next=' + encodeURIComponent(pathname)
        })
      }
    }
  }, [status, isAdmin, pathname, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking your session…</p>
      </div>
    )
  }

  return <>{children}</>
}
