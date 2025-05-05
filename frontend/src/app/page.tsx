import Navbar from './components/Navbar'
import ThemeSection from './components/ThemeSection'
import EventBar from './components/EventBar'
import { Timeline } from './components/Timeline'
// import RSVPButton from './components/RSVPButton'
import Footer from './components/Footer'
import AboutSection from './components/AboutSection'

export default function Home() {  
  return (
    <>
      <Navbar /> 
      <main className=""> {/* bg-[#202021] atau primary & className="pt-20 bg-[#202021]"*/}
        <ThemeSection />
        <AboutSection />
        <EventBar />
        <Timeline />
        {/* <RSVPButton /> */}
        <Footer />
      </main>
    </>
  )
}