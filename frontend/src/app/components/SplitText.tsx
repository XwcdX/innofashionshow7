'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface SplitTextProps {
  text?: string;
  className?: string;
  staggerDelay?: number;
  animationFrom?: { opacity: number; y?: number | string; x?: number | string; scale?: number; rotate?: number };
  animationTo?: { opacity: number; y?: number | string; x?: number | string; scale?: number; rotate?: number };
  transition?: object;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'right' | 'center' | 'justify' | 'initial' | 'inherit';
  once?: boolean;
  onAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text = '',
  className = '',
  staggerDelay = 0.05,
  animationFrom = { opacity: 0, y: 40 },
  animationTo = { opacity: 1, y: 0 },
  transition = { type: 'spring', damping: 12, stiffness: 100 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  once = true,
  onAnimationComplete,
}) => {
  const words = text.split(' ').map((word) => ({
    word,
    letters: word.split(''),
  }));

  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, {
    once: once,
    amount: threshold,
  });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: animationFrom,
    visible: {
      ...animationTo,
      transition: transition,
    },
  };

  return (
    <motion.p
      ref={ref}
      className={`split-parent overflow-hidden inline ${className}`}
      style={{ textAlign: textAlign }}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      onAnimationComplete={onAnimationComplete}
    >
      {words.map((wordObj, wordIndex) => (
        <motion.span
          key={`word-${wordIndex}`}
          className="inline-block whitespace-nowrap"
          style={{ marginRight: wordIndex < words.length - 1 ? '0.3em' : '0' }}
        >
          {wordObj.letters.map((letter, letterIndex) => (
            <motion.span
              key={`letter-${wordIndex}-${letterIndex}`}
              variants={letterVariants}
              className="inline-block"
              style={{ willChange: 'transform, opacity' }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </motion.p>
  );
};

export default SplitText;