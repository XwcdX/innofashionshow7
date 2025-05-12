'use client';
import SessionGuard from '@/app/components/SessionGuard';

export default function RegistrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionGuard />
      <img
        alt="Decorative frame top right"
        src="/assets/Frame 7.png"
        className="fixed -top-35 -right-45 sm:-top-45 sm:-right-55 md:-top-60 md:-right-65 lg:-top-80 lg:-right-75 m-4 sm:w-[600px] sm:h-[450px] md:w-[750px] md:h-[550px] lg:w-[917px] lg:h-[666px] object-cover z-[10]" // <-- z-index 10
      />
      <img
        alt="Decorative frame bottom left"
        src="/assets/Frame 7.png"
        className="fixed -bottom-35 -left-25 sm:-bottom-50 sm:-left-25 sm:w-[600px] sm:h-[450px] m-4 md:w-[750px] md:h-[550px] md:-bottom-55 md:-left-35 lg:-bottom-65 lg:-left-50 lg:w-[917px] lg:h-[666px] object-cover z-[10]" // <-- z-index 10
      />
      <main className="main-layout-background px-4 overflow-hidden min-h-screen relative">
        <div className="relative z-[20]">
          {children}
        </div>
      </main>

      <style jsx global>{`
        html {
          scroll-behavior: auto !important;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: inherit;
        }
        .main-layout-background {
          background: linear-gradient(
            135deg,
            #A30A99 0%,
            #820D8C 25%,
            #5F117F 50%,
            #3D1472 75%,
            #281660 100%
          );
          background-attachment: fixed;
          background-size: 200% 200%;
          animation: gradientAnimation 15s ease infinite;
          /* position: relative; is already applied */
        }
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        /* Other styles */
        .mix-blend-overlay { mix-blend-mode: overlay; }
        .mix-blend-lighten { mix-blend-mode: lighten; }
        .mix-blend-screen { mix-blend-mode: screen; }
        .mix-blend-soft-light { mix-blend-mode: soft-light; }
        section { width: 100%; position: relative; }
        .fade-in { opacity: 0; animation: fadeIn 1s ease-out forwards; }
        .slide-up { opacity: 0; transform: translateY(20px); animation: slideUp 0.8s ease-out forwards; }
        .scale-in { opacity: 0; transform: scale(0.95); animation: scaleIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { to { opacity: 1; transform: scale(1); } }
      `}</style>
    </>
  );
}