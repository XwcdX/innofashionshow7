'use client'
import React from 'react'

const CompetitionsSection: React.FC = () => {
  return (
    <section
      id="competitions"
      className="min-h-screen flex items-center justify-center py-16 font-neue-montreal -mt-65 mb-20 md:-mt-140 md:mb-0"
      style={{
        background: 'transparent',
        scrollSnapAlign: 'start',
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-20">
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
              className="group relative p-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10"
            >
              {/* Main Content */}
              <div className="relative z-10">
                <div className="text-4xl mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-300">
                </div>
                <h3
                  className="text-2xl font-semibold mb-3 group-hover:text-white transition-colors duration-300"
                  style={{
                    color: '#a6ff4d',
                    fontFamily: 'MODERNIZ, sans-serif',
                  }}
                >
                  {competition.title}
                </h3>
                <p
                  className="text-gray-300 text-base group-hover:text-white transition-colors duration-500"
                  style={{
                    fontFamily: 'EIRENE SANS, sans-serif',
                  }}
                >
                  {competition.description}
                </p>
              </div>

              {/* Hover Effects */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4dffff10] to-[#a6ff4d10]"></div>
                <div className="absolute inset-0 border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl shadow-[0_0_0_0_rgba(77,255,255,0.2)] group-hover:shadow-[0_0_30px_10px_rgba(77,255,255,0.4)] transition-shadow duration-500 pointer-events-none"></div>

              {/* Scale & Frosted Glass Layer */}
              <div className="absolute inset-0 rounded-2xl scale-95 group-hover:scale-100 transition-transform duration-500 bg-white/10 backdrop-blur-xl -z-10"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CompetitionsSection
