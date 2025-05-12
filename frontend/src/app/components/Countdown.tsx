'use client'
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  const [isMediumUp, setIsMediumUp] = useState(false);
  const maxDaysRef = useRef(0);
  const countdownRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<(HTMLSpanElement | null)[]>([]);

  gsap.registerPlugin(ScrollTrigger);

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
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsMediumUp(window.innerWidth >= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    setHasMounted(true);
    
    const initial = calculateTimeRemaining();
    setCountdown(initial);
    maxDaysRef.current = Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    const interval = setInterval(() => {
      const newCountdown = calculateTimeRemaining();
      setCountdown(newCountdown);
      
      if (newCountdown.days <= 0 && newCountdown.hours <= 0 && 
          newCountdown.minutes <= 0 && newCountdown.seconds <= 0) {
        clearInterval(interval);
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
      window.removeEventListener('resize', checkScreenSize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [onComplete]);

  useEffect(() => {
    if (!hasMounted) return;

    const ctx = gsap.context(() => {
      // Smoother initial hidden state
      gsap.set([titleRef.current, ...circlesRef.current, ...labelsRef.current], {
        opacity: 0,
        scale: 0.85, // Slightly larger initial scale for smoother pop
        y: 20, // Less initial offset for smoother movement
        transformOrigin: "center center" // Ensure scaling happens from center
      });

      // Smoother scroll trigger
      ScrollTrigger.create({
        trigger: countdownRef.current,
        start: "top 80%", // Slightly higher trigger point
        onEnter: () => animateElementsIn(),
        onEnterBack: () => animateElementsIn(),
      });
    }, containerRef);

    return () => ctx.revert();
  }, [hasMounted]);

  const animateElementsIn = () => {
    // Smoother title animation with bounce effect
    gsap.to(titleRef.current, {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 1.2, // Longer duration
      ease: "elastic.out(1.2, 0.5)", // More pronounced elastic effect
      delay: 0.1
    });

    // Smoother circle animations with staggered pop
    circlesRef.current.forEach((circle, index) => {
      gsap.to(circle, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.9, // Longer duration
        delay: 0.15 + index * 0.15, // More staggered delay
        ease: "back.out(2)", // Smoother back easing
        transformOrigin: "center center" // Ensure scaling happens from center
      });
    });

    // Smoother label animations
    labelsRef.current.forEach((label, index) => {
      gsap.to(label, {
        opacity: 1,
        y: 0,
        duration: 0.7, // Longer duration
        delay: 0.3 + index * 0.15, // More staggered delay
        ease: "sine.out" // Smoother easing
      });
    });
  };

  const calculatePercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  // Mobile-first sizing
  const radius = isMobile ? 20 : 46;
  const circumference = 2 * Math.PI * radius;
  const circleSize = isMobile ? 'w-18 h-18' : 'w-40 h-40';
  const numberSize = isMobile ? 'text-xs' : 'text-6xl';
  const labelSize = isMobile ? 'text-sm' : 'text-3xl';
  const gapSize = isMobile ? 'gap-1' : 'gap-8';
  const strokeWidth = isMobile ? '4' : '8';
  const titleSize = isMobile ? 'text-3xl' : 'text-6xl';
  const sectionPadding = isMobile ? 'py-12' : 'py-24';
  const flexDirection = isMobile ? 'flex-row' : 'flex-wrap';
  const labelMargin = isMobile ? 'mt-3' : 'mt-4';

  const setCircleRef = (index: number) => (el: HTMLDivElement | null) => {
    circlesRef.current[index] = el;
  };

  const setLabelRef = (index: number) => (el: HTMLSpanElement | null) => {
    labelsRef.current[index] = el;
  };

  if (!hasMounted) {
    return (
      <section 
        className={`min-h-screen flex items-center justify-center ${sectionPadding}`}
        style={{ 
          backgroundColor: '#202021',
          scrollSnapAlign: 'start'
        }}
        id="countdown"
        ref={countdownRef}
      >
        <div className="container mx-auto px-2">
          <div className="relative mb-8 text-center" style={{ height: '40px' }}></div>
          <div className={`flex ${flexDirection} justify-center ${gapSize} items-center py-2 overflow-x-auto`}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center mx-1">
                <div className={`relative ${circleSize} bg-gray-800 rounded-full`}></div>
                <div className={`${labelMargin} w-10 h-2 bg-gray-800 rounded`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className={`min-h-screen flex items-center justify-center ${sectionPadding} font-neue-montreal overflow-hidden`}
      style={{ 
        background: 'transparent',
        scrollSnapAlign: 'start'
      }}
      id="countdown"
      ref={countdownRef}
    >
      <div className="container mx-auto px-2" ref={containerRef}>
        <div className="relative mb-6 md:mb-16 text-center">
          <h2 
            ref={titleRef}
            className={`${titleSize} font-bold uppercase tracking-tighter inline-block relative ${
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
        
        <div className={`flex ${flexDirection} justify-center ${gapSize} items-center py-4 overflow-x-auto`}>
          {/* Days */}
          <div className="flex flex-col items-center mx-1">
            <div 
              className={`relative ${circleSize}`}
              ref={setCircleRef(0)}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#a6ff4d"
                  strokeWidth={strokeWidth}
                  opacity="0.3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#8f03d1"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (calculatePercentage(countdown.days, maxDaysRef.current) / 100 * circumference)}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className={`${numberSize} font-bold`}
                  style={{ color: '#eef2ff' }}
                >
                  {countdown.days.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <span 
              ref={setLabelRef(0)}
              className={`${labelSize} ${labelMargin} font-medium uppercase tracking-wider`}
              style={{ color: '#a6ff4d', letterSpacing: '0.1em' }}
            >
              Days
            </span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center mx-1">
            <div 
              className={`relative ${circleSize}`}
              ref={setCircleRef(1)}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#4dffff"
                  strokeWidth={strokeWidth}
                  opacity="0.3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#0c1f6f"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (calculatePercentage(countdown.hours, 24) / 100 * circumference)}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className={`${numberSize} font-bold`}
                  style={{ color: '#eef2ff' }}
                >
                  {countdown.hours.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <span 
              ref={setLabelRef(1)}
              className={`${labelSize} ${labelMargin} font-medium uppercase tracking-wider`}
              style={{ color: '#4dffff', letterSpacing: '0.1em' }}
            >
              Hours
            </span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center mx-1">
            <div 
              className={`relative ${circleSize}`}
              ref={setCircleRef(2)}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#c306aa"
                  strokeWidth={strokeWidth}
                  opacity="0.3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#a6ff4d"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (calculatePercentage(countdown.minutes, 60) / 100 * circumference)}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className={`${numberSize} font-bold`}
                  style={{ color: '#eef2ff' }}
                >
                  {countdown.minutes.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <span 
              ref={setLabelRef(2)}
              className={`${labelSize} ${labelMargin} font-medium uppercase tracking-wider`}
              style={{ color: '#c306aa', letterSpacing: '0.1em' }}
            >
              Minutes
            </span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center mx-1">
            <div 
              className={`relative ${circleSize}`}
              ref={setCircleRef(3)}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#4d88ff"
                  strokeWidth={strokeWidth}
                  opacity="0.3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#4dffff"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (calculatePercentage(countdown.seconds, 60) / 100 * circumference)}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className={`${numberSize} font-bold`}
                  style={{ color: '#eef2ff' }}
                >
                  {countdown.seconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <span 
              ref={setLabelRef(3)}
              className={`${labelSize} ${labelMargin} font-medium uppercase tracking-wider`}
              style={{ color: '#8f03d1', letterSpacing: '0.1em' }}
            >
              Seconds
            </span>
          </div>
        </div>

        <div 
          className="absolute bottom-30 -left-20 z-[-10] mb-4 mr-4 opacity-35"
          style={{
            backgroundImage: "url('/assets/layer3.png')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            width: '600px',
            height: '600px',
          }}
        ></div>
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