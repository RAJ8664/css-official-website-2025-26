import React, { useState, useEffect } from 'react'
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaArrowRight,
} from 'react-icons/fa'
import data from '../jsonData/members.json'
import '../styles/memberAnimations.css'
import MemberCard from '../components/MemberCard'

const Members = () => {
  const [flippedCards, setFlippedCards] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  
  const handleCardFlip = (cardId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }))
  }

  // Simulate loading and wait for images
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // Preload main image
    const img = new Image()
    img.src = 'images/member.png'
    img.onload = () => setImagesLoaded(true)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading || !imagesLoaded) {
    return (
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] flex items-center justify-center z-50">
        <div className="relative">
          {/* Animated loader */}
          <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
          
          {/* Loading text with typing animation */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-cyan-400 font-mono text-sm md:text-base">$~</span>
              <span className="text-white font-mono text-sm md:text-base">Loading Members</span>
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-cyan-400 animate-bounce"></div>
                <div className="w-1 h-4 bg-cyan-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-4 bg-cyan-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 w-48 md:w-64 h-1 bg-cyan-900/30 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse rounded-full w-3/4"></div>
            </div>
            
            {/* Status text */}
            <p className="mt-3 text-cyan-300/80 font-mono text-xs">
              {!imagesLoaded ? 'Loading images...' : 'Initializing system...'}
            </p>
          </div>

          {/* Floating elements */}
          <div className="absolute -top-4 -right-4 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-4 -left-4 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-1000"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white px-4 sm:px-6 py-8 sm:py-10 overflow-hidden">
    
      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 mt-4 sm:mt-8">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white"
            style={{ fontFamily: 'Goldman, sans-serif' }}
          >
            Our Members
          </h1>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 md:gap-10 mb-8 sm:mb-12 md:mb-16 p-4 sm:p-6 md:p-8 bg-black/90 rounded-lg sm:rounded-xl md:rounded-2xl backdrop-blur-lg border border-cyan-500/20 relative z-10 overflow-hidden">
          {/* Background Patterns */}
          <div className="absolute inset-0 bg-hexagon-pattern-black bg-[length:40px_40px] sm:bg-[length:60px_60px] md:bg-[length:80px_80px] opacity-20"></div>
          
          {/* Circuit Animation - Hidden on mobile for performance */}
          <div className="absolute inset-0 opacity-20 md:opacity-30 hidden sm:block">
            <svg width="100%" height="100%" className="absolute inset-0">
              <path
                d="M0,50 Q150,0 300,100 T600,50 T900,150 T1200,50"
                stroke="url(#circuitGradient)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4,6"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="20"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M0,200 Q200,150 400,250 T800,200 T1200,300 T1600,200"
                stroke="url(#circuitGradient)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4,6"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="20"
                  to="0"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </path>
              <defs>
                <linearGradient
                  id="circuitGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#00f7ff" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#00ccff" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#00a2ff" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Matrix Rain - Reduced on mobile */}
          <div className="absolute inset-0 overflow-hidden opacity-20 md:opacity-30">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute text-cyan-400 text-xs font-mono opacity-70 animate-[matrix-rain_20s_linear_infinite]"
                style={{
                  left: `${i * 16}%`,
                  animationDelay: `${i * 0.7}s`,
                  top: '-5%',
                }}
              >
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>

          {/* Animated Dots - Reduced on mobile */}
          <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping shadow-lg shadow-cyan-400/50 hidden sm:block"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-1000 shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping delay-1500 shadow-lg shadow-cyan-400/50 hidden sm:block"></div>

          {/* Border Corners */}
          <div className="absolute inset-0 border border-cyan-500/10 md:border-2 rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-none">
            <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 border-t border-l sm:border-t-2 sm:border-l-2 border-cyan-400"></div>
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 border-t border-r sm:border-t-2 sm:border-r-2 border-cyan-400"></div>
            <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 border-b border-l sm:border-b-2 sm:border-l-2 border-cyan-400"></div>
            <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 border-b border-r sm:border-b-2 sm:border-r-2 border-cyan-400"></div>
          </div>

          {/* Text Content */}
          <div className="flex-1 relative order-2 lg:order-1">
            <div className="absolute -left-2 sm:-left-3 md:-left-4 top-3 w-1 sm:w-1.5 md:w-2 h-8 sm:h-12 md:h-16 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full shadow-lg shadow-cyan-400/30"></div>
            <div className="relative pl-3 sm:pl-4 md:pl-6">
              <div className="flex items-center mb-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-red-500 rounded-full mr-1.5 sm:mr-2 shadow-lg shadow-red-500/40"></div>
                <span className="text-cyan-400 font-mono text-xs sm:text-xs md:text-sm">
                  SYSTEM_TERMINAL
                </span>
              </div>
              <p className="text-gray-200 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl font-mono">
                <span className="text-cyan-400">$~ </span>
                Every member brings unique energy, ideas, and enthusiasm that
                make our society stronger each year. We're proud of the diverse
                talents and perspectives that each individual contributes to our
                community's success.
              </p>
              <div className="flex items-center mt-2 sm:mt-3 md:mt-4">
                <span className="text-cyan-400 font-mono text-xs sm:text-sm md:text-base mr-1.5 sm:mr-2">
                  $~
                </span>
                <div className="w-1 h-3 sm:w-1.5 sm:h-4 md:w-2 md:h-5 bg-cyan-400 animate-blink"></div>
              </div>
              <div className="flex flex-wrap mt-3 sm:mt-4 md:mt-6 gap-2 sm:gap-3 md:gap-6">
                <div className="flex items-center bg-black/50 p-1 sm:p-1.5 md:p-2 rounded border border-cyan-500/20">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-1 sm:mr-1.5 md:mr-2 animate-pulse shadow-lg shadow-green-500/40"></div>
                  <span className="text-cyan-300 font-mono text-xs sm:text-xs md:text-sm">
                    ACTIVE
                  </span>
                </div>
                <div className="flex items-center bg-black/50 p-1 sm:p-1.5 md:p-2 rounded border border-cyan-500/20">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-blue-500 rounded-full mr-1 sm:mr-1.5 md:mr-2 animate-pulse delay-1000 shadow-lg shadow-blue-500/40"></div>
                  <span className="text-cyan-300 font-mono text-xs sm:text-xs md:text-sm">
                    MULTI_TALENTED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="flex-1 flex justify-center order-1 lg:order-2 mb-4 sm:mb-6 lg:mb-0">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
              <div className="absolute -inset-1 sm:-inset-2 md:-inset-4 bg-cyan-500/10 rounded-xl sm:rounded-2xl md:rounded-3xl blur-md sm:blur-lg md:blur-xl"></div>
              <div className="relative overflow-hidden rounded-lg sm:rounded-lg md:rounded-xl border border-cyan-500/30 group bg-black/50">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
                <img
                  src="images/member.png"
                  alt="Team members"
                  className="relative w-full transform group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute w-full h-0.5 sm:h-0.5 md:h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/3 animate-scan opacity-80 shadow-lg shadow-cyan-400/50"></div>
                <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-t border-l sm:border-t-2 sm:border-l-2 border-cyan-400 opacity-80"></div>
                <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-t border-r sm:border-t-2 sm:border-r-2 border-cyan-400 opacity-80"></div>
                <div className="absolute bottom-1 left-1 sm:bottom-1.5 sm:left-1.5 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-b border-l sm:border-b-2 sm:border-l-2 border-cyan-400 opacity-80"></div>
                <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-b border-r sm:border-b-2 sm:border-r-2 border-cyan-400 opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1.5 sm:p-2 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300 font-mono text-xs sm:text-xs md:text-sm">
                      IMG_PROC
                    </span>
                    <span className="text-cyan-300 font-mono text-xs sm:text-xs md:text-sm">
                      100%
                    </span>
                  </div>
                  <div className="w-full bg-cyan-900/30 h-0.5 sm:h-0.5 md:h-1 mt-0.5 sm:mt-1 rounded-full">
                    <div className="w-full h-full bg-cyan-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-cyan-500/30 rounded-full border border-cyan-400/50 animate-float-1 shadow-lg shadow-cyan-400/30 hidden sm:block"></div>
              <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-2 h-2 sm:w-3 sm:h-3 md:w-5 md:h-5 bg-purple-500/30 rounded-full border border-purple-400/50 animate-float-2 shadow-lg shadow-purple-400/30 hidden sm:block"></div>
            </div>
          </div>
        </div>

        {/* Members Grid Section */}
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex flex-col items-center justify-center mt-8 sm:mt-10 mb-8 sm:mb-12 p-4 sm:p-6 bg-black/60 rounded-lg sm:rounded-xl border border-cyan-500/30 relative overflow-hidden max-w-4xl mx-auto text-center animate-fadeIn">
            {/* Background effects */}
            <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
            <div className="absolute -top-8 -left-8 sm:-top-10 sm:-left-10 w-24 h-24 sm:w-32 sm:h-32 bg-cyan-500/10 rounded-full blur-lg sm:blur-xl"></div>
            <div className="absolute -bottom-8 -right-8 sm:-bottom-10 sm:-right-10 w-24 h-24 sm:w-32 sm:h-32 bg-purple-500/10 rounded-full blur-lg sm:blur-xl"></div>
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-2 h-2 sm:w-3 sm:h-3 border-t border-l sm:border-t-2 sm:border-l-2 border-cyan-400"></div>
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-2 h-2 sm:w-3 sm:h-3 border-t border-r sm:border-t-2 sm:border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 w-2 h-2 sm:w-3 sm:h-3 border-b border-l sm:border-b-2 sm:border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-2 h-2 sm:w-3 sm:h-3 border-b border-r sm:border-b-2 sm:border-r-2 border-cyan-400"></div>

            {/* Heading */}
            <h2 className="text-lg sm:text-xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 via-purple-400 to-cyan-100 bg-clip-text text-transparent animate-pulse">
              Meet Our Societies Members
            </h2>
          </div>

          {/* Members Grid */}
          <div className="space-y-12 sm:space-y-16 mt-8 sm:mt-12 max-w-7xl mx-auto">
            {Object.entries(data.wings).map(([key, wing], idx) => (
              <div key={key} className="relative">
                <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-8 font-semibold text-left border-l-2 sm:border-l-4 border-cyan-500 pl-3 sm:pl-4 text-cyan-300">
                  {wing.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
                  {wing.members['2025-26']?.map((member, i) => {
                    const cardId = `${key}-2025-26-${i}`
                    return (
                      <MemberCard
                        key={cardId}
                        member={member}
                        flipped={flippedCards[cardId]}
                        onFlip={() => handleCardFlip(cardId)}
                        index={i}
                      />
                    )
                  })}
                </div>
                {idx !== Object.entries(data.wings).length - 1 && (
                  <div className="mt-12 sm:mt-16 h-[1px] sm:h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-600 to-transparent opacity-40"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Members