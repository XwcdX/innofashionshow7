'use client'
import { useState, useEffect } from 'react';
import Bumper from './Bumper';

export default function LoadingAnimation() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, opacity: number, speed: number}>>([]);
  const [showMainContent, setShowMainContent] = useState(false);

  const handleBumperComplete = () => {
    setLoadingComplete(true);
    setShowMainContent(true);
  };

  useEffect(() => {
    const initialParticles = Array.from({length: 30}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.5 + 0.1
    }));
    setParticles(initialParticles);

    const intervalId = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalId);
          setTimeout(() => {
            setOpacity(0);
            setTimeout(() => {
              setLoadingComplete(true);
            }, 1000);
          }, 500);
          return 100;
        }
        return prev + 1;
      });

      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.speed) % 100,
        y: (p.y + p.speed * 0.3) % 100,
        opacity: Math.sin(Date.now() * 0.001 + p.id) * 0.2 + 0.3
      })));
    }, 30);

    return () => clearInterval(intervalId);
  }, []);

  if (loadingComplete) {
    return (
      <>
        <Bumper onComplete={handleBumperComplete} />
        <style jsx global>{`
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden"
        style={{ opacity: opacity, transition: 'opacity 1s ease-out' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                transform: `scale(${1 + Math.sin(Date.now() * 0.001 + p.id) * 0.5})`,
                transition: 'all 0.3s ease-out'
              }}
            />
          ))}
          
          <div className="absolute inset-0 opacity-10">
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white to-transparent" style={{
              clipPath: 'polygon(0% 100%, 100% 100%, 100% 70%, 80% 50%, 60% 70%, 40% 30%, 20% 60%, 0% 30%)'
            }}></div>
          </div>
        </div>

        <div className="text-center relative z-10">
          <div className="mb-16 transition-all duration-700 ease-in-out" style={{ 
            transform: `translateY(${progress < 50 ? -10 : 0}px)`,
            filter: `blur(${progress < 10 ? 2 : 0}px)`
          }}>
            <h1 className="text-5xl font-light tracking-widest text-white mb-1">INNOFASHION</h1>
            <p className="text-2xl font-light tracking-widest text-white">7</p>
          </div>
          
          <div className="w-64 h-px bg-gray-700 relative mx-auto overflow-hidden">
            <div 
              className="h-full bg-white absolute top-0 left-0 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 h-full w-1 bg-white opacity-70 animate-pulse"></div>
            </div>
            <div className="absolute inset-0 overflow-hidden">
              {progress < 100 && (
                <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-r from-transparent to-white opacity-20 animate-pulse"></div>
              )}
            </div>
          </div>
          
          <div className="mt-4 text-xs uppercase tracking-widest text-gray-400 font-light">
            {progress < 100 ? (
              <span className="animate-pulse">Crafting Collection {progress}%</span>
            ) : (
              <span className="text-white">Runway Ready</span>
            )}
          </div>
        </div>
        
        <div className="fixed bottom-6 text-xs text-gray-500 tracking-wider z-10">
          © 2025 INNOFASHION
        </div>
        
        {progress > 90 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white opacity-5 animate-ping"></div>
            <div className="absolute top-1/3 right-1/3 w-20 h-20 rounded-full bg-white opacity-5 animate-ping" style={{ animationDelay: '0.3s' }}></div>
          </div>
        )}
      </div>

      <style jsx global>{`
        body {
          background: ${showMainContent 
            ? 'linear-gradient(135deg, #A30A99 0%, #820D8C 25%, #5F117F 50%, #3D1472 75%, #281660 100%)' 
            : '#000'};
          background-attachment: fixed;
          background-size: 200% 200%;
          min-height: 100vh;
          animation: ${showMainContent ? 'gradientAnimation 15s ease infinite' : 'none'};
          margin: 0;
          padding: 0;
          font-family: inherit;
        }

        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}