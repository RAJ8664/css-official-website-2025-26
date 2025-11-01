import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const SponsorPopup = ({ isOpen, onClose, sponsorData }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      
      // Entrance animation
      const tl = gsap.timeline();
      tl.fromTo(popupRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
      );

      // Handle escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    const tl = gsap.timeline();
    tl.to(popupRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: "back.in(1.2)",
      onComplete: onClose
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={popupRef}
        className="relative max-w-2xl w-full mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-10 -right-2 md:-top-12 md:-right-4 z-20 bg-black/80 hover:bg-red-500/90 text-white rounded-full p-2 transition-all duration-200 transform hover:scale-110 border border-white/20"
          aria-label="Close popup"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Sponsor Poster Container */}
        <div className="relative bg-gradient-to-br from-cyan-900/20 to-purple-900/20 rounded-xl md:rounded-2xl border border-cyan-500/30 p-3 md:p-4 backdrop-blur-md shadow-2xl shadow-cyan-500/20">
          {/* Animated border effect */}
          <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-20 blur-sm"></div>
          
          {/* Sponsor Type Badge */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <span className="bg-cyan-500 text-white text-xs font-mono px-3 py-1 rounded-full border border-cyan-400/50 whitespace-nowrap">
              {sponsorData.type}
            </span>
          </div>
          
          {/* Poster Image with proper sizing */}
          <div className="relative z-10 mt-2">
            <img
              src={sponsorData.posterUrl}
              alt={`${sponsorData.name} Banner`}
              className="w-full h-auto max-h-[60vh] md:max-h-[70vh] object-contain rounded-lg md:rounded-xl shadow-lg"
            />
          </div>

          {/* Sponsor Name */}
          <div className="text-center mt-4">
            <p className="text-cyan-300 font-mono text-lg md:text-xl font-bold">
              {sponsorData.name}
            </p>
          </div>

          {/* Single Action Button */}
          {/* <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                window.open(sponsorData.websiteUrl, '_blank');
              }}
              className="px-8 py-3 bg-purple-500 hover:bg-purple-400 text-white font-mono text-sm rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visit Website
            </button>
          </div> */}
        </div>

        {/* Terminal-style info */}
        <div className="mt-3 text-center">
          <div className="inline-flex items-center px-3 py-2 bg-black/50 rounded-lg border border-cyan-500/20">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-cyan-400 font-mono text-xs md:text-sm">
              $~ {sponsorData.name.toLowerCase().replace(/\s+/g, '-')}-banner --active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorPopup;