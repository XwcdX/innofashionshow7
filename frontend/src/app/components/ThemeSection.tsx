'use client'
import ScrollReveal from "./ScrollReveal";
import { useState, useEffect, ReactNode, useRef } from 'react'
import SplitText from "./SplitText";

export default function ThemeSection() {
  const [glitchActive, setGlitchActive] = useState<boolean>(false)
  const [pageLoaded, setPageLoaded] = useState<boolean>(false)
  const [splitTextUsed, setSplitTextUsed] = useState<boolean>(true)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setPageLoaded(true)

    const glitchTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 100)
      }, 3000)

      return () => clearInterval(interval)
    }, 3000)

    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e))
    }

    return () => clearTimeout(glitchTimer)
  }, [])

  useEffect(() => {
    if (pageLoaded) {
      setTimeout(() => setSplitTextUsed(false), 3000);
    }
  }, [pageLoaded]);

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  const GlitchText = ({ children, className }: { children: ReactNode, className?: string }) => (
    <span className={`relative ${className || ''}`} style={{ opacity: pageLoaded ? 1 : 0 }}>
      {children}
      {pageLoaded && glitchActive && (
        <>
          <span
            aria-hidden="true"
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
            aria-hidden="true"
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
    <div id="Home" className="relative min-h-screen p-8 flex flex-col justify-center items-center overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'brightness(1.15) contrast(1.1)',
          opacity: 0.85
        }}
      >
        <source src="/teaser_inno_1 _CUT.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Mute/Unmute Button */}
      {/* <button
        onClick={handleToggleMute}
        className="fixed bottom-5 right-5 z-20 bg-black bg-opacity-50 text-white px-4 py-2 rounded hover:bg-opacity-75 transition"
        >
        {isMuted ? 'Unmute' : 'Mute'}
      </button> */}

      <div className="relative z-10 w-full">
        <ScrollReveal
          baseOpacity={0}
          enableBlur={true}
          baseRotation={5}
          blurStrength={10}
          delay={0.1}
          className="w-full text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tight text-white mb-12 text-center"
            style={{
              textShadow: '0 0 15px rgba(255, 255, 255, 0.9)',
              fontStyle: 'italic',
            }}>
            {splitTextUsed ? (
              <SplitText
                text="ILLUMINE"
                className="text-5xl md:text-6xl font-bold uppercase tracking-tight text-white mb-12 text-center"
                staggerDelay={0.1}
                animationFrom={{ opacity: 0, y: 50 }}
                animationTo={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15, mass: 0.5 }}
                threshold={0.2}
                rootMargin="-50px"
                onAnimationComplete={handleAnimationComplete}
              />
            ) : (
              <GlitchText>ILLUMINE</GlitchText>
            )}
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
          <p className="text-white text-xl mb-6" style={{ fontFamily: "Eirene Sans Bold, sans-serif", opacity: pageLoaded ? 1 : 0 }}>
            <span className="font-semibold">
              <GlitchText>Glow beyond, inspire more</GlitchText>
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
          <p className="text-white text-lg max-w-xl mx-auto" style={{ fontFamily: "Eirene Sans Bold, sans-serif", opacity: pageLoaded ? 1 : 0 }}>
            <GlitchText>
              See you on <span className="text-white font-semibold">15th June 2025</span> at{' '}
              <span className="text-white font-semibold">Tunjungan Plaza Convention Hall</span> or watch our{' '}
              <span className="text-white font-semibold">live streaming</span>.
            </GlitchText>
          </p>
        </ScrollReveal>
      </div>

      <div
        className="absolute  -bottom-55 -right-20 z-0 mb-4 mr-4 opacity-100"
        style={{
          backgroundImage: "url('/assets/layer1.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          width: '700px',
          height: '400px',
        }}
      ></div>

      <div
        className="absolute  -bottom-30 -left-20 z-0 mb-4 mr-4 opacity-35"
        style={{
          backgroundImage: "url('/assets/layer2.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          width: '400px',
          height: '400px',
        }}
      ></div>

      <style jsx>{`
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
          z-index: 1000;
          opacity: 0.25;
        }

        video {
          animation: video-enhance 8s ease-in-out infinite;
        }

        @keyframes video-enhance {
          0% { filter: brightness(1.15) contrast(1.1); }
          50% { filter: brightness(1.2) contrast(1.15); }
          100% { filter: brightness(1.15) contrast(1.1); }
        }
      `}</style>
    </div>
  );
}
