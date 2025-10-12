import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaSignInAlt } from 'react-icons/fa'

const menuItems = [
  { path: '/', label: 'Home' },
  { path: '/developers', label: 'Developers' },
  { path: '/members', label: 'Members' },
  { path: '/events', label: 'Events' },
  { path: '/wings', label: 'Wings' },
  { path: '/chat', label: 'Chat' },
  { path: '/materials', label: 'Materials' },
]

export const NavbarDemo = () => {
  const [isOpen, setIsOpen] = useState(false)
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

  return (
    <nav className="bg-[linear-gradient(to_right,#0a192f,#112240)] text-[#ccd6f6] sticky top-0 z-50 shadow-[0_0_15px_rgba(100,255,218,0.3)] backdrop-blur-lg bg-opacity-95 font-['Rajdhani',_sans-serif] clip-path-[inset(0_0_10px_0_round_24px)]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#64ffda] opacity-80"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#64ffda] opacity-80"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#64ffda] opacity-80"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#64ffda] opacity-80"></div>

        <div className="flex justify-between items-center h-16">
          {/* Logo - Left on desktop, centered on mobile */}
          <div className="hidden md:flex items-center relative md:flex-1">
            <motion.span
              className="text-3xl font-bold text-[#ccd6f6] text-shadow-[0_0_15px_#64ffda]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="https://res.cloudinary.com/dp4sknsba/image/upload/v1760078712/Untitled_design_xzhopc.svg" 
                alt="CSS Logo" 
                className="mt-2 w-auto md:h-21" // Adjusted height for mobile
              />
            </motion.span>
            <div className="absolute -top-2 -right-2 w-2 h-2 bg-[#64ffda] rounded-full animate-ping shadow-[0_0_15px_#64ffda]"></div>
          </div>

          {/* Desktop Menu - Center */}
          <div className="hidden md:flex items-center space-x-6 relative">
            {menuItems.map((item, index) => (
              <Link to={item.path} key={item.path}>
                <motion.div
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group ${
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
                      location.pathname === item.path
                        ? 'bg-[#64ffda]/20'
                        : ''
                    }`}
                  ></div>
                  <div
                    className={`absolute top-1 right-1 w-1.5 h-1.5 bg-[#64ffda] rounded-full animate-pulse transition-opacity ${
                      location.pathname === item.path
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
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
                    className="w-8 h-8 rounded-full border border-[#64ffda]"
                  />
                  <span className="relative z-10">Profile</span>
                  {/* <div className="absolute inset-0 bg-[#64ffda]/20 rounded-lg"></div> */}
                  {/* <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#64ffda] rounded-full animate-pulse opacity-100"></div> */}
                </motion.div>
              </Link>
            ) : (
              <Link to="/auth">
                <motion.div
                  className="relative px-4 text-sm font-medium rounded-lg transition-all duration-300 group flex items-center gap-2 bg-[#64ffda]/20 border-2 border-[#64ffda] shadow-[0_0_20px_rgba(100,255,218,0.9)] text-[#64ffda] py-2.5"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  variants={variants}
                  whileHover="authHover"
                >
                  <FaSignInAlt className="text-lg" />
                  <span className="relative z-10">Auth</span>
                  <div className="absolute inset-0 bg-[#64ffda]/20 rounded-lg"></div>
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#64ffda] rounded-full animate-pulse opacity-100"></div>
                </motion.div>
              </Link>
            )} 
          </div>

          {/* Mobile Layout - Menu left, Logo center, Auth right */}
          <div className="flex md:hidden items-center justify-between w-full">
            {/* Mobile Menu Button - Left */}
            <div className="flex items-center">
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
                {/* <div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-t border-l border-[#64ffda]"></div>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 border-t border-r border-[#64ffda]"></div>
                <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 border-b border-l border-[#64ffda]"></div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-b border-r border-[#64ffda]"></div>
                <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#64ffda] rounded-full animate-pulse"></div> */}
              </motion.button>
            </div>

            {/* Mobile Logo - Center */}
            <div className="flex items-center absolute left-1/2 transform -translate-x-1/2">
              <motion.span
                className="text-3xl font-bold text-[#ccd6f6] text-shadow-[0_0_15px_#64ffda]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src="https://res.cloudinary.com/dp4sknsba/image/upload/v1760078712/Untitled_design_xzhopc.svg" 
                  alt="CSS Logo" 
                  className="mt-1 h-22 w-auto"
                />
              </motion.span>
            </div>

            {/* Mobile Profile/Auth - Right */}
            <div className="flex items-center">
              {user ? (
                <Link to="/dashboard">
                  <motion.div
                    // className="relative p-2 rounded-lg transition-all duration-300 group bg-[#64ffda]/20 border-2  shadow-[0_0_15px_rgba(100,255,218,0.7)]"
                    variants={variants}
                    whileHover="profileHover"
                  >
                    <img
                      src={profile?.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.email}`}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border border-[#64ffda]"
                    />
                    {/* <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#64ffda] rounded-full animate-pulse opacity-100"></div> */}
                  </motion.div>
                </Link>
              ) : (
                <Link to="/auth">
                  <motion.div
                    className="relative p-2 rounded-lg transition-all duration-300 group bg-[#64ffda]/20 border-2 border-[#64ffda] shadow-[0_0_15px_rgba(100,255,218,0.7)]"
                    variants={variants}
                    whileHover="authHover"
                  >
                    <FaSignInAlt className="text-lg text-[#64ffda]" />
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#64ffda] rounded-full animate-pulse opacity-100"></div>
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
                    className={`relative px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 group ${
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
                    whileHover={{ scale: 1.05 }}
                  >
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
                        location.pathname === item.path
                          ? 'bg-[#64ffda]/20'
                          : ''
                      }`}
                    ></div>
                    <div
                      className={`absolute top-1 right-1 w-1.5 h-1.5 bg-[#64ffda] rounded-full animate-pulse transition-opacity ${
                        location.pathname === item.path
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