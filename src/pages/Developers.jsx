import React, { useState, useRef } from 'react';
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaCode,
  FaPalette,
  FaUserTie,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight
} from 'react-icons/fa';

const Carousel = ({ children, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4;
  const members = React.Children.toArray(children);
  const totalItems = members.length;
  
  const next = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= Math.ceil(totalItems / itemsPerView) ? 0 : prevIndex + 1
    );
  };
  
  const prev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.ceil(totalItems / itemsPerView) - 1 : prevIndex - 1
    );
  };
  
  // Calculate visible items based on currentIndex
  const visibleItems = members.slice(
    currentIndex * itemsPerView,
    (currentIndex + 1) * itemsPerView
  );
  
  return (
    <div className={`relative ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleItems}
      </div>
      
      <button
        onClick={prev}
        className="absolute top-1/2 -left-12 transform -translate-y-1/2 bg-cyan-900/70 border border-cyan-500 text-cyan-300 p-3 rounded-full hover:bg-cyan-800/70 hover:text-cyan-200 transition-colors"
      >
        <FaChevronLeft />
      </button>
      
      <button
        onClick={next}
        className="absolute top-1/2 -right-12 transform -translate-y-1/2 bg-cyan-900/70 border border-cyan-500 text-cyan-300 p-3 rounded-full hover:bg-cyan-800/70 hover:text-cyan-200 transition-colors"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

const Developers = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample data structure (replace with your actual data)
  const data = {
    categories: {
      leads: {
        name: 'Team Leads',
        icon: FaUserTie,
        members: [
          {
            name: 'John Doe',
            role: 'Lead Developer',
            year: '2023',
            photo: 'images/developer1.jpg',
            skills: ['React', 'Node.js', 'UI/UX'],
            bio: 'Experienced full-stack developer with passion for clean code.',
            social: {
              instagram: '#',
              facebook: '#',
              linkedin: '#'
            }
          },
          {
            name: 'Jane Smith',
            role: 'Design Lead',
            year: '2023',
            photo: 'images/developer2.jpg',
            skills: ['Figma', 'UI/UX', 'Illustration'],
            bio: 'Creative designer with an eye for detail and user experience.',
            social: {
              instagram: '#',
              facebook: '#',
              linkedin: '#'
            }
          }
        ]
      },
      developers: {
        name: 'Developers',
        icon: FaCode,
        members: [
          {
            name: 'Alex Johnson',
            role: 'Frontend Developer',
            year: '2023',
            photo: 'images/developer3.jpg',
            skills: ['React', 'JavaScript', 'CSS'],
            bio: 'Passionate about creating interactive web experiences.',
            social: {
              instagram: '#',
              facebook: '#',
              linkedin: '#'
            }
          },
          {
            name: 'Alex Johnson',
            role: 'Frontend Developer',
            year: '2023',
            photo: 'images/developer3.jpg',
            skills: ['React', 'JavaScript', 'CSS'],
            bio: 'Passionate about creating interactive web experiences.',
            social: {
              instagram: '#',
              facebook: '#',
              linkedin: '#'
            }
          },
          {
            name: 'Alex Johnson',
            role: 'Frontend Developer',
            year: '2023',
            photo: 'images/developer3.jpg',
            skills: ['React', 'JavaScript', 'CSS'],
            bio: 'Passionate about creating interactive web experiences.',
            social: {
              instagram: '#',
              facebook: '#',
              linkedin: '#'
            }
          },
          {
            name: 'Alex Johnson',
            role: 'Frontend Developer',
            year: '2023',
            photo: 'images/developer3.jpg',
            skills: ['React', 'JavaScript', 'CSS'],
            bio: 'Passionate about creating interactive web experiences.',
            social: {
              instagram: '#',
              facebook: '#',
              linkedin: '#'
            }
          }
        ]
      },
      designers: {
        name: 'Designers',
        icon: FaPalette,
        members: [
          {
            name: 'Sarah Wilson',
            role: 'UI/UX Designer',
            year: '2023',
            photo: 'images/developer4.jpg',
            skills: ['Figma', 'Illustrator', 'Photoshop'],
            bio: 'Creating beautiful and functional user interfaces.',
            social: {
              instagram: '#',
              facebook: '#',
              linkedin: '#'
            }
          }
        ]
      }
    }
  };

  // Combine all members for the "All" category
  const allMembers = Object.values(data.categories).flatMap(category => category.members);

  // Get current category members
  const getCurrentMembers = () => {
    if (selectedCategory === 'all') return allMembers;
    return data.categories[selectedCategory]?.members || [];
  };

  // Category configuration
  const categories = {
    all: { name: 'All Contributors', icon: FaCode },
    leads: { name: 'Team Leads', icon: FaUserTie },
    developers: { name: 'Developers', icon: FaCode },
    designers: { name: 'Designers', icon: FaPalette },
    ...data.categories
  };

  return (
    <div className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white px-6 py-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Binary rain animation */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-green-400 text-xs animate-fall"
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
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-10 animate-grid-move"></div>

        {/* Hexagon pattern */}
        <div className="absolute inset-0 bg-hexagon-pattern bg-[length:100px_100px] opacity-5 animate-pulse"></div>

        {/* Circuit lines */}
        <div className="absolute inset-0">
          <svg width="100%" height="100%" className="opacity-10">
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
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M0,300 Q300,200 600,300 T1200,250 T1800,400"
              stroke="magenta"
              strokeWidth="2"
              fill="none"
              strokeDasharray="8,8"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="16"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        {/* Floating tech elements */}
        <div className="absolute w-20 h-20 border-2 border-cyan-500/30 rounded-lg animate-float-1"></div>
        <div className="absolute w-16 h-16 border-2 border-purple-500/30 rounded-full right-20 top-1/4 animate-float-2"></div>
        <div className="absolute w-24 h-24 border-2 border-green-500/20 rotate-45 bottom-1/3 left-1/4 animate-float-3"></div>

        {/* Pulsing circles */}
        <div className="absolute w-72 h-72 bg-red-600/10 rounded-full blur-xl animate-pulse-slow top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-xl animate-pulse-slow-delayed bottom-20 right-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 text-white" style={{ fontFamily: 'Goldman, sans-serif' }}>
            Development Team
          </h1>
          <p className="text-xl text-cyan-300 max-w-3xl mx-auto">
            The talented individuals who design, develop, and maintain the CSS website and digital presence
          </p>
        </div>

        {/* Top Section: Text + Image - Similar to Members page */}
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-10 mb-12 md:mb-16 p-6 md:p-8 bg-black/90 rounded-xl md:rounded-2xl backdrop-blur-lg border border-cyan-500/20 relative z-10 overflow-hidden">
          {/* Hexagon grid background */}
          <div className="absolute inset-0 bg-hexagon-pattern-black bg-[length:60px_60px] md:bg-[length:80px_80px] opacity-20"></div>

          {/* Animated circuit lines*/}
          <div className="absolute inset-0 opacity-20 md:opacity-30 hidden sm:block">
            <svg width="100%" height="100%" className="absolute inset-0">
              <path
                d="M0,50 Q150,0 300,100 T600,50 T900,150 T1200,50"
                stroke="url(#circuitGradient)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4,6"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="20"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M0,200 Q200,150 400,250 T800,200 T1200,300 T1600,200"
                stroke="url(#circuitGradient)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4,6"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="20"
                  to="0"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </path>
              <defs>
                <linearGradient
                  id="circuitGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#00f7ff" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#00ccff" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#00a2ff" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Matrix code rain effect */}
          <div className="absolute inset-0 overflow-hidden opacity-20 md:opacity-30">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute text-cyan-400 text-xs font-mono opacity-70 animate-matrix-rain"
                style={{
                  left: `${i * 12}%`,
                  animationDelay: `${i * 0.7}s`,
                  top: '-5%',
                }}
              >
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>

          {/* Glowing nodes/particles */}
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping shadow-lg shadow-cyan-400/50 hidden sm:block"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-1000 shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-1500 shadow-lg shadow-cyan-400/50 hidden sm:block"></div>

          {/* Cyberpunk border */}
          <div className="absolute inset-0 border border-cyan-500/10 md:border-2 rounded-xl md:rounded-2xl pointer-events-none">
            <div className="absolute -top-0.5 -left-0.5 w-2 h-2 md:w-3 md:h-3 border-t border-l md:border-t-2 md:border-l-2 border-cyan-400"></div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 border-t border-r md:border-t-2 md:border-r-2 border-cyan-400"></div>
            <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 md:w-3 md:h-3 border-b border-l md:border-b-2 md:border-l-2 border-cyan-400"></div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 border-b border-r md:border-b-2 md:border-r-2 border-cyan-400"></div>
          </div>

          {/* Text Content */}
          <div className="flex-1 relative order-2 lg:order-1">
            {/* Tech indicator bar */}
            <div className="absolute -left-3 md:-left-4 top-3 w-1.5 md:w-2 h-12 md:h-16 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full shadow-lg shadow-cyan-400/30"></div>

            {/* Terminal-style text */}
            <div className="relative pl-4 md:pl-6">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full mr-2 shadow-lg shadow-red-500/40"></div>
                <span className="text-cyan-400 font-mono text-xs md:text-sm">
                  SYSTEM_TERMINAL
                </span>
              </div>

              <p className="text-gray-200 text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl font-mono">
                <span className="text-cyan-400">$~ </span>
                Our development team combines technical expertise with creative vision to build innovative digital experiences. Each member brings unique skills that contribute to our society's technological advancement.
              </p>

              {/* Command prompt */}
              <div className="flex items-center mt-3 md:mt-4">
                <span className="text-cyan-400 font-mono text-sm md:text-base mr-2">
                  $~
                </span>
                <div className="w-1.5 h-4 md:w-2 md:h-5 bg-cyan-400 animate-blink"></div>
              </div>

              {/* Tech stats indicators */}
              <div className="flex flex-wrap mt-4 md:mt-6 gap-3 md:gap-6">
                <div className="flex items-center bg-black/50 p-1.5 md:p-2 rounded border border-cyan-500/20">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-1.5 md:mr-2 animate-pulse shadow-lg shadow-green-500/40"></div>
                  <span className="text-cyan-300 font-mono text-xs md:text-sm">
                    ACTIVE_DEV
                  </span>
                </div>
                <div className="flex items-center bg-black/50 p-1.5 md:p-2 rounded border border-cyan-500/20">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full mr-1.5 md:mr-2 animate-pulse delay-1000 shadow-lg shadow-blue-500/40"></div>
                  <span className="text-cyan-300 font-mono text-xs md:text-sm">
                    CODE_INNOVATION
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="flex-1 flex justify-center order-1 lg:order-2 mb-6 lg:mb-0">
            <div className="relative w-full max-w-xs md:max-w-md">
              {/* Outer tech frame glow */}
              <div className="absolute -inset-2 md:-inset-4 bg-cyan-500/10 rounded-2xl md:rounded-3xl blur-lg md:blur-xl"></div>

              {/* Image container*/}
              <div className="relative overflow-hidden rounded-lg md:rounded-xl border border-cyan-500/30 group bg-black/50">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>

                <img
                  src="images/developers.png"
                  alt="Development team"
                  className="relative w-full transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Scanning effect */}
                <div className="absolute w-full h-0.5 md:h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/3 animate-scan opacity-80 shadow-lg shadow-cyan-400/50"></div>

                {/* Cyberpunk corner indicators */}
                <div className="absolute top-1.5 left-1.5 w-3 h-3 md:w-4 md:h-4 border-t border-l md:border-t-2 md:border-l-2 border-cyan-400 opacity-80"></div>
                <div className="absolute top-1.5 right-1.5 w-3 h-3 md:w-4 md:h-4 border-t border-r md:border-t-2 md:border-r-2 border-cyan-400 opacity-80"></div>
                <div className="absolute bottom-1.5 left-1.5 w-3 h-3 md:w-4 md:h-4 border-b border-l md:border-b-2 md:border-l-2 border-cyan-400 opacity-80"></div>
                <div className="absolute bottom-1.5 right-1.5 w-3 h-3 md:w-4 md:h-4 border-b border-r md:border-b-2 md:border-r-2 border-cyan-400 opacity-80"></div>

                {/* HUD overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300 font-mono text-xs md:text-sm">
                      DEV_TEAM_IMG
                    </span>
                    <span className="text-cyan-300 font-mono text-xs md:text-sm">
                      100%
                    </span>
                  </div>
                  <div className="w-full bg-cyan-900/30 h-0.5 md:h-1 mt-1 rounded-full">
                    <div className="w-full h-full bg-cyan-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Floating tech elements around image */}
              <div className="absolute -top-2 -right-2 w-4 h-4 md:w-6 md:h-6 bg-cyan-500/30 rounded-full border border-cyan-400/50 animate-float-1 shadow-lg shadow-cyan-400/30 hidden sm:block"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 md:w-5 md:h-5 bg-purple-500/30 rounded-full border border-purple-400/50 animate-float-2 shadow-lg shadow-purple-400/30 hidden sm:block"></div>
            </div>
          </div>
        </div>

        {/* Category Tabs Section */}
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between mt-10 mb-12 p-6 bg-black/60 rounded-xl border border-cyan-500/30 relative overflow-hidden">
            {/* Tech background elements */}
            <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>

            {/* Cyberpunk border corners */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

            {/* Meet Our Team title */}
            <div className="relative mb-6 lg:mb-0 lg:mr-8">
              <div className="flex items-center">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent">
                  Filter by Role
                </h2>
                <div className="ml-4 w-1 h-8 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full"></div>
              </div>
              <p className="text-cyan-300/80 text-sm mt-2 font-mono ml-6">
                SELECT_TEAM_CATEGORY
              </p>
            </div>

            {/* Category tabs */}
            <div className="relative flex flex-wrap justify-center gap-2 p-4 rounded-lg bg-black/40 border border-cyan-500/20">
              {/* Tech border for tabs container */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400 opacity-70"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400 opacity-70"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400 opacity-70"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400 opacity-70"></div>

              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`relative px-5 py-2 font-mono font-bold tracking-wider transition-all duration-300 flex items-center
                    ${
                      selectedCategory === key
                        ? 'bg-gradient-to-r from-cyan-900/70 to-cyan-700/70 text-cyan-300 border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.7)]'
                        : 'bg-gray-900/60 text-gray-300 border border-gray-700 hover:border-cyan-500 hover:text-cyan-300 hover:shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    } 
                    rounded-md overflow-hidden group`}
                >
                  {/* Icon based on category */}
                  {React.createElement(category.icon, { className: "mr-2" })}
                  
                  {/* Active indicator for selected category */}
                  {selectedCategory === key && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                  )}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-cyan-400/0 group-hover:from-cyan-500/10 group-hover:to-cyan-400/10 transition-all duration-300 rounded-md ${
                      selectedCategory === key
                        ? 'from-cyan-500/20 to-cyan-400/20'
                        : ''
                    }`}
                  ></div>
                  <span
                    className={`relative z-10 ${selectedCategory === key ? 'drop-shadow-[0_0_4px_rgba(6,182,212,0.8)]' : ''}`}
                  >
                    {category.name}
                  </span>

                  {/* Bottom border highlight for selected category */}
                  {selectedCategory === key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Team Members Section */}
          <div className="relative mt-12">
            <h2 className="text-4xl mb-8 font-semibold text-left border-l-4 border-cyan-500 pl-4 text-cyan-300 flex items-center">
              {React.createElement(categories[selectedCategory].icon, { className: "mr-3" })}
              {categories[selectedCategory].name}
            </h2>

            <Carousel className="w-full">
              {getCurrentMembers().map((member, index) => (
                <div key={index} className="group perspective h-full p-1">
                  <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 group-hover:border-cyan-400/60 group-hover:shadow-cyan-400/20 transition-all duration-500 p-4">
                    {/* Tech corner elements with glow*/}
                    <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-500/50 opacity-70 group-hover:border-cyan-300 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-500/50 opacity-70 group-hover:border-cyan-300 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-500/50 opacity-70 group-hover:border-cyan-300 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-500/50 opacity-70 group-hover:border-cyan-300 group-hover:opacity-100 transition-all duration-500"></div>

                    <div className="flex flex-col items-center text-center h-full">
                      {/* Profile Image */}
                      <div className="relative mb-6">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-500/50">
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                        <div className="absolute -inset-3 rounded-full bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-all duration-500"></div>
                      </div>

                      {/* Name and Role */}
                      <h3 className="text-xl font-bold text-white mb-2">
                        {member.name}
                      </h3>
                      <p className="text-cyan-300 text-sm mb-4">
                        {member.role}
                      </p>
                      {member.year && (
                        <p className="text-cyan-400 text-xs mb-4">
                          {member.year}
                        </p>
                      )}

                      {/* Skills */}
                      {member.skills && (
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                          {member.skills.map((skill, i) => (
                            <span key={i} className="text-xs bg-cyan-900/30 text-cyan-300 px-2 py-1 rounded-full border border-cyan-500/30">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Bio (truncated) */}
                      {member.bio && (
                        <p className="text-gray-300 text-sm mb-6 line-clamp-3">
                          {member.bio}
                        </p>
                      )}

                      {/* Social Links */}
                      <div className="flex gap-4 text-xl mt-auto">
                        {member.social.instagram && (
                          <a
                            href={member.social.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-pink-500/30 border border-gray-700 hover:border-pink-500"
                          >
                            <FaInstagram className="text-white text-lg" />
                          </a>
                        )}
                        {member.social.facebook && (
                          <a
                            href={member.social.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-blue-500/30 border border-gray-700 hover:border-blue-500"
                          >
                            <FaFacebook className="text-white text-lg" />
                          </a>
                        )}
                        {member.social.linkedin && (
                          <a
                            href={member.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-blue-500/30 border border-gray-700 hover:border-blue-400"
                          >
                            <FaLinkedin className="text-white text-lg" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
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
  @keyframes matrix-rain {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100vh);
    }
  }
  @keyframes float-1 {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-10px) rotate(5deg);
    }
  }
  @keyframes float-2 {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-15px) rotate(-5deg);
    }
  }
  @keyframes float-3 {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-8px) rotate(3deg);
    }
  }
  @keyframes blink {
    0%, 50% {
      opacity: 1;
    }
    51%, 100% {
      opacity: 0;
    }
  }
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 0.1;
      transform: scale(1);
    }
    50% {
      opacity: 0.2;
      transform: scale(1.05);
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
  .animate-matrix-rain {
    animation: matrix-rain 20s linear infinite;
  }
  .animate-float-1 {
    animation: float-1 6s ease-in-out infinite;
  }
  .animate-float-2 {
    animation: float-2 8s ease-in-out infinite;
  }
  .animate-float-3 {
    animation: float-3 7s ease-in-out infinite;
  }
  .animate-blink {
    animation: blink 1s step-start infinite;
  }
  .animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
  }
  .animate-pulse-slow-delayed {
    animation: pulse-slow 5s ease-in-out infinite 1s;
  }
  .bg-grid-pattern {
    background-image: linear-gradient(
        rgba(6, 182, 212, 0.1) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
  }
  .bg-hexagon-pattern {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M50,0 L100,25 L100,75 L50,100 L0,75 L0,25 Z' fill='none' stroke='%2300ccff' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E");
  }
  .bg-hexagon-pattern-black {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M50,0 L100,25 L100,75 L50,100 L0,75 L0,25 Z' fill='none' stroke='%2300ccff' stroke-width='0.5' opacity='0.05'/%3E%3C/svg%3E");
  }
  .bg-circuit-pattern {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M0,0 L100,100 M100,0 L0,100 M25,0 L25,100 M50,0 L50,100 M75,0 L75,100 M0,25 L100,25 M0,50 L100,50 M0,75 L100,75' fill='none' stroke='%2300ccff' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E");
  }
`}</style>
    </div>
  );
}

export default Developers;