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

'use client'
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
      lerp: 0.1,
      smoothWheel: true,
    });
  
    let animationFrame: number;
  
    const raf = (time: number): void => {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    };
  
    animationFrame = requestAnimationFrame(raf);
  
    return () => {
      cancelAnimationFrame(animationFrame);
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
