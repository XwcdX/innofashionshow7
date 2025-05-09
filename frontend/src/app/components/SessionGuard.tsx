'use client';

import { useSession, signIn } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ManualLoader from './ManualLoader';

export default function SessionGuard() {
  const pathname = usePathname() ?? '/';
  const isAdminRoute = pathname.startsWith('/admin');
  const router = useRouter();

  const [showPageLoader, setShowPageLoader] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState<string | undefined>('Initializing...');

  const { status } = useSession({
    required: false,
  });

  useEffect(() => {
    if (status === 'loading') {
      setLoaderMessage('Checking your session…');
      setShowPageLoader(true);
    } else if (status === 'unauthenticated') {
      setLoaderMessage(isAdminRoute ? 'Redirecting to admin login...' : 'Preparing login...');

      if (isAdminRoute) {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
      } else {
        signIn(undefined, {
          callbackUrl: pathname,
        }).finally(() => {
            setShowPageLoader(false);
        });
      }
    } else if (status === 'authenticated') {
      setShowPageLoader(false);
      setLoaderMessage(undefined);
    }
  }, [status, isAdminRoute, pathname, router]);

  if (showPageLoader) {
    return <ManualLoader isLoading={true} message={loaderMessage} />;
  }

  return null;
}