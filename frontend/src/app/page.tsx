'use client'
import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ThemeSection from './components/ThemeSection';
import EventBar from './components/EventBar';
import Footer from './components/Footer';
import AboutSection from './components/AboutSection';
import CompetitionsSection from './components/CompetitionsSection';
// import LoadingAnimation from './components/Loader';
import Countdown from './components/Countdown';
import PrizePool from './components/Prize';
import FAQ from './components/FAQ';
// import Sponsor from './components/Sponsor';
import Lenis from '@studio-freight/lenis';
import TimelineSection from "@/app/components/TimelineSection";
import ClickSpark from './components/ClickSpark';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!isLoading) {
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
  }, [isLoading]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div ref={mainRef} className="relative">
        <ClickSpark
          sparkColor='rgba(77, 255, 255, 0.7)'
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
        >
          <Navbar />
          <ThemeSection />
          <AboutSection />
          <EventBar />
          <CompetitionsSection />
          <Countdown />
          <TimelineSection />
          <PrizePool />
          {/* <FAQ /> */}
          {/* <Sponsor /> */}
          <Footer />
        </ClickSpark>
      </div>

      <style jsx global>{`
  html {
    scroll-behavior: auto !important;
  }

  .mix-blend-overlay {
    mix-blend-mode: overlay;
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
    to {
      opacity: 1;
    }
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