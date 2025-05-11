'use client'
import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ThemeSection from './components/ThemeSection';
import EventBar from './components/EventBar';
// import RSVPButton from './components/RSVPButton'
import Footer from './components/Footer';
import AboutSection from './components/AboutSection';
import CompetitionsSection from './components/CompetitionsSection';
import LoadingAnimation from './components/Loader';
import Bumper from './components/Bumper';
import Countdown from './components/Countdown';
import PrizePool from './components/Prize';
import FAQ from './components/FAQ';
import Sponsor from './components/Sponsor';
import Lenis from '@studio-freight/lenis';
import TimelineSection from "@/app/components/TimelineSection";
// import { Timeline } from './components/Timeline';




export default function Home() {
  const [currentStage, setCurrentStage] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (currentStage >= 2) {
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        infinite: false,
      });

      function raf(time: number) {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenisRef.current?.destroy();
      };
    }
  }, [currentStage]);

  useEffect(() => {
    if (currentStage === 0) {
      const timer = setTimeout(() => {
        setCurrentStage(1);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  const handleBumperComplete = () => {
    setCurrentStage(2);
  };

  return (

    <div className="relative w-full h-full overflow-hidden">
      <img
        src="/blending_1.png"
        alt="Decorative blending effect"
        className="absolute top-0 left-0 w-1/3 opacity-50 mix-blend-overlay pointer-events-none"
        style={{ zIndex: -1 }}
      />
      <img
        src="/blending_2.png"
        alt="Decorative blending effect"
        className="absolute bottom-0 right-0 w-1/4 opacity-30 mix-blend-lighten pointer-events-none"
        style={{ zIndex: -1 }}
      />
      <img
        src="/blending_3.png"
        alt="Decorative blending effect"
        className="absolute top-1/2 left-1/4 w-1/5 opacity-40 mix-blend-screen pointer-events-none"
        style={{ zIndex: -1, transform: 'translate(-50%, -50%) rotate(45deg)' }}
      />
      <img
        src="/blending_4.png"
        alt="Decorative blending effect"
        className="absolute top-1/3 right-1/4 w-1/6 opacity-60 mix-blend-soft-light pointer-events-none"
        style={{ zIndex: -1 }}
      />

      {currentStage === 0 && <LoadingAnimation />}
      {currentStage === 1 && <Bumper onComplete={handleBumperComplete} />}

      {currentStage >= 2 && (
        <div ref={mainRef} className="relative">
          <Navbar />
          <ThemeSection />
          <AboutSection />
          <EventBar />
          <CompetitionsSection />
          <Countdown />
          <PrizePool />
          <FAQ />
          <Sponsor />
          <TimelineSection />
          {/* <Timeline /> */}
          {/* <RSVPButton /> */}
          <Footer />


        </div>
      )}

      <style jsx global>{`
  html {
    scroll-behavior: auto !important;
  }
  
  .mix-blend-overlay {
    mix-blend-mode: overlay;5
  }
  .mix-blend-lighten {
    mix-blend-mode: lighten;
  }
  .mix-blend-screen {
    mix-blend-mode: screen;
  }
  .mix-blend-soft-light {
    mix-blend-mode: soft-light;
  }

  body {
    background: linear-gradient(
      135deg,
      #A30A99 0%,
      #820D8C 25%,
      #5F117F 50%,
      #3D1472 75%,
      #281660 100%
    );
    background-attachment: fixed;
    background-size: 200% 200%;
    min-height: 100vh;
    animation: gradientAnimation 15s ease infinite;
    margin: 0;
    padding: 0;
    font-family: inherit;
    position: relative;
    overflow-x: hidden;
  }

  section {
    height: 100vh;
    width: 100%;
    position: relative;
    background-color: transparent;
  }
  
  .fade-in {
    opacity: 0;
    animation: fadeIn 1s ease-out forwards;
  }
  
  .slide-up {
    opacity: 0;
    transform: translateY(20px);
    animation: slideUp 0.8s ease-out forwards;
  }
  
  .scale-in {
    opacity: 0;
    transform: scale(0.95);
    animation: scaleIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  
  @keyframes fadeIn {
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`}</style>
    </div>
  );
}