'use client'
import ScrollReveal from "./ScrollReveal";
import { useState, useEffect, ReactNode } from 'react'

export default function ThemeSection() {
  const [glitchActive, setGlitchActive] = useState<boolean>(false)
  const [pageLoaded, setPageLoaded] = useState<boolean>(false)

  useEffect(() => {
    setPageLoaded(true)
    
    // Start glitch effect 3 seconds after page load
    const glitchTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 100)
      }, 3000)
      
      return () => clearInterval(interval)
    }, 3000)

    return () => clearTimeout(glitchTimer)
  }, [])

  const GlitchText = ({ children, className }: { children: ReactNode, className?: string }) => (
    <span className={`relative ${className}`} style={{ opacity: pageLoaded ? 1 : 0 }}>
      {children}
      {pageLoaded && glitchActive && (
        <>
          <span 
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
  )

  return (
    <div className="bg-[#202021] min-h-screen p-8 flex flex-col justify-center items-center">
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
          className="text-[#a6ff4d] font-bold text-6xl mb-4 relative"
          style={{ fontFamily: "Moderniz, sans-serif", opacity: pageLoaded ? 1 : 0 }}
        >
          <GlitchText>ILLUMINÉ</GlitchText>
        </h1>
      </ScrollReveal>

      {/* Subheadline */}
      <ScrollReveal
        baseOpacity={0}
        enableBlur={true}
        baseRotation={5}
        blurStrength={10}
        delay={0.2}
        className="w-full text-center"
      >
        <p
          className="text-[#8f03d1] text-xl mb-6"
          style={{ fontFamily: "Eirene Sans Bold, sans-serif", opacity: pageLoaded ? 1 : 0 }}
        >
          <span className="font-semibold">
            <GlitchText>A French-inspired take on &ldquo;illuminate&rdquo; for a high-fashion feel.</GlitchText>
          </span>
        </p>
      </ScrollReveal>

      {/* Divider */}
      <ScrollReveal
        baseOpacity={0}
        enableBlur={true}
        blurStrength={10}
        delay={0.3}
        className="w-full text-center"
      >
        <p
          className="text-white text-lg mb-6 max-w-xl mx-auto"
          style={{ fontFamily: "Eirene Sans Bold, sans-serif", opacity: pageLoaded ? 1 : 0 }}
        >
          ───────────────────────────────
        </p>
      </ScrollReveal>

      {/* Event info */}
      <ScrollReveal
        baseOpacity={0}
        enableBlur={true}
        baseRotation={5}
        blurStrength={10}
        delay={0.4}
        className="w-full text-center"
      >
        <p
          className="text-[#8f03d1] text-lg max-w-xl mx-auto"
          style={{ fontFamily: "Eirene Sans Bold, sans-serif", opacity: pageLoaded ? 1 : 0 }}
        >
          <GlitchText>
            See you on <span className="text-[#c306aa] font-semibold">15th June 2025</span> at{' '}
            <span className="text-[#c306aa] font-semibold">Tunjungan Plaza Convention Hall</span> or watch our{' '}
            <span className="text-[#c306aa] font-semibold">live streaming</span>.
          </GlitchText>
        </p>
      </ScrollReveal>

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
  );
}