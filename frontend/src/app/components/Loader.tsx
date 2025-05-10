'use client'
import { useState, useEffect, useRef } from 'react'
import Bumper from './Bumper'
import Image from 'next/image'

export default function LoadingAnimation() {
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [svgLoaded, setSvgLoaded] = useState(false)
  const animationTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!svgLoaded) return

    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current)
    }

    animationTimeout.current = setTimeout(() => {
      setLoadingComplete(true)
    }, 3000)

    return () => {
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current)
      }
    }
  }, [svgLoaded])

  if (loadingComplete) {
    return <Bumper onComplete={() => {}} />
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src="/assets/innofashion_FINAL_FIX.svg"
          alt="Loading"
          fill
          priority
          onLoad={() => setSvgLoaded(true)}
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