'use client'
import React from 'react'

const CompetitionsSection: React.FC = () => {
  return (
    <section
      id="competitions"
      className="min-h-screen flex items-center justify-center py-16 font-neue-montreal md:-mb-150 "
      style={{
        background: 'transparent',
        scrollSnapAlign: 'start',
      }}
    >
      <div className="container mx-auto px-4 text-center -mt-150 ">
        {/* <h2
          className="text-5xl md:text-6xl font-bold uppercase tracking-tight text-[#4dffff] mb-12"
          style={{
            textShadow: '0 0 15px rgba(77, 255, 255, 0.7)',
            fontStyle: 'italic',
          }}
        >
          Register Now
        </h2> */}

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 pt-* ">
      {[{
        title: 'Contest',
        description: 'Craft intuitive user experiences with elegant design solutions.',
      }, {
        title: 'Talkshow',
        description: 'Compete using data analytics and machine learning to solve problems.',
      }, {
        title: 'Workshop',
        description: 'Build robust applications and demonstrate your coding expertise.',
      }].map((competition, index) => (
        <div
          key={index}
          className="p-6 rounded-2xl border border-[#4dffff40] bg-[#1b1b1b] backdrop-filter backdrop-blur-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-opacity-60 hover:shadow-[0_0_25px_5px_#a6ff4d]"
        >
          <h3
            className="text-2xl font-semibold mb-3"
            style={{
              color: '#a6ff4d',
              fontFamily: 'MODERNIZ, sans-serif',
            }}
          >
            {competition.title}
          </h3>
          <p
            className="text-gray-300 text-base"
            style={{
              fontFamily: 'EIRENE SANS, sans-serif',
            }}
          >
            {competition.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

  )
}

export default CompetitionsSection
