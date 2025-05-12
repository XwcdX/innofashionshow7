'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Providers } from './providers';
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SplashCursor from "./components/SplashCursor";
import BrandedLoader from './components/BrandedLoader';
import Lenis from 'lenis';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// interface Spark {
//   x: number;
//   y: number;
//   angle: number;
//   startTime: number;
//   size: number;
//   speed: number;
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [appIsLoading, setAppIsLoading] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const sparksRef = useRef<Spark[]>([]);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let resizeTimeout: NodeJS.Timeout;

    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(parent);
    resizeCanvas();

    return () => {
      ro.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, []);

  const easeFunc = useCallback(
    (t: number, type: "linear" | "ease-in" | "ease-out" | "ease-in-out") => {
      switch (type) {
        case "linear":
          return t;
        case "ease-in":
          return t * t;
        case "ease-in-out":
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        case "ease-out":
        default:
          return t * (2 - t);
      }
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const draw = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // sparksRef.current = sparksRef.current.filter((spark: Spark) => {
      //   const elapsed = timestamp - spark.startTime;
      //   // ... rest of your spark drawing logic ...
      //   return true;
      // });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [easeFunc]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer); 
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (appIsLoading) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      if (lenisRef.current) {
        lenisRef.current.stop();
      }
    } else {
       const overflowTimer = setTimeout(() => {
           html.style.overflow = '';
           body.style.overflow = '';
       }, 700);

      if (!lenisRef.current && typeof window !== 'undefined') {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          infinite: false,
        });

        function raf(time: number) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        lenisRef.current = lenis;
      }
      if (lenisRef.current) {
        lenisRef.current.start();
      }

       return () => {
           clearTimeout(overflowTimer);
           if (lenisRef.current) {
               lenisRef.current.destroy();
               lenisRef.current = null;
           }
       };
    }
     return undefined;
  }, [appIsLoading]);


  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} font-neue-montreal`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Neue+Montreal:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js" strategy="beforeInteractive" />
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.css"
        />
        <Script
          src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.js"
          strategy="beforeInteractive"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/tw-elements@latest/dist/css/tw-elements.min.css"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" />
      </head>
      <body className="antialiased" onClick={handleClick}>
        <BrandedLoader isLoading={appIsLoading} message="Initializing Innofashionshow7..." />

        <div
          className={`transition-opacity duration-700 ease-in-out ${appIsLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          
        >
          <SplashCursor />
          <Providers>
            <canvas
              ref={canvasRef}
              className="fixed inset-0 pointer-events-none z-50"
            />
            {children}
          </Providers>
        </div>

        <Script
          src="https://cdn.jsdelivr.net/npm/tw-elements@latest/dist/js/tw-elements.umd.min.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/sweetalert2@11"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}