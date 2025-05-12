'use client';

import { useRouter } from 'next/navigation';
import PixelCard from '@/app/components/PixelCard';

export default function RegistrationSelectionPage() {
  const router = useRouter();

  const handleNavigation = (path: string | null) => {
    if (path) {
      router.push(path);
    } else {
      alert("This registration option is coming soon!");
      console.log("Navigation for this option is not yet implemented.");
    }
  };

  const cardBaseClasses = "w-full text-white font-semibold text-xl md:text-2xl px-6 py-8 rounded-xl shadow-xl focus:outline-none transition-all duration-200 ease-in-out transform hover:-translate-y-1.5";

  return (
    <div className='fixed inset-0 w-screen h-screen z-[5]'>
      <div
        className="h-screen w-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 selection:bg-purple-500 selection:text-white overflow-hidden"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-12 text-center mb-12 sm:mb-16 md:mb-20 text-center [text-shadow:_0_0_6px_rgba(255,255,255,0.7)]"
            style={{
              fontStyle: 'italic',
            }}>
          Choose Your Registration
        </h1>

        <div className="w-full max-w-5xl xl:max-w-6xl space-y-8 md:space-y-0 md:grid md:grid-cols-4 md:gap-8 xl:gap-10">
          {/* Contest Card */}
          <PixelCard
            variant="blue"
            onClick={() => handleNavigation('/registration/contest')}
            imageUrl="/assets/contest-card-bg.jpg"
            className={`${cardBaseClasses} md:col-span-2 md:h-52 lg:h-60 focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900`}
          >
            Contest
          </PixelCard>

          {/* Talkshow Card */}
          <PixelCard
            variant="teal"
            onClick={() => handleNavigation(null)}
            imageUrl="/assets/talkshow-card-bg.png"
            className={`${cardBaseClasses} md:col-start-3 md:col-span-2 md:h-52 lg:h-60 focus-visible:ring-4 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900`}
          >
            Talkshow
          </PixelCard>

          {/* Workshop Card */}
          <PixelCard
            variant="purple"
            onClick={() => handleNavigation(null)}
            imageUrl="/assets/workshop-card-bg.webp"
            className={`${cardBaseClasses} md:col-start-2 md:col-span-2 md:h-52 lg:h-60 focus-visible:ring-4 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900`}
          >
            Workshop
          </PixelCard>
        </div>
      </div>
    </div>
  );
}