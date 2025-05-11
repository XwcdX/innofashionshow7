// app/layout.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [appIsLoading, setAppIsLoading] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);

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
      html.style.overflow = '';
      body.style.overflow = '';

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
    }

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [appIsLoading]);

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
      <body className="antialiased">
        <BrandedLoader isLoading={appIsLoading} message="Initializing Innofashionshow7..." />
        {!appIsLoading && (
          <>
            <SplashCursor />
            <Providers>
              {children}
            </Providers>
          </>
        )}

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