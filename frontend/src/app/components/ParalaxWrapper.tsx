"use client";
import { ReactNode, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ParalaxWrapper({ children, speed = 0.5 }: { children: ReactNode, speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      gsap.to(ref.current, {
        y: -(100 * speed),
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }, [speed]);

  return <div ref={ref}>{children}</div>;
}