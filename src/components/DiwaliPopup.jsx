import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

const DiwaliPopup = ({ isOpen, onClose }) => {
  const popupRef = useRef(null);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      
      // Entrance animation
      const tl = gsap.timeline();
      
      tl.fromTo(popupRef.current,
        { scale: 0, opacity: 0, rotation: -10 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" }
      )
      .fromTo('.diwali-element',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.4"
      );

      // Start fireworks after a delay
      setTimeout(() => setShowFireworks(true), 1000);

      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    const tl = gsap.timeline();
    tl.to(popupRef.current, {
      scale: 0,
      opacity: 0,
      rotation: 10,
      duration: 0.6,
      ease: "back.in(1.2)",
      onComplete: onClose
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Fireworks Background */}
            {showFireworks && <Fireworks />}
            
            {/* Main Popup */}
            <div
              ref={popupRef}
              className="relative w-full max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Popup Content */}
              <div className="relative bg-gradient-to-br from-[#ff6b00] via-[#ff8c00] to-[#ffa500] rounded-3xl p-8 shadow-2xl border-4 border-yellow-300 overflow-hidden">
                
                {/* Decorative Border */}
                <div className="absolute inset-2 border-2 border-yellow-200/50 rounded-2xl pointer-events-none"></div>
                
                {/* Floating Diyas */}
                <FloatingDiyas />
                
                {/* Sparkles */}
                <Sparkles />
                
                {/* Content */}
                <div className="relative z-10 text-center space-y-6">
                  
                  {/* Main Title */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="diwali-element"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold text-white font-poppins drop-shadow-2xl">
                      🪔 Happy Diwali! 🪔
                    </h1>
                  </motion.div>

                  {/* Subtitle */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="diwali-element"
                  >
                    <p className="text-yellow-100 text-lg md:text-xl font-inter font-medium">
                      May the divine light of Diwali spread peace, prosperity, happiness, and good health in your life
                    </p>
                  </motion.div>

                  {/* Decorative Separator */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="diwali-element h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent rounded-full"
                  ></motion.div>

                  {/* Message */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="diwali-element"
                  >
                    <p className="text-white/90 text-sm md:text-base font-inter leading-relaxed">
                      Wishing you and your family a Diwali filled with sweet moments, beautiful memories, and the warmth of loved ones. 
                      <br /><br />
                      <span className="text-yellow-200 font-semibold">
                        From Computer Science Society
                      </span>
                    </p>
                  </motion.div>

                  {/* Close Button */}
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 255, 255, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="diwali-element px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full shadow-lg border-2 border-yellow-300 font-poppins text-lg transition-all duration-300"
                  >
                    Continue Celebration 🎉
                  </motion.button>
                </div>

                {/* Corner Decorations */}
                <div className="absolute top-4 left-4 text-2xl animate-bounce">✨</div>
                <div className="absolute top-4 right-4 text-2xl animate-bounce" style={{animationDelay: '0.3s'}}>🪔</div>
                <div className="absolute bottom-4 left-4 text-2xl animate-bounce" style={{animationDelay: '0.6s'}}>🎆</div>
                <div className="absolute bottom-4 right-4 text-2xl animate-bounce" style={{animationDelay: '0.9s'}}>💫</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Fireworks Component
const Fireworks = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight,
            scale: 0,
            opacity: 1
          }}
          animate={{
            y: Math.random() * window.innerHeight * 0.3,
            scale: [0, 4, 0],
            opacity: [1, 0.8, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeOut"
          }}
          style={{
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

// Floating Diyas Component
const FloatingDiyas = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          initial={{
            y: 100,
            x: Math.random() * 300 - 150,
            opacity: 0,
            rotate: Math.random() * 360
          }}
          animate={{
            y: -100,
            opacity: [0, 1, 0],
            rotate: Math.random() * 360 + 180
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear"
          }}
          style={{
            left: `${20 + Math.random() * 60}%`,
          }}
        >
          {i % 2 === 0 ? '🪔' : '✨'}
        </motion.div>
      ))}
    </div>
  );
};

// Sparkles Component
const Sparkles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-300 rounded-full"
          initial={{
            scale: 0,
            opacity: 0,
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5 + Math.random() * 1,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default DiwaliPopup;