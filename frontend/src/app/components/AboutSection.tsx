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
        duration: 2.0, // Adjust duration to make the animation 2 times longer
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

        <h2
          className="text-5xl md:text-6xl font-bold uppercase tracking-tight text-[#4dffff] mb-12 text-center"
          style={{
            textShadow: "0 0 15px rgba(77, 255, 255, 0.7)",
            fontStyle: "italic",
          }}
        >
          <GlitchText glitchActive={glitchActive}>ABOUT US</GlitchText>
        </h2>
            
        <p
          className="text-sm leading-relaxed tracking-wide text-justify"
          style={{ fontFamily: "Eirene Sans Bold, sans-serif" }}
        > 
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vulputate
          ex in dolor fringilla pellentesque. Ut ut purus semper, vehicula enim
          sit amet, porttitor arcu. Quisque hendrerit maximus mattis. Donec
          vitae sapien nisi. Quisque sed laoreet ipsum, congue volutpat ipsum.
          Class aptent taciti sociosqu ad litora torquent per conubia nostra,
          per inceptos himenaeos. Nullam non dui ultrices mi scelerisque finibus
          nec id nunc. Vestibulum euismod blandit risus.
          <br />
          <br />
          Phasellus interdum, elit eu pulvinar tempus, lacus metus fermentum
          leo, lacinia mattis nibh odio vel est. Ut bibendum tellus nec
          consequat rutrum. Fusce at mi orci. Etiam vestibulum tincidunt
          suscipit. Aliquam vitae quam sem. Fusce lorem elit, sollicitudin sed
          risus eu, feugiat molestie neque. Vivamus odio velit, pretium
          vulputate ligula eget.
        </p>
      </ScrollReveal>

      {/* Right Section Image with custom GSAP fade + slide */}
      <div
        ref={rightImageRef}
        className="w-full md:w-1/2 relative aspect-[4/3] mt-20 mb-10 md:aspect-auto "
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
