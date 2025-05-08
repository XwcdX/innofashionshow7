'use client'
import React, { useState, useEffect } from 'react';

interface SponsorItem {
  name: string;
  logo: string;
  url: string;
}

const Sponsor = () => {
  const sponsors: SponsorItem[] = [
    { 
      name: 'Afterpay', 
      logo: 'https://logo.clearbit.com/afterpay.com', 
      url: 'https://www.afterpay.com' 
    },
    { 
      name: 'Behance', 
      logo: 'https://logo.clearbit.com/behance.net', 
      url: 'https://www.behance.net' 
    },
    { 
      name: 'Google', 
      logo: 'https://logo.clearbit.com/google.com', 
      url: 'https://www.google.com' 
    },
    { 
      name: 'Adobe', 
      logo: 'https://logo.clearbit.com/adobe.com', 
      url: 'https://www.adobe.com' 
    },
    { 
      name: 'Ralph Lauren', 
      logo: 'https://logo.clearbit.com/ralphlauren.com', 
      url: 'https://www.ralphlauren.com' 
    },
    { 
      name: 'Dropbox', 
      logo: 'https://logo.clearbit.com/dropbox.com', 
      url: 'https://www.dropbox.com' 
    }
  ];

  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: 'transparent',
        //backgroundColor: '#202021',
        scrollSnapAlign: 'start'
      }}
      id="sponsor"
    >
      <div className="w-full max-w-6xl px-4">
        <div className="relative mb-16 md:mb-16 text-center">
          <h2 
            className={`text-5xl md:text-6xl font-bold uppercase tracking-tighter inline-block relative ${
              glitchActive ? 'glitch-active' : ''
            }`}
            style={{ 
              color: '#4dffff',
              textShadow: '0 0 15px rgba(77, 255, 255, 0.7)',
              fontStyle: 'italic'
            }}
            data-text="SPONSORS & PARTNERS"
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
        
        <div className="flex flex-wrap justify-center items-center gap-6">
          {sponsors.map((sponsor, index) => (
            <a
              key={index}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[150px] h-[80px] flex items-center justify-center relative group"
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="w-full h-full object-contain opacity-100 transition-all duration-300 group-hover:opacity-0"
                style={{
                  filter: 'grayscale(100%) brightness(1.5)'
                }}
              />
              
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="absolute w-full h-full object-contain opacity-0 transition-all duration-300 group-hover:opacity-100"
                style={{
                  filter: 'none',
                  transform: 'scale(1.1)'
                }}
              />
            </a>
          ))}
        </div>

        <style jsx>{`
          .glitch-active {
            animation: glitch-anim 0.3s linear infinite;
          }
          
          @keyframes glitch-anim {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
          }
        `}</style>
      </div>
    </section>
  );
};

export default Sponsor;