import React, { useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiquidEther from "../components/LiquidEther";
import Carousel from "../components/Carousel";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const [showContent, setShowContent] = useState(false);
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setInput("");
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh(); // recalc start/end positions
  }, []);


  useGSAP(() => {
    const isMobile = window.innerWidth < 768;
    gsap.set(".vi-mask-group", {
      scale: isMobile ? 0.5 : 1.15,
      transformOrigin: "center center",
    });
    const finalScale = isMobile ? window.innerWidth / 50 + 10 : 15;
    gsap.to(".vi-mask-group", {
      rotate: 10,
      scale: finalScale,
      transformOrigin: "50% 50%",
      ease: "none",
      scrollTrigger: {
        trigger: ".svg",
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        onEnter: () => setShowContent(true),
        onLeaveBack: () => setShowContent(false),
      },
    });

    // Fade out background video gradually when About starts
    gsap.to(".bg-video", {
      opacity: 0.5,
      scrollTrigger: {
        trigger: ".about",
        start: "top center",
        end: "top top",
        scrub: true,
      },
    });
  });

  return (
    <div className="w-full relative">
      <div className="svg sticky top-0 z-[100] w-full h-screen flex items-center justify-center bg-black">
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          <defs>
            <mask id="viMask">
              <rect width="100%" height="100%" fill="black" />
              <g className="vi-mask-group">
                <text
                  x="50%"
                  y="50%"
                  fontSize="250"
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
              className="w-full h-full object-cover"
            >
              <source src="videos/video.mp4" type="video/mp4" />
            </video>
          </foreignObject>
        </svg>
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
    <section className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
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
      <div className="relative z-10 w-full max-w-[1200px] bg-black/70 rounded-xl border border-cyan-500/20 p-6 md:p-10 backdrop-blur-md shadow-lg shadow-cyan-500/10">
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
    </div>
  );
}

export default Home;
