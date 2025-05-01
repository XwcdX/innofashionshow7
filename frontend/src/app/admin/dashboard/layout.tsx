import { Metadata } from 'next';
import Navbar from './components/Navbar';
import './admin.css';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Admin dashboard for managing the app.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
