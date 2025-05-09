'use client';

import React, { useEffect, useState, useRef, ReactNode, CSSProperties, MouseEvent, FocusEvent } from "react";
import './PixelCard.css';

interface PixelConstructorArgs {
  canvasWidth: number;
  canvasHeight: number;
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  speed: number;
  delay: number;
}

class Pixel {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInteger: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;

  constructor({ canvasWidth, canvasHeight, context, x, y, color, speed, delay }: PixelConstructorArgs) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2; // Max size of a pixel square
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.005;
    this.isIdle = true;
    this.isReverse = false;
    this.isShimmer = false;
  }

  getRandomValue(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  draw(): void {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size
    );
  }

  appear(): void {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }
    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
      if (this.size > this.maxSize) this.size = this.maxSize;
    }
    this.draw();
  }

  disappear(): void {
    this.isShimmer = false;
    if (this.size <= 0) {
      this.isIdle = true;
      this.size = 0;
      return;
    } else {
      this.size -= 0.15;
    }
    this.draw();
  }

  shimmer(): void {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }
    if (this.isReverse) {
      this.size -= this.speed;
      if (this.size < this.minSize) this.size = this.minSize;
    } else {
      this.size += this.speed;
      if (this.size > this.maxSize) this.size = this.maxSize;
    }
  }
}

function getEffectiveSpeed(value: number | string, reducedMotion: boolean): number {
  const min = 0;
  const max = 100;
  const throttle = 0.001;
  const parsed = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(parsed) || parsed <= min || reducedMotion) {
    return min;
  } else if (parsed >= max) {
    return max * throttle;
  } else {
    return parsed * throttle;
  }
}

interface VariantConfig {
  gap: number;
  speed: number;
  colors: string;
  noFocus?: boolean;
}

const VARIANTS: Record<string, VariantConfig> = {
  default: {
    gap: 5,
    speed: 35,
    colors: "#e2e8f0,#cbd5e1,#94a3b8",
    noFocus: false
  },
  blue: {
    gap: 6,
    speed: 30,
    colors: "#93c5fd,#60a5fa,#3b82f6",
    noFocus: false
  },
  teal: {
    gap: 6,
    speed: 30,
    colors: "#5eead4,#2dd4bf,#0d9488",
    noFocus: false
  },
  purple: {
    gap: 6,
    speed: 30,
    colors: "#c4b5fd,#a78bfa,#8b5cf6",
    noFocus: false
  }
};


interface PixelCardProps {
  variant?: string;
  gap?: number;
  speed?: number;
  colors?: string;
  noFocus?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  style?: CSSProperties;
  imageUrl?: string;
}

