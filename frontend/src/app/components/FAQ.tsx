'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const TAP_THRESHOLD_PX = 10;
const TAP_THRESHOLD_MS = 200;
const MOMENTUM_MULTIPLIER = 25;
const MOMENTUM_FRICTION = 0.92;
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
  const [startY, setStartY] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [scrollTopStart, setScrollTopStart] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const velocityTracker = useRef<{ x: number, y: number, time: number }[]>([]);
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
      // const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      // const scrollEnd = scrollWidth - clientWidth;
    }
  }, []);

  const smoothScrollTo = useCallback((targetX: number, targetY: number, duration: number = 400) => {
    if (!containerRef.current) return;
    cancelAnimation();

    const startX = containerRef.current.scrollLeft;
    const startY = containerRef.current.scrollTop;
    const changeX = targetX - startX;
    const changeY = targetY - startY;

    if (Math.abs(changeX) < 1 && Math.abs(changeY) < 1) {
      checkScrollPosition();
      return;
    }

    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      if (containerRef.current) {
        if (Math.abs(changeX) > 1) {
          containerRef.current.scrollLeft = startX + changeX * easedProgress;
        }
        if (Math.abs(changeY) > 1) {
          containerRef.current.scrollTop = startY + changeY * easedProgress;
        }
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateScroll);
      } else {
        if (containerRef.current) {
          if (Math.abs(changeX) > 1) containerRef.current.scrollLeft = targetX;
          if (Math.abs(changeY) > 1) containerRef.current.scrollTop = targetY;
        }
        checkScrollPosition();
        animationRef.current = undefined;
      }
    };

    animationRef.current = requestAnimationFrame(animateScroll);
  }, [checkScrollPosition, cancelAnimation]);

  const snapToNearestCard = useCallback((animate = true) => {
    if (!containerRef.current || !sliderRef.current) return;

    if (isMobile) {
      const containerHeight = containerRef.current.offsetHeight;
      const cardHeightWithGap = containerHeight / CARDS_PER_VIEW_MOBILE;
      const currentScroll = containerRef.current.scrollTop;
      const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight;

      if (cardHeightWithGap <= 0) return;

      const cardIndex = Math.round(currentScroll / cardHeightWithGap);
      const targetScroll = Math.max(0, Math.min(maxScroll, cardHeightWithGap * cardIndex));

      if (Math.abs(currentScroll - targetScroll) > 1) {
        if (animate) {
          smoothScrollTo(containerRef.current.scrollLeft, targetScroll, 300);
        } else {
          cancelAnimation();
          containerRef.current.scrollTop = targetScroll;
          checkScrollPosition();
        }
      } else {
        checkScrollPosition();
      }
    } else {
      const containerWidth = containerRef.current.offsetWidth;
      const cardWidthWithGap = containerWidth / cardsPerView;
      const currentScroll = containerRef.current.scrollLeft;
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;

      if (cardWidthWithGap <= 0) return;

      const cardIndex = Math.round(currentScroll / cardWidthWithGap);
      const targetScroll = Math.max(0, Math.min(maxScroll, cardWidthWithGap * cardIndex));

      if (Math.abs(currentScroll - targetScroll) > 1) {
        if (animate) {
          smoothScrollTo(targetScroll, containerRef.current.scrollTop, 300);
        } else {
          cancelAnimation();
          containerRef.current.scrollLeft = targetScroll;
          checkScrollPosition();
        }
      } else {
        checkScrollPosition();
      }
    }
  }, [cardsPerView, isMobile, smoothScrollTo, checkScrollPosition, cancelAnimation]);

  const handleResize = useCallback(() => {
    if (containerRef.current && sliderRef.current) {
      if (isMobile) {
        const containerHeight = containerRef.current.offsetHeight;
        const cardHeight = containerHeight / CARDS_PER_VIEW_MOBILE;
        const gap = 8;
        const totalSliderHeight = (cardHeight * faqs.length) - gap;
        
        sliderRef.current.style.width = '100%';
        sliderRef.current.style.height = `${totalSliderHeight}px`;

        const cards = sliderRef.current.querySelectorAll('.faq-card');
        const cardElementHeight = cardHeight - gap;
        cards.forEach(card => {
          (card as HTMLElement).style.width = 'calc(100% - 32px)';
          (card as HTMLElement).style.height = `${cardElementHeight}px`;
          (card as HTMLElement).style.minHeight = `${cardElementHeight}px`;
          (card as HTMLElement).style.margin = `0 16px ${gap}px 16px`;
        });
      } else {
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidth = containerWidth / cardsPerView;
        const gap = 12;
        const totalSliderWidth = (cardWidth * faqs.length) - gap;
        
        sliderRef.current.style.height = 'auto';
        sliderRef.current.style.width = `${totalSliderWidth}px`;

        const cards = sliderRef.current.querySelectorAll('.faq-card');
        const cardElementWidth = cardWidth - gap;
        cards.forEach(card => {
          (card as HTMLElement).style.width = `${cardElementWidth}px`;
          (card as HTMLElement).style.minWidth = `${cardElementWidth}px`;
          (card as HTMLElement).style.height = 'auto';
          (card as HTMLElement).style.marginBottom = '0';
        });
      }

      checkScrollPosition();
      snapToNearestCard(false);
    }
  }, [faqs.length, cardsPerView, isMobile, checkScrollPosition, snapToNearestCard]);

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
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartX(clientX);
    setStartY(clientY);
    setScrollLeftStart(containerRef.current.scrollLeft);
    setScrollTopStart(containerRef.current.scrollTop);
    dragStartTimeRef.current = performance.now();
    didDragRef.current = false;

    velocityTracker.current = [{ x: clientX, y: clientY, time: dragStartTimeRef.current }];

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  }, [cancelAnimation]);

  const duringDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const walkX = clientX - startX;
    const walkY = clientY - startY;

    if (!didDragRef.current && (Math.abs(walkX) > TAP_THRESHOLD_PX || Math.abs(walkY) > TAP_THRESHOLD_PX)) {
      didDragRef.current = true;
    }

    const newScrollLeft = scrollLeftStart - walkX;
    const newScrollTop = scrollTopStart - walkY;

    const now = performance.now();
    velocityTracker.current.push({ x: clientX, y: clientY, time: now });
    if (velocityTracker.current.length > 5) velocityTracker.current.shift();

    requestAnimationFrame(() => {
      if (containerRef.current && isDragging) {
        if (isMobile) {
          const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight;
          containerRef.current.scrollTop = Math.max(0, Math.min(maxScroll, newScrollTop));
        } else {
          const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
          containerRef.current.scrollLeft = Math.max(0, Math.min(maxScroll, newScrollLeft));
        }
      }
    });
  }, [isDragging, startX, startY, scrollLeftStart, scrollTopStart, isMobile]);

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

    setIsDragging(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }

    const dragEndTime = performance.now();
    const dragDuration = dragEndTime - dragStartTimeRef.current;
    const endX = velocityTracker.current[velocityTracker.current.length - 1]?.x ?? startX;
    const endY = velocityTracker.current[velocityTracker.current.length - 1]?.y ?? startY;
    const dragDistanceX = Math.abs(endX - startX);
    const dragDistanceY = Math.abs(endY - startY);

    if (!didDragRef.current && dragDistanceX < TAP_THRESHOLD_PX && dragDistanceY < TAP_THRESHOLD_PX && dragDuration < TAP_THRESHOLD_MS) {
      didDragRef.current = false;
      return;
    }

    let velocityX = 0;
    let velocityY = 0;
    if (velocityTracker.current.length >= 2) {
      const newest = velocityTracker.current[velocityTracker.current.length - 1];
      const older = velocityTracker.current[0];
      const dx = newest.x - older.x;
      const dy = newest.y - older.y;
      const dt = newest.time - older.time;
      if (dt > 0) {
        velocityX = dx / dt;
        velocityY = dy / dt;
      }
    }

    if ((Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) && containerRef.current) {
      const container = containerRef.current;
      let currentVelocityX = -velocityX * MOMENTUM_MULTIPLIER;
      let currentVelocityY = -velocityY * MOMENTUM_MULTIPLIER;
      const startTime = performance.now();

      const animateMomentum = (currentTime: number) => {
        if (!containerRef.current) {
          animationRef.current = undefined;
          return;
        }

        const elapsedTime = currentTime - startTime;
        const decayFactor = Math.pow(MOMENTUM_FRICTION, elapsedTime / 16.67);
        const deltaScrollX = currentVelocityX * (16.67 / 1000);
        const deltaScrollY = currentVelocityY * (16.67 / 1000);

        currentVelocityX *= decayFactor;
        currentVelocityY *= decayFactor;

        if ((Math.abs(currentVelocityX) < 0.2 && Math.abs(currentVelocityY) < 0.2) || elapsedTime > 1500) {
          snapToNearestCard();
          animationRef.current = undefined;
          return;
        }

        if (isMobile) {
          const maxScrollY = container.scrollHeight - container.clientHeight;
          const newScrollTop = Math.max(0, Math.min(maxScrollY, container.scrollTop + deltaScrollY));
          container.scrollTop = newScrollTop;
        } else {
          const maxScrollX = container.scrollWidth - container.clientWidth;
          const newScrollLeft = Math.max(0, Math.min(maxScrollX, container.scrollLeft + deltaScrollX));
          container.scrollLeft = newScrollLeft;
        }

        animationRef.current = requestAnimationFrame(animateMomentum);
      };

      cancelAnimation();
      animationRef.current = requestAnimationFrame(animateMomentum);
    } else {
      snapToNearestCard();
    }
  }, [isDragging, startX, startY, isMobile, snapToNearestCard, cancelAnimation]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!containerRef.current) return;
  
    cancelAnimation();
  
    if (isMobile) {
      containerRef.current.scrollBy({
        top: e.deltaY * SCROLL_WHEEL_MULTIPLIER,
        behavior: 'auto'
      });
    } else {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        containerRef.current.scrollBy({
          left: e.deltaX * SCROLL_WHEEL_MULTIPLIER,
          behavior: 'auto'
        });
      }
    }
  
    if (wheelTimeoutRef.current !== undefined) {
      clearTimeout(wheelTimeoutRef.current);
    }
    wheelTimeoutRef.current = setTimeout(() => {
      snapToNearestCard();
      wheelTimeoutRef.current = undefined;
    }, SNAP_DEBOUNCE_MS);
  }, [snapToNearestCard, cancelAnimation, isMobile]);

  return (
    <section
      id="faq"
      className="min-h-screen w-full flex flex-col justify-center relative overflow-hidden py-8 md:py-12"
      style={{ 
        background: 'transparent'
      }}
    >
      <div className="container mx-auto px-0 flex-1 flex flex-col justify-center relative z-10">
        <div className="relative mb-6 md:mb-8 text-center">
          <h2
            className={`text-4xl md:text-6xl font-bold uppercase tracking-tighter inline-block relative ${
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
            className={`w-full overflow-x-hidden py-1 cursor-grab no-scrollbar ${
              isMobile ? 'overflow-y-scroll h-[60vh]' : 'overflow-y-hidden h-auto'
            }`}
            onMouseDown={startDrag}
            onMouseMove={duringDrag}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onTouchStart={startDrag}
            onTouchMove={duringDrag}
            onTouchEnd={endDrag}
            onWheel={handleWheel}
            style={{ 
              scrollBehavior: 'auto', 
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              marginLeft: isMobile ? '-12px' : '0'
            }}
          >
            <div
              ref={sliderRef}
              className={`flex ${isMobile ? 'flex-col pl-3' : 'flex-row gap-3'}`}
            >
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="faq-card flex-shrink-0 group"
                  style={{ perspective: '1000px' }}
                  onClick={() => handleCardClick(index)}
                >
                  <div
                    className={`relative w-full transition-transform duration-500 ease-in-out preserve-3d ${
                      activeIndex === index ? 'rotate-y-180' : ''
                    } ${isMobile ? 'h-[35vh]' : 'h-56'}`}
                  >
                    {/* question */}
                    <div
                      className={`absolute w-full h-full backface-hidden rounded-lg sm:p-2 md:p-4 flex items-center justify-center cursor-pointer ${
                        activeIndex === index ? 'glass-card-active' : 'glass-card'
                      }`}
                      style={{ 
                        borderRadius: '12px',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)'
                      }}
                      role="button" 
                      aria-expanded={activeIndex === index}
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(index); } }}
                    >
                      <h3 
                        className="text-xl md:text-2xl font-bold text-center px-3"
                        style={{ 
                          color: '#ffffff',
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                          lineHeight: '1.4'
                        }}
                      >
                        {faq.question}
                      </h3>
                    </div>

                    {/* answer */}
                    <div
                      className={`absolute w-full h-full backface-hidden rounded-lg p-4 md:p-4 flex flex-col rotate-y-180 glass-card-active`}
                      style={{ 
                        borderRadius: '12px',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)'
                      }}
                    >
                      <h3 
                        className="font-semibold mb-2 line-clamp-2 text-white" 
                        style={{ 
                          fontSize: isMobile ? '1.1rem' : '1.25rem'
                        }}
                      >
                        {faq.question}
                      </h3>
                      <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar">
                        <p 
                          className="leading-relaxed text-white/90"
                          style={{ 
                            fontSize: isMobile ? '0.95rem' : '1rem'
                          }}
                        >
                          {faq.answer}
                        </p>
                      </div>
                      <div className="flex justify-end items-center text-white/70 text-xs mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        Back
                        <span className="text-xl ml-1" style={{ color: '#ffffff' }} aria-hidden="true">
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
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; height: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.5); }
        .faq-card:focus { outline: none; }
        .faq-card:focus-visible > div {
            outline: 2px solid #4dffff;
            outline-offset: 1px;
            border-radius: 0.5rem;
        }
        .glass-card {
          background: rgba(143, 3, 209, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          background: rgba(143, 3, 209, 0.25);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
        }
        .glass-card-active {
          background: rgba(77, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
        }
        @media (max-width: 767px) {
          .faq-card {
            width: calc(100% - 24px) !important;
            margin-left: 2px !important;
            margin-right: 2px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default FAQ;