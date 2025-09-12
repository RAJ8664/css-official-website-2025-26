import React from 'react';
import { FaInstagram, FaFacebook, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-[#00010a] text-gray-400 py-12 overflow-hidden">
      {/* Dark glowing blobs */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-cyan-700/20 rounded-full blur-3xl animate-float-1"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-800/15 rounded-full blur-3xl animate-float-2"></div>

      {/* Subtle cyan code rain */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-cyan-400 font-mono text-xs animate-[fall_6s_linear_infinite]"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-20px',
              animationDelay: `${Math.random() * 6}s`,
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 z-10">
        {/* Logo + Contact Info */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <img
            src="https://res.cloudinary.com/dludtk5vz/image/upload/v1757083555/CSS-LOGO_scfa6u.jpg"
            alt="CSS Logo"
            className="w-20 mb-2"
          />
          <div className="flex flex-col items-center md:items-start gap-2 text-cyan-300 font-mono text-lg">
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-cyan-400" />
              <span>contact@css-official.com</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="text-cyan-400" />
              <span>+91 12345 67890</span>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex gap-6 text-2xl text-cyan-300">
          <a
            href="https://www.instagram.com/css_nits/"
            className="hover:text-cyan-500 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.facebook.com/CSS.NITSilchar/"
            className="hover:text-cyan-500 transition"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.linkedin.com/company/cssnits"
            className="hover:text-cyan-500 transition"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>

      {/* Bottom line */}
      <div className="relative z-10 mt-10 border-t border-cyan-500/10 pt-4 text-center text-cyan-300 font-mono text-sm">
        © 2025 CSS Official Website. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;







