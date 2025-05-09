'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const TAP_THRESHOLD_PX = 10;
const TAP_THRESHOLD_MS = 200;
const MOMENTUM_MULTIPLIER = 20;
const MOMENTUM_FRICTION = 0.95;
const SCROLL_WHEEL_MULTIPLIER = 1;
const SNAP_DEBOUNCE_MS = 150;
const CARDS_PER_VIEW_DESKTOP = 4;
const CARDS_PER_VIEW_MOBILE = 1.5;

const FAQ: React.FC = () => {
  const [faqs] = useState<FAQItem[]>([
    { id: 1, question: 'Apa itu INNOFASHION?', answer: 'INNOFASHION adalah acara fashion futuristik tahunan yang menghadirkan berbagai desainer inspiratif dan workshop menarik dengan tema ILLUMINÉ.' },
    { id: 2, question: 'Kapan acara diselenggarakan?', answer: 'Acara akan berlangsung pada 15-17 November 2023 di Jakarta Convention Center.' },
    { id: 3, question: 'Bagaimana cara mendapatkan tiket?', answer: 'Tiket dapat dibeli melalui website resmi atau partner ticketing kami.' },
    { id: 4, question: 'Apakah ada diskon grup?', answer: 'Ya, diskon 15% untuk pembelian minimal 5 tiket.' },
    { id: 5, question: 'Apa saja acaranya?', answer: 'Fashion show, workshop, talkshow, dan pameran dari desainer ternama.' },
    { id: 6, question: 'Apakah ada dress code?', answer: 'Tidak ada dress code khusus, namun kami anjurkan berpakaian futuristik.' },
    { id: 7, question: 'Berapa lama acara berlangsung?', answer: 'Acara berlangsung dari pukul 10.00 - 21.00 WIB setiap harinya.' },
    { id: 8, question: 'Apakah ada area parkir yang tersedia?', answer: 'Ya, tersedia area parkir yang luas di Jakarta Convention Center dengan tarif normal.' },
    { id: 9, question: 'Bisakah anak-anak masuk ke acara ini?', answer: 'Anak-anak di atas 12 tahun diperbolehkan masuk dengan tiket penuh. Anak di bawah 12 tahun gratis dengan pendamping dewasa.' },
    { id: 10, question: 'Apakah ada merchandise resmi?', answer: 'Ya, tersedia merchandise resmi INNOFASHION yang bisa dibeli di lokasi acara.' },
    { id: 11, question: 'Bagaimana jika tiket hilang?', answer: 'Tiket elektronik bisa diakses kembali melalui email konfirmasi. Tiket fisik yang hilang tidak bisa diganti.' },
    { id: 12, question: 'Apakah ada fasilitas untuk difabel?', answer: 'Ya, Jakarta Convention Center menyediakan akses dan fasilitas untuk pengunjung difabel.' },
  ]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [glitchActive, setGlitchActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const velocityTracker = useRef<{ x: number, time: number }[]>([]);
  const dragStartTimeRef = useRef<number>(0);
  const didDragRef = useRef(false);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const cardsPerView = useMemo(() => (isMobile ? CARDS_PER_VIEW_MOBILE : CARDS_PER_VIEW_DESKTOP), [isMobile]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const glitchTimer = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100);
    }, 3000);
    return () => clearInterval(glitchTimer);
  }, []);

  const cancelAnimation = useCallback(() => {
    if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
    }
  }, []);

  const checkScrollPosition = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const scrollEnd = scrollWidth - clientWidth;
    }
  }, []);

  const smoothScrollTo = useCallback((target: number, duration: number = 500, ease = (t: number) => 1 - Math.pow(1 - t, 4)) => {
    if (!containerRef.current) return;
    cancelAnimation();

    const start = containerRef.current.scrollLeft;
    const change = target - start;
    if (Math.abs(change) < 1) {
        checkScrollPosition();
        return;
    }

    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = ease(progress);

      if (containerRef.current) {
          containerRef.current.scrollLeft = start + change * easedProgress;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateScroll);
      } else {
        if (containerRef.current) {
            containerRef.current.scrollLeft = target;
        }
        checkScrollPosition();
        animationRef.current = undefined;
      }
    };

    animationRef.current = requestAnimationFrame(animateScroll);
  }, [checkScrollPosition, cancelAnimation]);

  const snapToNearestCard = useCallback((animate = true) => {
    if (!containerRef.current || !sliderRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const cardWidthWithGap = containerWidth / cardsPerView;
    const currentScroll = containerRef.current.scrollLeft;
    const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;

    if (cardWidthWithGap <= 0) return;

    const cardIndex = Math.round(currentScroll / cardWidthWithGap);
    const targetScroll = Math.max(0, Math.min(maxScroll, cardWidthWithGap * cardIndex));

    if (Math.abs(currentScroll - targetScroll) > 1) {
        if (animate) {
            smoothScrollTo(targetScroll, 300);
        } else if (containerRef.current) {
            cancelAnimation();
            containerRef.current.scrollLeft = targetScroll;
            checkScrollPosition();
        }
    } else {
       checkScrollPosition();
    }
  }, [cardsPerView, smoothScrollTo, checkScrollPosition, cancelAnimation]);

  const handleResize = useCallback(() => {
    if (containerRef.current && sliderRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      if (cardsPerView <= 0 || containerWidth <= 0) return;

      const cardWidth = containerWidth / cardsPerView;
      const gap = 16;
      const totalSliderWidth = (cardWidth * faqs.length) - gap;
      sliderRef.current.style.width = `${totalSliderWidth}px`;

      const cards = sliderRef.current.querySelectorAll('.faq-card');
      const cardElementWidth = cardWidth - gap;
      cards.forEach(card => {
        (card as HTMLElement).style.width = `${cardElementWidth}px`;
        (card as HTMLElement).style.minWidth = `${cardElementWidth}px`;
      });

      checkScrollPosition();
      snapToNearestCard(false);
    }
  }, [faqs.length, cardsPerView, checkScrollPosition, snapToNearestCard]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    const container = containerRef.current;
    container?.addEventListener('scroll', checkScrollPosition, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      container?.removeEventListener('scroll', checkScrollPosition);
      cancelAnimation();
      if (wheelTimeoutRef.current !== undefined) {
          clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, [handleResize, checkScrollPosition, cancelAnimation]);

  const handleCardClick = (index: number) => {
    if (!didDragRef.current) {
      setActiveIndex(activeIndex === index ? null : index);
    }
    didDragRef.current = false;
  };

  const startDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
        return;
    }
    if (!containerRef.current) return;
    cancelAnimation();

    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setScrollLeftStart(containerRef.current.scrollLeft);
    dragStartTimeRef.current = performance.now();
    didDragRef.current = false;

    velocityTracker.current = [{ x: clientX, time: dragStartTimeRef.current }];

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  }, [cancelAnimation]);

  const duringDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const walk = clientX - startX;

    if (!didDragRef.current && Math.abs(walk) > 2) {
        didDragRef.current = true;
    }

    const newScrollLeft = scrollLeftStart - walk;

    const now = performance.now();
    velocityTracker.current.push({ x: clientX, time: now });
    if (velocityTracker.current.length > 8) velocityTracker.current.shift();

    requestAnimationFrame(() => {
      if (containerRef.current && isDragging) {
        const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
        containerRef.current.scrollLeft = Math.max(0, Math.min(maxScroll, newScrollLeft));
        checkScrollPosition();
      }
    });
  }, [isDragging, startX, scrollLeftStart, checkScrollPosition]);

  const endDrag = useCallback(() => {
    if (!isDragging || !containerRef.current) {
        if (isDragging) {
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
            if (containerRef.current) containerRef.current.style.cursor = 'grab';
            setIsDragging(false);
        }
        return;
    }

    const wasDragging = isDragging;
    setIsDragging(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
    }

    if (!wasDragging) return;

    const dragEndTime = performance.now();
    const dragDuration = dragEndTime - dragStartTimeRef.current;
    const endX = velocityTracker.current[velocityTracker.current.length - 1]?.x ?? startX;
    const dragDistance = Math.abs(endX - startX);

    if (!didDragRef.current && dragDistance < TAP_THRESHOLD_PX && dragDuration < TAP_THRESHOLD_MS) {
        didDragRef.current = false;
        return;
    }

    let velocity = 0;
    if (velocityTracker.current.length >= 2) {
      const newest = velocityTracker.current[velocityTracker.current.length - 1];
      const olderIndex = Math.max(0, velocityTracker.current.length - 4);
      const older = velocityTracker.current[olderIndex];
      const dx = newest.x - older.x;
      const dt = newest.time - older.time;
      if (dt > 10) {
        velocity = dx / dt;
      }
    }

    if (Math.abs(velocity) > 0.15 && containerRef.current) {
        const container = containerRef.current;
        let currentVelocity = -velocity * MOMENTUM_MULTIPLIER;
        const startTime = performance.now();

        const animateMomentum = (currentTime: number) => {
            if (!containerRef.current) {
                animationRef.current = undefined;
                return;
            }

            const elapsedTime = currentTime - startTime;
            const decayFactor = Math.pow(MOMENTUM_FRICTION, elapsedTime / 16.67);
            const deltaScroll = currentVelocity * (16.67 / 1000);

            currentVelocity *= decayFactor;

            if (Math.abs(currentVelocity) < 0.5 || elapsedTime > 2000) {
                snapToNearestCard();
                animationRef.current = undefined;
                return;
            }

            const maxScroll = container.scrollWidth - container.clientWidth;
            const currentScroll = container.scrollLeft;
            const newScrollLeft = Math.max(0, Math.min(maxScroll, currentScroll + deltaScroll));

            if (Math.abs(currentScroll - newScrollLeft) < 0.1) {
                 snapToNearestCard();
                 animationRef.current = undefined;
                 return;
            }

            container.scrollLeft = newScrollLeft;
            checkScrollPosition();

            if ((newScrollLeft <= 0 || newScrollLeft >= maxScroll) && Math.abs(currentScroll - newScrollLeft) < 1) {
                 snapToNearestCard();
                 animationRef.current = undefined;
                 return;
            }

            animationRef.current = requestAnimationFrame(animateMomentum);
        };

        cancelAnimation();
        animationRef.current = requestAnimationFrame(animateMomentum);

    } else {
        snapToNearestCard();
    }
  }, [isDragging, startX, snapToNearestCard, checkScrollPosition, cancelAnimation]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!containerRef.current) return;
  
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      e.stopPropagation();
      
      cancelAnimation();
  
      const scrollAmount = e.deltaX * SCROLL_WHEEL_MULTIPLIER;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'auto'
      });
  
      if (wheelTimeoutRef.current !== undefined) {
        clearTimeout(wheelTimeoutRef.current);
      }
      wheelTimeoutRef.current = setTimeout(() => {
        snapToNearestCard();
        wheelTimeoutRef.current = undefined;
      }, SNAP_DEBOUNCE_MS);
  
      checkScrollPosition();
    }
  }, [snapToNearestCard, checkScrollPosition, cancelAnimation]);

  const ScrollIndicator = () => {
    const [currentIndicator, setCurrentIndicator] = useState(0);

    useEffect(() => {
      const calculateIndicator = () => {
        if (!containerRef.current || cardsPerView <= 0) return;
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidthWithGap = containerWidth / cardsPerView;
        const scrollPos = containerRef.current.scrollLeft;
        const activeIdx = Math.round(scrollPos / cardWidthWithGap);
        setCurrentIndicator(Math.min(faqs.length - 1, Math.max(0, activeIdx)));
      };

      const container = containerRef.current;
      if(container) {
          container.addEventListener('scroll', calculateIndicator, { passive: true });
          calculateIndicator();
      }

      return () => {
          if (container) {
              container.removeEventListener('scroll', calculateIndicator);
          }
      };
    }, [cardsPerView, faqs.length]);

    const maxIndicatorsToShow = 12;
    const indicatorsToShow = faqs.slice(0, maxIndicatorsToShow);

    if (!isMobile) return null;

    return (
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 pointer-events-none z-10">
        {indicatorsToShow.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-width duration-300 ${
              i === currentIndicator ? 'bg-purple-400 w-6' : 'bg-gray-600 w-2'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section
      className="min-h-screen w-full flex flex-col justify-center relative overflow-hidden py-16"
      style={{ 
        fontFamily: "'Neue Montreal', sans-serif",
        background: 'transparent'
      }}
      id="faq"
    >
      <div className="container mx-auto px-4 flex-1 flex flex-col justify-center relative z-10">
        <div className="relative mb-12 md:mb-16 text-center">
          <h2
            className={`text-5xl md:text-6xl font-bold uppercase tracking-tighter inline-block relative ${
              glitchActive ? 'glitch-active' : ''
            }`}
            style={{ 
              color: '#4dffff',
              textShadow: '0 0 15px rgba(77, 255, 255, 0.7)',
              fontStyle: 'italic'
            }}
          >
            FREQUENTLY ASKED
            <br />
            QUESTIONS
            {glitchActive && (
              <>
                <span className="glitch-layer" style={{ color: '#a6ff4d', textShadow: '3px 0 #c306aa', clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}>
                  FREQUENTLY ASKED
                  <br />
                  QUESTIONS
                </span>
                <span className="glitch-layer" style={{ color: '#8f03d1', textShadow: '-3px 0 #4dffff', clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}>
                  FREQUENTLY ASKED
                  <br />
                  QUESTIONS
                </span>
              </>
            )}
          </h2>
        </div>

        <div className="relative flex items-center">
          <div
            ref={containerRef}
            className="w-full overflow-x-hidden py-4 cursor-grab no-scrollbar"
            onMouseDown={startDrag}
            onMouseMove={duringDrag}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onTouchStart={startDrag}
            onTouchMove={duringDrag}
            onTouchEnd={endDrag}
            onWheel={handleWheel}
            style={{ scrollBehavior: 'auto', WebkitOverflowScrolling: 'touch', willChange: 'scroll-position', overscrollBehaviorX: 'contain'}}
          >
            <div
              ref={sliderRef}
              className="flex gap-4 px-2"
            >
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="faq-card flex-shrink-0 group"
                  style={{ perspective: '1000px', touchAction: 'pan-y' }}
                  onClick={() => handleCardClick(index)}
                >
                  <div
                    className={`relative w-full h-64 transition-transform duration-500 ease-in-out preserve-3d ${activeIndex === index ? 'rotate-y-180' : ''}`}
                  >
                    {/* question */}
                    <div
                      className={`absolute w-full h-full backface-hidden rounded-xl p-4 md:p-6 flex items-center justify-center cursor-pointer shadow-lg group-hover:shadow-xl transition-shadow duration-300 ${
                        activeIndex === index ? 'bg-gradient-to-br from-purple-100 to-blue-100' : 'bg-gradient-to-b from-purple-50 to-white'
                      }`}
                      style={{ border: '1px solid rgba(143, 3, 209, 0.3)' }}
                      role="button" 
                      aria-expanded={activeIndex === index}
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(index); } }}
                    >
                      <h3 
                        className="text-2xl md:text-2xl font-bold text-center px-4"
                        style={{ 
                          color: '#8f03d1',
                          textShadow: '0 2px 4px rgba(143, 3, 209, 0.1)',
                          lineHeight: '1.4'
                        }}
                      >
                        {faq.question}
                      </h3>
                    </div>

                    {/* answer */}
                    <div
                      className={`absolute w-full h-full backface-hidden rounded-xl p-4 md:p-6 flex flex-col shadow-lg rotate-y-180 ${
                         activeIndex === index ? 'bg-gradient-to-br from-blue-100 to-purple-100' : 'bg-gradient-to-b from-blue-50 to-white'
                      }`}
                      style={{ border: '1px solid rgba(143, 3, 209, 0.3)' }}
                       aria-hidden={activeIndex !== index}
                    >
                      <h3 className="text-lg md:text-xl font-semibold mb-3 line-clamp-2 flex-shrink-0" style={{ color: '#8f03d1' }}>
                        {faq.question}
                      </h3>
                      <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar">
                        <p className="text-sm md:text-base" style={{ color: '#0c1f6f', lineHeight: '1.6' }}>
                          {faq.answer}
                        </p>
                      </div>
                       <div className="flex justify-end items-center text-gray-500 text-xs mt-2 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        Back
                        <span className="text-xl ml-2" style={{ color: '#c306aa' }} aria-hidden="true">
                           ×
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ScrollIndicator />
      </div>

      <style jsx>{`
        .glitch-active { animation: glitch-anim 0.3s linear infinite; }
        .glitch-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.7; pointer-events: none; }
        @keyframes glitch-anim {
          0% { transform: translate(0); } 20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); } 60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); } 100% { transform: translate(0); }
        }
        .preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(143, 3, 209, 0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(143, 3, 209, 0.6); }
        .faq-card:focus { outline: none; }
        .faq-card:focus-visible > div {
            outline: 3px solid #4dffff;
            outline-offset: 2px;
            border-radius: 0.75rem;
        }
        .faq-container {
          overscroll-behavior-x: contain;
          touch-action: pan-y;
        }
      `}</style>
    </section>
  );
};

export default FAQ;