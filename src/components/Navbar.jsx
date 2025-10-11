import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import {
  FaHome,
  FaCode,
  FaUsers,
  FaCalendarAlt,
  FaFeatherAlt,
  FaNewspaper,
  FaSignInAlt,
} from 'react-icons/fa'

const menuItems = [
  { path: '/', label: 'Home', icon: FaHome },
  { path: '/developers', label: 'Developers', icon: FaCode },
  { path: '/members', label: 'Members', icon: FaUsers },
  { path: '/events', label: 'Events', icon: FaCalendarAlt },
  { path: '/wings', label: 'Wings', icon: FaFeatherAlt },
  { path: '/editorials', label: 'Editorials', icon: FaNewspaper },
  { path: '/login', label: 'Login', icon: FaSignInAlt },
]

export const NavbarDemo = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const variants = {
    inactive: {
      background: 'transparent',
      boxShadow: 'none',
      color: '#ccd6f6',
      scale: 1,
    },
    active: {
      background: 'linear-gradient(to right, #0a192f, #112240)',
      boxShadow: '0 0 15px rgba(100, 255, 218, 0.5)',
      color: '#64ffda',
      transition: { duration: 0.3 },
    },
    loginHover: {
      scale: 1.1,
      boxShadow: '0 0 25px rgba(100, 255, 218, 0.9)',
      transition: { duration: 0.2, yoyo: Infinity },
    },
  }

  return (
    <nav className="bg-[linear-gradient(to_right,#0a192f,#112240)] text-[#ccd6f6] sticky top-0 z-50 shadow-[0_0_15px_rgba(100,255,218,0.3)] backdrop-blur-lg bg-opacity-95 font-['Rajdhani',_sans-serif]  clip-path-[inset(0_0_10px_0_round_24px)]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Background tech effects */}
        <div className="absolute inset-0 bg-circuit-pattern opacity-25 pointer-events-none rounded-b-3xl"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-[#64ffda] text-xs opacity-25 animate-matrix-rain"
              style={{
                left: `${i * 8.33}%`,
                animationDelay: `${i * 0.25}s`,
                top: '-10%',
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>
        <svg
          className="absolute inset-0 opacity-20 pointer-events-none"
          width="100%"
          height="100%"
        >
          <path
            d="M0,10 H1200 M0,20 H1200 M0,40 H1200 M0,50 H1200"
            stroke="url(#circuitGradient)"
            strokeWidth="0.8"
            strokeDasharray="4,4"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="8"
              dur="1.5s"
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
              <stop offset="0%" stopColor="#64ffda" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#8892b0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#64ffda" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#64ffda] opacity-80"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#64ffda] opacity-80"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#64ffda] opacity-80"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#64ffda] opacity-80"></div>

        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center relative">
            <motion.span
              className="text-3xl font-bold text-[#ccd6f6] text-shadow-[0_0_15px_#64ffda]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              CSS
            </motion.span>
            <div className="absolute -bottom-1 w-full h-1 bg-gradient-to-r from-[#64ffda] to-[#64ffda] animate-holographic rounded-b-md opacity-60"></div>
            <div className="absolute -top-2 -right-2 w-2 h-2 bg-[#64ffda] rounded-full animate-ping shadow-[0_0_15px_#64ffda]"></div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 relative">
            {menuItems.map((item, index) => (
              <Link to={item.path} key={item.path}>
                <motion.div
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group flex items-center gap-2 ${
                    item.label === 'Login'
                      ? 'bg-[#64ffda]/20 border-2 border-[#64ffda] shadow-[0_0_20px_rgba(100,255,218,0.9)] text-[#64ffda] px-5 py-2.5'
                      : location.pathname === item.path
                        ? 'text-[#64ffda] border border-[#64ffda] shadow-[0_0_15px_rgba(100,255,218,0.8)]'
                        : 'text-[#ccd6f6] border border-[#64ffda]/30 hover:shadow-[0_0_10px_rgba(100,255,218,0.6)]'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  variants={variants}
                  variant={
                    location.pathname === item.path ? 'active' : 'inactive'
                  }
                  whileHover={
                    item.label === 'Login' ? 'loginHover' : { scale: 1.05 }
                  }
                >
                  <item.icon className="text-lg" />
                  <span className="relative z-10">{item.label}</span>
                  {location.pathname === item.path && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-1 bg-[#64ffda] rounded-b-md filter blur-[1px] shadow-[0_0_5px_#64ffda]"
                      layoutId="active-tab-underline"
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      }}
                    />
                  )}
                  <div
                    className={`absolute inset-0 bg-[#64ffda]/0 group-hover:bg-[#64ffda]/10 transition-all duration-300 rounded-lg ${
                      location.pathname === item.path && item.label !== 'Login'
                        ? 'bg-[#64ffda]/20'
                        : ''
                    } ${item.label === 'Login' ? 'bg-[#64ffda]/20' : ''}`}
                  ></div>
                  <div
                    className={`absolute top-1 right-1 w-1.5 h-1.5 bg-[#64ffda] rounded-full animate-pulse transition-opacity ${
                      location.pathname === item.path || item.label === 'Login'
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                  ></div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full bg-[#112240]/60 border border-[#64ffda]/50 hover:bg-[#112240]/80 hover:border-[#64ffda] transition-all duration-300 relative"
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="h-6 w-6 text-[#64ffda]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                />
              </svg>
              <div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-t border-l border-[#64ffda]"></div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 border-t border-r border-[#64ffda]"></div>
              <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 border-b border-l border-[#64ffda]"></div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-b border-r border-[#64ffda]"></div>
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#64ffda] rounded-full animate-pulse"></div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-[linear-gradient(to_bottom,#0a192f,#112240)] absolute top-16 left-0 w-full border-t border-[#64ffda]/40 shadow-[0_0_15px_rgba(100,255,218,0.3)] backdrop-blur-lg bg-opacity-95 rounded-b-2xl"
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
          >
            <div className="relative px-4 pt-4 pb-6 space-y-2">
              <div className="absolute inset-0 bg-circuit-pattern opacity-25 rounded-b-2xl"></div>
              {menuItems.map((item, index) => (
                <Link
                  to={item.path}
                  key={item.path}
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    className={`relative block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 group flex items-center gap-2 ${
                      item.label === 'Login'
                        ? 'bg-[#64ffda]/20 border-2 border-[#64ffda] shadow-[0_0_20px_rgba(100,255,218,0.9)] text-[#64ffda] px-5 py-3.5'
                        : location.pathname === item.path
                          ? 'text-[#64ffda] border border-[#64ffda] shadow-[0_0_15px_rgba(100,255,218,0.8)]'
                          : 'text-[#ccd6f6] hover:shadow-[0_0_10px_rgba(100,255,218,0.6)]'
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    variants={variants}
                    variant={
                      location.pathname === item.path ? 'active' : 'inactive'
                    }
                    whileHover={
                      item.label === 'Login' ? 'loginHover' : { scale: 1.05 }
                    }
                  >
                    <item.icon className="text-lg" />
                    <span className="relative z-10">{item.label}</span>
                    {location.pathname === item.path && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-1 bg-[#64ffda] rounded-b-md filter blur-[1px] shadow-[0_0_5px_#64ffda]"
                        layoutId="active-tab-underline-mobile"
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 25,
                        }}
                      />
                    )}
                    <div
                      className={`absolute inset-0 bg-[#64ffda]/0 group-hover:bg-[#64ffda]/10 transition-all duration-300 rounded-lg ${
                        location.pathname === item.path &&
                        item.label !== 'Login'
                          ? 'bg-[#64ffda]/20'
                          : ''
                      } ${item.label === 'Login' ? 'bg-[#64ffda]/20' : ''}`}
                    ></div>
                    <div
                      className={`absolute top-1 right-1 w-1.5 h-1.5 bg-[#64ffda] rounded-full animate-pulse transition-opacity ${
                        location.pathname === item.path ||
                        item.label === 'Login'
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                    ></div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
