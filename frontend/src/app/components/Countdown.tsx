'use client'
import React, { useState, useEffect, useRef, ReactNode } from 'react'; // Added ReactNode
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Define GlitchText component (consistent with previous examples)
const GlitchText = ({
  children,
  className, // className for the main span wrapper, if needed
  glitchActive,
}: {
  children: ReactNode;
  className?: string;
  glitchActive: boolean;
}) => (
  // The outer span can receive the 'glitch-active' class for the shake animation
  <span className={`${className || ''} ${glitchActive ? 'glitch-active' : ''}`}>
    {children}
    {glitchActive && (
      <>
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 w-full h-full opacity-70 pointer-events-none"
          style={{
            color: "#a6ff4d",       // Palette: Light Green
            textShadow: "2px 0 #c306aa", // Palette: Magenta/Pink-Purple
            clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
          }}
        >
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 w-full h-full opacity-70 pointer-events-none"
          style={{
            color: "#8f03d1",      // Palette: Purple
            textShadow: "-2px 0 #a6ff4d", // Palette: Light Green for shadow
            clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
          }}
        >
          {children}
        </span>
      </>
    )}
  </span>
);


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
  const targetDate = new Date('2025-07-17T00:00:00');
  const [countdown, setCountdown] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [glitchActive, setGlitchActive] = useState(false); // Already present and used
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // const [isMediumUp, setIsMediumUp] = useState(false); // isMediumUp was not used, commented out
  const maxDaysRef = useRef(0);
  const countdownRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null); // This ref is for GSAP animation, not directly for glitch component
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
      // setIsMediumUp(window.innerWidth >= 768); // isMediumUp not used
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    setHasMounted(true);
    
    const initial = calculateTimeRemaining();
    setCountdown(initial);
    maxDaysRef.current = Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (maxDaysRef.current <=0) maxDaysRef.current = 30; // Default max days if target is past for placeholder

    const interval = setInterval(() => {
      const newCountdown = calculateTimeRemaining();
      setCountdown(newCountdown);
      
      if (newCountdown.days <= 0 && newCountdown.hours <= 0 && 
          newCountdown.minutes <= 0 && newCountdown.seconds <= 0) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 1000);

    // This useEffect already handles glitchActive state
    const glitchEffectTimer = setTimeout(() => { // Renamed to avoid conflict if merged later
        const glitchInterval = setInterval(() => {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 100); // Duration of glitch visual
        }, 3000); // Interval between glitches

        return () => clearInterval(glitchInterval);
    }, 2000); // Initial delay before glitch starts

    return () => {
      clearInterval(interval);
      clearTimeout(glitchEffectTimer); // Clear the timeout for glitch effect
      // clearInterval(glitchTimer); // This was the old name, ensure correct timer is cleared
      window.removeEventListener('resize', checkScreenSize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [onComplete]);

  useEffect(() => {
    if (!hasMounted) return;

    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, ...circlesRef.current.filter(el => el), ...labelsRef.current.filter(el => el)], {
        opacity: 0,
        scale: 0.85,
        y: 20,
        transformOrigin: "center center"
      });

      ScrollTrigger.create({
        trigger: countdownRef.current,
        start: "top 80%",
        onEnter: () => animateElementsIn(),
        // onEnterBack: () => animateElementsIn(), // Optional: re-animate on scroll back
      });
    }, containerRef);

    return () => ctx.revert();
  }, [hasMounted]);

  const animateElementsIn = () => {
    gsap.to(titleRef.current, {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "elastic.out(1.2, 0.5)",
      delay: 0.1
    });

    circlesRef.current.forEach((circle, index) => {
      if (!circle) return;
      gsap.to(circle, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay: 0.15 + index * 0.15,
        ease: "back.out(2)",
        transformOrigin: "center center"
      });
    });

    labelsRef.current.forEach((label, index) => {
      if (!label) return;
      gsap.to(label, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 0.3 + index * 0.15,
        ease: "sine.out" 
      });
    });
  };

  const calculatePercentage = (current: number, max: number) => {
    if (max === 0) return 0; // Avoid division by zero
    return Math.min((current / max) * 100, 100);
  };

  const radius = isMobile ? 33 : 46;
  const circumference = 2 * Math.PI * radius;
  const circleSize = isMobile ? 'w-18 h-22' : 'w-40 h-40'; // Note: h-22 seems odd for a circle with w-18
  const numberSize = isMobile ? 'text-md' : 'text-6xl';
  const labelSize = isMobile ? 'text-sm' : 'text-3xl';
  const gapSize = isMobile ? 'gap-0' : 'gap-8';
  const strokeWidth = isMobile ? '4' : '8';
  const titleSizeClass = isMobile ? 'text-3xl' : 'text-6xl'; // Renamed to avoid conflict
  const sectionPadding = isMobile ? 'py-12' : 'py-24';
  const flexDirection = isMobile ? 'flex-row' : 'flex-wrap'; // flex-wrap for desktop, flex-row for mobile
  const labelMargin = isMobile ? 'mt-3' : 'mt-4';

  const setCircleRef = (index: number) => (el: HTMLDivElement | null) => {
    circlesRef.current[index] = el;
  };

  const setLabelRef = (index: number) => (el: HTMLSpanElement | null) => {
    labelsRef.current[index] = el;
  };

  if (!hasMounted) { // Placeholder skeleton loader
    return (
      <section 
        className={`min-h-screen flex items-center justify-center ${sectionPadding}`}
        style={{ 
          backgroundColor: '#202021', // Consistent with your theme
          scrollSnapAlign: 'start'
        }}
        id="countdown"
        ref={countdownRef}
      >
        <div className="container mx-auto px-2">
          <div className="relative mb-8 text-center" style={{ height: '40px' }}>
            {/* Placeholder for title */}
            <div className="h-10 w-3/4 md:w-1/2 mx-auto bg-gray-700 rounded opacity-50"></div>
          </div>
          <div className={`flex ${isMobile ? 'flex-row' : 'flex-wrap'} justify-center ${isMobile ? 'gap-0' : 'gap-8'} items-center py-2 overflow-x-auto`}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center mx-1">
                <div className={`relative ${isMobile ? 'w-18 h-18' : 'w-40 h-40'} bg-gray-800 rounded-full opacity-50`}></div> {/* Made h-18 for mobile circle */}
                <div className={`${isMobile ? 'mt-3' : 'mt-4'} w-10 h-2 md:w-16 md:h-4 bg-gray-700 rounded opacity-50`}></div>
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
        background: 'transparent', // To show the global AnimatedSvgBackground
        scrollSnapAlign: 'start'
      }}
      id="countdown"
      ref={countdownRef}
    >
      <div className="container mx-auto px-2" ref={containerRef}>
        <div className="relative mb-6 md:mb-16 text-center">
          <h2 
            ref={titleRef} // GSAP animation target
            className={`${titleSizeClass} font-bold uppercase tracking-tighter inline-block relative`}
            style={{ 
              color: 'white',
              textShadow: '0 0 15px rgba(77, 255, 255, 0.7)', // Cyan glow
              fontStyle: 'italic'
            }}
          >
            {/* Apply GlitchText component here */}
            <GlitchText glitchActive={glitchActive}>
              COUNTDOWN
            </GlitchText>
          </h2>
        </div>
        
        <div className={`flex ${flexDirection} justify-center ${gapSize} items-center py-4 overflow-x-auto`}>
          {/* days */}
          <div className="flex flex-col items-center mx-1">
            <div 
              className={`relative ${circleSize}`} // Ensure circleSize results in equal w and h for circle
              ref={setCircleRef(0)}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#a6ff4d" strokeWidth={strokeWidth} opacity="0.3"/>
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#8f03d1" strokeWidth={strokeWidth} strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (calculatePercentage(countdown.days, maxDaysRef.current) / 100 * circumference)}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`${numberSize} font-bold`} style={{ color: '#eef2ff' }}>
                  {countdown.days.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <span ref={setLabelRef(0)} className={`${labelSize} ${labelMargin} font-medium uppercase tracking-wider`} style={{ color: '#a6ff4d', letterSpacing: '0.1em' }}>
              Days
            </span>
          </div>

          {/* hours */}
          <div className="flex flex-col items-center mx-1">
            <div className={`relative ${circleSize}`} ref={setCircleRef(1)}>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#4dffff" strokeWidth={strokeWidth} opacity="0.3"/>
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#0c1f6f" strokeWidth={strokeWidth} strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (calculatePercentage(countdown.hours, 24) / 100 * circumference)}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`${numberSize} font-bold`} style={{ color: '#eef2ff' }}>
                  {countdown.hours.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <span ref={setLabelRef(1)} className={`${labelSize} ${labelMargin} font-medium uppercase tracking-wider`} style={{ color: '#4dffff', letterSpacing: '0.1em' }}>
              Hours
            </span>
          </div>

          {/* minutes */}
          <div className="flex flex-col items-center mx-1">
            <div className={`relative ${circleSize}`} ref={setCircleRef(2)}>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#c306aa" strokeWidth={strokeWidth} opacity="0.3"/>
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#a6ff4d" strokeWidth={strokeWidth} strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (calculatePercentage(countdown.minutes, 60) / 100 * circumference)}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`${numberSize} font-bold`} style={{ color: '#eef2ff' }}>
                  {countdown.minutes.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <span ref={setLabelRef(2)} className={`${labelSize} ${labelMargin} font-medium uppercase tracking-wider`} style={{ color: '#c306aa', letterSpacing: '0.1em' }}>
              Minutes
            </span>
          </div>

          {/* seconds */}
          <div className="flex flex-col items-center mx-1">
            <div className={`relative ${circleSize}`} ref={setCircleRef(3)}>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#4d88ff" strokeWidth={strokeWidth} opacity="0.3"/> {/* Consider a palette color */}
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#4dffff" strokeWidth={strokeWidth} strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (calculatePercentage(countdown.seconds, 60) / 100 * circumference)}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`${numberSize} font-bold`} style={{ color: '#eef2ff' }}>
                  {countdown.seconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <span ref={setLabelRef(3)} className={`${labelSize} ${labelMargin} font-medium uppercase tracking-wider`} style={{ color: '#8f03d1', letterSpacing: '0.1em' }}>
              Seconds
            </span>
          </div>
        </div>

        {/* Decorative Image */}
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
        /* This animation is applied via the GlitchText component when glitchActive is true */
        .glitch-active { 
          animation: glitch-anim 0.3s linear infinite; /* Keep or adjust this shake */
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

