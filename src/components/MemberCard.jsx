import React from 'react'
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaArrowRight,
} from 'react-icons/fa'
import { Tilt } from 'react-tilt'
import { motion } from 'framer-motion'
import { fadeIn } from '../utils/motion'
import '../styles/memberAnimations.css' // Make sure you have this file

const defaultOptions = {
  reverse: false,
  max: 35,
  perspective: 1000,
  scale: 1.05,
  speed: 1000,
  transition: true,
  axis: null,
  reset: true,
  easing: 'cubic-bezier(.03,.98,.52,.99)',
}

const MemberCard = ({ member, flipped, onFlip, index }) => {
  return (
    <Tilt options={defaultOptions}>
      <motion.div
        variants={fadeIn('right', 'spring', index * 0.5, 0.75)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div
          className="group perspective h-96 w-full max-w-[320px] mx-auto"
          onClick={onFlip}
        >
          <div
            className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
              flipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 group-hover:border-cyan-400/60 group-hover:shadow-cyan-400/20 transition-all duration-500 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
              {/* Tech grid overlay */}
              <div className="absolute inset-0 bg-tech-grid opacity-20 mix-blend-overlay animate-pulse-slow"></div>
              {/* Neon glowing corners */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60 opacity-80 rounded-sm glow"></div>
              <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60 opacity-80 rounded-sm glow"></div>
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60 opacity-80 rounded-sm glow"></div>
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60 opacity-80 rounded-sm glow"></div>

              <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="relative mb-6">
                  <div className="relative w-48 h-48 rounded-full border-2 border-gray-700 group-hover:border-cyan-400 transition-all duration-500 overflow-hidden">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                    {/* Neon ring behind photo */}
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400 opacity-30 animate-ping-slow"></div>
                  </div>
                </div>
                <div className="text-center px-4 overflow-hidden">
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-white group-hover:text-cyan-300 transition-colors duration-300 truncate">
                    {member.name}
                  </h3>
                  <p className="text-sm md:text-base text-gray-400 group-hover:text-cyan-200 transition-colors duration-300 line-clamp-3">
                    {member.role}
                  </p>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center text-xs bg-black/70 px-3 py-1.5 rounded-full border border-cyan-500/40 group-hover:border-cyan-400/60 transition-all">
                    <span className="mr-2 text-cyan-300">View details</span>
                    <FaArrowRight className="text-cyan-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden border border-cyan-500/50 shadow-2xl shadow-cyan-500/30 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
              {/* Animated circuit pattern */}
              <div className="absolute inset-0 bg-circuit-pattern opacity-20 animate-pulse-slow"></div>
              {/* Neon border overlay */}
              <div className="absolute inset-0 rounded-xl border-2 border-cyan-400/30 group-hover:border-cyan-300 transition-all"></div>

              <div className="relative h-full flex flex-col items-center justify-center p-6">
                <div className="text-center mb-6">
                  <h3 className="text-base md:text-lg font-bold mb-1 bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent truncate">
                    {member.name}
                  </h3>
                  <p className="text-xs md:text-sm text-cyan-300 font-mono line-clamp-3">
                    {member.role}
                  </p>
                </div>
                <div className="flex gap-4 text-xl md:text-2xl mb-8">
                  <a
                    href={member.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-110 shadow-lg hover:shadow-pink-500/30 border border-gray-700 hover:border-pink-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaInstagram className="text-white" />
                  </a>
                  <a
                    href={member.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full hover:bg-blue-600 transition-all transform hover:scale-110 shadow-lg hover:shadow-blue-500/30 border border-gray-700 hover:border-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaFacebook className="text-white" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full hover:bg-blue-700 transition-all transform hover:scale-110 shadow-lg hover:shadow-blue-500/30 border border-gray-700 hover:border-blue-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaLinkedin className="text-white" />
                  </a>
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
      </motion.div>
    </Tilt>
  )
}

export default MemberCard
