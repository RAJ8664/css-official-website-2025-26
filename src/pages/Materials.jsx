import React from 'react'
import { FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa'

const Materials = () => {
    return (
        <div className='relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white px-4 py-6 overflow-hidden'>
            <div className='relative max-w-4xl mx-auto'>
                {/* Header */}
                <div className='text-center mb-10 mt-4'>
                    <h1
                        className='text-4xl md:text-6xl font-bold mb-3 text-white'
                        style={{ fontFamily: 'Goldman, sans-serif' }}
                    >
                        Study Materials
                    </h1>
                    <p className='text-base md:text-xl text-gray-300 font-mono px-2'>
                        <span className='text-cyan-400'>$~ </span>
                        Access all course materials and resources
                    </p>
                </div>

                {/* Main Content Card */}
                <div className='flex flex-col items-center gap-6 p-4 md:p-8 bg-black/90 rounded-2xl backdrop-blur-lg border border-cyan-500/20 relative z-10 overflow-hidden'>
                    {/* Background Effects */}
                    <div className='absolute inset-0 bg-hexagon-pattern-black bg-[length:40px_40px] md:bg-[length:60px_60px] opacity-20'></div>
                    <div className='absolute top-1/4 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping shadow-lg shadow-cyan-400/50'></div>
                    <div className='absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-1000 shadow-lg shadow-cyan-400/50'></div>

                    {/* Corner Borders */}
                    <div className='absolute inset-0 border border-cyan-500/10 rounded-2xl pointer-events-none'>
                        <div className='absolute -top-0.5 -left-0.5 w-3 h-3 border-t border-l border-cyan-400'></div>
                        <div className='absolute -top-0.5 -right-0.5 w-3 h-3 border-t border-r border-cyan-400'></div>
                        <div className='absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b border-l border-cyan-400'></div>
                        <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b border-r border-cyan-400'></div>
                    </div>

                    {/* Icon */}
                    <div className='relative'>
                        <div className='absolute -inset-3 md:-inset-4 bg-cyan-500/20 rounded-full blur-lg'></div>
                        <div className='relative w-16 h-16 md:w-20 md:h-20 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 flex items-center justify-center'>
                            <FaExternalLinkAlt className='w-6 h-6 md:w-8 md:h-8 text-cyan-400' />
                        </div>
                    </div>

                    {/* Description */}
                    <div className='text-center max-w-2xl px-2'>
                        <h2 className='text-2xl md:text-3xl font-bold text-cyan-400 mb-3 font-mono'>
                            MATERIALS_PORTAL
                        </h2>
                        <p className='text-gray-300 text-base md:text-lg leading-relaxed mb-4 font-mono'>
                            <span className='text-cyan-400'>$~ </span>
                            All study materials, lecture notes, assignments, and resources are
                            available on our dedicated materials website.
                        </p>
                    </div>

                    {/* Main Link Button - Mobile Optimized */}

                    <a
                        href='https://raj8664.github.io/Prep/'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='group relative w-full max-w-sm px-6 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg border border-cyan-400/30 backdrop-blur-sm transition-all duration-300 hover:from-cyan-500 hover:to-purple-500 hover:border-cyan-300/50 active:scale-95 touch-manipulation'
                    >
                        <div className='absolute -inset-1 bg-cyan-500/20 rounded-lg blur-lg group-hover:bg-cyan-500/30 transition-all duration-300'></div>
                        <div className='relative flex items-center justify-center space-x-3'>
                            <span className='text-white font-mono text-lg md:text-xl font-bold text-center'>
                                Visit Prep
                            </span>
                            <FaExternalLinkAlt className='w-4 h-4 md:w-5 md:h-5 text-white group-hover:animate-pulse flex-shrink-0' />
                        </div>
                    </a>

                    <a
                        href='https://cse23.xyz'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='group relative w-full max-w-sm px-6 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg border border-cyan-400/30 backdrop-blur-sm transition-all duration-300 hover:from-cyan-500 hover:to-purple-500 hover:border-cyan-300/50 active:scale-95 touch-manipulation'
                    >
                        <div className='absolute -inset-1 bg-cyan-500/20 rounded-lg blur-lg group-hover:bg-cyan-500/30 transition-all duration-300'></div>
                        <div className='relative flex items-center justify-center space-x-3'>
                            <span className='text-white font-mono text-lg md:text-xl font-bold text-center'>
                                Visit CSE23.xyz
                            </span>
                            <FaExternalLinkAlt className='w-4 h-4 md:w-5 md:h-5 text-white group-hover:animate-pulse flex-shrink-0' />
                        </div>
                    </a>

                    {/* Additional Info - Stack on mobile */}
                    <div className='flex flex-col sm:flex-row justify-center gap-3 mt-4 w-full max-w-sm'>
                        <div className='flex items-center justify-center bg-black/50 p-3 rounded border border-cyan-500/20 flex-1 min-w-0'>
                            <div className='w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse shadow-lg shadow-green-500/40 flex-shrink-0'></div>
                            <span className='text-cyan-300 font-mono text-xs md:text-sm truncate'>
                                LIVE_PORTAL
                            </span>
                        </div>
                        <div className='flex items-center justify-center bg-black/50 p-3 rounded border border-cyan-500/20 flex-1 min-w-0'>
                            <div className='w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse delay-1000 shadow-lg shadow-blue-500/40 flex-shrink-0'></div>
                            <span className='text-cyan-300 font-mono text-xs md:text-sm truncate'>
                                UPDATED_REGULARLY
                            </span>
                        </div>
                    </div>

                    {/* Terminal-style Footer */}
                    <div className='mt-6 p-3 md:p-4 bg-black/50 rounded-lg border border-cyan-500/10 w-full max-w-sm'>
                        <div className='flex items-center font-mono text-xs md:text-sm'>
                            <span className='text-cyan-400 mr-2'>$~</span>
                            <span className='text-gray-300 truncate'>
                                Redirecting to materials repository...
                            </span>
                            <div className='w-2 h-3 md:h-4 bg-cyan-400 animate-blink ml-2 flex-shrink-0'></div>
                        </div>
                    </div>
                </div>

                {/* Bottom Info */}
                <div className='text-center mt-6 text-gray-400 font-mono text-xs md:text-sm px-2'>
                    <span className='text-cyan-400'>$~ </span>
                    For any issues with the materials portal, contact the technical team
                </div>
            </div>
        </div>
    )
}

export default Materials
