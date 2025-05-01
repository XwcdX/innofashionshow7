'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const navItems = ['Home', 'About', 'Timeline', 'RSVP']

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md shadow-md border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <motion.h1
          className="text-xl font-bold text-white tracking-wide relative"
          whileHover={{ rotate: [0, -1, 1, 0], scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <span className="glitch" data-text="LUMINESCENCE">LUMINESCENCE</span>
        </motion.h1>
        <div className="flex space-x-6 text-white text-sm font-medium">
          {navItems.map((item) => (
            <motion.div
              key={item}
              whileHover={{ y: -2, scale: 1.05 }}
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
        .glitch {
          position: relative;
          color: white;
        }
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          width: 100%;
          overflow: hidden;
          color: #0ff;
          clip: rect(0, 900px, 0, 0);
        }
        .glitch::before {
          animation: glitchTop 2s infinite linear;
          color: #ff00c8;
        }
        .glitch::after {
          animation: glitchBottom 2s infinite linear;
          color: #a6ff4d;
        }

        @keyframes glitchTop {
          0%, 100% { clip: rect(0, 9999px, 0, 0); }
          10% { clip: rect(0, 9999px, 10px, 0); }
          30% { clip: rect(0, 9999px, 5px, 0); }
        }

        @keyframes glitchBottom {
          0%, 100% { clip: rect(0, 9999px, 0, 0); }
          10% { clip: rect(5px, 9999px, 10px, 0); }
          30% { clip: rect(10px, 9999px, 15px, 0); }
        }
      `}</style>
    </motion.nav>
  )
}
