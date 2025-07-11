// app/page.tsx
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
// import FAQ from './components/FAQ';
// import Sponsor from './components/Sponsor';
import Lenis from '@studio-freight/lenis';
import TimelineSection from "@/app/components/TimelineSection";
import ClickSpark from './components/ClickSpark';
import AnimatedSvgBackground from './components/AnimatedSvgBackground';
import Sponsor, { SponsorItem } from './components/Sponsor';

export default function Home() {
  // State isLoading dan logika Lenis Anda tetap sama persis seperti kode awal Anda.
  // Saya akan mengembalikan isLoading ke kondisi awal Anda (selalu true untuk contoh ini,
  // namun Anda mungkin memiliki logika untuk mengubahnya).
  const [isLoading] = useState(true);
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

  const sponsors: SponsorItem[] = [
    { name: '88 Digital Printing', logo: "/assets/Sponsor - 88 Digital Printing.png", url: '#' },
    { name: 'Barenbliss', logo: "/assets/Sponsor - Barenbliss.png", url: '#' },
    { name: 'Kados', logo: "/assets/Sponsor - Kados.png", url: '#' },
    { name: 'Cleo', logo: "/assets/Sponsor - Cleo.PNG", url: '#' },
    { name: 'Lanyer', logo: "/assets/Sponsor - Lanyer.jpg", url: '#' },
    { name: 'Mahek', logo: "/assets/Sponsor - Mahek.PNG", url: '#' },
    { name: 'Photohaseo', logo: "/assets/Sponsor - Photohaseo.png", url: '#' },
    { name: 'UBS GOLD', logo: "/assets/Sponsor - UBS GOLD.png", url: '#' },
  ];
  
  return (
    // Struktur JSX utama tidak diubah, hanya penambahan AnimatedSvgBackground
    // dan penyesuaian CSS untuk body.
    <div className="relative w-full h-full overflow-hidden">
      <AnimatedSvgBackground />

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
          <Sponsor sponsors={sponsors} />
          <Footer />
        </ClickSpark>
      </div>

      {/* 3. Modifikasi HANYA bagian body dan @keyframes gradientAnimation di CSS global */}
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
          /* HAPUS ATAU KOMENTARI ATURAN BACKGROUND LAMA */
          /* background: linear-gradient(
            135deg,
            #A30A99 0%,
            #820D8C 25%,
            #5F117F 50%,
            #3D1472 75%,
            #281660 100%
          );
          background-attachment: fixed;
          background-size: 200% 200%;
          animation: gradientAnimation 15s ease infinite;
          */

          /* TAMBAHKAN WARNA DASAR UNTUK BODY */
          background-color: #0c0a0f; /* Warna dasar dari SVG Anda */
          
          /* Properti body lainnya dari kode asli Anda dipertahankan */
          min-height: 100vh;
          margin: 0;
          padding: 0;
          font-family: inherit;
          position: relative;
          overflow-x: hidden;
        }

        section {
          height: 100vh; /* Ini dari kode asli Anda */
          width: 100%;
          position: relative;
          background-color: transparent; /* Ini penting agar background SVG terlihat */
        }

        /* Animasi lainnya tetap sama */
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

        /* HAPUS ATAU KOMENTARI KEYFRAME ANIMASI GRADIENT LAMA */
        /*
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
        */
        
        /* Blok duplikat CSS yang ada di kode asli Anda juga saya biarkan apa adanya,
           meskipun idealnya bisa dirapikan. Fokus kita adalah pada penggantian background.
        */
        html { /* Duplikat dari atas, dibiarkan sesuai kode asli */
          scroll-behavior: auto !important;
        }
        
        .mix-blend-overlay { /* Duplikat dari atas, dibiarkan sesuai kode asli */
          mix-blend-mode: overlay;
        }
        .mix-blend-lighten { /* Duplikat dari atas, dibiarkan sesuai kode asli */
          mix-blend-mode: lighten;
        }
        .mix-blend-screen { /* Duplikat dari atas, dibiarkan sesuai kode asli */
          mix-blend-mode: screen;
        }
        .mix-blend-soft-light { /* Duplikat dari atas, dibiarkan sesuai kode asli */
          mix-blend-mode: soft-light;
        }

        body { /* Duplikat dari atas, dibiarkan sesuai kode asli (tapi sudah dimodifikasi di atas) */
          /* ... (sudah dimodifikasi di atas untuk background) ... */
          background-color: #0c0a0f; /* Pastikan ini konsisten dengan modifikasi di atas */
          
          background-attachment: fixed;
          background-size: 200% 200%;
          min-height: 100vh;
          /* animation: gradientAnimation 15s ease infinite; */ /* Pastikan ini juga dikomentari/dihapus di duplikat */
          margin: 0;
          padding: 0;
          font-family: inherit;
          position: relative;
          overflow-x: hidden;
        }

        section { /* Duplikat dari atas, dibiarkan sesuai kode asli */
          height: 100vh;
          width: 100%;
          position: relative;
          background-color: transparent;
        }
        
        .fade-in { /* Duplikat dari atas, dibiarkan sesuai kode asli */
          opacity: 0;
          animation: fadeIn 1s ease-out forwards;
        }
        
        .slide-up { /* Duplikat dari atas, dibiarkan sesuai kode asli */
          opacity: 0;
          transform: translateY(20px);
          animation: slideUp 0.8s ease-out forwards;
        }
        
        .scale-in { /* Duplikat dari atas, dibiarkan sesuai kode asli */
          opacity: 0;
          transform: scale(0.95);
          animation: scaleIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        @keyframes fadeIn { /* Duplikat dari atas, dibiarkan sesuai kode asli */
          to { opacity: 1; }
        }
        
        @keyframes slideUp { /* Duplikat dari atas, dibiarkan sesuai kode asli */
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn { /* Duplikat dari atas, dibiarkan sesuai kode asli */
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* @keyframes gradientAnimation { ... } */ /* Pastikan ini juga dikomentari/dihapus di duplikat */
      `}</style>
    </div>
  );
}
