"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "./ScrollReveal"; // Adjust if needed
// import GlitchText from "./GlitchText";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const [glitchActive, setGlitchActive] = useState<boolean>(false);
  const rightImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glitchTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 100);
      }, 3000);

      return () => clearInterval(interval);
    }, 3000);

    const el = rightImageRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      {
        opacity: 0,
        x: 100,
      },
      {
        opacity: 1,
        x: 0,
        duration: 2.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => clearTimeout(glitchTimer);
  }, []);

  return (
    <section id="about" className="flex flex-col md:flex-row w-full min-h-screen text-white ">
      {/* Left Section with ScrollReveal */}
      <ScrollReveal className="w-full md:w-1/2 relative p-10 mt-20 md:p-16">
        {/* Lines Asset (bottom-left corner) */}
        <div className="transform scale-210 absolute bottom-0 z-[-10] left-0 w-100 h-100 opacity-35">
          <Image
            src="/assets/lines1.png"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h2
            className="text-5xl md:text-6xl font-bold uppercase tracking-tight text-white mb-12 text-center"
            style={{
              textShadow: "0 0 15px rgba(77, 255, 255, 0.7)",
              fontStyle: "italic",
            }}
          >
            <GlitchText glitchActive={glitchActive}>ABOUT US</GlitchText>
          </h2>

          <p
            className="text-lg leading-relaxed tracking-wide text-justify text-center"
            style={{ fontFamily: "Eirene Sans Bold, sans-serif" }}
          >
            Innofashion Show is an annual event by the Textile and Fashion Design program at Petra Christian University, serving as a platform for final-year students to showcase their best creations. More than just an academic appreciation event, it is a stage for young talents to innovate and contribute to the fashion industry.
          </p>
        </div>
      </ScrollReveal>

      {/* Right Section Image with custom GSAP fade + slide */}
<div
  ref={rightImageRef}
  className="w-full md:w-1/2 relative aspect-[4/3] mt-20 mb-10 md:aspect-auto mr-0 lg:mr-16 rounded-lg overflow-hidden" // Tambahkan rounded-lg dan overflow-hidden
>
  <Image
    src="/assets/runway.jpg"
    alt="Runway Fashion Show"
    fill
    className="object-cover"
    priority
  />
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
    </section>
  );
}

// GlitchText Component
const GlitchText = ({
  children,
  className,
  glitchActive,
}: {
  children: ReactNode;
  className?: string;
  glitchActive: boolean;
}) => (
  <span className={`relative ${className}`}>
    {children}
    {glitchActive && (
      <>
        <span
          className="absolute top-0 left-0 w-full h-full opacity-70 pointer-events-none"
          style={{
            color: "#a6ff4d",
            textShadow: "2px 0 #c306aa",
            clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
          }}
        >
          {children}
        </span>
        <span
          className="absolute top-0 left-0 w-full h-full opacity-70 pointer-events-none"
          style={{
            color: "#8f03d1",
            textShadow: "-2px 0 rgb(104, 255, 77)",
            clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
          }}
        >
          {children}
        </span>
      </>
    )}
  </span>
);
