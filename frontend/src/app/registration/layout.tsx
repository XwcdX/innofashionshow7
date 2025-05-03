import { Metadata } from 'next';
import SessionGuard from '@/app/components/SessionGuard';

export const metadata: Metadata = {
  title: 'Registration Panel',
  description: 'Registration dashboard.',
};

export default function RegistrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGuard>
      <main>{children}</main>
    </SessionGuard>
  );
}