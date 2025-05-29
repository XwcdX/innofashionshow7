'use client'

import Link from "next/link"
import Image from "next/image"
import GlitchText from "./GlitchText"
import { motion } from "framer-motion"
import { useEffect, useState} from "react"
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const isLoading = status === 'loading';

  // --- DEBUG LOGS START ---
  useEffect(() => {
      console.log("Navbar: Session Status:", status);
      console.log("Navbar: Is Logged In:", isLoggedIn);
      console.log("Navbar: Is Loading:", isLoading);
      if (!isLoading) {
          console.log("Navbar: Session Data:", session);
      }
  }, [status, isLoggedIn, isLoading]);


  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Effect to hide/show navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY <= 10) {
        setShowNavbar(true)
      } else if (currentScrollY > lastScrollY) {
        setShowNavbar(false)
        setSidebarOpen(false) 
      } else { 
        setShowNavbar(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const handleSmoothScroll = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      const offset = 80; 
      const elementPosition = (target as HTMLElement).getBoundingClientRect().top; // Cast to HTMLElement
      const offsetPosition = elementPosition + window.scrollY - offset; // Use window.scrollY for current scroll position

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setSidebarOpen(false); // Close sidebar after clicking a link
    }
  }

  const handleLogout = async (e: React.MouseEvent) => {
      e.preventDefault(); // *** Ensure this is the first thing called ***
      console.log('Logout button clicked, calling signOut...'); // Debug log
      setSidebarOpen(false); // Close sidebar before logging out
      try {
        await signOut({ callbackUrl: '/' });
        console.log('signOut call finished.');
      } catch (error) {
        console.error('Error during signOut:', error);
      }
  };


  const baseNavLinks = [
    { href: "#Home", label: "Home" },
    { href: "#about", label: "About Us" },
    { href: "#events", label: "Events" },
    { href: "#timeline", label: "Timeline" },
    { href: "/registration", label: "Registration" }, 
    { href: "/contest", label: "Submission" }
  ];

  // --- UPDATED LOGIC FOR NAV LINKS ---
  //  const navLinks = (isLoggedIn && !isLoading)
  //   ? [...baseNavLinks,]
  //   : baseNavLinks;
  // --- END UPDATED LOGIC ---


  return (
    <>
      {/* Motion div handles fixed positioning and animation */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: showNavbar ? 0 : -100, opacity: showNavbar ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-0 left-0 w-full z-50"
      >
        <header
          className={`w-full bg-[#1A1A1A]/90 backdrop-blur-sm shadow-md text-white px-4 md:px-8 py-3 md:py-5`} 
        >
          <div className="max-w-screen-xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="z-50">
              <Image
                src="/assets/innologo.png"
                alt="INNOFASHIONShow7 Logo"
                width={120}
                height={30}
                className="w-32 md:w-40"
              />
            </Link>

            {/* Desktop Nav Links */}
            <nav
              className="hidden md:flex gap-6 lg:gap-8 text-xs md:text-sm font-bold tracking-wide uppercase"
              style={{ fontFamily: "Moderniz, sans-serif" }}
            >
              {/* Only render nav links after session status is determined */}
               {!isLoading && baseNavLinks.map(({ href, label }) => {
                 const isSmoothScroll = href.startsWith('#');
                 return isSmoothScroll ? (
                   <a
                     href={href}
                     key={label}
                     onClick={(e) => handleSmoothScroll(e, href)}
                     className="hover:opacity-80 relative cursor-pointer"
                   >
                     <GlitchText>{label}</GlitchText>
                   </a>
                 ) : (
                   <Link
                     href={href}
                     key={label}
                     className="hover:opacity-80 relative"
                   >
                      <GlitchText>{label}</GlitchText>
                   </Link>
                 );
              })}
            </nav>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden z-50"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              {/* Your SVG for hamburger icon */}
              <svg
                className={`ham ham6 ${sidebarOpen ? 'active' : ''}`}
                viewBox="0 0 100 100"
                width="40"
              >
                <path className="line top" d="m 30,33 h 40 c 13.100415,0 14.380204,31.80258 6.899646,33.421777 -24.612039,5.327373 9.016154,-52.337577 -12.75751,-30.563913 l -28.284272,28.284272" />
                <path className="line middle" d="m 70,50 c 0,0 -32.213436,0 -40,0 -7.786564,0 -6.428571,-4.640244 -6.428571,-8.571429 0,-5.895471 6.073743,-11.783399 12.286435,-5.570707 6.212692,6.212692 28.284272,28.284272 28.284272,28.284272" />
                <path className="line bottom" d="m 69.575405,67.073826 h -40 c -13.100415,0 -14.380204,-31.80258 -6.899646,-33.421777 24.612039,-5.327373 -9.016154,52.337577 12.75751,30.563913 l 28.284272,-28.284272" />
              </svg>
            </button>

            {/* Desktop Auth Button: Show nothing while loading */}
            {!isLoading && (
              isLoggedIn ? ( // If logged in, show Logout button
                <a
                  href="#" // href="#" prevents navigation if JS fails, but onClick is primary
                  onClick={handleLogout}
                  className="hidden md:block border border-white px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase hover:bg-white hover:text-black transition cursor-pointer" // Added cursor-pointer
                  style={{ fontFamily: "Moderniz, sans-serif" }}
                >
                  <GlitchText>Logout</GlitchText>
                </a>
              ) : ( // If not logged in, show Sign In / Register button
                <Link
                  href="/login"
                  className="hidden md:block border border-white px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase hover:bg-white hover:text-black transition"
                  style={{ fontFamily: "Moderniz, sans-serif" }}
                >
                   <GlitchText>Sign In / Register</GlitchText>
                </Link>
              )
            )}
          </div>
        </header>
      </motion.div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={toggleSidebar} // Close sidebar when clicking outside
      >
        <div
          className={`absolute inset-y-0 left-0 w-64 bg-[#1A1A1A]/95 backdrop-blur-lg shadow-lg transform transition-all duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside sidebar from closing it
        >
          <div className="h-full flex flex-col pt-20 px-6">
            <div className="flex-1 flex flex-col">
               {/* Only render nav links after session status is determined */}
              {!isLoading && baseNavLinks.map(({ href, label }) => {
                const isSmoothScroll = href.startsWith('#');
                return isSmoothScroll ? (
                  <a
                    href={href}
                    key={label}
                    onClick={(e) => handleSmoothScroll(e, href)}
                    className="py-4 border-b border-white/10 text-white hover:text-white transition-colors uppercase font-bold tracking-wider cursor-pointer" // Added cursor-pointer
                    style={{ fontFamily: "Moderniz, sans-serif" }}
                  >
                    <GlitchText>{label}</GlitchText>
                  </a>
                ) : (
                  <Link
                    href={href}
                    key={label}
                    className="py-4 border-b border-white/10 text-white hover:text-white transition-colors uppercase font-bold tracking-wider"
                    style={{ fontFamily: "Moderniz, sans-serif" }}
                    onClick={() => setSidebarOpen(false)}
                  >
                     <GlitchText>{label}</GlitchText>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth Button: Show nothing while loading */}
            {!isLoading && (
              <div className="py-6">
                {isLoggedIn ? ( // If logged in, show Logout button
                  <a
                    href="#"
                    onClick={handleLogout}
                    className="block w-full text-white text-center border border-white px-4 py-2 text-xs font-semibold tracking-wider uppercase hover:bg-white hover:text-black transition cursor-pointer" // Added cursor-pointer
                    style={{ fontFamily: "Moderniz, sans-serif" }}
                  >
                    <GlitchText>Logout</GlitchText>
                  </a>
                ) : ( // If not logged in, show Sign In / Register button
                  <Link
                    href="/login"
                    className="block w-full text-white text-center border border-white px-4 py-2 text-xs font-semibold tracking-wider uppercase hover:bg-white hover:text-black transition"
                    style={{ fontFamily: "Moderniz, sans-serif" }}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <GlitchText>Sign In / Register</GlitchText>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hamburger Animation Styles */}
      {/* Moved to global style to avoid re-injection issues */}
      <style jsx global>{`
        .ham {
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: transform 400ms;
          user-select: none;
        }
        .ham.active {
          transform: rotate(45deg);
        }
        .ham .line {
          fill: none;
          transition: stroke-dasharray 400ms, stroke-dashoffset 400ms;
          stroke: #fff;
          stroke-width: 3.9;
          stroke-linecap: round;
        }
        .ham6 .top {
          stroke-dasharray: 40 172;
        }
        .ham6 .middle {
          stroke-dasharray: 40 111;
        }
        .ham6 .bottom {
          stroke-dasharray: 40 172;
        }
        .ham6.active .top {
          stroke-dashoffset: -132px;
        }
        .ham6.active .middle {
          stroke-dashoffset: -71px;
        }
        .ham6.active .bottom {
          stroke-dashoffset: -132px;
        }
      `}</style>
    </>
  )
}