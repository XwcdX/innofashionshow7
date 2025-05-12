'use client';

import Script from "next/script";
import "./globals.css";
import { useRef, useEffect, useCallback } from "react";

const fontNeueMontreal = {
  className: "font-neue-montreal",
  style: {},
};

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
  size: number;
  speed: number;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
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
      //   if (elapsed >= 400) {
      //     return false;
      //   }

      //   const progress = elapsed / 400;
      //   const eased = easeFunc(progress, "ease-out"); // Using "ease-out" as default

      //   const distance = eased * 35 * 1.3 * spark.speed;
      //   const currentSize = spark.size * (1 - eased * 0.5);

      //   const x1 = spark.x + distance * Math.cos(spark.angle);
      //   const y1 = spark.y + distance * Math.sin(spark.angle);
      //   const x2 = spark.x + (distance + currentSize) * Math.cos(spark.angle);
      //   const y2 = spark.y + (distance + currentSize) * Math.sin(spark.angle);

      //   //ctx.strokeStyle = "#ffffff";
      //   ctx.lineWidth = 2;
      //   ctx.lineCap = "round";
      //   ctx.beginPath();
      //   ctx.moveTo(x1, y1);
      //   ctx.lineTo(x2, y2);
      //   ctx.stroke();

      //   return true;
      // });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [easeFunc]);

  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = performance.now();
    const newSparks: Spark[] = Array.from({ length: 14 }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / 14 + (Math.random() * 0.2 - 0.1),
      startTime: now,
      size: 18 * (0.9 + Math.random() * 0.2),
      speed: 0.9 + Math.random() * 0.2
    }));

    sparksRef.current.push(...newSparks);
  };

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Neue+Montreal:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js" async />
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.css"
        />
        <Script
          src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.js"
          strategy="beforeInteractive"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/tw-elements@latest/dist/css/tw-elements.min.css"
          rel="stylesheet"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/tw-elements@latest/dist/js/tw-elements.umd.min.js"
          strategy="afterInteractive"
        />
        <Script
          strategy="afterInteractive"
          src="https://cdn.jsdelivr.net/npm/sweetalert2@11"
        />
      </head>
      
      <body 
        className={fontNeueMontreal.className}
        style={fontNeueMontreal.style}
        onClick={handleClick}
      >
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-50"
        />
        {children}
      </body>
    </html>
  );
}