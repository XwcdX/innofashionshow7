'use client'
import React, { useState, useEffect } from 'react';

export interface SponsorItem {
  name: string;
  logo: string;
  url: string;
}

interface SponsorProps {
  sponsors?: SponsorItem[];
}

const defaultSponsors: SponsorItem[] = [
  { name: 'Afterpay', logo: 'https://logo.clearbit.com/afterpay.com', url: 'https://www.afterpay.com' },
  { name: 'Behance', logo: 'https://logo.clearbit.com/behance.net', url: 'https://www.behance.net' },
  { name: 'Google', logo: 'https://logo.clearbit.com/google.com', url: 'https://www.google.com' },
  { name: 'Adobe', logo: 'https://logo.clearbit.com/adobe.com', url: 'https://www.adobe.com' },
  { name: 'Ralph Lauren', logo: 'https://logo.clearbit.com/ralphlauren.com', url: 'https://www.ralphlauren.com' },
  { name: 'Dropbox', logo: 'https://logo.clearbit.com/dropbox.com', url: 'https://www.dropbox.com' }
];

const Sponsor: React.FC<SponsorProps> = ({ sponsors = defaultSponsors }) => {
  const [glitchActive, setGlitchActive] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const checkScreenSize = () => {
      if (typeof window !== 'undefined') {
        setScreenWidth(window.innerWidth);
      }
    };
    
    checkScreenSize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkScreenSize);
    }

    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 120);
    }, 4000);
    
    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkScreenSize);
      }
    };
  }, []);

  const getGridConfig = () => {
    const count = sponsors.length;
    const isMobile = screenWidth < 640;
    const isTablet = screenWidth >= 640 && screenWidth < 1024;
    
    if (isMobile) {
      // Mobile: Always single column
      return {
        gridStyle: 'grid-cols-1',
        cardWidth: '100%',
        cardHeight: '140px',
        maxCards: count
      };
    } else if (isTablet) {
      // Tablet: 2-3 columns depending on count
      if (count <= 2) {
        return {
          gridStyle: 'grid-cols-2',
          cardWidth: '100%',
          cardHeight: '180px',
          maxCards: count
        };
      } else {
        return {
          gridStyle: 'grid-cols-3',
          cardWidth: '100%',
          cardHeight: '160px',
          maxCards: count
        };
      }
    } else {
      // Desktop: Maximum utilization
      if (count <= 3) {
        return {
          gridStyle: 'grid-cols-3',
          cardWidth: '100%',
          cardHeight: '200px',
          maxCards: count
        };
      } else if (count <= 6) {
        return {
          gridStyle: 'grid-cols-3',
          cardWidth: '100%',
          cardHeight: '180px',
          maxCards: count
        };
      } else {
        return {
          gridStyle: 'grid-cols-4',
          cardWidth: '100%',
          cardHeight: '160px',
          maxCards: count
        };
      }
    }
  };

  const gridConfig = getGridConfig();
  const isMobile = screenWidth < 640;

  // We can remove this function since we're always using 100vh now
  // const getRequiredHeight = () => {
  //   const titleHeight = isMobile ? 120 : 180;
  //   const cardHeight = parseInt(gridConfig.cardHeight);
  //   const gap = isMobile ? 16 : screenWidth < 1024 ? 24 : 32;
  //   const padding = isMobile ? 32 : 64;
  //   const margin = isMobile ? 48 : 96;
  //   
  //   const cols = gridConfig.gridStyle === 'grid-cols-1' ? 1 : 
  //               gridConfig.gridStyle === 'grid-cols-2' ? 2 : 
  //               gridConfig.gridStyle === 'grid-cols-3' ? 3 : 4;
  //   const rows = Math.ceil(sponsors.length / cols);
  //   
  //   const totalGridHeight = (rows * cardHeight) + ((rows - 1) * gap);
  //   const totalHeight = titleHeight + totalGridHeight + padding + margin;
  //   
  //   return totalHeight;
  // };

  // Since we're always using 100vh now, we don't need this calculation
  // const requiredHeight = getRequiredHeight();
  // const useFullHeight = requiredHeight > (window.innerHeight * 0.8);

  return (
    <section 
      className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12"
      style={{ 
        background: 'transparent', 
        scrollSnapAlign: 'start',
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        maxWidth: '100vw',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
      id="sponsor"
    >
      <div 
        className="w-full flex flex-col items-center justify-center h-full"
        style={{
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Title Section - Updated with Prize Pool sizing */}
        <div className="relative mb-12 md:mb-16 lg:mb-20 text-center flex-shrink-0">
          <h2 
            className={`text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter inline-block relative ${glitchActive ? 'glitch-active' : ''}`}
            style={{ 
              color: '#4dffff',
              textShadow: '0 0 15px rgba(77, 255, 255, 0.7)',
              fontStyle: 'italic'
            }}
            data-text="SPONSORS"
          >
            SPONSORS
            {glitchActive && (
              <>
                <span 
                  className="absolute top-0 left-0 w-full h-full opacity-70"
                  style={{
                    color: '#a6ff4d',
                    textShadow: '3px 0 #c306aa',
                    clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)'
                  }}
                >
                  SPONSORS
                </span>
                <span 
                  className="absolute top-0 left-0 w-full h-full opacity-70"
                  style={{
                    color: '#8f03d1',
                    textShadow: '-3px 0 #4dffff',
                    clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)'
                  }}
                >
                  SPONSORS
                </span>
              </>
            )}
          </h2>
        </div>

        {/* Sponsors Grid */}
        <div 
          className="w-full flex items-center justify-center"
          style={{
            maxWidth: '100%',
            overflow: 'hidden'
          }}
        >
          <div 
            className={`grid w-full ${gridConfig.gridStyle}`}
            style={{
              maxWidth: '100%',
              gap: isMobile ? '1rem' : screenWidth < 1024 ? '1.5rem' : '2rem',
              gridAutoRows: `minmax(${gridConfig.cardHeight}, 1fr)`,
              padding: isMobile ? '0' : '1rem',
              justifyContent: 'center',
              alignContent: 'center',
              justifyItems: 'center',
              alignItems: 'center'
            }}
          >
            {sponsors.map((sponsor, index) => (
              <SponsorCard 
                key={index}
                sponsor={sponsor}
                cardHeight={gridConfig.cardHeight}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

        {/* Background decoration */}
        <div 
          className="absolute bottom-0 right-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "url('/assets/layer1.png')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            width: isMobile ? '200px' : '400px',
            height: isMobile ? '160px' : '320px',
            transform: 'translateX(20%) translateY(10%)'
          }}
        />

        <style jsx>{`
          .glitch-active {
            animation: glitch-anim 0.3s linear infinite;
          }
          
          @keyframes glitch-anim {
            0% { transform: translate(0); }
            20% { transform: translate(-3px, 3px); }
            40% { transform: translate(-3px, -3px); }
            60% { transform: translate(3px, 3px); }
            80% { transform: translate(3px, -3px); }
            100% { transform: translate(0); }
          }
        `}</style>
      </div>
    </section>
  );
};

const SponsorCard: React.FC<{
  sponsor: SponsorItem;
  cardHeight: string;
  isMobile: boolean;
}> = ({ sponsor, cardHeight, isMobile }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="w-full flex justify-center items-center"
      style={{
        height: cardHeight,
        minHeight: cardHeight
      }}
    >
      <div
        className="flex items-center justify-center relative group w-full h-full rounded-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          padding: isMobile ? '1rem' : '1.5rem'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo container with consistent sizing */}
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        >
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            className="transition-all duration-500"
            style={{
              filter: isHovered 
                ? 'none brightness(1.1) contrast(1.1)' 
                : 'grayscale(100%) brightness(1.4) contrast(1.3)',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>
        
        {/* Hover glow effect */}
        <div 
          className="absolute inset-0 rounded-2xl transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, rgba(77, 255, 255, 0.12), rgba(166, 255, 77, 0.12))',
            boxShadow: '0 0 50px rgba(77, 255, 255, 0.4)',
            opacity: isHovered ? 1 : 0
          }}
        />
        
        {/* Subtle inner glow */}
        <div 
          className="absolute inset-2 rounded-xl transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, rgba(77, 255, 255, 0.05), rgba(166, 255, 77, 0.05))',
            opacity: isHovered ? 1 : 0
          }}
        />
      </div>
    </div>
  );
};

export default Sponsor;