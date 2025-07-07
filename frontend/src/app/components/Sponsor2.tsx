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
      setScreenWidth(window.innerWidth);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 120);
    }, 4000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const getGridConfig = () => {
    const count = sponsors.length;
    const isMobile = screenWidth < 640;
    const isTablet = screenWidth >= 640 && screenWidth < 1024;
    
    if (count === 1) {
      return {
        cols: 1,
        containerWidth: isMobile ? '320px' : isTablet ? '350px' : '400px',
        containerHeight: isMobile ? '200px' : isTablet ? '220px' : '250px',
        gridStyle: 'grid-cols-1'
      };
    } else if (count === 2) {
      return {
        cols: 1,
        containerWidth: isMobile ? '320px' : isTablet ? '300px' : '350px',
        containerHeight: isMobile ? '180px' : isTablet ? '180px' : '200px',
        gridStyle: isMobile ? 'grid-cols-1' : 'grid-cols-2'
      };
    } else if (count === 3) {
      return {
        cols: 1,
        containerWidth: isMobile ? '300px' : isTablet ? '250px' : '280px',
        containerHeight: isMobile ? '160px' : isTablet ? '150px' : '170px',
        gridStyle: isMobile ? 'grid-cols-1' : 'grid-cols-2',
        specialLayout: !isMobile
      };
    } else if (count === 4) {
      return {
        cols: 1,
        containerWidth: isMobile ? '280px' : isTablet ? '220px' : '250px',
        containerHeight: isMobile ? '150px' : isTablet ? '140px' : '160px',
        gridStyle: isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-4'
      };
    } else if (count === 5) {
      return {
        cols: 1,
        containerWidth: isMobile ? '260px' : isTablet ? '200px' : '230px',
        containerHeight: isMobile ? '140px' : isTablet ? '130px' : '150px',
        gridStyle: isMobile ? 'grid-cols-1' : 'grid-cols-3',
        specialLayout: !isMobile
      };
    } else if (count === 6) {
      return {
        cols: 1,
        containerWidth: isMobile ? '240px' : isTablet ? '180px' : '200px',
        containerHeight: isMobile ? '130px' : isTablet ? '120px' : '140px',
        gridStyle: isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-3' : 'grid-cols-6'
      };
    } else {
      return {
        cols: 1,
        containerWidth: isMobile ? '220px' : isTablet ? '160px' : '180px',
        containerHeight: isMobile ? '120px' : isTablet ? '110px' : '130px',
        gridStyle: isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-3' : 'grid-cols-6'
      };
    }
  };

  const gridConfig = getGridConfig();
  const isMobile = screenWidth < 640;

  const getSpecialLayout = () => {
    const count = sponsors.length;
    
    if (isMobile) return null;
    
    if (count === 3) {
      return {
        firstRow: [sponsors[0]],
        secondRow: [sponsors[1], sponsors[2]]
      };
    } else if (count === 5) {
      return {
        firstRow: [sponsors[0], sponsors[1]],
        secondRow: [sponsors[2], sponsors[3], sponsors[4]]
      };
    }
    return null;
  };

  const specialLayout = getSpecialLayout();

  return (
    <section 
      className="flex items-center justify-center py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12"
      style={{ 
        background: 'transparent', 
        scrollSnapAlign: 'start',
        maxWidth: '100vw',
        minHeight: isMobile ? 'auto' : '100vh',
        maxHeight: isMobile ? 'none' : '100vh',
        overflow: isMobile ? 'visible' : 'hidden'
      }}
      id="sponsor"
    >
      <div className="w-full max-w-7xl flex flex-col items-center justify-center h-full">
        {/* Title Section */}
        <div className="relative mb-8 md:mb-12 lg:mb-16 text-center">
          <h2 
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter inline-block relative ${glitchActive ? 'glitch-active' : ''}`}
            style={{ 
              color: '#4dffff',
              textShadow: '0 0 30px rgba(77, 255, 255, 0.8), 0 0 60px rgba(77, 255, 255, 0.4)',
              fontStyle: 'italic',
              lineHeight: '1.1',
              letterSpacing: '-0.02em'
            }}
            data-text="SPONSORS"
          >
            SPONSORS
            {glitchActive && (
              <>
                <span 
                  className="absolute top-0 left-0 w-full h-full opacity-80"
                  style={{
                    color: '#a6ff4d',
                    textShadow: '4px 0 #c306aa, 0 0 20px rgba(166, 255, 77, 0.6)',
                    clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
                    transform: 'translateX(-2px)'
                  }}
                >
                  SPONSORS
                </span>
                <span 
                  className="absolute top-0 left-0 w-full h-full opacity-80"
                  style={{
                    color: '#8f03d1',
                    textShadow: '-4px 0 #4dffff, 0 0 20px rgba(143, 3, 209, 0.6)',
                    clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
                    transform: 'translateX(2px)'
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
          className="w-full flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8"
          style={{
            maxWidth: '100vw',
            maxHeight: isMobile ? 'none' : '60vh',
            overflowY: isMobile ? 'visible' : 'auto'
          }}
        >
          {specialLayout ? (
            <div className="flex flex-col items-center gap-8 sm:gap-10 md:gap-12 w-full">
              {/* First Row */}
              <div className="flex justify-center gap-8 sm:gap-10 md:gap-12">
                {specialLayout.firstRow.map((sponsor, index) => (
                  <SponsorCard 
                    key={`first-${index}`}
                    sponsor={sponsor}
                    config={gridConfig}
                  />
                ))}
              </div>
              
              {/* Second Row */}
              <div className="flex justify-center gap-8 sm:gap-10 md:gap-12">
                {specialLayout.secondRow.map((sponsor, index) => (
                  <SponsorCard 
                    key={`second-${index}`}
                    sponsor={sponsor}
                    config={gridConfig}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div 
              className={`grid w-full justify-items-center ${gridConfig.gridStyle}`}
              style={{
                maxWidth: sponsors.length === 1 ? gridConfig.containerWidth : '100%',
                gap: isMobile ? '1.5rem' : screenWidth < 1024 ? '2rem' : '3rem'
              }}
            >
              {sponsors.map((sponsor, index) => (
                <SponsorCard 
                  key={index}
                  sponsor={sponsor}
                  config={gridConfig}
                />
              ))}
            </div>
          )}
        </div>

        <div 
          className="absolute bottom-0 right-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "url('/assets/layer1.png')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            width: '400px',
            height: '320px',
            transform: 'translateX(20%) translateY(10%)'
          }}
        />

        <style jsx>{`
          .glitch-active {
            animation: glitch-anim 0.4s linear infinite;
          }

          @keyframes glitch-anim {
            0% { transform: translate(0); }
            10% { transform: translate(-1px, 1px); }
            20% { transform: translate(-2px, 2px); }
            30% { transform: translate(2px, -1px); }
            40% { transform: translate(-1px, -2px); }
            50% { transform: translate(1px, 2px); }
            60% { transform: translate(2px, 1px); }
            70% { transform: translate(-2px, -1px); }
            80% { transform: translate(-1px, 2px); }
            90% { transform: translate(1px, -2px); }
            100% { transform: translate(0); }
          }

          /* Responsive adjustments */
          @media (max-width: 640px) {
            .glitch-active {
              animation-duration: 0.3s;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

const SponsorCard: React.FC<{
  sponsor: SponsorItem;
  config: any;
}> = ({ sponsor, config }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex justify-center items-center"
      style={{
        width: config.containerWidth,
        height: config.containerHeight
      }}
    >
      <a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center relative group w-full h-full p-4 sm:p-5 md:p-6 rounded-2xl transition-all duration-500 hover:scale-105"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo container with consistent sizing */}
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{
            padding: '8px'
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
              objectFit: 'contain',
              minWidth: '80%',
              minHeight: '60%'
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
      </a>
    </div>
  );
};

export default Sponsor;