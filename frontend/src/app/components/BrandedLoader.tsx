'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BrandedLoaderProps {
  isLoading: boolean;
  message?: string;
  svgSrc?: string;
}

const BrandedLoader: React.FC<BrandedLoaderProps> = ({
  isLoading,
  message,
  svgSrc = "/assets/innofashion_FINAL_FIX.svg",
}) => {
  const [svgImageLoaded, setSvgImageLoaded] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      setSvgImageLoaded(false);
    }
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ease-in-out">
      <div className="flex flex-col items-center justify-center p-6 rounded-lg">
        <div className="relative w-48 h-48 md:w-64 md:h-64 mb-4">
          <Image
            src={svgSrc}
            alt="Loading Animation"
            fill
            priority
            onLoad={() => setSvgImageLoaded(true)}
            className={`object-contain transition-opacity duration-500 ${
              svgImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {!svgImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
            </div>
          )}
        </div>

        {(message || !svgImageLoaded) && (
          <p className="text-sm md:text-base text-purple-300 mt-2 animate-pulse">
            {message || 'Loading...'}
          </p>
        )}
      </div>
    </div>
  );
};

export default BrandedLoader;