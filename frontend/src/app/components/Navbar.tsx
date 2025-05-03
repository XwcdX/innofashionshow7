'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const navItems = ['Home', 'About', 'Timeline', 'RSVP']

export default function Navbar() {
  const [glitchActive, setGlitchActive] = useState<boolean>(false)

  useEffect(() => {
    const glitchTimer = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 100)
    }, 3000)
    return () => clearInterval(glitchTimer)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md shadow-md border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1
          className={`text-xl font-bold text-white tracking-wide relative ${
            glitchActive ? 'glitch-active' : ''
          }`}
          data-text="ILLUMINE"
        >
          ILLUMINE
          {glitchActive && (
            <>
              <span 
                className="absolute top-0 left-0 w-full h-full opacity-70"
                style={{
                  color: '#a6ff4d',
                  textShadow: '2px 0 #c306aa',
                  clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)'
                }}
              >
                ILLUMINE
              </span>
              <span 
                className="absolute top-0 left-0 w-full h-full opacity-70"
                style={{
                  color: '#8f03d1',
                  textShadow: '-2px 0rgb(104, 255, 77)',
                  clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)'
                }}
              >
                ILLUMINE
              </span>
            </>
          )}
        </h1>

        <div className="flex space-x-6 text-white text-sm font-medium">
          {navItems.map((item) => (
            <motion.div
              key={item}
              whileHover={{ y: -2, scale: 1.05, color: '#a6ff4d' }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative group"
            >
              <Link href={`#${item.toLowerCase()}`} className="relative z-10">
                {item}
              </Link>
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-teal-400 rounded-full"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .glitch-active {
          animation: glitch-anim 0.3s linear infinite;
        }

        @keyframes glitch-anim {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </motion.nav>
  )
}
