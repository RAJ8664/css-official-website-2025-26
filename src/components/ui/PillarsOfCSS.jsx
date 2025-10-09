"use client";
import React from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";

const AnimatedTestimonials = ({
  testimonials,
  autoplay = false
}) => {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Memoized mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkMobile, 250);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Memoized navigation handlers
  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const handleDotClick = useCallback((index) => {
    setActive(index);
  }, []);

  // Optimized autoplay
  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, handleNext]);

  // Memoize random rotations to prevent re-renders
  const randomRotations = useMemo(() => 
    testimonials.map(() => Math.floor(Math.random() * 21) - 10),
    [testimonials.length]
  );

  // Memoize current testimonial
  const currentTestimonial = useMemo(() => 
    testimonials[active],
    [testimonials, active]
  );

  return (
    <div className="mx-auto max-w-sm px-4 py-10 font-sans antialiased md:max-w-6xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-20">
        {/* Images Section */}
        <div className={`${isMobile ? 'order-2' : 'order-1'} md:order-1`}>
          <div className="relative h-64 w-full md:h-80">
            <AnimatePresence mode="sync"> {/* Changed from "wait" to "sync" */}
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    rotate: randomRotations[index],
                  }}
                  animate={{
                    opacity: index === active ? 1 : 0.4,
                    scale: index === active ? 1 : 0.8,
                    rotate: index === active ? 0 : randomRotations[index],
                    zIndex: index === active ? 40 : testimonials.length + 2 - index,
                    y: index === active ? [0, -30, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    rotate: randomRotations[index],
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    loading="lazy"
                    className="h-full w-full rounded-3xl object-cover object-center shadow-2xl"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Content Section */}
        <div className={`${isMobile ? 'order-1' : 'order-2'} md:order-2 flex flex-col justify-between py-4`}>
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-cyan-400 font-mono text-sm">PILLARS_TERMINAL</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">
              {currentTestimonial.name}
            </h3>
            <p className="text-sm text-cyan-400 font-mono mb-6">
              {currentTestimonial.designation}
            </p>
            
            <motion.p className="text-lg text-gray-300 leading-relaxed">
              {currentTestimonial.quote}
            </motion.p>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-8 md:pt-12">
            <button
              onClick={handlePrev}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 hover:bg-cyan-900 transition-colors duration-300 border border-cyan-500/30"
              aria-label="Previous testimonial"
            >
              <IconArrowLeft className="h-5 w-5 text-cyan-400 transition-transform duration-300 group-hover/button:-translate-x-1" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 hover:bg-cyan-900 transition-colors duration-300 border border-cyan-500/30"
              aria-label="Next testimonial"
            >
              <IconArrowRight className="h-5 w-5 text-cyan-400 transition-transform duration-300 group-hover/button:translate-x-1" />
            </button>
            
            {/* Dot Indicators */}
            <div className="flex items-center gap-2 ml-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === active ? 'bg-cyan-400 w-6' : 'bg-gray-600'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AnimatedTestimonials);