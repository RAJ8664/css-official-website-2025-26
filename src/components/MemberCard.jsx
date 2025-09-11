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

const defaultOptions = {
  reverse: false, // reverse the tilt direction
  max: 35, // max tilt rotation (degrees)
  perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
  scale: 1.05, // 2 = 200%, 1.5 = 150%, etc..
  speed: 1000, // Speed of the enter/exit transition
  transition: true, // Set a transition on enter/exit.
  axis: null, // What axis should be disabled. Can be X or Y.
  reset: true, // If the tilt effect has to be reset on exit.
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
        <div className="group perspective h-96 w-full" onClick={onFlip}>
          <div
            className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
              flipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden bg-gray-700 rounded-xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 group-hover:border-cyan-400/60 group-hover:shadow-cyan-400/20 transition-all duration-500">
              {/* Animated grid background */}
              <div className="absolute inset-0 bg-tech-grid opacity-10"></div>

              {/* Tech corner elements */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-500/50 opacity-70 group-hover:border-cyan-300 transition-all"></div>
              <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-500/50 opacity-70 group-hover:border-cyan-300 transition-all"></div>
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-500/50 opacity-70 group-hover:border-cyan-300 transition-all"></div>
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-500/50 opacity-70 group-hover:border-cyan-300 transition-all"></div>

              {/* Central content */}
              <div className="flex flex-col items-center justify-center h-full p-6">
                {/* Profile image */}
                <div className="relative mb-6">
                  <div className="relative w-42 h-42 rounded-full">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover border-2 border-gray-700 group-hover:border-cyan-400 transition-all duration-500"
                    />
                  </div>
                  <div className="absolute -inset-3 rounded-full bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-all"></div>
                </div>

                {/* Name and role */}
                <div className="text-center px-2">
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-cyan-300 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-xl text-gray-400 group-hover:text-cyan-200 transition-colors duration-300">
                    {member.role}
                  </p>
                </div>

                {/* Flip hint */}
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
              {/* Background */}
              <div className="absolute inset-0 bg-circuit-pattern opacity-15"></div>
              <div className="absolute inset-0 rounded-xl border-2 border-cyan-500/20 group-hover:border-cyan-400/40 transition-all"></div>

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-1 bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent">
                    {member.name}
                  </h3>
                  <p className="text-sm text-cyan-300 font-mono">
                    {member.role}
                  </p>
                </div>

                {/* Social links */}
                <div className="flex gap-4 text-2xl mb-8">
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

                {/* Flip back hint */}
                <div className="absolute bottom-5 left-0 right-0 flex justify-center">
                  <div className="flex items-center text-xs bg-black/50 px-3 py-1 rounded-full border border-cyan-500/30">
                    <span className="mr-2 text-cyan-300">View profile</span>
                    <FaArrowRight className="rotate-180 text-cyan-400" />
                  </div>
                </div>

                {/* Animated dots */}
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
