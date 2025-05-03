import { Metadata } from 'next';
import Navbar from './components/Navbar';
import './admin.css';
import SessionGuard from '@/app/components/SessionGuard';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Admin dashboard for managing the app.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGuard>
      <Navbar />
      <main>{children}</main>
    </SessionGuard>
  );
}
