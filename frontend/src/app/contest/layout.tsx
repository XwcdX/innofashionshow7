import { Metadata } from 'next';
import SessionGuard from '@/app/components/SessionGuard';

export const metadata: Metadata = {
  title: 'Registration Panel',
  description: 'Registration dashboard.',
};

export default function RegistrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionGuard/>
      <img
        src="/assets/Frame 7.png"
        className="fixed -bottom-35 -left-25 sm:-bottom-50 sm:-left-25 sm:w-[600px] sm:h-[450px] m-4 md:w-[750px] md:h-[550px] md:-bottom-55 md:-left-35 lg:-bottom-65 lg:-left-50 lg:w-[917px] lg:h-[666px] object-cover"
      />
      <img
        src="/assets/Frame 7.png"
        className="fixed -top-35 -right-45 sm:-top-45 sm:-right-55 md:-top-60 md:-right-65 lg:-top-80 lg:-right-75 m-4 sm:w-[600px] sm:h-[450px] md:w-[750px] md:h-[550px] lg:w-[917px] lg:h-[666px] object-cover"
      />
      <main className="!bg-gradient-to-b !from-[#a30a99] !to-[#281660] py-8 px-4 overflow-hidden min-h-screen">{children}</main>
    </>
  );
}