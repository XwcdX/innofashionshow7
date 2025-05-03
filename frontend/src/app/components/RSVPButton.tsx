"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function RSVPButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="bg-[#202021] min-h-[70vh] flex flex-col justify-center items-center p-8">
      <motion.button
        className="
          relative
          inline-block
          px-[30px] py-[15px]
          text-lg
          bg-gradient-to-r from-[#8f03d1] to-[#c306aa]
          text-[#a6ff4d]
          border-none
          rounded-lg
          transition-all
          duration-300
          ease-in-out
          shadow-[0_5px_0_#8f03d1]
          cursor-pointer
          overflow-hidden
        "
        style={{ fontFamily: "Moderniz, sans-serif" }}
        initial={{ scale: 0.95 }}
        animate={{ 
          scale: 1,
          boxShadow: "0 5px 0 #8f03d1"
        }}
        whileHover={{
          y: -3,
          boxShadow: "0 8px 15px rgba(143, 3, 209, 0.5)",
          transition: { duration: 0.3 }
        }}
        whileTap={{
          y: 2,
          boxShadow: "none",
          scale: 0.98
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Glow effect */}
        <motion.span
          className="absolute inset-0 bg-[#a6ff4d] opacity-0"
          animate={{
            opacity: isHovered ? 0.1 : 0,
            transition: { duration: 0.4 }
          }}
        />
        
        {/* Text with subtle animation */}
        <motion.span
          className="relative z-10"
          animate={{
            scale: isHovered ? 1.05 : 1,
            textShadow: isHovered ? "0 0 10px rgba(166, 255, 77, 0.7)" : "none"
          }}
        >
          RSVP NOW
        </motion.span>

        {/* Floating particles */}
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute bg-[#a6ff4d] rounded-full"
                initial={{
                  opacity: 0,
                  scale: 1000,
                  x: "50%",
                  y: "50%"
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: `${Math.random() * 100 - 50}%`,
                  y: `${Math.random() * 100 - 150}%`,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                style={{
                  width: `${Math.random() * 4 + 100}px`,
                  height: `${Math.random() * 4 + 100}px`,
                }}
              />
            ))}
          </>
        )}
      </motion.button>
    </section>
  );
}