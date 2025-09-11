import React from 'react';
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
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
      "Check out our latest collection of cutting-edge text animations for your projects.",
    id: 1,
    icon: <FiFileText className="h-[16px] w-[16px] text-cyan-400" />,
    image: "images/demo1.jpeg",
  },
  {
    title: "AAKRUTI",
    description: "Smooth, next-generation animations to elevate your user experience.",
    id: 2,
    icon: <FiCircle className="h-[16px] w-[16px] text-cyan-400" />,
    image: "images/demo2.jpeg",
  },
  {
    title: "DESIGN WORKSHOP",
    description: "Reusable cyberpunk-styled components for your projects.",
    id: 3,
    icon: <FiLayers className="h-[16px] w-[16px] text-cyan-400" />,
    image: "images/demo3.jpeg",
  },
  {
    title: "GIT & GITHUB workshop",
    description: "Futuristic backgrounds and patterns for your projects.",
    id: 4,
    icon: <FiLayout className="h-[16px] w-[16px] text-cyan-400" />,
    image: "images/demo4.jpeg",
  },
  {
    title: "DATATHON",
    description: "Essential UI components with cyberpunk flair are coming soon!",
    id: 5,
    icon: <FiCode className="h-[16px] w-[16px] text-cyan-400" />,
    image: "images/demo5.jpeg",
  },
];

const DRAG_BUFFER = 10;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

export default function Carousel() {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [itemWidth, setItemWidth] = useState(280);

  const carouselItems = [...DEFAULT_ITEMS, DEFAULT_ITEMS[0]]; // For looping
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Calculate container and item widths
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const screenWidth = window.innerWidth;
        let newContainerWidth;

        if (screenWidth >= 1024) {
          newContainerWidth = Math.min(1200, screenWidth * 0.85);
          setItemWidth(300);
        } else if (screenWidth >= 768) {
          newContainerWidth = screenWidth * 0.9;
          setItemWidth(250);
        } else {
          // Mobile-specific adjustments
          newContainerWidth = screenWidth * 0.98; // Increased from 0.95 to 0.98
          setItemWidth(screenWidth * 0.85); // Make items wider on mobile
        }

        setContainerWidth(newContainerWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
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
    const timer = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prev) => {
          if (prev === DEFAULT_ITEMS.length - 1) {
            return prev + 1;
          }
          if (prev === carouselItems.length - 1) {
            return 0;
          }
          return prev + 1;
        });
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [isHovered, carouselItems.length]);

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (currentIndex === DEFAULT_ITEMS.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex((prev) =>
          Math.min(prev + 1, carouselItems.length - 1)
        );
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (currentIndex === 0) {
        setCurrentIndex(DEFAULT_ITEMS.length - 1);
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      if (prev === DEFAULT_ITEMS.length - 1) {
        return prev + 1;
      }
      if (prev === carouselItems.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return DEFAULT_ITEMS.length - 1;
      }
      return prev - 1;
    });
  };

  return (
    <div className=" flex flex-col items-center justify-center bg-gradient-to-br from-black to-[#021547] p-2 md:p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Binary rain */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-cyan-400 text-xs animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                top: "-20px",
              }}
            >
              {Math.random() > 0.5 ? "1" : "0"}
            </div>
          ))}
        </div>

        {/* Grid background */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-10 animate-grid-move"></div>
      </div>

      <div className="w-full flex items-center justify-center relative z-10 px-2 md:px-4">
        {/* Prev arrow */}
        <button
          onClick={goToPrev}
          className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 mr-4 hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-300"
        >
          <FiArrowLeft />
        </button>

        <div
          ref={containerRef}
          className="relative overflow-hidden p-2 md:p-6 rounded-2xl border border-cyan-500/30 backdrop-blur-lg bg-black/60"
          style={{ width: containerWidth || "90%", maxWidth: "1200px" }}
        >
          <motion.div
            className="flex cursor-grab"
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
            animate={{ x: -(currentIndex * trackItemOffset) }}
            transition={effectiveTransition}
            onAnimationComplete={handleAnimationComplete}
          >
            {carouselItems.map((item, index) => {
              // Calculate the position of each card relative to the center
              const position = index - currentIndex;
              const absPosition = Math.abs(position);
              
              // Only apply rotation to cards that are not in the center
              const rotateY = position > 0 ? Math.min(position * 10, 30) : 
                             position < 0 ? Math.max(position * 10, -30) : 0;
              
              // Scale down cards that are further from the center
              const scale = absPosition > 0 ? Math.max(0.9, 1 - absPosition * 0.1) : 1;
              
              // Adjust opacity for cards that are further from the center
              const opacity = absPosition > 1 ? Math.max(0.6, 1 - absPosition * 0.2) : 1;
              
              // Adjust z-index to ensure proper layering
              const zIndex = carouselItems.length - absPosition;

              return (
                <motion.div
                  key={index}
                  className="relative shrink-0 flex flex-col items-start justify-between 
                             bg-gradient-to-br from-[#0a0a0a] to-[#021547] 
                             border border-cyan-500/40 
                             rounded-xl overflow-hidden cursor-grab active:cursor-grabbing 
                             group p-4 md:p-5 shadow-[0_0_15px_rgba(0,255,255,0.15)]"
                  style={{
                    width: itemWidth,
                    minHeight: window.innerWidth < 768 ? "320px" : "360px", // Reduced height on mobile
                    zIndex: zIndex,
                    transformStyle: "preserve-3d",
                    scale: scale,
                    opacity: opacity,
                  }}
                  animate={{
                    rotateY: rotateY,
                  }}
                  transition={effectiveTransition}
                >
                  {/* Glow header strip */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-60"></div>

                  {/* Image */}
                  <div className="w-full mb-3 md:mb-4 overflow-hidden rounded-lg border border-cyan-500/20">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-32 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Neon corners */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-cyan-400/70 group-hover:border-purple-400 transition-all duration-300"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-cyan-400/70 group-hover:border-purple-400 transition-all duration-300"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-cyan-400/70 group-hover:border-purple-400 transition-all duration-300"></div>
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-cyan-400/70 group-hover:border-purple-400 transition-all duration-300"></div>

                  {/* Icon + Text */}
                  <div className="mb-3 md:mb-4">
                    <span className="flex h-[28px] w-[28px] md:h-[32px] md:w-[32px] items-center justify-center 
                                   rounded-full bg-cyan-900/60 border border-cyan-400/30 
                                   shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <div className="mb-1 md:mb-2 font-black text-base md:text-lg text-cyan-300 group-hover:text-purple-300 transition-colors duration-300 tracking-wide">
                      {item.title}
                    </div>
                    <p className="text-xs md:text-sm text-gray-300 group-hover:text-gray-100 transition-colors duration-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Scanline */}
                  <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent top-1/3 animate-scan opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Dots */}
          <div className="flex justify-center items-center mt-3 md:mt-4 space-x-2">
            {DEFAULT_ITEMS.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  currentIndex % DEFAULT_ITEMS.length === index
                    ? "bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.8)]"
                    : "bg-cyan-900"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Next arrow */}
        <button
          onClick={goToNext}
          className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 ml-4 hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-300"
        >
          <FiArrowRight />
        </button>
      </div>

      {/* Mobile arrows */}
      <div className="md:hidden flex justify-center space-x-8 mt-4">
        <button
          onClick={goToPrev}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-300"
        >
          <FiArrowLeft />
        </button>
        <button
          onClick={goToNext}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-300"
        >
          <FiArrowRight />
        </button>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
}