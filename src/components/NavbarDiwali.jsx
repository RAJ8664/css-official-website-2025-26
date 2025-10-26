import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaSignInAlt } from 'react-icons/fa'
import { MdAccountCircle } from "react-icons/md";

const menuItems = [
  { path: '/', label: 'Home' },
  { path: '/developers', label: 'Developers' },
  { path: '/members', label: 'Members' },
  { path: '/events', label: 'Events' },
  { path: '/wings', label: 'Wings' },
  { path: '/chat', label: 'Chat' },
  { path: '/materials', label: 'Materials' },
  { path: '/esperanza', label: 'Esperanza' }
]

// Color themes for the lights
const colorThemes = [
  { name: 'Classic', colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'] },
  { name: 'Warm', colors: ['#ff9a3c', '#ff6b6b', '#ffd93d', '#ff9a3c'] },
  { name: 'Cool', colors: ['#6a11cb', '#2575fc', '#2af598', '#08aeea'] },
  { name: 'Festive', colors: ['#ff0000', '#00ff00', '#ffff00', '#ff00ff'] },
  { name: 'Royal', colors: ['#833ab4', '#fd1d1d', '#fcb045', '#405de6'] },
]

export const NavbarDemo = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(0)
  const location = useLocation()
  const { user, profile } = useAuth()

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
    authHover: {
      scale: 1.1,
      boxShadow: '0 0 25px rgba(100, 255, 218, 0.9)',
      transition: { duration: 0.2, yoyo: Infinity },
    },
    profileHover: {
      scale: 1.05,
      boxShadow: '0 0 20px rgba(100, 255, 218, 0.7)',
      transition: { duration: 0.2 },
    },
  }

  const changeLights = () => {
    setCurrentTheme((prev) => (prev + 1) % colorThemes.length)
  }

  // Generate hanging rice lights - optimized for mobile
  const generateHangingLights = () => {
    const lights = []
    const totalLights = window.innerWidth < 768 ? 10 : 16 // Fewer lights on mobile
    const currentColors = colorThemes[currentTheme].colors
    
    for (let i = 0; i < totalLights; i++) {
      const color = currentColors[i % currentColors.length]
      const position = ((i + 0.5) / totalLights) * 100
      const delay = i * 0.15
      const size = window.innerWidth < 768 ? 4 + (Math.random() * 3) : 6 + (Math.random() * 4) // Smaller on mobile
      const hangHeight = window.innerWidth < 768 ? 6 + (Math.random() * 4) : 8 + (Math.random() * 6)
      const swingAmount = window.innerWidth < 768 ? 3 + (Math.random() * 6) : 5 + (Math.random() * 10)
      
      lights.push(
        <motion.div
          key={i}
          className="absolute flex flex-col items-center"
          style={{
            left: `${position}%`,
            top: '0%',
          }}
        >
          {/* Light string */}
          <div 
            className="w-px bg-gradient-to-b from-[#64ffda]/50 to-transparent"
            style={{ height: `${hangHeight}px` }}
          />
          
          {/* Light bulb */}
          <motion.div
            className="rounded-full relative"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: `radial-gradient(circle at 30% 30%, ${color}, ${color}dd)`,
              boxShadow: `0 0 12px ${color}, 0 0 20px ${color}80`,
              filter: 'brightness(1.2)',
            }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.9, 1.1, 0.9],
              x: [-swingAmount/2, swingAmount/2, -swingAmount/2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Light glow effect */}
            <div 
              className="absolute inset-0 rounded-full blur-[2px]"
              style={{
                background: color,
                opacity: 0.6,
              }}
            />
          </motion.div>
        </motion.div>
      )
    }
    return lights
  }

  return (
    <>
      {/* Main Navbar Container */}
      <div className="sticky top-0 z-50">
        {/* Navbar */}
        <nav className="bg-[linear-gradient(to_right,#0a192f,#112240)] text-[#ccd6f6] shadow-[0_0_15px_rgba(100,255,218,0.3)] backdrop-blur-lg bg-opacity-95 font-['Rajdhani',_sans-serif]">
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            {/* Corner accents - hidden on mobile */}
            <div className="hidden sm:block absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-[#64ffda] opacity-80"></div>
            <div className="hidden sm:block absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-[#64ffda] opacity-80"></div>
            <div className="hidden sm:block absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-[#64ffda] opacity-80"></div>
            <div className="hidden sm:block absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-[#64ffda] opacity-80"></div>

            <div className="flex justify-between items-center h-14 md:h-16">
              {/* Logo - Left on desktop, centered on mobile */}
              <div className="hidden md:flex items-center relative md:flex-1">
                <motion.span
                  className="text-3xl font-bold text-[#ccd6f6]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src="https://res.cloudinary.com/dp4sknsba/image/upload/v1760078712/Untitled_design_xzhopc.svg" 
                    alt="CSS Logo" 
                    className="mt-2 w-auto h-2 md:h-16"
                  />
                </motion.span>
                <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#64ffda] rounded-full animate-ping"></div>
              </div>

              {/* Desktop Menu - Center */}
              <div className="hidden md:flex items-center space-x-4 lg:space-x-6 relative">
                {menuItems.map((item, index) => (
                  <Link to={item.path} key={item.path}>
                    <motion.div
                      className={`relative px-3 lg:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group ${
                        location.pathname === item.path
                          ? 'text-[#64ffda] border border-[#64ffda] shadow-[0_0_15px_rgba(100,255,218,0.8)]'
                          : 'text-[#ccd6f6] border border-[#64ffda]/30 hover:shadow-[0_0_10px_rgba(100,255,218,0.6)]'
                      }`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      variants={variants}
                      variant={
                        location.pathname === item.path ? 'active' : 'inactive'
                      }
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="relative z-10 whitespace-nowrap">{item.label}</span>
                      {location.pathname === item.path && (
                        <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-1 bg-[#64ffda] rounded-b-md filter blur-[1px]"
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
                          location.pathname === item.path
                            ? 'bg-[#64ffda]/20'
                            : ''
                        }`}
                      ></div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Desktop Auth/Profile - Right */}
              <div className="hidden md:flex items-center space-x-4 md:flex-1 justify-end">
                {user ? (
                  <Link to="/dashboard">
                    <motion.div
                      className="relative px-3 py-1 text-sm font-medium rounded-lg transition-all duration-300 group flex items-center gap-2 bg-[#64ffda]/20 border-2 border-[#64ffda] shadow-[0_0_20px_rgba(100,255,218,0.9)] text-[#64ffda]"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      variants={variants}
                      whileHover="profileHover"
                    >
                      <img
                        src={profile?.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.email}`}
                        alt="Profile"
                        className="w-7 h-7 rounded-full border border-[#64ffda]"
                      />
                      <span className="relative z-10 hidden lg:inline">Profile</span>
                    </motion.div>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <motion.div
                      className="relative px-3 lg:px-4 text-sm font-medium rounded-lg transition-all duration-300 group flex items-center gap-2 bg-[#64ffda]/20 border-2 border-[#64ffda] shadow-[0_0_20px_rgba(100,255,218,0.9)] text-[#64ffda] py-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      variants={variants}
                      whileHover="authHover"
                    >
                      <FaSignInAlt className="text-base lg:text-lg" />
                      <span className="relative z-10 hidden lg:inline">Auth</span>
                    </motion.div>
                  </Link>
                )} 
              </div>

              {/* Mobile Layout */}
              <div className="flex md:hidden items-center justify-between w-full">
                {/* Mobile Menu Button - Left */}
                <div className="flex items-center">
                  <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-full bg-[#112240]/60 border border-[#64ffda]/50 hover:bg-[#112240]/80 hover:border-[#64ffda] transition-all duration-300 relative"
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      className="h-5 w-5 text-[#64ffda]"
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
                  </motion.button>
                </div>

                {/* Mobile Logo - Center */}
                <div className="flex items-center absolute left-1/2 transform -translate-x-1/2">
                  <motion.span
                    className="text-2xl font-bold text-[#ccd6f6]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img 
                      src="https://res.cloudinary.com/dp4sknsba/image/upload/v1760078712/Untitled_design_xzhopc.svg" 
                      alt="CSS Logo" 
                      className="h-18 w-auto"
                    />
                  </motion.span>
                </div>

                {/* Mobile Profile/Auth - Right */}
                <div className="flex items-center">
                  {user ? (
                    <Link to="/dashboard">
                      <motion.div
                        variants={variants}
                        whileHover="profileHover"
                      >
                        <img
                          src={profile?.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.email}`}
                          alt="Profile"
                          className="w-8 h-8 rounded-full border border-[#64ffda]"
                        />
                      </motion.div>
                    </Link>
                  ) : (
                    <Link to="/auth">
                      <motion.div
                        className="relative p-2 rounded-lg transition-all duration-300 group bg-[#64ffda]/20 border-2 border-[#64ffda] shadow-[0_0_15px_rgba(100,255,218,0.7)]"
                        variants={variants}
                        whileHover="authHover"
                      >
                        <MdAccountCircle className="text-lg size-4 text-[#64ffda]" />
                      </motion.div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="md:hidden bg-[linear-gradient(to_bottom,#0a192f,#112240)] absolute top-14 left-0 w-full border-t border-[#64ffda]/40 shadow-[0_0_15px_rgba(100,255,218,0.3)] backdrop-blur-lg bg-opacity-95"
                initial={{ y: '-100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              >
                <div className="relative px-3 pt-3 pb-4 space-y-2">
                  <div className="absolute inset-0 bg-circuit-pattern opacity-25"></div>
                  {menuItems.map((item, index) => (
                    <Link
                      to={item.path}
                      key={item.path}
                      onClick={() => setIsOpen(false)}
                    >
                      <motion.div
                        className={`relative px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 group ${
                          location.pathname === item.path
                            ? 'text-[#64ffda] border border-[#64ffda] shadow-[0_0_15px_rgba(100,255,218,0.8)]'
                            : 'text-[#ccd6f6] hover:shadow-[0_0_10px_rgba(100,255,218,0.6)]'
                        }`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        variants={variants}
                        variant={
                          location.pathname === item.path ? 'active' : 'inactive'
                        }
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="relative z-10">{item.label}</span>
                        {location.pathname === item.path && (
                          <motion.div
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#64ffda] rounded-b-md filter blur-[1px]"
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
                            location.pathname === item.path
                              ? 'bg-[#64ffda]/20'
                              : ''
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

        {/* Hanging Rice Lights Container - Optimized for mobile */}
        <div className="relative w-full h-6 md:h-8 bg-gradient-to-b from-[#0a192f]/80 to-transparent">
          {/* Main light string line */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#64ffda]/40 to-transparent shadow-[0_0_8px_rgba(100,255,218,0.3)]"></div>
          
          {/* Hanging Lights */}
          {generateHangingLights()}
          
          {/* Change Lights Button - Positioned below the lights on the right side */}
          <motion.button
            onClick={changeLights}
            className="absolute right-2 md:right-4 top-full mt-1 px-2 py-1 text-[10px] md:text-xs font-bold rounded-full bg-[#0a192f] border border-[#64ffda] text-[#64ffda] shadow-lg hover:shadow-[#64ffda]/50 transition-all duration-300 z-10 flex items-center gap-1 backdrop-blur-sm"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(100, 255, 218, 0.7)' }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="inline"
            >
              ✨
            </motion.span>
            <span className="whitespace-nowrap">Change Colours</span>
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline"
            >
              🪔
            </motion.span>
          </motion.button>
        </div>
      </div>
    </>
  )
}