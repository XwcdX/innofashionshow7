'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function LoadingAnimation({ onComplete }: { onComplete: () => void }) {
  const [svgLoaded, setSvgLoaded] = useState(false)
  const animationTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!svgLoaded) return

    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current)
    }

    animationTimeout.current = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => {
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current)
      }
    }
  }, [svgLoaded, onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src="/assets/innofashion_FINAL_FIX.svg"
          alt="Loading"
          fill
          priority
          onLoadingComplete={() => setSvgLoaded(true)}
          className="object-contain"
        />
      </div>
      
      {!svgLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  )
}