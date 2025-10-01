"use client";
import React from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedTestimonials = ({
  testimonials,
  autoplay = false
}) => {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, testimonials.length, active]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-10 font-sans antialiased md:max-w-6xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-20">
        {/* Images Section - Order changes on mobile */}
        <div className={`${isMobile ? 'order-2' : 'order-1'} md:order-1`}>
          <div className="relative h-64 w-full md:h-80">
            <AnimatePresence mode="wait">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.4,
                    scale: isActive(index) ? 1 : 0.8,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index) ? 40 : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -30, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    rotate: randomRotateY(),
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
              {testimonials[active].name}
            </h3>
            <p className="text-sm text-cyan-400 font-mono mb-6">
              {testimonials[active].designation}
            </p>
            
            <motion.p className="text-lg text-gray-300 leading-relaxed">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-8 md:pt-12">
            <button
              onClick={handlePrev}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 hover:bg-cyan-900 transition-colors duration-300 border border-cyan-500/30"
            >
              <IconArrowLeft className="h-5 w-5 text-cyan-400 transition-transform duration-300 group-hover/button:-translate-x-1" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 hover:bg-cyan-900 transition-colors duration-300 border border-cyan-500/30"
            >
              <IconArrowRight className="h-5 w-5 text-cyan-400 transition-transform duration-300 group-hover/button:translate-x-1" />
            </button>
            
            {/* Dot Indicators */}
            <div className="flex items-center gap-2 ml-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActive(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === active ? 'bg-cyan-400 w-6' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedTestimonials;