'use client'

import Link from "next/link"
import Image from "next/image"
import GlitchText from "./GlitchText"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY <= 10) {
        setShowNavbar(true)
      } else if (currentScrollY > lastScrollY) {
        setShowNavbar(false)
      } else {
        setShowNavbar(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <header
        className={`fixed top-0 left-0 w-full z-50 bg-[#1A1A1A]/90 backdrop-blur-sm shadow-md border-b border-white/10 text-white px-8 py-5 
        transform transition-all duration-300 ease-in-out 
        ${showNavbar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} 
        backdrop-blur-md bg-opacity-40`}  // Adding glass effect with backdrop-blur and bg-opacity
      >
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image src="/innologo.png" alt="INNOFASHIONShow7 Logo" width={160} height={40} />
          </Link>

          {/* Nav Links */}
          <nav
            className="hidden md:flex gap-8 text-sm font-bold tracking-wide uppercase"
            style={{ fontFamily: "Moderniz, sans-serif" }}
          >
            {[
              { href: "/", label: "Home" },
              { href: "/timeline", label: "Timeline" },
              { href: "/events", label: "Events" },
              { href: "/competition", label: "Competition" },
              { href: "/about", label: "About Us" },
            ].map(({ href, label }) => (
              <Link href={href} key={label} className="hover:opacity-80 relative">
                <GlitchText>{label}</GlitchText>
              </Link>
            ))}
          </nav>

          {/* Sign In */}
          <Link
            href="/signin"
            className="border border-white px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase hover:bg-white hover:text-black transition"
            style={{ fontFamily: "Moderniz, sans-serif" }}
          >
            Sign In / Register
          </Link>
        </div>
      </header>
    </motion.div>
  )
}
