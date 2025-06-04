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

  const cardBaseClasses = "w-full lg:h-full text-white font-semibold text-[20px] lg:text-[35px] px-6 py-8 rounded-[25px] shadow-xl focus:outline-none transition-all duration-200 ease-in-out transform hover:-translate-y-1.5 bg-black/10 backdrop-blur-md border !border-violet-500 !border-2 !shadow-lg !shadow-violet-500/50";

  return (
    <div className='fixed inset-0 w-screen h-screen z-[5]'>
      <div
        className="h-screen w-screen flex flex-col items-center justify-center p-4 sm:p-6 md:!p-16 lg:!p-8 selection:bg-purple-500 selection:text-white overflow-hidden"
        style={{
          color: '#a6ff4d',
          fontFamily: 'Nephilm, sans-serif',
        }}
      >
        <h1 className="text-4xl sm:text-5xl lg:!text-[75px] font-extrabold tracking-tight text-white text-center mb-12 sm:mb-16 lg:!mb-24 text-center [text-shadow:_0_0_6px_rgba(255,255,255,0.7)]"
          style={{
            fontStyle: 'italic',
          }}>
          Choose Your Registration
        </h1>

        <div className="w-full max-w-5xl xl:max-w-5xl space-y-8 lg:space-y-0 lg:grid h-auto lg:!h-[50vh] lg:grid-cols-3 lg:gap-8 xl:gap-10">
          {/* Contest Card */}
          <PixelCard
            variant="blue"
            onClick={() => handleNavigation('/registration/contest')}
            className={`${cardBaseClasses} lg:h-52 lg:h-60 focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 bg-[linear-gradient(to_bottom,#5A97CE_0%,transparent_40%,transparent_60%,#5A97CE_100%)]`}
          >
            Competition
          </PixelCard>

          {/* Workshop Card */}
          <PixelCard
            variant="purple"
            onClick={() => handleNavigation(null)}
            className={`${cardBaseClasses} lg:h-52 lg:h-60 focus-visible:ring-4 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 bg-[linear-gradient(to_bottom,#9009A3_0%,transparent_40%,transparent_60%,#9009A3_100%)]`}
          >
            Workshop
          </PixelCard>

          {/* Talkshow Card */}
          <PixelCard
            variant="teal"
            onClick={() => handleNavigation(null)}
            className={`${cardBaseClasses} lg:h-52 lg:h-60 focus-visible:ring-4 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 bg-[linear-gradient(to_bottom,#949087_0%,transparent_40%,transparent_60%,#949087_100%)]`}
          >
            Talkshow
          </PixelCard>
        </div>
      </div>
    </div>
  );
}