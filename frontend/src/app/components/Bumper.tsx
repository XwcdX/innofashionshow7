'use client'
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BumperProps {
  onComplete: () => void;
}

const Bumper = ({ onComplete }: BumperProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showSoundButton, setShowSoundButton] = useState(false);
  const [showSoundText, setShowSoundText] = useState(true);
  const [isExiting, setIsExiting] = useState(false); // Ubah nama state untuk lebih jelas

  const startVideo = async () => {
    if (!videoRef.current) return;

    try {
      videoRef.current.preload = 'auto';
      videoRef.current.muted = true;
      
      await videoRef.current.play();
      setIsPlaying(true);
      
      if (videoRef.current.muted) {
        setShowSoundButton(true);
      }
    } catch (error) {
      console.error('Failed to play video:', error);
    }
  };

  const toggleSound = () => {
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      
      if (showSoundText) {
        setShowSoundText(false);
      }
      
      if (!newMutedState) {
        videoRef.current.play().catch(e => console.log('Play after unmute failed:', e));
      }
    }
  };

  const handleVideoEnd = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 500); // durasi animasi
  };

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  useEffect(() => {
    const handleUserInteraction = () => {
      if (videoRef.current && !isPlaying) {
        startVideo();
      }
    };

    document.addEventListener('click', handleUserInteraction);
    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [isPlaying]);

  useEffect(() => {
    startVideo();
    
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      <AnimatePresence>
        {!isExiting ? (
          <motion.div
            key="bumper"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              playsInline
              muted={isMuted}
              autoPlay
              onEnded={handleVideoEnd}
            >
              <source src="/teaser_inno_1.mp4#t=0.1" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {showSoundButton && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`absolute bottom-4 right-4 ${showSoundText ? 'bg-black px-4 py-2 rounded-lg' : 'p-3 bg-black rounded-full'} text-white cursor-pointer flex items-center justify-center hover:bg-opacity-90 transition-all shadow-lg z-20`}
                onClick={toggleSound}
                style={{ 
                  minWidth: showSoundText ? '120px' : '48px', 
                  minHeight: showSoundText ? '40px' : '48px',
                }}
              >
                {isMuted ? (
                  <>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 5L6 9H3V15H6L11 19V5Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M21 9L15 15M15 9L21 15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {showSoundText && <span className="ml-2 font-medium">Sound ON</span>}
                  </>
                ) : (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5L6 9H3V15H6L11 19V5Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M14 9C15.5 10 16 12 14 15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M17 7C20 9 20 15 17 17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleSkip}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-70 px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all z-20 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Skip</span>
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>

            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="rounded-full h-12 w-12 border-t-2 border-b-2 border-white"
                />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bumper;