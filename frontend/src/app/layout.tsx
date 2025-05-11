// app/layout.tsx
'use client'; // Make RootLayout a Client Component to use useState/useEffect for the loader

import { useState, useEffect } from 'react'; // Import hooks
import type { Metadata } from "next";
import { Providers } from './providers';
import { Geist, Geist_Mono } from "next/font/google"; // Corrected import name
import Script from "next/script";
import "./globals.css";
import SplashCursor from "./components/SplashCursor";
import BrandedLoader from './components/BrandedLoader'; // Your loader

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
  const [appIsLoading, setAppIsLoading] = useState(true); // State for the loader

  useEffect(() => {
    // Simulate initial app setup or hide after a delay
    // In a real app, this might be tied to some initial data fetch completion
    const timer = setTimeout(() => {
      setAppIsLoading(false);
    }, 2500); // Show loader for 2.5 seconds on initial load

    return () => clearTimeout(timer);
  }, []);

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
          strategy="beforeInteractive" // DataTables JS depends on jQuery
        />

        {/* TwElements & Dependencies */}
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/tw-elements@latest/dist/css/tw-elements.min.css"
          rel="stylesheet"
        />
        {/* SweetAlert2 */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" />

      </head>
      {/* Removed fontNeueMontreal.className and .style from body, apply font-neue-montreal to html or body directly */}
      <body className={`antialiased`}>
        <BrandedLoader isLoading={appIsLoading} message="Initializing Innofashionshow..." />
        
        <SplashCursor /> {/* Ensure z-index is appropriate if loader is on top */}
        <Providers>
          {children}
        </Providers>

        {/* Scripts that can load later */}
        <Script
          src="https://cdn.jsdelivr.net/npm/tw-elements@latest/dist/js/tw-elements.umd.min.js"
          strategy="lazyOnload" // Changed strategy
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/sweetalert2@11"
          strategy="lazyOnload" // Changed strategy
        />
      </body>
    </html>
  );
}