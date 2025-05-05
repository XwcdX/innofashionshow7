'use client'

import { useRouter } from 'next/navigation'

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-4">

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">
        Choose Your Registration
      </h1>

      {/* Button container */}
      <div className="w-full max-w-3xl space-y-6 md:space-y-0 md:grid md:grid-cols-4 md:gap-x-6 md:gap-y-6">
        {/* Contest Button */}
        <button
          onClick={() => handleNavigation('/registration/contest')}
          className="w-full flex items-center justify-center md:col-span-2 md:justify-self-end md:h-20 bg-blue-600 text-white font-semibold text-lg px-6 py-5 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:-translate-y-1"
        >
          Contest
        </button>

        {/* Talkshow Button */}
        <button
          onClick={() => handleNavigation(null)}
          className="w-full flex items-center justify-center md:col-start-3 md:col-span-2 md:justify-self-start md:h-20 bg-teal-600 text-white font-semibold text-lg px-6 py-5 rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:-translate-y-1"
        >
          Talkshow
        </button>

        {/* Workshop Button */}
        <button
          onClick={() => handleNavigation(null)}
          className="w-full flex items-center justify-center md:col-start-2 md:col-span-2 md:justify-self-center md:h-20 bg-purple-600 text-white font-semibold text-lg px-6 py-5 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:-translate-y-1"
        >
          Workshop
        </button>

      </div>
    </div>
  );
}