import React, { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import {
  FaInstagram,
  FaUsers,
  FaFacebook,
  FaLinkedin,
  FaCode,
  FaPalette,
  FaUserTie,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
} from 'react-icons/fa'
import { Tilt } from 'react-tilt'
import { motion } from 'framer-motion'
import teamData from '../jsonData/developers.json' // Fetch data from JSON
import '../styles/developers.css'
import { NavbarDemo } from '../components/Navbar'

// Default options for Tilt component
const defaultTiltOptions = {
  reverse: true,
  max: 35,
  perspective: 1000,
  scale: 1.05,
  speed: 1000,
  transition: true,
  axis: null,
  reset: true,
  easing: 'cubic-bezier(.03,.98,.52,.99)',
}

const MemberCard = ({ member, index }) => {
  const [flipped, setFlipped] = useState(false)

  const handleFlip = () => {
    setFlipped(!flipped)
  }

  return (
    <Tilt options={defaultTiltOptions}>
      <div className="group perspective h-96 w-full" onClick={handleFlip}>
        <div
          className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
            flipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front of Card */}
          <div className="absolute inset-0 backface-hidden bg-gray-700 rounded-xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 group-hover:border-cyan-400/60 group-hover:shadow-cyan-400/20 transition-all duration-500">
            <div className="absolute inset-0 bg-tech-grid opacity-10"></div>
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-500/50 opacity-70 group-hover:border-cyan-300 transition-all"></div>
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-500/50 opacity-70 group-hover:border-cyan-300 transition-all"></div>
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-500/50 opacity-70 group-hover:border-cyan-300 transition-all"></div>
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-500/50 opacity-70 group-hover:border-cyan-300 transition-all"></div>
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="relative mb-6">
                <div className="relative w-32 h-32 rounded-full">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover border-2 border-gray-700 group-hover:border-cyan-400 transition-all duration-500"
                  />
                </div>
                <div className="absolute -inset-3 rounded-full bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-all"></div>
              </div>
              <div className="text-center px-2">
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-300 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-lg text-gray-400 group-hover:text-cyan-200 transition-colors duration-300">
                  {member.role}
                </p>
                {member.year && (
                  <p className="text-cyan-400 text-sm mt-1">{member.year}</p>
                )}
              </div>
              <div className="absolute bottom-5 left-0 right-0 flex justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center text-xs bg-black/70 px-3 py-1.5 rounded-full border border-cyan-500/40 group-hover:border-cyan-400/60 transition-all">
                  <span className="mr-2 text-cyan-300">View details</span>
                  <FaArrowRight className="text-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Back of Card */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl overflow-hidden border border-cyan-500/50 shadow-2xl shadow-cyan-500/30">
            <div className="absolute inset-0 bg-circuit-pattern opacity-15"></div>
            <div className="absolute inset-0 rounded-xl border-2 border-cyan-500/20 group-hover:border-cyan-400/40 transition-all"></div>
            <div className="relative h-full flex flex-col items-center justify-center p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold mb-1 bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent">
                  {member.name}
                </h3>
                <p className="text-sm text-cyan-300 font-mono">{member.role}</p>
                {member.year && (
                  <p className="text-cyan-400 text-xs mt-1">{member.year}</p>
                )}
              </div>
              <div className="flex gap-3 text-xl mb-6">
                {member.social.instagram && (
                  <a
                    href={member.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-110 shadow-lg hover:shadow-pink-500/30 border border-gray-700 hover:border-pink-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaInstagram className="text-white text-lg" />
                  </a>
                )}
                {member.social.facebook && (
                  <a
                    href={member.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full hover:bg-blue-600 transition-all transform hover:scale-110 shadow-lg hover:shadow-blue-500/30 border border-gray-700 hover:border-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaFacebook className="text-white text-lg" />
                  </a>
                )}
                {member.social.linkedin && (
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full hover:bg-blue-700 transition-all transform hover:scale-110 shadow-lg hover:shadow-blue-500/30 border border-gray-700 hover:border-blue-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaLinkedin className="text-white text-lg" />
                  </a>
                )}
              </div>
              <div className="absolute bottom-5 left-0 right-0 flex justify-center">
                <div className="flex items-center text-xs bg-black/50 px-3 py-1 rounded-full border border-cyan-500/30">
                  <span className="mr-2 text-cyan-300">View profile</span>
                  <FaArrowRight className="rotate-180 text-cyan-400" />
                </div>
              </div>
              <div className="absolute top-4 flex space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow shadow-red-500/50"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-300 shadow shadow-yellow-500/50"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-700 shadow shadow-green-500/50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Tilt>
  )
}

const Carousel = ({ children, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(1)
  const members = React.Children.toArray(children)
  const totalItems = members.length
  const totalSlides = Math.ceil(totalItems / itemsPerView)

  // Dynamic itemsPerView based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640)
        setItemsPerView(1) // Mobile
      else if (window.innerWidth < 1024)
        setItemsPerView(2) // Tablet
      else setItemsPerView(4) // Desktop
    }
    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  const next = () => {
    setCurrentIndex((prev) => (prev + 1 >= totalSlides ? 0 : prev + 1))
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    delta: 50,
    trackTouch: true,
    trackMouse: false,
  })

  // Calculate visible items
  const startIndex = currentIndex * itemsPerView
  const visibleItems = members.slice(startIndex, startIndex + itemsPerView)

  if (totalItems === 0)
    return <p className="text-center text-cyan-300">No members found</p>

  return (
    <div className={`relative px-8 ${className}`}>
      <div
        {...handlers}
        className="overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          initial={false}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: 'tween',
            ease: 'easeOut',
            duration: 0.3,
          }}
        >
          {visibleItems}
        </motion.div>
      </div>
      <button
        onClick={prev}
        className="absolute top-1/2 -translate-y-1/2 bg-cyan-900/70 border border-cyan-500 text-cyan-300 p-2 sm:p-3 lg:p-4 rounded-full hover:bg-cyan-800/80 hover:text-cyan-200 hover:scale-110 transition-all duration-300 shadow-lg shadow-cyan-500/30 z-10 left-8 sm:left-10 lg:left-12"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 -translate-y-1/2 bg-cyan-900/70 border border-cyan-500 text-cyan-300 p-2 sm:p-3 lg:p-4 rounded-full hover:bg-cyan-800/80 hover:text-cyan-200 hover:scale-110 transition-all duration-300 shadow-lg shadow-cyan-500/30 z-10 right-8 sm:right-10 lg:right-12"
        aria-label="Next slide"
      >
        <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
      </button>
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
              currentIndex === idx ? 'bg-cyan-400' : 'bg-gray-600'
            } hover:bg-cyan-300`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

const Developers = () => {
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem('selectedCategory') || 'all'
  })

  // Save selected category to localStorage and reset carousel index
  useEffect(() => {
    localStorage.setItem('selectedCategory', selectedCategory)
  }, [selectedCategory])

  // Return members from the contributors category when 'all' is selected
  const getCurrentMembers = () => {
    return selectedCategory === 'all'
      ? teamData.categories.contributors?.members || []
      : teamData.categories[selectedCategory]?.members || []
  }

  // Category config with icons and member counts
  const categories = {
    all: {
      name: 'All Contributors',
      icon: FaUsers,
      count: teamData.categories.contributors?.members.length || 0,
    },
    leads: {
      name: 'Team Leads',
      icon: FaUserTie,
      count: teamData.categories.leads?.members.length || 0,
    },
    developers: {
      name: 'Developers',
      icon: FaCode,
      count: teamData.categories.developers?.members.length || 0,
    },
    designers: {
      name: 'Designers',
      icon: FaPalette,
      count: teamData.categories.designers?.members.length || 0,
    },
  }

  return (
    <div className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white px-4 sm:px-6 py-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-green-400 text-xs animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `2s`,
                top: '-20px',
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-10 animate-grid-move"></div>
        <div className="absolute inset-0 bg-hexagon-pattern bg-[length:100px_100px] opacity-5 animate-pulse"></div>
        <div className="absolute inset-0">
          <svg width="100%" height="100%" className="opacity-10">
            <path
              d="M0,100 Q200,50 400,150 T800,50 T1200,200 T1600,0"
              stroke="cyan"
              strokeWidth="2"
              fill="none"
              strokeDasharray="10,10"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="20"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
            <div className="absolute w-20 h-20 border-2 border-cyan-500/30 rounded-lg animate-float-1"></div>
            <div className="absolute w-16 h-16 border-2 border-purple-500/30 rounded-full right-20 top-1/4 animate-float-2"></div>
            <div className="absolute w-24 h-24 border-2 border-green-500/20 rotate-45 bottom-1/3 left-1/4 animate-float-3"></div>
            <div className="absolute w-72 h-72 bg-red-600/10 rounded-full blur-xl animate-pulse-slow top-10 left-10"></div>
            <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-xl animate-pulse-slow-delayed bottom-20 right-10"></div>
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl sm:text-6xl font-bold mb-4 text-white"
            style={{ fontFamily: 'Goldman, sans-serif' }}
          >
            Development Team
          </h1>
          <p className="text-lg sm:text-xl text-cyan-300 max-w-3xl mx-auto">
            The talented individuals who design, develop, and maintain the CSS
            website and digital presence
          </p>
        </div>

        {/* Top Section: Text + Image */}
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-10 mb-12 md:mb-16 p-6 md:p-8 bg-black/90 rounded-xl md:rounded-2xl backdrop-blur-lg border border-cyan-500/20 relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-hexagon-pattern-black bg-[length:60px_60px] md:bg-[length:80px_80px] opacity-20"></div>
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
          <div className="absolute inset-0 overflow-hidden opacity-20 md:opacity-30">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute text-cyan-400 text-xs font-mono opacity-70 animate-matrix-rain"
                style={{
                  left: `${i * 12}%`,
                  animationDelay: `${i * 0.7}s`,
                  top: '-5%',
                }}
              >
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping shadow-lg shadow-cyan-400/50 hidden sm:block"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-1000 shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-1500 shadow-lg shadow-cyan-400/50 hidden sm:block"></div>
          <div className="absolute inset-0 border border-cyan-500/10 md:border-2 rounded-xl md:rounded-2xl pointer-events-none">
            <div className="absolute -top-0.5 -left-0.5 w-2 h-2 md:w-3 md:h-3 border-t border-l md:border-t-2 md:border-l-2 border-cyan-400"></div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 border-t border-r md:border-t-2 md:border-r-2 border-cyan-400"></div>
            <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 md:w-3 md:h-3 border-b border-l md:border-b-2 md:border-l-2 border-cyan-400"></div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 border-b border-r md:border-b-2 md:border-r-2 border-cyan-400"></div>
          </div>
          <div className="flex-1 relative order-2 lg:order-1">
            <div className="absolute -left-3 md:-left-4 top-3 w-1.5 md:w-2 h-12 md:h-16 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full shadow-lg shadow-cyan-400/30"></div>
            <div className="relative pl-4 md:pl-6">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full mr-2 shadow-lg shadow-red-500/40"></div>
                <span className="text-cyan-400 font-mono text-xs md:text-sm">
                  SYSTEM_TERMINAL
                </span>
              </div>
              <p className="text-gray-200 text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl font-mono">
                <span className="text-cyan-400">$~ </span>
                Our development team combines technical expertise with creative
                vision to build innovative digital experiences. Each member
                brings unique skills that contribute to our society's
                technological advancement.
              </p>
              <div className="flex items-center mt-3 md:mt-4">
                <span className="text-cyan-400 font-mono text-sm md:text-base mr-2">
                  $~
                </span>
                <div className="w-1.5 h-4 md:w-2 md:h-5 bg-cyan-400 animate-blink"></div>
              </div>
              <div className="flex flex-wrap mt-4 md:mt-6 gap-3 md:gap-6">
                <div className="flex items-center bg-black/50 p-1.5 md:p-2 rounded border border-cyan-500/20">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-1.5 md:mr-2 animate-pulse shadow-lg shadow-green-500/40"></div>
                  <span className="text-cyan-300 font-mono text-xs md:text-sm">
                    ACTIVE_DEV
                  </span>
                </div>
                <div className="flex items-center bg-black/50 p-1.5 md:p-2 rounded border border-cyan-500/20">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full mr-1.5 md:mr-2 animate-pulse delay-1000 shadow-lg shadow-blue-500/40"></div>
                  <span className="text-cyan-300 font-mono text-xs md:text-sm">
                    CODE_INNOVATION
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center order-1 lg:order-2 mb-6 lg:mb-0">
            <div className="relative w-full max-w-xs md:max-w-md">
              <div className="absolute -inset-2 md:-inset-4 bg-cyan-500/10 rounded-2xl md:rounded-3xl blur-lg md:blur-xl"></div>
              <div className="relative overflow-hidden rounded-lg md:rounded-xl border border-cyan-500/30 group bg-black/50">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
                <img
                  src="images/developers.png"
                  alt="Development team"
                  className="relative w-full transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute w-full h-0.5 md:h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/3 animate-scan opacity-80 shadow-lg shadow-cyan-400/50"></div>
                <div className="absolute top-1.5 left-1.5 w-3 h-3 md:w-4 md:h-4 border-t border-l md:border-t-2 md:border-l-2 border-cyan-400 opacity-80"></div>
                <div className="absolute top-1.5 right-1.5 w-3 h-3 md:w-4 md:h-4 border-t border-r md:border-t-2 md:border-r-2 border-cyan-400 opacity-80"></div>
                <div className="absolute bottom-1.5 left-1.5 w-3 h-3 md:w-4 md:h-4 border-b border-l md:border-b-2 md:border-l-2 border-cyan-400 opacity-80"></div>
                <div className="absolute bottom-1.5 right-1.5 w-3 h-3 md:w-4 md:h-4 border-b border-r md:border-b-2 md:border-r-2 border-cyan-400 opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300 font-mono text-xs md:text-sm">
                      DEV_TEAM_IMG
                    </span>
                    <span className="text-cyan-300 font-mono text-xs md:text-sm">
                      100%
                    </span>
                  </div>
                  <div className="w-full bg-cyan-900/30 h-0.5 md:h-1 mt-1 rounded-full">
                    <div className="w-full h-full bg-cyan-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 md:w-6 md:h-6 bg-cyan-500/30 rounded-full border border-cyan-400/50 animate-float-1 shadow-lg shadow-cyan-400/30 hidden sm:block"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 md:w-5 md:h-5 bg-purple-500/30 rounded-full border border-purple-400/50 animate-float-2 shadow-lg shadow-purple-400/30 hidden sm:block"></div>
            </div>
          </div>
        </div>

        {/* Category Tabs Section */}
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between mt-10 mb-12 p-6 bg-black/60 rounded-xl border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>
            <div className="relative mb-6 lg:mb-0 lg:mr-8">
              <div className="flex items-center">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent">
                  Filter by Role
                </h2>
                <div className="ml-4 w-1 h-8 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full"></div>
              </div>
              <p className="text-cyan-300/80 text-sm mt-2 font-mono ml-6">
                SELECT_TEAM_CATEGORY
              </p>
            </div>
            <div className="relative flex flex-wrap justify-center gap-2 p-4 rounded-lg bg-black/40 border border-cyan-500/20">
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400 opacity-70"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400 opacity-70"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400 opacity-70"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400 opacity-70"></div>
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`relative px-4 sm:px-5 py-2 font-mono font-bold tracking-wider transition-all duration-300 flex items-center
                    ${
                      selectedCategory === key
                        ? 'bg-gradient-to-r from-cyan-900/70 to-cyan-700/70 text-cyan-300 border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.7)]'
                        : 'bg-gray-900/60 text-gray-300 border border-gray-700 hover:border-cyan-500 hover:text-cyan-300 hover:shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    } 
                    rounded-md overflow-hidden group`}
                >
                  {React.createElement(category.icon, { className: 'mr-2' })}
                  {selectedCategory === key && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                  )}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-cyan-400/0 group-hover:from-cyan-500/10 group-hover:to-cyan-400/10 transition-all duration-300 rounded-md ${
                      selectedCategory === key
                        ? 'from-cyan-500/20 to-cyan-400/20'
                        : ''
                    }`}
                  ></div>
                  <span
                    className={`relative z-10 ${selectedCategory === key ? 'drop-shadow-[0_0_4px_rgba(6,182,212,0.8)]' : ''}`}
                  >
                    {category.name} ({category.count})
                  </span>
                  {selectedCategory === key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Team Members Section */}
          <div className="relative mt-12">
            <h2 className="text-3xl sm:text-4xl mb-8 font-semibold text-left border-l-4 border-cyan-500 pl-4 text-cyan-300 flex items-center">
              {React.createElement(categories[selectedCategory].icon, {
                className: 'mr-3',
              })}
              {categories[selectedCategory].name} ({getCurrentMembers().length})
            </h2>
            <Carousel className="w-full" key={selectedCategory}>
              {getCurrentMembers().map((member, index) => (
                <MemberCard
                  key={`${selectedCategory}-${index}`}
                  member={member}
                  index={index}
                />
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Developers
