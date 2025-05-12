'use client'
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PrizePool: React.FC = () => {
  const [prizePool, setPrizePool] = useState<number>(0);
  const [showShadow, setShowShadow] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const [glitchActive, setGlitchActive] = useState<boolean>(false);
  const [hasStartedCounting, setHasStartedCounting] = useState(false);
  const targetPrize: number = 5000000;
  
  const titleRef = useRef<HTMLHeadingElement>(null);
  const prizeTextRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const glitchTimer = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100);
    }, 3000);

    return () => {
      clearInterval(glitchTimer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, prizeTextRef.current], {
        opacity: 0,
        y: 30,
        scale: 0.9
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        onEnter: () => {
          animateElementsIn();
          if (!hasStartedCounting) {
            startCountUp();
            setHasStartedCounting(true);
          }
        },
        onEnterBack: () => {
          animateElementsIn();
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [hasStartedCounting]);

  const animateElementsIn = () => {
    gsap.to(titleRef.current, {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "elastic.out(1.2, 0.5)",
      delay: 0.1
    });

    gsap.to(prizeTextRef.current, {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.3,
      ease: "back.out(1.7)"
    });
  };

  const startCountUp = () => {
    const duration: number = 1500;
    const increment: number = targetPrize / (duration / 16);
    let prizeStart: number = 0;
    const prizeEnd: number = targetPrize;

    const animate = () => {
      if (prizeStart < prizeEnd) {
        prizeStart += increment;
        setPrizePool(Math.ceil(prizeStart));
        requestAnimationFrame(animate);
      } else {
        setPrizePool(prizeEnd);
        setShowShadow(true);
      }
    };

    animate();
  };

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center p-4 -mt-60"
      style={{ 
        background: 'transparent',
        scrollSnapAlign: 'start'
      }}
      id="prize"
    >
      <div 
        className="absolute bottom-0 -right-40 z-0 mb-4 mr-4 opacity-35"
        style={{
          backgroundImage: "url('/assets/layer2.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          width: '700px',
          height: '400px',
        }}
      ></div>

      <div 
        className="absolute bottom-0 -left-40 z-0 mb-4 mr-4 opacity-35"
        style={{
          backgroundImage: "url('/assets/lines2.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          width: '700px',
          height: '700px',
        }}
      ></div>

      <div ref={containerRef} className="text-center w-full max-w-6xl px-4">
        <div className="relative">
          <div className="relative mb-8 md:mb-16 lg:mb-20 text-center">
            <h2 
              ref={titleRef}
              className={`text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter inline-block relative ${glitchActive ? 'glitch-active' : ''}`}
              style={{ 
                color: '#4dffff',
                textShadow: '0 0 15px rgba(77, 255, 255, 0.7)',
                fontStyle: 'italic'
              }}
              data-text="TOTAL PRIZE POOL"
            >
              TOTAL PRIZE POOL
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
                    TOTAL PRIZE POOL
                  </span>
                  <span 
                    className="absolute top-0 left-0 w-full h-full opacity-70"
                    style={{
                      color: '#8f03d1',
                      textShadow: '-3px 0 #4dffff',
                      clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)'
                    }}
                  >
                    TOTAL PRIZE POOL
                  </span>
                </>
              )}
            </h2>
          </div>
          
          <div ref={prizeTextRef} className="relative">
            {showShadow && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter"
                  style={{ 
                    color: 'rgba(143, 3, 209, 0.3)',
                    fontStyle: 'italic',
                    textShadow: '0 0 20px rgba(77, 255, 255, 0.5)',
                    lineHeight: isMobile ? '1.2' : '1.1'
                  }}
                >
                  Rp 5.000.000
                </span>
              </div>
            )}

            <div className="relative overflow-hidden">
              <div className={`absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter bg-clip-text text-transparent opacity-70 ${glitchActive ? 'translate-x-3' : 'translate-x-0'} transition-transform duration-75`}
                style={{ 
                  backgroundImage: 'linear-gradient(to right, #c306aa, #8f03d1)',
                  fontStyle: 'italic',
                  lineHeight: isMobile ? '1.2' : '1.1'
                }}
              >
                Rp {prizePool.toLocaleString('id-ID')}
              </div>
              <div className={`absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter bg-clip-text text-transparent opacity-70 ${glitchActive ? '-translate-x-3' : 'translate-x-0'} transition-transform duration-75`}
                style={{ 
                  backgroundImage: 'linear-gradient(to right, #4dffff, #a6ff4d)',
                  fontStyle: 'italic',
                  lineHeight: isMobile ? '1.2' : '1.1'
                }}
              >
                Rp {prizePool.toLocaleString('id-ID')}
              </div>
              
              <span className={`text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter bg-clip-text text-transparent ${glitchActive ? 'scale-110' : 'scale-100'} transition-all duration-200`}
                style={{ 
                  backgroundImage: 'linear-gradient(to right, #a6ff4d, #4dffff, #8f03d1)',
                  fontStyle: 'italic',
                  lineHeight: isMobile ? '1.2' : '1.1'
                }}
              >
                Rp {prizePool.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

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

export default PrizePool;