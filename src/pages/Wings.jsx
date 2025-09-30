"use client";
import { useScroll, useTransform, motion, useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { SparklesCore } from "../components/ui/sparkles";

const Wings = () => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [activeTerminal, setActiveTerminal] = useState(null);
  const [scrollDirection, setScrollDirection] = useState("down");
  const terminalRefs = useRef([]);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection("up");
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Font definitions for each wing
  const wingFonts = [
    "font-bold font-['Goldman']", // Executive Wing
    "font-bold font-['Goldman']", // Dev Wing
    "font-bold font-['Goldman']", // CP Wing
    "font-bold font-['Goldman']", // ML Wing
    "font-bold font-['Goldman']", // PR Wing
    "font-bold font-['Goldman']", // Design Wing
    "font-bold font-['Goldman']", // Literature Wing
  ];

  // Icons for each wing
  const wingIcons = [
    "👑", // Executive Wing - crown
    "💻", // Dev Wing - laptop
    "⚡", // CP Wing - lightning bolt
    "🤖", // ML Wing - robot
    "📢", // PR Wing - megaphone
    "🎨", // Design Wing - artist palette
    "📚", // Literature Wing - books
  ];

  // Animation variants for timeline markers
  // Update your marker variants
const markerVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 15,
      delay: 0.2
    }
  },
  active: {
    scale: 1.3,
    boxShadow: "0 0 20px rgba(34, 211, 238, 0.8)",
    transition: { 
      duration: 0.3,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

// Add connection lines between markers
const connectionVariants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: { 
    scaleY: 1, 
    opacity: 1,
    transition: { 
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

  // Animation variants for terminal entries
  const terminalVariants = {
    hidden: { 
      opacity: 0, 
      y: scrollDirection === "down" ? 50 : -50,
      rotateX: -15 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  // Terminal content animation
  const contentVariants = {
    hidden: { opacity: 0, y: scrollDirection === "down" ? 20 : -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Data for the 7 wings of the Computer Science Society
  const wingsData = [
    {
      title: "Executive Wing",
      content: (
        <motion.div 
          className="terminal-theme p-6 rounded-lg border border-cyan-500/30 bg-black/80 text-cyan-300 font-mono backdrop-blur-sm relative overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)" }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTerminal(activeTerminal === 0 ? null : 0)}
          animate={{ 
            y: activeTerminal === 0 ? [0, -5, 0] : 0,
            transition: { duration: 0.3 }
          }}
          variants={terminalVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={scrollDirection}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          
          {/* Terminal header */}
          <motion.div className="flex mb-4 items-center" variants={contentVariants}>
            <div className="flex mr-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-lg shadow-red-500/40"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 shadow-lg shadow-yellow-500/40"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/40"></div>
            </div>
            <span className="text-cyan-400 text-xs">EXECUTIVE_TERMINAL</span>
          </motion.div>
          
          {/* Terminal content */}
          <motion.p className="mb-2 text-green-400" variants={contentVariants}>$ executive --about</motion.p>
          <motion.p className="text-cyan-200/80 mb-2" variants={contentVariants}>// Focuses on leadership, management, and organizational strategies.</motion.p>
          <motion.p className="text-white" variants={contentVariants}>The Executive Wing of CSS is considered to be the backbone of the entire Computer Science Society. With the goal of making each and every event, module, and session organized under the banner of CSS a grand success, the wing manages, coordinates, and arranges resources and assets to ensure a smooth workflow among all the individual wings. The wing thus forms the binding force between the various sub-wings, thereby making every inch of hard work a grand success.</motion.p>
          
          {/* Command prompt */}
          <motion.div className="flex items-center mt-4" variants={contentVariants}>
            <span className="text-green-400 mr-2">$~</span>
            <motion.div 
              className="w-2 h-4 bg-green-400"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            ></motion.div>
          </motion.div>
          
          {/* Cyberpunk corner indicators */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-400"></div>
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-400"></div>
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-cyan-400"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-cyan-400"></div>
        </motion.div>
      )
    },
    {
      title: "Dev Wing",
      content: (
        <motion.div 
          className="terminal-theme p-6 rounded-lg border border-cyan-500/30 bg-black/80 text-cyan-300 font-mono backdrop-blur-sm relative overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)" }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTerminal(activeTerminal === 1 ? null : 1)}
          animate={{ 
            y: activeTerminal === 1 ? [0, -5, 0] : 0,
            transition: { duration: 0.3 }
          }}
          variants={terminalVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={scrollDirection}
        >
          <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-1000"></div>
          
          <motion.div className="flex mb-4 items-center" variants={contentVariants}>
            <div className="flex mr-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-lg shadow-red-500/40"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 shadow-lg shadow-yellow-500/40"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/40"></div>
            </div>
            <span className="text-cyan-400 text-xs">DEV_TERMINAL</span>
          </motion.div>
          
          <motion.p className="mb-2 text-green-400" variants={contentVariants}>$ dev --about</motion.p>
          <motion.p className="text-cyan-200/80 mb-2" variants={contentVariants}>// Building practical solutions</motion.p>
          <motion.p className="text-white" variants={contentVariants}>The Developers-Wing of CSS is one of the most significant parts of the society and is responsible for maintaining and upgrading the official Website and App of the Society. The wing is targeted to provide a platform for the junior members of the CSE branch to showcase and upskill their technical knowledge while working on industry-standard projects. It is an ever-growing and expanding group of enthusiastic developers that take pride in building real-world projects and contributing to the proper functioning of our society.</motion.p>
          
          <motion.div className="flex items-center mt-4" variants={contentVariants}>
            <span className="text-green-400 mr-2">$~</span>
            <motion.div 
              className="w-2 h-4 bg-green-400"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            ></motion.div>
          </motion.div>
          
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-400"></div>
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-400"></div>
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-cyan-400"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-cyan-400"></div>
        </motion.div>
      )
    },
    {
      title: "CP Wing",
      content: (
        <motion.div 
          className="terminal-theme p-6 rounded-lg border border-cyan-500/30 bg-black/80 text-cyan-300 font-mono backdrop-blur-sm relative overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)" }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTerminal(activeTerminal === 2 ? null : 2)}
          animate={{ 
            y: activeTerminal === 2 ? [0, -5, 0] : 0,
            transition: { duration: 0.3 }
          }}
          variants={terminalVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={scrollDirection}
        >
          <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
          <div className="absolute top-2 left-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-1500"></div>
          
          <motion.div className="flex mb-4 items-center" variants={contentVariants}>
            <div className="flex mr-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-lg shadow-red-500/40"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 shadow-lg shadow-yellow-500/40"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/40"></div>
            </div>
            <span className="text-cyan-400 text-xs">CP_TERMINAL</span>
          </motion.div>
          
          <motion.p className="mb-2 text-green-400" variants={contentVariants}>$ cp --about</motion.p>
          <motion.p className="text-cyan-200/80 mb-2" variants={contentVariants}>// Enhancing problem-solving skills</motion.p>
          <motion.p className="text-white" variants={contentVariants}>The CP-Wing is a crucial part of CSS which is responsible for the improvement of problem-solving skills, along with the strengthening of the core DSA concepts which also serves as a torchbearer for students in the field of CP. The CP-Wing works hard to produce better and more efficient coders, who will then be able to help take the world to even greater heights, exclusively for the benefit of our students.</motion.p>
          
          <motion.div className="flex items-center mt-4" variants={contentVariants}>
            <span className="text-green-400 mr-2">$~</span>
            <motion.div 
              className="w-2 h-4 bg-green-400"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            ></motion.div>
          </motion.div>
          
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-400"></div>
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-400"></div>
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-cyan-400"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-cyan-400"></div>
        </motion.div>
      )
    },
    {
      title: "ML Wing",
      content: (
        <motion.div 
          className="terminal-theme p-6 rounded-lg border border-cyan-500/30 bg-black/80 text-cyan-300 font-mono backdrop-blur-sm relative overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)" }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTerminal(activeTerminal === 3 ? null : 3)}
          animate={{ 
            y: activeTerminal === 3 ? [0, -5, 0] : 0,
            transition: { duration: 0.3 }
          }}
          variants={terminalVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={scrollDirection}
        >
          <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-2000"></div>
          
          <motion.div className="flex mb-4 items-center" variants={contentVariants}>
            <div className="flex mr-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-lg shadow-red-500/40"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 shadow-lg shadow-yellow-500/40"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/40"></div>
            </div>
            <span className="text-cyan-400 text-xs">ML_TERMINAL</span>
          </motion.div>
          
          <motion.p className="mb-2 text-green-400" variants={contentVariants}>$ ml --about</motion.p>
          <motion.p className="text-cyan-200/80 mb-2" variants={contentVariants}>// Advancing machine learning techniques</motion.p>
          <motion.p className="text-white" variants={contentVariants}>The ML Wing of CSS is mainly responsible for developing a culture of machine learning and other aspects of artificial intelligence in our college. In order to help budding ML and AI enthusiasts, the wing also organize different events, workshops, speaker sessions, etc. in the domains of AI and ML. All the members of ML Wing are highly motivated and enthusiastic to work towards the greater good of the CSS society.</motion.p>
          
          <motion.div className="flex items-center mt-4" variants={contentVariants}>
            <span className="text-green-400 mr-2">$~</span>
            <motion.div 
              className="w-2 h-4 bg-green-400"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            ></motion.div>
          </motion.div>
          
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-400"></div>
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-400"></div>
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-cyan-400"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-cyan-400"></div>
        </motion.div>
      )
    },
    {
      title: "PR Wing",
      content: (
        <motion.div 
          className="terminal-theme p-6 rounded-lg border border-cyan-500/30 bg-black/80 text-cyan-300 font-mono backdrop-blur-sm relative overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)" }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTerminal(activeTerminal === 4 ? null : 4)}
          animate={{ 
            y: activeTerminal === 4 ? [0, -5, 0] : 0,
            transition: { duration: 0.3 }
          }}
          variants={terminalVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={scrollDirection}
        >
          <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-2000"></div>
          
          <motion.div className="flex mb-4 items-center" variants={contentVariants}>
            <div className="flex mr-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-lg shadow-red-500/40"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 shadow-lg shadow-yellow-500/40"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/40"></div>
            </div>
            <span className="text-cyan-400 text-xs">PR_TERMINAL</span>
          </motion.div>
          
          <motion.p className="mb-2 text-green-400" variants={contentVariants}>$ pr --about</motion.p>
          <motion.p className="text-cyan-200/80 mb-2" variants={contentVariants}>// Advancing public relations strategies</motion.p>
          <motion.p className="text-white" variants={contentVariants}>The Public Relations Wing of the Computer Science Society, NIT Silchar Society is the division responsible for maintaining Relations of the Society with External Entities, Organizations, and Individuals. The PR Wing of the CSS, NIT Silchar works closely with other Wings of the society to ensure that all of the society's activities are effectively carried out and hereby make an impression on the image of the Society holistically.</motion.p>
          
          <motion.div className="flex items-center mt-4" variants={contentVariants}>
            <span className="text-green-400 mr-2">$~</span>
            <motion.div 
              className="w-2 h-4 bg-green-400"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            ></motion.div>
          </motion.div>
          
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-400"></div>
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-400"></div>
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-cyan-400"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-cyan-400"></div>
        </motion.div>
      )
    },
    {
      title: "Design Wing",
      content: (
        <motion.div 
          className="terminal-theme p-6 rounded-lg border border-cyan-500/30 bg-black/80 text-cyan-300 font-mono backdrop-blur-sm relative overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)" }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTerminal(activeTerminal === 5 ? null : 5)}
          animate={{ 
            y: activeTerminal === 5 ? [0, -5, 0] : 0,
            transition: { duration: 0.3 }
          }}
          variants={terminalVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={scrollDirection}
        >
          <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-2500 transform -translate-x-1/2 -translate-y-1/2"></div>
          
          <motion.div className="flex mb-4 items-center" variants={contentVariants}>
            <div className="flex mr-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-lg shadow-red-500/40"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 shadow-lg shadow-yellow-500/40"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/40"></div>
            </div>
            <span className="text-cyan-400 text-xs">DESIGN_TERMINAL</span>
          </motion.div>
          
          <motion.p className="mb-2 text-green-400" variants={contentVariants}>$ design --about</motion.p>
          <motion.p className="text-cyan-200/80 mb-2" variants={contentVariants}>// Crafting user experiences</motion.p>
          <motion.p className="text-white" variants={contentVariants}>The Design Wing of CSS is a community of designers whose goal is to provide a good environment for designers to grow their existing talent and sharpen it by working on real-world projects for our society. It focuses on conducting introductory sessions on the basics of design and industry-standard tools such as Adobe Illustrator, Adobe Photoshop, Adobe Premiere Pro, Adobe After Effects, Figma, etc. The wing believes in the fact that everyone can be a designer with just a little bit of practice and dedication.</motion.p>
          
          <motion.div className="flex items-center mt-4" variants={contentVariants}>
            <span className="text-green-400 mr-2">$~</span>
            <motion.div 
              className="w-2 h-4 bg-green-400"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            ></motion.div>
          </motion.div>
          
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-400"></div>
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-400"></div>
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-cyan-400"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-cyan-400"></div>
        </motion.div>
      )
    },
    {
      title: "Literature Wing",
      content: (
        <motion.div 
          className="terminal-theme p-6 rounded-lg border border-cyan-500/30 bg-black/80 text-cyan-300 font-mono backdrop-blur-sm relative overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)" }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTerminal(activeTerminal === 6 ? null : 6)}
          animate={{ 
            y: activeTerminal === 6 ? [0, -5, 0] : 0,
            transition: { duration: 0.3 }
          }}
          variants={terminalVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={scrollDirection}
        >
          <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-2000"></div>
          
          <motion.div className="flex mb-4 items-center" variants={contentVariants}>
            <div className="flex mr-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-lg shadow-red-500/40"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 shadow-lg shadow-yellow-500/40"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/40"></div>
            </div>
            <span className="text-cyan-400 text-xs">Literature_TERMINAL</span>
          </motion.div>
          
          <motion.p className="mb-2 text-green-400" variants={contentVariants}>$ Literature --about</motion.p>
          <motion.p className="text-cyan-200/80 mb-2" variants={contentVariants}>// Exploring the world of literature</motion.p>
          <motion.p className="text-white" variants={contentVariants}>The Literary wing of CSS takes care of all the literary work published and managed by the Computer Science Society of NIT Silchar. From social media posts, technical and website content for the official CSS website and Play Store application to description taglines of social media handles, the literary wing handles it all. BITSCRIBE, the annual magazine of the Computer Science Society, is also compiled and published by the literary wing.</motion.p>
          
          <motion.div className="flex items-center mt-4" variants={contentVariants}>
            <span className="text-green-400 mr-2">$~</span>
            <motion.div 
              className="w-2 h-4 bg-green-400"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            ></motion.div>
          </motion.div>
          
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-400"></div>
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-400"></div>
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-cyan-400"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-cyan-400"></div>
        </motion.div>
      )
    },
  ];

  return (
    <div
      className="w-full min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white font-sans md:px-10 relative overflow-hidden"
      ref={containerRef}>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Binary rain animation */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-green-400 text-xs animate-[fall_5s_linear_infinite]"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                top: '-20px',
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-10"></div>

        {/* Pulsing circles */}
        <div className="absolute w-72 h-72 bg-cyan-600/10 rounded-full blur-xl animate-[pulse_4s_ease-in-out_infinite] top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-purple-600/10 rounded-full blur-xl animate-[pulse_5s_ease-in-out_infinite_1s] bottom-20 right-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-10 px-4 md:px-8 lg:px-10 z-10 mt-15">
        {/* Header with centered WINGS title and sparkle effect */}
        <div className="text-center mb-5 relative">
          <div className="relative inline-block">
            <h1 
              className="text-7xl font-bold mb-2 text-white"
              style={{ fontFamily: 'Goldman, sans-serif' }}
            >
              WINGS
            </h1>
            {/* Sparkle effect */}
            <div className="absolute -inset-10 -z-10">
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={100}
                className="w-full h-full"
                particleColor="#FFFFFF"
              />
            </div>
          </div>
          <p className="text-cyan-300/80 text-sm md:text-base max-w-sm mx-auto font-mono">
            The specialized divisions of our Computer Science Society
          </p>
          <div className="relative flex justify-center items-center mt-4">
            <div className="absolute inset-x-20  bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20  bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60  bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-60  bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
          </div>
        </div>
      </div>
      
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20 z-10">
        {wingsData.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:pt-40 md:gap-10">
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <motion.div 
                className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-black flex items-center justify-center border border-cyan-500/50"
                variants={markerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                animate={activeTerminal === index ? "active" : ""}
              >
                <motion.div 
                  className="h-8 w-8 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center text-xl shadow-lg shadow-cyan-400/20"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {wingIcons[index]}
                </motion.div>
              </motion.div>
              <h3 className={`hidden md:block text-xl md:pl-20 md:text-5xl text-cyan-300/90 relative ${wingFonts[index]}`}>
                {/* Sparkles effect for each wing title */}
                <div className="absolute -inset-6 -z-10">
                  <SparklesCore
                    background="transparent"
                    minSize={0.2}
                    maxSize={0.6}
                    particleDensity={50}
                    className="w-full h-full"
                    particleColor="#38BDF8"
                  />
                </div>
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className={`md:hidden block text-2xl mb-4 text-left text-cyan-300/90 relative ${wingFonts[index]}`}>
                {/* Sparkles effect for mobile view */}
                <div className="absolute -inset-4 -z-10">
                  <SparklesCore
                    background="transparent"
                    minSize={0.2}
                    maxSize={0.6}
                    particleDensity={30}
                    className="w-full h-full"
                    particleColor="#38BDF8"
                  />
                </div>
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-cyan-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]">
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-cyan-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Wings;