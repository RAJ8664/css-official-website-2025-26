import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiquidEther from "../components/ui/LiquidEther";
import Carousel from "../components/ui/Carousel";
import AnimatedTestimonials from "../components/ui/PillarsOfCSS";
import Chatbot from "../components/ui/Chatbot";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const [showContent, setShowContent] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const svgRef = useRef(null);
  const animationRef = useRef(null);

  // Testimonials data for Pillars of CSS
  const pillarsTestimonials = [
    {
      src: "https://cs.nits.ac.in/storage/FacultyDetails/IMG_175345198568838dd11b534.jpg",
      name: "Umakanta Majhi",
      designation: "Faculty Advisor",
      quote: "Building robust technical skills through hands-on workshops, coding competitions, and project development. We focus on modern technologies and best practices to prepare students for real-world challenges."
    },
    {
      src: "https://media.licdn.com/dms/image/v2/D5603AQGruQwte8cacQ/profile-displayphoto-shrink_400_400/B56ZZRxDdfGcAk-/0/1745128547498?e=1762387200&v=beta&t=hmbsJCGSBtyC8NZ894ISWkilg-OxxRDe6Zq8s7DBwPs",
      name: "Amborish Sharma",
      designation: "General Secretary",
      quote: "Creating a supportive network where students can learn, grow, and collaborate. We organize tech talks, networking events, and mentorship programs to foster meaningful connections."
    },
    {
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBlPlpTtK_z4wQ4W74DmV5pxpZYatxBAmzrg&s",
      name: "Swapneel S.",
      designation: "President",
      quote: "Encouraging innovative thinking and research-oriented approach. We support projects in AI, ML, web development, and emerging technologies to push boundaries of what's possible."
    },
    {
      src: "https://img.freepik.com/free-photo/lifestyle-beauty-fashion-people-emotions-concept-young-asian-female-office-manager-ceo-with-pleased-expression-standing-white-background-smiling-with-arms-crossed-chest_1258-59329.jpg?semt=ais_hybrid&w=740&q=80",
      name: "Ankita Kumari",
      designation: "Technical Head",
      quote: "Providing opportunities for professional development through interview preparation, resume building, and industry interactions. We bridge the gap between academia and industry."
    }
  ];

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setInput("");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Check if page is loaded
    const handleLoad = () => {
      setIsLoading(false);
      clearInterval(progressInterval);
    };

    // If page is already loaded
    if (document.readyState === 'complete') {
      setTimeout(() => {
        setIsLoading(false);
        clearInterval(progressInterval);
      }, 1000);
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Refresh ScrollTrigger after a short delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    // Fallback timeout to hide loader
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
      clearInterval(progressInterval);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
      clearInterval(progressInterval);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // Function to properly detect mobile devices
  const isMobileDevice = () => {
    return (
      typeof window.orientation !== "undefined" || 
      navigator.userAgent.indexOf('IEMobile') !== -1 ||
      window.innerWidth < 768
    );
  };

  const cssFontSize = isMobileDevice() ? "250" : "320";

  useGSAP(() => {
    if (animationRef.current) {
      animationRef.current.kill();
    }
    
    const isMobile = isMobileDevice();
    
    let initialScale, finalScale;
    
    if (isMobile) {
      const screenRatio = window.innerHeight / window.innerWidth;
      initialScale = screenRatio > 1.6 ? 0.6 : 0.6;
      finalScale = 30;
    } else {
      initialScale = 1.15;
      finalScale = 20;
    }
    
    gsap.set(".vi-mask-group", {
      scale: initialScale,
      transformOrigin: "center center",
    });
    
    animationRef.current = gsap.to(".vi-mask-group", {
      rotate: 10,
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
      autoAlpha: 1,
      scale: 1,
      duration: 0.5,
      scrollTrigger: {
        trigger: ".about",
        start: "top center",
        toggleActions: "play none none reverse",
      },
    });
    
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Loading Screen Component
  const LoadingScreen = () => (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
      {/* Matrix-style background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(50)].map((_, i) => (
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
  );

  return (
    <>
      {isLoading && <LoadingScreen />}
      
      <div className={`w-full relative bg-black ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        <Chatbot />
        <div className="svg-container sticky top-0 z-[100] w-full h-screen flex items-center justify-center bg-black">
          <svg 
            ref={svgRef}
            viewBox="0 0 800 600" 
            preserveAspectRatio="xMidYMid slice" 
            className="w-full h-full"
          >
            <defs>
              <mask id="viMask">
                <rect width="100%" height="100%" fill="black" />
                <g className="vi-mask-group">
                  <text
                    x="50%"
                    y="50%"
                    fontSize={cssFontSize}
                    textAnchor="middle"
                    fill="white"
                    dominantBaseline="middle"
                    fontFamily="Arial Black"
                  >
                    CSS
                  </text>
                </g>
              </mask>
            </defs>
            <foreignObject width="100%" height="100%" mask="url(#viMask)">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover bg-video"
              >
                <source src="videos/video.mp4" type="video/mp4" />
              </video>
            </foreignObject>
          </svg>
        </div>
        
        {/* Add a simple fallback for mobile if video doesn't play */}
        <div className="mobile-fallback hidden absolute inset-0 bg-gradient-to-b from-blue-900 to-purple-900">
          <div className="flex items-center justify-center h-full">
            <h1 className="text-4xl font-bold text-white">CSS</h1>
          </div>
        </div>

        {/* About Section */}
        <section className="about relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center px-6 py-16 overflow-hidden">
          <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 bg-black/70 rounded-xl border border-cyan-500/20 p-8 md:p-12 backdrop-blur-md shadow-lg shadow-cyan-500/10">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-cyan-400 font-mono text-md">ABOUT_TERMINAL</span>
              </div>
              <div className="space-y-6 font-mono">
                <p className="text-2xl md:text-3xl font-bold text-green-400 tracking-wide">
                  <span className="text-cyan-400">$~ </span> mkdir <span className="text-3xl">Computer-Science-Society</span>
                </p>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  <span className="text-emerald-400 font-mono">$~</span> cat <span className="text-white">About.txt</span>
                  <br />
                  The{" "}
                  <span className="highlight font-semibold text-2xl text-white">
                    Computer Science Society
                  </span>, run by the CSE department of
                  <span className="highlight font-semibold text-2xl text-white">
                    {" "}NIT Silchar
                  </span>, aims to impart academic, technical, and socio-cultural awareness
                  to the students of our college.
                </p>
              </div>
              <div className="flex items-center mt-6">
                <span className="text-cyan-400 font-mono text-lg mr-2">$~</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent outline-none border-none text-lg font-mono text-white w-full caret-cyan-400"
                  placeholder="type a command..."
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <img
                src="images/about.png"
                alt="About Us"
                className="rounded-2xl shadow-lg shadow-cyan-500/20 border border-cyan-500/20 object-cover max-h-[400px]"
              />
            </div>
          </div>
        </section>

        {/* Announcement Section */}
        <section className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex flex-col items-center justify-center px-5 py-16 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 opacity-40 mix-blend-screen">
              <LiquidEther resolution={0.4} colors={["#0f172a", "#1e3a8a", "#38bdf8"]} />
            </div>
            <div className="absolute inset-0 opacity-20">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-green-400 text-xs animate-[fall_6s_linear_infinite]"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 6}s`,
                    top: "-20px",
                  }}
                >
                  {Math.random() > 0.5 ? "1" : "0"}
                </div>
              ))}
            </div>
            <svg width="100%" height="100%" className="absolute inset-0 opacity-10">
              <path
                d="M0,100 Q200,50 400,150 T800,50 T1200,200 T1600,0"
                stroke="cyan"
                strokeWidth="2"
                fill="none"
                strokeDasharray="10,10"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="20"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>

          {/* Foreground Terminal Box */}
          <div className="relative z-10 w-full max-w-[1200px] bg-black/70 rounded-xl border border-cyan-500/20 p-3 md:p-10 backdrop-blur-md shadow-lg shadow-cyan-500/10">
            {/* Terminal Header */}
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-cyan-400 font-mono text-sm">ANNOUNCEMENTS_TERMINAL</span>
            </div>

            {/* Terminal Title */}
            <h2 className="text-2xl md:text-3xl font-mono font-bold text-green-400 mb-4">
              <span className="text-cyan-400">$~ </span> Announcements
            </h2>

            {/* Carousel */}
            <div className="w-full flex justify-center">
              <Carousel
                baseWidth={650} // bigger images
                autoplay={true}
                autoplayDelay={3000}
                pauseOnHover={true}
                loop={true}
                round={false}
              />
            </div>
            <div className="flex items-center mt-6">
              <span className="text-cyan-400 font-mono text-lg mr-2">$~</span>
              <div className="w-[2px] h-6 bg-cyan-400 animate-blink"></div>
            </div>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center px-4 py-16 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
              }}></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute inset-0 opacity-5">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-cyan-400 animate-pulse"
                  style={{
                    width: `${Math.random() * 100 + 50}px`,
                    height: `${Math.random() * 100 + 50}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    filter: 'blur(40px)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 w-full max-w-7xl">
            {/* Section Header */}
            <div className="text-center mb-12 md:mb-16 px-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-cyan-400 font-mono text-sm md:text-md">PILLARS_OF_CSS_TERMINAL</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-mono">
                <span className="text-cyan-400">$~ </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
                  Pillars of CSS
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                The four foundational pillars that define the Computer Science Society and drive our mission forward.
              </p>
            </div>

            {/* Testimonials Component */}
            <div className="bg-black/50 rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-2xl shadow-cyan-500/10 overflow-hidden">
              <AnimatedTestimonials 
                testimonials={pillarsTestimonials}
                autoplay={true}
              />
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-cyan-900/30 border border-cyan-500/50">
                <span className="text-cyan-400 font-mono text-sm">
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

export default Home;