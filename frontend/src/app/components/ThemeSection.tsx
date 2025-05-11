'use client';
import ScrollReveal from "./ScrollReveal"; // Assuming this component is correctly implemented
import { useState, useEffect, ReactNode, useRef } from 'react';

export default function ThemeSection() {
  const [glitchActive, setGlitchActive] = useState<boolean>(false);
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Refs to store timer IDs for proper cleanup
  const glitchEffectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const glitchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setPageLoaded(true);
    const currentVideo = videoRef.current; // Capture video ref for use in cleanup

    // Start glitch effect 3 seconds after page load
    glitchEffectTimeoutRef.current = setTimeout(() => {
      glitchIntervalRef.current = setInterval(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 100);
      }, 3000); // Glitch triggers every 3 seconds
    }, 3000); // Initial delay for glitch effect

    // Autoplay background video
    if (currentVideo) {
      // Ensure necessary attributes for a background looping video
      currentVideo.muted = true;
      currentVideo.loop = true;
      currentVideo.playsInline = true; // Important for iOS and some Android browsers
      currentVideo.preload = 'auto'; // Good practice for videos expected to play

      currentVideo.play().catch(error => {
        // Catch potential errors, especially if autoplay is blocked or element is removed
        if ((error as DOMException).name === 'AbortError') {
          console.warn('ThemeSection: Background video play was aborted (likely due to unmount).');
        } else {
          console.error("ThemeSection: Background video autoplay prevented or error:", error);
        }
      });
    }

    // Cleanup function: This runs when the component unmounts
    return () => {
      if (glitchEffectTimeoutRef.current) {
        clearTimeout(glitchEffectTimeoutRef.current);
      }
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current);
      }

      // Pause the video if it's playing and the component unmounts
      if (currentVideo && !currentVideo.paused) {
        currentVideo.pause();
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  const GlitchText = ({ children, className }: { children: ReactNode, className?: string }) => (
    <span className={`relative ${className || ''}`} style={{ opacity: pageLoaded ? 1 : 0 }}>
      {children}
      {pageLoaded && glitchActive && (
        <>
          <span
            aria-hidden="true" // Decorative element
            className="absolute top-0 left-0 w-full h-full opacity-70 pointer-events-none"
            style={{
              color: '#a6ff4d',
              textShadow: '2px 0 #c306aa',
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)'
            }}
          >
            {children}
          </span>
          <span
            aria-hidden="true" // Decorative element
            className="absolute top-0 left-0 w-full h-full opacity-70 pointer-events-none"
            style={{
              color: '#8f03d1',
              textShadow: '-2px 0 rgb(104, 255, 77)',
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)'
            }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  );

  return (
    <div className="relative min-h-screen p-8 flex flex-col justify-center items-center overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        // autoPlay, muted, loop, playsInline are now handled by useEffect
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.8,
          mixBlendMode: 'screen'
        }}
      >
        <source src="/teaser_inno_1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better text visibility */}
      <div
        className="absolute inset-0 z-[1]" // Ensure overlay is above video (z-0)
        style={{
          background: 'linear-gradient(180deg, rgba(163, 10, 153, 0.3) 0%, rgba(40, 22, 96, 0.7) 100%)'
        }}
      />

      {/* Content */}
      <div className="relative z-[10] w-full"> {/* Ensure content is above overlay (z-1) */}
        {/* Headline */}
        <ScrollReveal
          baseOpacity={0}
          enableBlur={true}
          baseRotation={5}
          blurStrength={10}
          delay={0.1}
          className="w-full text-center"
        >
          <h1
            className="text-5xl md:text-6xl font-bold uppercase tracking-tight text-[#4dffff] mb-12 text-center"
            style={{
              textShadow: '0 0 15px rgba(77, 255, 255, 0.7)',
              fontStyle: 'italic',
            }}
          >
            <GlitchText>ILLUMINE</GlitchText>
          </h1>
        </ScrollReveal>

        <ScrollReveal
          baseOpacity={0}
          enableBlur={true}
          baseRotation={5}
          blurStrength={10}
          delay={0.2}
          className="w-full text-center"
        >
          <p
            className="text-white text-xl mb-6"
            style={{ fontFamily: "Eirene Sans Bold, sans-serif", opacity: pageLoaded ? 1 : 0 }}
          >
            <span className="font-semibold">
              <GlitchText>A French-inspired take on “illuminate” for a high-fashion feel.</GlitchText>
            </span>
          </p>
        </ScrollReveal>

        <ScrollReveal
          baseOpacity={0}
          enableBlur={true}
          baseRotation={5}
          blurStrength={10}
          delay={0.4}
          className="w-full text-center"
        >
          <p
            className="text-white text-lg max-w-xl mx-auto"
            style={{ fontFamily: "Eirene Sans Bold, sans-serif", opacity: pageLoaded ? 1 : 0 }}
          >
            <GlitchText>
              See you on <span className="text-white font-semibold">15th June 2025</span> at{' '}
              <span className="text-white font-semibold">Tunjungan Plaza Convention Hall</span> or watch our{' '}
              <span className="text-white font-semibold">live streaming</span>.
            </GlitchText>
          </p>
        </ScrollReveal>
      </div>

      {/* Decorative image at the bottom right */}
      <div
        className="absolute -bottom-30 -right-20 z-0 mb-4 mr-4 opacity-35" // Keep z-0 if it's meant to be behind content/overlay
        style={{
          backgroundImage: "url('/assets/layer2.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          width: '400px',
          height: '400px',
        }}
      ></div>

      {/* 
        The <style jsx> block is assumed to be correct as per your original code.
        If the `body::before` grain effect is intended for this section only, 
        consider scoping it more locally or using a class on the body toggle.
        If it's global, it should be in your global CSS file.
      */}
      <style jsx>{`
        /* Additional texture effects */
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, -35%); }
          90% { transform: translate(-10%, 10%); }
        }

        /* 
          If this body::before is only for this component's active view,
          you might want to manage it by adding/removing a class to the body
          via another useEffect. If it's truly global, move it to globals.css.
        */
        /*
        body::before {
          content: "";
          position: fixed;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E");
          animation: grain 8s steps(10) infinite;
          pointer-events: none;
          z-index: 1000; // Ensure it's on top if it's a global overlay
          opacity: 0.25;
        }
        */
        .glitch-active { /* This class is not currently applied to any element for animation */
          /* If you intend for GlitchText to animate when glitchActive is true, you'd apply this class to its container */
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
  );
}