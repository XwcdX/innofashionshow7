"use client"
import { ReactNode, useState } from "react"

export default function GlitchText({
  children,
  className = ""
}: {
  children: ReactNode
  className?: string
}) {
  const [hovering, setHovering] = useState(false)

  return (
    <span
      className={`relative ${className}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <span className={`${hovering ? "glitch-anim" : ""}`}>{children}</span>

      {hovering && (
        <>
          <span
            className="absolute top-0 left-0 w-full h-full opacity-70 pointer-events-none glitch-anim"
            style={{
              color: '#a6ff4d',
              textShadow: '2px 0 #c306aa',
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)'
            }}
          >
            {children}
          </span>
          <span
            className="absolute top-0 left-0 w-full h-full opacity-70 pointer-events-none glitch-anim"
            style={{
              color: '#8f03d1',
              textShadow: '-2px 0 rgb(104, 255, 77)',
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)'
            }}
          >
            {children}
          </span>
        </>
      )}

      <style jsx>{`
        .glitch-anim {
          animation: glitch-anim 0.3s infinite;
        }

        @keyframes glitch-anim {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-1px, 1px);
          }
          40% {
            transform: translate(-1px, -1px);
          }
          60% {
            transform: translate(1px, 1px);
          }
          80% {
            transform: translate(1px, -1px);
          }
          100% {
            transform: translate(0);
          }
        }
      `}</style>
    </span>
  )
}
