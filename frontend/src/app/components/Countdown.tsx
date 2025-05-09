'use client'
import React, { useState, useEffect, useRef } from 'react';

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  onComplete?: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ onComplete }) => {
  const targetDate = new Date('2025-05-31T00:00:00');
  const [countdown, setCountdown] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [glitchActive, setGlitchActive] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const maxDaysRef = useRef(0);

  function calculateTimeRemaining(): CountdownState {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    setHasMounted(true);
    
    const initial = calculateTimeRemaining();
    setCountdown(initial);
    maxDaysRef.current = Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    const interval = setInterval(() => {
      const newCountdown = calculateTimeRemaining();
      setCountdown(newCountdown);
      
      if (newCountdown.days <= 0 && newCountdown.hours <= 0 && 
          newCountdown.minutes <= 0 && newCountdown.seconds <= 0) {
        onComplete?.();
      }
    }, 1000);

    const glitchTimer = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(glitchTimer);
      window.removeEventListener('resize', checkMobile);
    };
  }, [onComplete]);

  const calculatePercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  const radius = isMobile ? 40 : 45;
  const circumference = 2 * Math.PI * radius;

  if (!hasMounted) {
    return (
      <section 
        className="min-h-screen flex items-center justify-center py-16"
        style={{ 
          backgroundColor: '#202021',
          scrollSnapAlign: 'start'
        }}
        id="countdown"
      >
        <div className="container mx-auto px-4">
          <div className="relative mb-16 text-center" style={{ height: '56px' }}></div>
          <div className="flex flex-wrap justify-center gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="relative w-32 h-32 md:w-40 md:h-40 bg-gray-800 rounded-full"></div>
                <div className="mt-4 w-20 h-6 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="min-h-screen flex items-center justify-center py-16 font-neue-montreal"
      style={{ 
        background: 'transparent',
        scrollSnapAlign: 'start'
      }}
      id="countdown"
    >
      <div className="container mx-auto px-4">
        {/* title */}
        <div className="relative mb-16 text-center">
          <h2 
            className={`text-5xl md:text-6xl font-bold uppercase tracking-tighter inline-block relative ${
              glitchActive ? 'glitch-active' : ''
            }`}
            style={{ 
              color: '#4dffff',
              textShadow: '0 0 15px rgba(77, 255, 255, 0.7)',
              fontStyle: 'italic'
            }}
          >
            COUNTDOWN
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
                  COUNTDOWN
                </span>
                <span 
                  className="absolute top-0 left-0 w-full h-full opacity-70"
                  style={{
                    color: '#8f03d1',
                    textShadow: '-3px 0 #4dffff',
                    clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)'
                  }}
                >
                  COUNTDOWN
                </span>
              </>
            )}
          </h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {/* days */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#a6ff4d"
                  strokeWidth="8"
                  opacity="0.3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#8f03d1"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (calculatePercentage(countdown.days, maxDaysRef.current) / 100 * circumference)}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className="text-4xl md:text-5xl font-bold"
                  style={{ color: '#eef2ff' }}
                >
                  {countdown.days.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <span 
              className="mt-6 text-xl uppercase tracking-widest"
              style={{ color: '#a6ff4d', letterSpacing: '0.2em' }}
            >
              Days
            </span>
          </div>

          {/* hours */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#4dffff"
                  strokeWidth="8"
                  opacity="0.3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#0c1f6f"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (calculatePercentage(countdown.hours, 24) / 100 * circumference)}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className="text-4xl md:text-5xl font-bold"
                  style={{ color: '#eef2ff' }}
                >
                  {countdown.hours.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <span 
              className="mt-6 text-xl uppercase tracking-widest"
              style={{ color: '#4dffff', letterSpacing: '0.2em' }}
            >
              Hours
            </span>
          </div>

          {/* minutes */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#c306aa"
                  strokeWidth="8"
                  opacity="0.3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#a6ff4d"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (calculatePercentage(countdown.minutes, 60) / 100 * circumference)}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className="text-4xl md:text-5xl font-bold"
                  style={{ color: '#eef2ff' }}
                >
                  {countdown.minutes.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <span 
              className="mt-6 text-xl uppercase tracking-widest"
              style={{ color: '#c306aa', letterSpacing: '0.2em' }}
            >
              Minutes
            </span>
          </div>

          {/* seconds */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#4d88ff"
                  strokeWidth="8"
                  opacity="0.3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#4dffff"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (calculatePercentage(countdown.seconds, 60) / 100 * circumference)}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className="text-4xl md:text-5xl font-bold"
                  style={{ color: '#eef2ff' }}
                >
                  {countdown.seconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <span 
              className="mt-6 text-xl uppercase tracking-widest"
              style={{ color: '#8f03d1', letterSpacing: '0.2em' }}
            >
              Seconds
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
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
    </section>
  );
};

export default Countdown;