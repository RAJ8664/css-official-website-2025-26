import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Carousel from "../components/ui/Carousel";
import AnimatedTestimonials from "../components/ui/PillarsOfCSS";
import Chatbot from "../components/ui/Chatbot";
import { NavbarDemo } from "../components/Navbar";

// Register GSAP plugins only once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Memoize testimonials data to prevent re-renders
const PILLARS_TESTIMONIALS = [
  {
    src: "https://cs.nits.ac.in/storage/FacultyDetails/IMG_175345198568838dd11b534.jpg",
    name: "Umakanta Majhi",
    designation: "Faculty Advisor",
    quote: "Promoting a culture of innovation and creativity. We encourage students to think outside the box, experiment with new ideas, and develop solutions that make a difference."
  },
  {
    src: "https://res.cloudinary.com/dp4sknsba/image/upload/v1760007735/Swapneel_Bhaiya_ltkb53.jpg",
    name: "Swapnil Dansana",
    designation: "President",
    quote: "Encouraging innovative thinking and research-oriented approach. We support projects in AI, ML, web development, and emerging technologies to push boundaries of what's possible."
  },
  {
    src: "https://res.cloudinary.com/dp4sknsba/image/upload/v1760007829/Amborish_xqum5s.jpg",
    name: "Amborish Sarmah",
    designation: "General Secretary",
    quote: "Creating a supportive network where students can learn, grow, and collaborate. We organize tech talks, networking events, and mentorship programs to foster meaningful connections."
  },
  
  {
    src: "https://res.cloudinary.com/dcdxyfnfo/image/upload/v1757535079/WhatsApp_Image_2025-08-31_at_11.28.29_AM_-_002_RAJ_KUMAR_ROY_uopc4j.webp",
    name: "Raj Kumar Roy",
    designation: "Technical Head",
    quote: "Providing opportunities for professional development through interview preparation, resume building, and industry interactions. We bridge the gap between academia and industry."
  },
  {
    src: "https://res.cloudinary.com/dcdxyfnfo/image/upload/v1757535268/IMG-20250510-WA0014_-_CSE_100_TARUN_CHANDAK_w0cny9.webp",
    name: "Tarun Chandak",
    designation: "Finance and Ops Co-ordinator",
    quote: "Fostering a culture of continuous learning and curiosity. We encourage students to explore new technologies, participate in hackathons, and stay updated with industry trends."
  }
];