const PixelCard: React.FC<PixelCardProps> = ({
  variant = "default",
  gap,
  speed,
  colors,
  noFocus,
  className = "",
  children,
  onClick,
  style,
  imageUrl
}) => {
  const [isMounted, setIsMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number | null>(null);
  const timePreviousRef = useRef<number>(0);

  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ).current;

  const variantCfg = VARIANTS[variant] || VARIANTS.default;
  const finalGap = gap ?? variantCfg.gap;
  const finalSpeed = speed ?? variantCfg.speed;
  const finalColors = colors ?? variantCfg.colors;
  const finalNoFocus = noFocus ?? variantCfg.noFocus;

  useEffect(() => {
    if (typeof window !== 'undefined') {
        timePreviousRef.current = performance.now();
    }
    setIsMounted(true);
  }, []);

  const initPixels = () => {
    if (!isMounted || !containerRef.current || !canvasRef.current || typeof window === 'undefined') return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);
    const ctx = canvasRef.current.getContext("2d");

    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvasRef.current.width = width * dpr;
    canvasRef.current.height = height * dpr;
    canvasRef.current.style.width = `${width}px`;
    canvasRef.current.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const colorsArray = finalColors.split(",").map(c => c.trim()).filter(c => c);
    if (colorsArray.length === 0) {
        colorsArray.push("#cccccc");
    }
    const pxs: Pixel[] = [];

    for (let x = 0; x < width; x += finalGap) {
      for (let y = 0; y < height; y += finalGap) {
        const color = colorsArray[Math.floor(Math.random() * colorsArray.length)];
        const dx = x - width / 2;
        const dy = y - height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const delay = reducedMotion ? 0 : distance * 0.7;

        pxs.push(
          new Pixel({
            canvasWidth: width,
            canvasHeight: height,
            context: ctx,
            x,
            y,
            color,
            speed: getEffectiveSpeed(finalSpeed, reducedMotion),
            delay
          })
        );
      }
    }
    pixelsRef.current = pxs;
  };

  const doAnimate = (fnName: "appear" | "disappear") => {
    if (!isMounted || !canvasRef.current || typeof window === 'undefined') return;

    animationRef.current = requestAnimationFrame(() => doAnimate(fnName));
    const timeNow = performance.now();
    const timePassed = timeNow - timePreviousRef.current;
    const timeInterval = 1000 / 60;
    if (timePassed < timeInterval) return;
    timePreviousRef.current = timeNow - (timePassed % timeInterval);

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    ctx.clearRect(0, 0, canvasRef.current.width / dpr, canvasRef.current.height / dpr);

    let allIdle = true;
    for (let i = 0; i < pixelsRef.current.length; i++) {
      const pixel = pixelsRef.current[i];
      pixel[fnName]();
      if (!pixel.isIdle) {
        allIdle = false;
      }
    }

    if (allIdle && fnName === 'disappear' && pixelsRef.current.every(p => p.size <= 0)) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const handleAnimation = (name: "appear" | "disappear") => {
    if (!isMounted || typeof window === 'undefined') return;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (!canvasRef.current?.getContext("2d")) return;
    timePreviousRef.current = performance.now();
    animationRef.current = requestAnimationFrame(() => doAnimate(name));
  };

  const onMouseEnter = () => isMounted && !reducedMotion && handleAnimation("appear");
  const onMouseLeave = () => isMounted && !reducedMotion && handleAnimation("disappear");
  const onFocusHandler = (e: FocusEvent<HTMLDivElement>) => {
    if (!isMounted || finalNoFocus || reducedMotion || (e.currentTarget && e.relatedTarget && e.currentTarget.contains(e.relatedTarget as Node))) return;
    handleAnimation("appear");
  };
  const onBlurHandler = (e: FocusEvent<HTMLDivElement>) => {
    if (!isMounted || finalNoFocus || reducedMotion || (e.currentTarget && e.relatedTarget && e.currentTarget.contains(e.relatedTarget as Node))) return;
    handleAnimation("disappear");
  };

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    initPixels();
    
    const observer = new ResizeObserver(() => {
      if (!isMounted) return;
      initPixels();
      if (containerRef.current === document.activeElement || containerRef.current?.matches(':hover')) {
        if (!reducedMotion) handleAnimation("appear");
      }
    });

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) observer.unobserve(currentContainer);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isMounted, finalGap, finalSpeed, finalColors, reducedMotion]);


  const imageContainerStyle: CSSProperties = imageUrl ? {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : {};

  if (!isMounted) {
    const ssrCardStyle: CSSProperties = {
      ...style,
      ...(imageUrl ? imageContainerStyle : {}),
    };
    return (
      <div
        ref={containerRef}
        className={`pixel-card ${className}`}
        style={ssrCardStyle}
        onClick={onClick}
        tabIndex={finalNoFocus ? -1 : 0}
        role={onClick ? "button" : undefined}
      >
        {imageUrl && (
            <div className="pixel-card-image-container-ssr-placeholder" style={imageContainerStyle}>
                 <div className="pixel-card-image-darken-overlay-ssr-placeholder"></div>
            </div>
        )}
        <div className="pixel-card-content">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`pixel-card ${className}`}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={finalNoFocus ? undefined : onFocusHandler}
      onBlur={finalNoFocus ? undefined : onBlurHandler}
      tabIndex={finalNoFocus ? -1 : 0}
      role="button"
    >
      {imageUrl && (
        <div className="pixel-card-image-container" style={imageContainerStyle}>
          <div className="pixel-card-image-darken-overlay"></div>
        </div>
      )}
      
      <canvas
        className="pixel-canvas"
        ref={canvasRef}
      />
      
      <div className="pixel-card-content text-shadow-[0px_0px_7px_rgb(255_255_255_/_0.5)]">
        {children}
      </div>
    </div>
  );
};

export default PixelCard;