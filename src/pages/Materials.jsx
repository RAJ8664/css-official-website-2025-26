import React from 'react';
import { FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa';

const Materials = () => {
  return (
    <div className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white px-6 py-10 overflow-hidden">
      

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 mt-8">
          <h1
            className="text-6xl font-bold mb-4 text-white"
            style={{ fontFamily: 'Goldman, sans-serif' }}
          >
            Study Materials
          </h1>
          <p className="text-xl text-gray-300 font-mono">
            <span className="text-cyan-400">$~ </span>
            Access all course materials and resources
          </p>
        </div>

        {/* Main Content Card */}
        <div className="flex flex-col items-center gap-8 p-8 bg-black/90 rounded-2xl backdrop-blur-lg border border-cyan-500/20 relative z-10 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-hexagon-pattern-black bg-[length:60px_60px] opacity-20"></div>
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-1000 shadow-lg shadow-cyan-400/50"></div>
          
          {/* Corner Borders */}
          <div className="absolute inset-0 border border-cyan-500/10 rounded-2xl pointer-events-none">
            <div className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t border-l border-cyan-400"></div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t border-r border-cyan-400"></div>
            <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b border-l border-cyan-400"></div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b border-r border-cyan-400"></div>
          </div>

          {/* Icon */}
          <div className="relative">
            <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-lg"></div>
            <div className="relative w-20 h-20 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 flex items-center justify-center">
              <FaExternalLinkAlt className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          {/* Description */}
          <div className="text-center max-w-2xl">
            <h2 className="text-3xl font-bold text-cyan-400 mb-4 font-mono">
              MATERIALS_PORTAL
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6 font-mono">
              <span className="text-cyan-400">$~ </span>
              All study materials, lecture notes, assignments, and resources are available on our dedicated materials website.
            </p>
          </div>

          {/* Main Link Button */}
          <a
            href="https://cse23.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg border border-cyan-400/30 backdrop-blur-sm transition-all duration-300 hover:from-cyan-500 hover:to-purple-500 hover:border-cyan-300/50 hover:transform hover:scale-105"
          >
            <div className="absolute -inset-1 bg-cyan-500/20 rounded-lg blur-lg group-hover:bg-cyan-500/30 transition-all duration-300"></div>
            <div className="relative flex items-center justify-center space-x-3">
              <span className="text-white font-mono text-xl font-bold">
                Visit CSE23.xyz
              </span>
              <FaExternalLinkAlt className="w-5 h-5 text-white group-hover:animate-pulse" />
            </div>
          </a>

          {/* Additional Info */}
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <div className="flex items-center bg-black/50 p-3 rounded border border-cyan-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse shadow-lg shadow-green-500/40"></div>
              <span className="text-cyan-300 font-mono text-sm">LIVE_PORTAL</span>
            </div>
            <div className="flex items-center bg-black/50 p-3 rounded border border-cyan-500/20">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse delay-1000 shadow-lg shadow-blue-500/40"></div>
              <span className="text-cyan-300 font-mono text-sm">UPDATED_REGULARLY</span>
            </div>
          </div>

          {/* Terminal-style Footer */}
          <div className="mt-8 p-4 bg-black/50 rounded-lg border border-cyan-500/10 w-full max-w-md">
            <div className="flex items-center font-mono text-sm">
              <span className="text-cyan-400 mr-2">$~</span>
              <span className="text-gray-300">Redirecting to materials repository...</span>
              <div className="w-2 h-4 bg-cyan-400 animate-blink ml-2"></div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-8 text-gray-400 font-mono text-sm">
          <span className="text-cyan-400">$~ </span>
          For any issues with the materials portal, contact the technical team
        </div>
      </div>
    </div>
  );
};

export default Materials;