// Preload critical images
const preloadImages = () => {
  if (typeof window === 'undefined') return;
  
  const images = [
    'images/about.png',
    ...PILLARS_TESTIMONIALS.map(testimonial => testimonial.src)
  ];
  
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Separate LoadingScreen component
const LoadingScreen = React.memo(({ loadingProgress }) => (
  <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
    {/* Optimized Matrix background with reduced elements */}
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="absolute text-green-400 text-xs animate-[fall_3s_linear_infinite]"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            top: "-20px",
          }}
        >
          {Math.random() > 0.5 ? "1" : "0"}
        </div>
      ))}
    </div>

    {/* Main loader content */}
    <div className="relative z-10 text-center">
      {/* CSS Logo */}
      <div className="mb-8">
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 font-mono mb-4">
          CSS
        </h1>
        <p className="text-cyan-400 font-mono text-lg">Computer Science Society</p>
      </div>

      {/* Terminal-style loader */}
      <div className="bg-black/80 border border-cyan-500/30 rounded-lg p-6 max-w-md mx-auto backdrop-blur-sm">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-cyan-400 font-mono text-sm">LOADING_SYSTEM</span>
        </div>

        <div className="space-y-2 font-mono text-left">
          <p className="text-green-400 text-sm">
            <span className="text-cyan-400">$~ </span>Initializing components...
          </p>
          <p className="text-green-400 text-sm">
            <span className="text-cyan-400">$~ </span>Loading assets...
          </p>
          <p className="text-green-400 text-sm">
            <span className="text-cyan-400">$~ </span>Starting services...
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-cyan-400 font-mono mb-1">
            <span>Progress</span>
            <span>{Math.min(100, Math.round(loadingProgress))}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-green-400 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, loadingProgress)}%` }}
            ></div>
          </div>
        </div>

        {/* Loading animation */}
        <div className="flex justify-center mt-4">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer text */}
      <p className="text-gray-400 text-sm mt-6 font-mono">
        NIT Silchar • Computer Science & Engineering
      </p>
    </div>
  </div>
));

function Home() {
  const [showContent, setShowContent] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false)

  const svgRef = useRef(null);
  const animationRef = useRef(null);
  const videoRef = useRef(null);

  

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about')
      if (aboutSection) {
        const aboutSectionTop = aboutSection.offsetTop
        const scrollPosition = window.scrollY + window.innerHeight / 2
        
        // Show navbar when we reach about section
        setShowNavbar(scrollPosition >= aboutSectionTop)
      }
    }

    window.addEventListener('scroll', handleScroll)
    // Initial check
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Memoize event handlers
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setInput("");
    }
  }, []);

  const isMobileDevice = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  const getTextOrientation = useCallback(() => {
    if (typeof window === 'undefined') return 'horizontal';
    
    const isMobile = isMobileDevice();
    if (!isMobile) return 'horizontal';
    
    // For mobile, check if we should use vertical layout
    return window.innerHeight > window.innerWidth ? 'vertical' : 'horizontal';
  }, [isMobileDevice]);
  
  // Memoized text configuration
  const textConfig = useMemo(() => {
    const orientation = getTextOrientation();
    const isMobile = isMobileDevice();
    if (orientation === 'vertical') {
      return {
        fontSize: isMobile ? "300" : "220",
        textAnchor: "middle",
        dominantBaseline: "middle",
        letterSpacing: "0",
        writingMode: "tb", // top to bottom (vertical)
        glyphOrientationVertical: "0"
      };
    } else {
      return {
        fontSize: isMobile ? "200" : "320",
        textAnchor: "middle",
        dominantBaseline: "middle",
        letterSpacing: "0",
        writingMode: "lr", // left to right (horizontal)
      };
    }
  }, [getTextOrientation, isMobileDevice]);
  const getViewBox = useCallback(() => {
    const isMobile = isMobileDevice();
    const orientation = getTextOrientation();
    
    if (isMobile && orientation === 'vertical') {
      return "0 0 800 600"; // Taller viewBox for vertical text
    } else if (isMobile) {
      return "0 0 1200 800"; // Wider viewBox for mobile horizontal
    }
    return "0 0 800 600"; // Default for desktop
  }, [isMobileDevice, getTextOrientation]);

   const MaskText = useMemo(() => {
    const orientation = getTextOrientation();
    const fontFamily = "goldman, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

    if (orientation === 'vertical') {
      // Vertical text layout - each character on a new line
      return (
        <g className="vi-mask-group">
        {/* C - Top of screen */}
        <text
          x="50%"
          y="4%"
          fontSize={textConfig.fontSize}
          textAnchor="middle"
          fill="white"
          dominantBaseline="middle"
          fontFamily={fontFamily}
          fontWeight="1000"
          stroke="white" 
          strokeWidth="20px" 
          paintOrder="stroke"
        >
          C
        </text>
        {/* S - Middle of screen */}
        <text
          x="50%"
          y="56%"
          fontSize={textConfig.fontSize}
          textAnchor="middle"
          fill="white"
          fontFamily={fontFamily}
          fontWeight="1000"
          stroke="white" 
          strokeWidth="20px" 
          paintOrder="stroke"
        >
          S
        </text>
        {/* S - Bottom of screen */}
        <text
          x="50%"
          y="97%"
          fontSize={textConfig.fontSize}
          textAnchor="middle"
          fill="white"
          fontFamily={fontFamily}
          fontWeight="1000"
          stroke="white" 
          strokeWidth="20px" 
          paintOrder="stroke"
        >
          S
        </text>
      </g>
      );
    } else {
      // Horizontal text layout
      return (
        <g className="vi-mask-group">
          <text
            x="50%"
            y="50%"
            fontSize={textConfig.fontSize}
            textAnchor={textConfig.textAnchor}
            fill="white"
            dominantBaseline={textConfig.dominantBaseline}
            fontFamily="Arial Black"
            letterSpacing={textConfig.letterSpacing}
          >
            CSS
          </text>
        </g>
      );
    }
  }, [textConfig, getTextOrientation]);
  const cssFontSize = useMemo(() => 
    isMobileDevice() ? "250" : "320", 
    [isMobileDevice]
  );

  // Optimized loading simulation
  useEffect(() => {
    if (!isMounted) return;

    window.scrollTo(0, 0);
    
    // Preload images early
    preloadImages();

    let progressInterval;
    let timer;
    let fallbackTimer;

    const simulateLoading = () => {
      let progress = 0;
      progressInterval = setInterval(() => {
        if (!isMounted) {
          clearInterval(progressInterval);
          return;
        }
        progress += Math.random() * 15;
        if (progress >= 100) {
          setLoadingProgress(100);
          clearInterval(progressInterval);
          // Give a small delay for smooth transition
          setTimeout(() => {
            if (isMounted) setIsLoading(false);
          }, 200);
        } else {
          setLoadingProgress(progress);
        }
      }, 150);
    };

    // Start loading simulation
    simulateLoading();

    // Check if critical resources are loaded
    const checkCriticalResources = () => {
      const video = document.querySelector('.bg-video');
      if (video && video.readyState >= 3) {
        clearInterval(progressInterval);
        setLoadingProgress(100);
        setTimeout(() => {
          if (isMounted) setIsLoading(false);
        }, 200);
      }
    };

    // Set up resource checking
    const video = document.querySelector('.bg-video');
    if (video) {
      video.addEventListener('loadeddata', checkCriticalResources);
      video.addEventListener('canplay', checkCriticalResources);
    }

    // ScrollTrigger refresh with debounce
    timer = setTimeout(() => {
      if (isMounted) {
        ScrollTrigger.refresh();
      }
    }, 500);

    // Fallback timeout
    fallbackTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
        clearInterval(progressInterval);
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
      clearInterval(progressInterval);
      
      const video = document.querySelector('.bg-video');
      if (video) {
        video.removeEventListener('loadeddata', checkCriticalResources);
        video.removeEventListener('canplay', checkCriticalResources);
      }
    };
  }, [isMounted]);

  // Optimized GSAP animations with reduced dependencies
  useGSAP(() => {
    if (!isMounted) return;

    if (animationRef.current) {
      animationRef.current.kill();
    }
    
    const isMobile = isMobileDevice();
    const orientation = getTextOrientation();

    let initialScale, finalScale;
    
    if (isMobile && orientation === 'vertical') {
      // Adjust scales for vertical text on mobile
      const screenRatio = window.innerHeight / window.innerWidth;
      initialScale = screenRatio > 1.6 ? 0.7 : 0.7;
      finalScale = 15; // Increased for better vertical coverage
    } else if (isMobile) {
      const screenRatio = window.innerHeight / window.innerWidth;
      initialScale = screenRatio > 1.6 ? 0.5 : 0.5;
      finalScale = 20;
    } else {
      initialScale = 1.15;
      finalScale = 15;
    }
    
    // Batch GSAP operations
    gsap.set(".vi-mask-group", {
      scale: initialScale,
      transformOrigin: "center center",
    });
    
    animationRef.current = gsap.to(".vi-mask-group", {
      rotate: orientation === 'vertical' ? 0 : 10,
      scale: finalScale,
      transformOrigin: "50% 50%",
      ease: "none",
      scrollTrigger: {
        trigger: ".svg-container",
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        onEnter: () => setShowContent(true),
        onLeaveBack: () => setShowContent(false),
      },
    });
    

    gsap.to(".bg-video", {
      opacity: 0.5,
      scrollTrigger: {
        trigger: ".about",
        start: "top center",
        end: "top top",
        scrub: true,
      },
    });
    gsap.to(".chat-launcher", {
      autoAlpha: 1, // Fades in and handles visibility
      scale: 1, // Scales it from its default 0.5 to 1
      duration: 0.5,
      scrollTrigger: {
        trigger: ".about", // The element that triggers the animation
        start: "top center", // Starts when the top of ".about" hits the viewport center
        toggleActions: "play none none reverse", // Fades in on scroll down, fades out on scroll up
      },
    });
    

    // Throttled resize handler
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (isMounted) {
          ScrollTrigger.refresh();
        }
      }, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isMobileDevice, isMounted, getTextOrientation]);

  // Optimized video element with preload and lazy loading
  const VideoBackground = useMemo(() => (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="w-full h-full object-cover bg-video"
      onLoadedData={() => {
        // Video loaded callback for better loading detection
        if (isLoading && loadingProgress < 90 && isMounted) {
          setLoadingProgress(90);
        }
      }}
    >
      <source src="https://res.cloudinary.com/dx8jytou0/video/upload/v1760209325/techVid_az70rq.mp4" type="video/mp4" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-purple-900 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">CSS</h1>
      </div>
    </video>
  ), [isLoading, loadingProgress, isMounted]);

  if (!isMounted) {
    return null;
  }
 

  return (
    <>
      {isLoading && <LoadingScreen loadingProgress={loadingProgress} />}

      <div className={`w-full relative bg-black `}>

        <Chatbot />

        <div className="svg-container sticky top-0 z-[100] w-full h-screen flex items-center justify-center bg-red">
          <svg 
            ref={svgRef}
            viewBox={getViewBox()} 
            preserveAspectRatio="xMidYMid slice" 
            className="w-full h-full"
          >
            
            <defs>
              <mask id="viMask">
                <rect width="100%" height="100%" fill="black" />
                {MaskText}
              </mask>
            </defs>
            
            <foreignObject width="100%" height="100%" mask="url(#viMask)">
              {VideoBackground}
            </foreignObject>
          </svg>
        </div>

        {showNavbar && <NavbarDemo />}

        {/* About Section - Reduced padding for mobile */}
        <section id="about" className="about relative min-h-[65vh] md:min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center px-4 py-1 md:py-3.5 overflow-hidden">
          <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="flex-1 bg-black/70 rounded-xl border border-cyan-500/20 p-5 md:p-8 lg:p-12 backdrop-blur-md shadow-lg shadow-cyan-500/10">
              <div className="flex items-center mb-3 md:mb-6">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-cyan-400 font-mono text-sm md:text-md">ABOUT_TERMINAL</span>
              </div>
              <div className="space-y-3 md:space-y-6 font-mono">
                <p className="text-xl md:text-3xl font-bold text-green-400 tracking-wide">
                  <span className="text-cyan-400">$~ </span> mkdir <span className="text-xl md:text-3xl">Computer-Science-Society</span>
                </p>
                <p className="text-sm md:text-xl text-gray-300 leading-relaxed">
                  <span className="text-emerald-400 font-mono">$~</span> cat <span className="text-white">About.txt</span>
                  <br />
                  The{" "}
                  <span className="highlight font-semibold text-base md:text-2xl text-white">
                    Computer Science Society
                  </span>, run by the CSE department of
                  <span className="highlight font-semibold text-base md:text-2xl text-white">
                    {" "}NIT Silchar
                  </span>, aims to impart academic, technical, and socio-cultural awareness
                  to the students of our college.
                </p>
              </div>
              <div className="flex items-center mt-3 md:mt-6">
                <span className="text-cyan-400 font-mono text-sm md:text-lg mr-2">$~</span>
                {/* <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent outline-none border-none text-sm md:text-lg font-mono text-white w-full caret-cyan-400"
                  placeholder="type a command..."
                  autoFocus
                /> */}
              </div>
            </div>
            
            {/* Image Container - Hidden on mobile, visible on medium screens and up */}
            <div className=" flex-1 justify-center">
              <img
                src="images/about.png"
                alt="About Us"
                loading="lazy"
                className="rounded-2xl shadow-lg shadow-cyan-500/20 border border-cyan-500/20 object-cover max-h-[300px] md:max-h-[400px] w-full"
                onLoad={() => {
                  // Image loaded callback
                  if (isLoading && loadingProgress < 80 && isMounted) {
                    setLoadingProgress(80);
                  }
                }}
              />
            </div>
          </div>
        </section>

        {/* Announcement Section */}
        <section className="relative min-h-[90vh] md:min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex flex-col items-center justify-center px-3 py-1 md:py-7 overflow-hidden">
          {/* Foreground Terminal Box */}
          <div className="relative z-10 w-full max-w-[1200px] bg-black/70 rounded-xl border border-cyan-500/20 p-3 md:p-9 backdrop-blur-md shadow-lg shadow-cyan-500/10">
            {/* Terminal Header */}
            <div className="flex items-center mb-3 md:mb-4">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full mr-1 md:mr-2"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full mr-1 md:mr-2"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-1 md:mr-2"></div>
              <span className="text-cyan-400 font-mono text-xs md:text-sm">ANNOUNCEMENTS_TERMINAL</span>
            </div>

            {/* Terminal Title */}
            <h2 className="text-lg md:text-3xl font-mono font-bold text-green-400 mb-3 md:mb-4">
              <span className="text-cyan-400">$~ </span> Announcements
            </h2>

            {/* Carousel */}
            <div className="w-full flex justify-center">
              <Carousel />
            </div>
            <div className="flex items-center mt-4 md:mt-6">
              <span className="text-cyan-400 font-mono text-sm md:text-lg mr-2">$~</span>
              <div className="w-[2px] h-4 md:h-6 bg-cyan-400 animate-blink"></div>
            </div>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="relative min-h-[90vh] md:min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center px-3 py-1 md:py-7 overflow-hidden">
          {/* Main Content */}
          <div className="relative z-10 w-full max-w-7xl">
            {/* Section Header */}
            <div className="text-center mb-6 md:mb-16 px-2">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full mr-1 md:mr-2"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full mr-1 md:mr-2"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-1 md:mr-2"></div>
                <span className="text-cyan-400 font-mono text-xs md:text-sm">PILLARS_OF_CSS_TERMINAL</span>
              </div>
              
              <h2 className="text-xl md:text-5xl font-bold text-white mb-2 md:mb-4 font-mono">
                <span className="text-cyan-400">$~ </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
                  Pillars of CSS
                </span>
              </h2>
              
              <p className="text-xs md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                The five foundational pillars that define the Computer Science Society and drive our mission forward.
              </p>
            </div>

            {/* Testimonials Component */}
            <div className="bg-black/50 rounded-xl md:rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-lg md:shadow-2xl shadow-cyan-500/10 overflow-hidden">
              <AnimatedTestimonials 
                testimonials={PILLARS_TESTIMONIALS}
                autoplay={true}
              />
            </div>

            {/* Additional Info */}
            <div className="mt-6 md:mt-12 text-center">
              <div className="inline-flex items-center px-3 py-1 md:px-6 md:py-3 rounded-full bg-cyan-900/30 border border-cyan-500/50">
                <span className="text-cyan-400 font-mono text-xs md:text-sm">
                  $~ cat pillars.txt | more...
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default React.memo(Home);