import Navbar from './components/Navbar'
import ThemeSection from './components/ThemeSection'
import EventBar from './components/EventBar'
import { Timeline } from './components/Timeline'
import RSVPButton from './components/RSVPButton'
import Footer from './components/Footer'

export default function Home() {  
  return (
    <>
      <Navbar /> 
      <main className="pt-20 bg-[#202021]"> {/* bg-[#202021] atau primary */}
        <ThemeSection />
        <EventBar />
        <Timeline />
        <RSVPButton />
        <Footer />
      </main>
    </>
  )
}