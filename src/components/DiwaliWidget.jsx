import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAuth } from '/src/context/AuthContext.jsx';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import AdminPanel from './AdminPanelDiwali';
import DiyaIcon from './DiyaIcon';

const DiwaliWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('send');
  const { user, profile: authProfile } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  const widgetRef = useRef(null);
  const popupRef = useRef(null);
  const tl = useRef(null);

  // Check admin status based on your existing logic
  useEffect(() => {
    checkAdminStatus();
  }, [user, authProfile]);

  const checkAdminStatus = () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    const adminStatus = 
      authProfile?.role === 'admin' || 
      authProfile?.is_admin === true ||
      authProfile?.admin === true ||
      (authProfile?.email && authProfile.email.includes('admin')) ||
      (user?.email && user.email.includes('admin'));

    setIsAdmin(adminStatus);
  };

  // GSAP Animations
  useEffect(() => {
    tl.current = gsap.timeline({ paused: true });
    
    tl.current
      .to(widgetRef.current, {
        scale: 0.8,
        duration: 0.2,
        ease: "power2.inOut"
      })
      .to(popupRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "back.out(1.7)",
        display: 'block'
      }, "-=0.1")
      .fromTo('.tab-content', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.1 },
        "-=0.2"
      );

    // Floating animation for widget
    gsap.to(widgetRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Glow pulse effect
    gsap.to(widgetRef.current, {
      boxShadow: "0 0 30px #ff9e00, 0 0 60px #ff6b00",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

  }, []);

  const toggleWidget = () => {
    if (isOpen) {
      closeWidget();
    } else {
      openWidget();
    }
  };

  const openWidget = () => {
    tl.current.play();
    setIsOpen(true);
  };

  const closeWidget = () => {
    tl.current.reverse();
    setIsOpen(false);
  };

  const handleTabChange = (tab) => {
    gsap.to('.tab-content', {
      opacity: 0,
      y: 20,
      duration: 0.2,
      onComplete: () => {
        setActiveTab(tab);
        gsap.to('.tab-content', {
          opacity: 1,
          y: 0,
          duration: 0.3
        });
      }
    });
  };

  return (
    <div className="fixed bottom-18 right-6 z-100">
      {/* Floating Widget */}
      <div
        ref={widgetRef}
        className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full cursor-pointer shadow-2xl flex items-center justify-center relative group"
        onClick={toggleWidget}
      >
        <DiyaIcon />
        
        {/* Glow effect */}
        {/* <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-50 group-hover:opacity-75 blur-md animate-pulse"></div> */}
        
        {/* Sparkles */}
        {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div> */}
        {/* <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-orange-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div> */}

        {/* Admin Badge */}
        {isAdmin && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
        )}
      </div>

      {/* Popup Panel */}
      <div
        ref={popupRef}
        className="absolute bottom-20 right-0 w-80 bg-gradient-to-br from-purple-900/95 via-orange-900/95 to-pink-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-orange-400/30 hidden opacity-0 scale-95 origin-bottom-right"
        style={{ display: 'none' }}
      >
        {/* Header with Close Button */}
        <div className="p-4 border-b border-orange-500/30 relative">
          {/* Close Button */}
          <button
            onClick={closeWidget}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-orange-300 hover:text-orange-100 hover:bg-orange-500/30 rounded-full transition-all duration-200 group"
          >
            <svg 
              className="w-4 h-4 group-hover:scale-110 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-poppins pr-6">
            🪔 Diwali Wishes
          </h2>
          <p className="text-center text-orange-200/80 text-sm mt-1 font-inter">
            Spread the light of happiness
          </p>
          {isAdmin && (
            <div className="flex items-center justify-center mt-2">
              <span className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full border border-red-500/30">
                🛡️ Admin Mode
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-orange-500/20">
          <button
            onClick={() => handleTabChange('send')}
            className={`flex-1 py-3 text-sm font-medium transition-all duration-300 ${
              activeTab === 'send'
                ? 'text-orange-400 bg-orange-500/10 border-b-2 border-orange-400'
                : 'text-orange-200/70 hover:text-orange-300'
            } font-poppins`}
          >
            🪔 Send Wish
          </button>
          <button
            onClick={() => handleTabChange('view')}
            className={`flex-1 py-3 text-sm font-medium transition-all duration-300 ${
              activeTab === 'view'
                ? 'text-orange-400 bg-orange-500/10 border-b-2 border-orange-400'
                : 'text-orange-200/70 hover:text-orange-300'
            } font-poppins`}
          >
            💌 View Wishes
          </button>
          {isAdmin && (
            <button
              onClick={() => handleTabChange('admin')}
              className={`flex-1 py-3 text-sm font-medium transition-all duration-300 ${
                activeTab === 'admin'
                  ? 'text-orange-400 bg-orange-500/10 border-b-2 border-orange-400'
                  : 'text-orange-200/70 hover:text-orange-300'
              } font-poppins`}
            >
              ⚙️ Admin
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="tab-content">
            {activeTab === 'send' && <MessageForm />}
            {activeTab === 'view' && <MessageList />}
            {activeTab === 'admin' && isAdmin && <AdminPanel />}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.9s'}}></div>
      </div>
    </div>
  );
};

export default DiwaliWidget;