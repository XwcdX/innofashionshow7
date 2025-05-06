// import Navbar from './components/Navbar'
// import ThemeSection from './components/ThemeSection'
// import EventBar from './components/EventBar'
// import { Timeline } from './components/Timeline'
// // import RSVPButton from './components/RSVPButton'
// import Footer from './components/Footer'
// import AboutSection from './components/AboutSection'
// import CompetitionsSection from './components/CompetitionsSection'


// export default function Home() {  
//   return (
//     <>
//       <Navbar /> 
//       <main className=""> {/* bg-[#202021] atau primary & className="pt-20 bg-[#202021]"*/}
//         <ThemeSection />
//         <AboutSection />
//         <EventBar />
//         <CompetitionsSection />
//         <Timeline />
//         {/* <RSVPButton /> */}
//         <Footer />
//       </main>
//     </>
//   )
// }

"use client";
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import ThemeSection from './components/ThemeSection';
import EventBar from './components/EventBar';
import { Timeline } from './components/Timeline';
// import RSVPButton from './components/RSVPButton'
import Footer from './components/Footer';
import AboutSection from './components/AboutSection';
import CompetitionsSection from './components/CompetitionsSection';
import Lenis from 'lenis';

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1, // Smoothness
      smoothWheel: true, // Make mouse wheel smooth
    });

    // Request Animation Frame for updating lenis
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className=""> {/* bg-[#202021] atau primary & className="pt-20 bg-[#202021]"*/}
        <ThemeSection />
        <AboutSection />
        <EventBar />
        <CompetitionsSection />
        <Timeline />
        {/* <RSVPButton /> */}
        <Footer />
      </main>
    </>
  );
}
