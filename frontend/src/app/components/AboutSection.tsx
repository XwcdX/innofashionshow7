"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "./ScrollReveal"; // Adjust if needed

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const rightImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section className="flex flex-col md:flex-row w-full min-h-screen text-white">
      {/* Left Section with ScrollReveal */}
      <ScrollReveal className="w-full md:w-1/2 relative p-10 md:p-16" style={{ background: 'transparent', scrollSnapAlign: 'start' }}>
        {/* Lines Asset (bottom-left corner) */}
        <div className="transform scale-210 absolute bottom-7 left-0 w-40 h-40">
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
          ABOUT US
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
        className="w-full md:w-1/2 relative h-[500px] md:h-auto"
      >
        <Image
          src="/assets/runway.jpg"
          alt="Runway Fashion Show"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}
