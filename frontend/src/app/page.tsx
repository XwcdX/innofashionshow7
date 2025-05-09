'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState }
from 'react';
import ManualLoader from '@/app/components/ManualLoader';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState<string | undefined>(undefined);

  const showLoaderWithMessage = (message?: string) => {
    setLoaderMessage(message);
    setIsLoading(true);
  };

  const hidePageLoader = () => {
    setIsLoading(false);
    setLoaderMessage(undefined);
  };

  useEffect(() => {
    if (status === 'loading') {
      showLoaderWithMessage("Checking session...");
    } else {
      hidePageLoader();
    }

    return () => {
      if (status === 'loading') {
        hidePageLoader();
      }
    };
  }, [status]);

  const handleLogout = async () => {
    showLoaderWithMessage("Logging out...");
    try {
      try {
        const res = await fetch('/api/auth/clear-custom-cookies', { method: 'POST' });
        if (!res.ok) {
          console.error('Failed to clear custom cookies:', await res.text());
        }
      } catch (error) {
        console.error('Error calling clear-custom-cookies API:', error);
      }

      await signOut({ redirect: false });
      router.push('/login');
    } catch (error) {
      console.error('An error occurred during logout:', error);
    } finally {
      hidePageLoader();
    }
  };

  return (
    <>
      <ManualLoader isLoading={isLoading} message={loaderMessage} />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        {session && status === 'authenticated' ? (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              Welcome, {session.user?.name}!
            </h1>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-6 py-2 bg-red-600 text-white font-medium rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-70"
            >
              Logout
            </button>
          </div>
        ) : (
          status === 'unauthenticated' && (
            <>
              <h1 className="text-4xl font-bold text-gray-800 mb-6">
                Welcome to Innofashionshow7
              </h1>
              <Link
                href="/login"
                className={`mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-disabled={isLoading}
                onClick={(e) => {
                  if (isLoading) e.preventDefault();
                  console.log("Login link clicked!");
                }}
              >
                Login
              </Link>
            </>
          )
        )}
      </div>
    </>
  );
}