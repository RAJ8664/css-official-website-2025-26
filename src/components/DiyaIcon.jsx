import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const DiyaIcon = () => {
  const flameRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    // Flame animation
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    tl
      .to(flameRef.current, {
        scaleY: 1.4,
        scaleX: 1.1,
        duration: 0.6,
        ease: "power2.inOut"
      })
      .to(flameRef.current, {
        scaleY: 0.9,
        scaleX: 1.2,
        duration: 0.4,
        ease: "power2.inOut"
      });

    // Glow animation
    gsap.to(glowRef.current, {
      opacity: 0.6,
      scale: 1.2,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

  }, []);

  return (
    <div className="relative">
      {/* Outer Glow */}
      <div
        ref={glowRef}
        className="absolute -inset-3 bg-yellow-400 rounded-full opacity-40 blur-lg"
      ></div>

      {/* Diya Base */}
      <div className="relative z-10">
        <div className="w-9 h-4 bg-gradient-to-b from-amber-800 to-amber-900 rounded-b-full border-2 border-amber-600">
          {/* Oil */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-7 h-2 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-t-full"></div>
        </div>
        
        {/* Wick */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gray-700 rounded-t"></div>
      </div>

      {/* Flame */}
      <div
        ref={flameRef}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3 h-5 z-20"
        style={{
          background: 'linear-gradient(to top, #ff5722 0%, #ff9800 40%, #ffeb3b 70%, #ffffff 100%)',
          borderRadius: '50% 50% 20% 20%',
          filter: 'blur(0.5px) drop-shadow(0 0 8px #ff9800) drop-shadow(0 0 16px #ff5722)',
          transformOrigin: 'center bottom'
        }}
      ></div>

      {/* Spark */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
    </div>
  );
};

export default DiyaIcon;