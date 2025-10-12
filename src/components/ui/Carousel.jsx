import React from 'react';
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue } from "motion/react";
import {
  FiCircle,
  FiCode,
  FiFileText,
  FiLayers,
  FiLayout,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";

const DEFAULT_ITEMS = [
  {
    title: "ABACUS",
    description:
      "The annual Computer Science and Engineering week - ABACUS! The excitement begins each year, for the Annual week of the CSE department in which different games and competitions takes place where everyone gets a cool opportunity to prove their skills down and claim the prize money. But the most unique point about it is that it gives you, the freshers, the opportunity to become organizers, to present your ideas, instead of just participating and enables you to learn numerous things.",
    id: 1,
    icon: <FiFileText className="h-[16px] w-[16px] text-cyan-400" />,
    image: "https://res.cloudinary.com/dx8jytou0/image/upload/f_webp/v1757495059/Abacus_az0bsl.png",
  },
  {
    title: "Treasure Hunt",
    description: "Get ready for the ultimate test of wit, teamwork, and strategy! Are you ready to decipher cryptic clues and claim The Final Paycheque? CSS brings you the most thrilling treasure hunt across the campus!",
    id: 2,
    icon: <FiCircle className="h-[16px] w-[16px] text-cyan-400" />,
    image: "https://res.cloudinary.com/dx8jytou0/image/upload/f_webp/v1757501229/Screenshot_2025-09-10_161836_ma94ly.png",
  },
  {
    title: "Abacus Got Latent",
    description: "Aspiring to become Samay Raina but don't want to go to JAIL! Welcome to 'ABACUS Got LATENT', the ultimate talent showdown where self-awareness meets creativity! This is your chance to showcase your hidden talent- whether it's dark comedy, mimicry, singing, acting, or any unique skill.",
    id: 3,
    icon: <FiCircle className="h-[16px] w-[16px] text-cyan-400" />,
    image: "https://res.cloudinary.com/dx8jytou0/image/upload/f_webp/v1757501445/Screenshot_2025-09-10_162215_w81bsa.png",
  },
  {
    title: "Chase Cloud 9",
    description: "Chase Cloud 9, an intense challenge brought by the Computer Science Society. It's the ultimate test to find the next tech masterminds—designed to simulate the most rigorous real-world recruitment processes.",
    id: 4,
    icon: <FiLayers className="h-[16px] w-[16px] text-cyan-400" />,
    image: "https://res.cloudinary.com/dx8jytou0/image/upload/f_webp/v1757501619/Screenshot_2025-09-10_162429_wexhhb.png",
  },
  {
    title: "ENIGMA",
    description: "ENIGMA provides an opportunity for the freshman of the college to get introduced to the field of competitive programming. It prepares the students for internship/placement season by providing an opportunity to take a shot at real time Coding Round Problems. Our alumni have also, at many times appreciated this highly esteemed initiative by the CP Wing of the Society, given the value addition it has accentuated in the brightest of minds",
    id: 5,
    icon: <FiLayout className="h-[16px] w-[16px] text-cyan-400" />,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
  },
  {
    title: "DATATHON",
    description: "Dive into the world of data science with DATATHON! Analyze, visualize, and derive insights from complex datasets. Perfect for aspiring data scientists and ML enthusiasts.",
    id: 6,
    icon: <FiCode className="h-[16px] w-[16px] text-cyan-400" />,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
  },
];

const DRAG_BUFFER = 10;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

const styles = `
  @keyframes fall {
    from {
      transform: translateY(-20px);
    }
    to {
      transform: translateY(100vh);
    }
  }
  @keyframes grid-move {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 50px 50px;
    }
  }
  @keyframes scan {
    0% {
      top: 0;
    }
    100% {
      top: 100%;
    }
  }
  .animate-fall {
    animation: fall 5s linear infinite;
  }
  .animate-grid-move {
    animation: grid-move 10s linear infinite;
  }
  .animate-scan {
    animation: scan 2s linear infinite;
  }
  .bg-grid-pattern {
    background-image: linear-gradient(
        rgba(6, 182, 212, 0.1) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
  }
`;

export default function Carousel() {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [itemWidth, setItemWidth] = useState(280);
  const [isMounted, setIsMounted] = useState(false);

  const carouselItems = [
    DEFAULT_ITEMS[DEFAULT_ITEMS.length - 1], 
    ...DEFAULT_ITEMS, 
    DEFAULT_ITEMS[0]
  ];
  const [currentIndex, setCurrentIndex] = useState(1); 
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  
  useEffect(() => {
    setIsMounted(true);
    
    const updateWidth = () => {
      if (containerRef.current) {
        const screenWidth = window.innerWidth;
        let newContainerWidth;
        let newItemWidth;

        if (screenWidth >= 1024) {
          newContainerWidth = Math.min(1200, screenWidth * 0.85);
          newItemWidth = 300;
        } else if (screenWidth >= 768) {
          newContainerWidth = screenWidth * 0.9;
          newItemWidth = 250;
        } else {
          // Mobile-specific adjustments
          newContainerWidth = screenWidth * 0.9;
          newItemWidth = Math.min(280, screenWidth * 0.7);
        }

        setContainerWidth(newContainerWidth);
        setItemWidth(newItemWidth);
      }
    };

    updateWidth();
    
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateWidth, 250);
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const trackItemOffset = itemWidth + GAP;

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  
  useEffect(() => {
    if (!isHovered && isMounted) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isHovered, isMounted]);

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(-(trackItemOffset * 1));
      setCurrentIndex(1);
      setTimeout(() => setIsResetting(false), 50);
    }
    
    else if (currentIndex === 0) {
      setIsResetting(true);
      x.set(-(trackItemOffset * DEFAULT_ITEMS.length));
      setCurrentIndex(DEFAULT_ITEMS.length);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => prev + 1);
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  
  const getCarouselOffset = () => {
    if (!containerWidth || !itemWidth) return 0;
    
    const containerCenter = containerWidth / 2;
    const itemCenter = itemWidth / 2;
    
    
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const paddingAdjustment = isMobile ? 0 : 0;
    
    const offset = containerCenter - itemCenter - (currentIndex * trackItemOffset) + paddingAdjustment;
    
    return offset;
  };

  const randomPositions = useRef(
    Array.from({ length: 30 }, () => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`
    }))
  ).current;

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-black to-[#021547] p-2 md:p-4 relative overflow-hidden w-full min-h-screen">
      <style>{styles}</style>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-10 animate-grid-move"></div>
      </div>

      <div className="w-full flex items-center justify-center relative z-10 px-2 md:px-4">
        <button
          onClick={goToPrev}
          className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 mr-4 hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-300"
          aria-label="Previous slide"
        >
          <FiArrowLeft />
        </button>

        <div
          ref={containerRef}
          className="relative overflow-hidden p-2 md:p-6 rounded-2xl border border-cyan-500/30 backdrop-blur-lg bg-black/60 w-full max-w-full"
          style={{ 
            width: containerWidth || "100%", 
            maxWidth: "1200px",
          }}
        >
          <motion.div
            className="flex cursor-grab items-center"
            drag="x"
            dragConstraints={{
              left: -trackItemOffset * (carouselItems.length - 1),
              right: 0,
            }}
            style={{
              gap: `${GAP}px`,
              x,
            }}
            onDragEnd={handleDragEnd}
            animate={{ x: getCarouselOffset() }}
            transition={effectiveTransition}
            onAnimationComplete={handleAnimationComplete}
          >
            {carouselItems.map((item, index) => {
              const position = index - currentIndex;
              const absPosition = Math.abs(position);
              
              const rotateY = position > 0 ? Math.min(position * 8, 25) : 
                             position < 0 ? Math.max(position * 8, -25) : 0;
              
              const scale = absPosition > 0 ? Math.max(0.85, 1 - absPosition * 0.15) : 1;
              const opacity = absPosition > 1 ? Math.max(0.5, 1 - absPosition * 0.25) : 1;
              const zIndex = carouselItems.length - absPosition;

              return (
                <motion.div
                  key={`${item.id}-${index}`}
                  className="relative shrink-0 flex flex-col items-start justify-between 
                             bg-gradient-to-br from-[#0a0a0a] to-[#021547] 
                             border border-cyan-500/40 
                             rounded-xl overflow-hidden cursor-grab active:cursor-grabbing 
                             group p-3 md:p-5 shadow-[0_0_15px_rgba(0,255,255,0.15)]"
                  style={{
                    width: itemWidth,
                    minHeight: typeof window !== 'undefined' && window.innerWidth < 768 ? "280px" : "360px",
                    zIndex: zIndex,
                    transformStyle: "preserve-3d",
                    scale: scale,
                    opacity: opacity,
                    maxWidth: typeof window !== 'undefined' && window.innerWidth < 768 ? "80vw" : "none"
                  }}
                  animate={{
                    rotateY: rotateY,
                  }}
                  transition={effectiveTransition}
                >
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-60"></div>

                  <div className="w-full mb-2 md:mb-4 overflow-hidden rounded-lg border border-cyan-500/20">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-24 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-cyan-400/70 group-hover:border-purple-400 transition-all duration-300"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-cyan-400/70 group-hover:border-purple-400 transition-all duration-300"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-cyan-400/70 group-hover:border-purple-400 transition-all duration-300"></div>
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-cyan-400/70 group-hover:border-purple-400 transition-all duration-300"></div>

                  <div className="mb-2 md:mb-4">
                    <span className="flex h-[24px] w-[24px] md:h-[32px] md:w-[32px] items-center justify-center 
                                   rounded-full bg-cyan-900/60 border border-cyan-400/30 
                                   shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                      {item.icon}
                    </span>
                  </div>
                  <div className="w-full">
                    <div className="mb-1 md:mb-2 font-black text-sm md:text-lg text-cyan-300 group-hover:text-purple-300 transition-colors duration-300 tracking-wide">
                      {item.title}
                    </div>
                    <p className="text-xs md:text-sm text-gray-300 group-hover:text-gray-100 transition-colors duration-300 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent top-1/3 animate-scan opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>
                </motion.div>
              );
            })}
          </motion.div>

          
          <div className="flex justify-center items-center mt-3 md:mt-4 space-x-2">
            {DEFAULT_ITEMS.map((_, index) => {
             
              const dotIndex = (currentIndex - 1 + DEFAULT_ITEMS.length) % DEFAULT_ITEMS.length;
              return (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    dotIndex === index
                      ? "bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.8)]"
                      : "bg-cyan-900"
                  }`}
                  onClick={() => setCurrentIndex(index + 1)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>
        </div>

        <button
          onClick={goToNext}
          className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 ml-4 hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-300"
          aria-label="Next slide"
        >
          <FiArrowRight />
        </button>
      </div>

      <div className="md:hidden flex justify-center space-x-8 mt-4">
        <button
          onClick={goToPrev}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-300"
          aria-label="Previous slide"
        >
          <FiArrowLeft />
        </button>
        <button
          onClick={goToNext}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-300"
          aria-label="Next slide"
        >
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
}