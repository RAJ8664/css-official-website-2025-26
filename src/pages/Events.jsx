// Events.jsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import eventsContent from "../constants/events";
import { FaArrowRight, FaExternalLinkAlt, FaLock, FaCheck } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import "../styles/eventsAnimation.css";

// Add this near the top of your Events.jsx file, after the imports
const whatsappGroups = {
    "css-hackathon-2024": "https://chat.whatsapp.com/YOUR_HACKATHON_LINK",
    "web-dev-workshop": "https://chat.whatsapp.com/YOUR_WORKSHOP_LINK",
    // Add more event slugs and their WhatsApp links here
    // Make sure the slugs match exactly with your events in eventsContent
};
// EventCard component with registration handling
function EventCard({
  slug,
  name,
  description,
  organizer,
  status,
  image,
  registrationLink,
  moreEvents,
  requiresAuth = false,
  onRegister,
  isRegistered = false,
}) {
  const [hovered, setHovered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const { user } = useAuth();
  const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;

  const handleInteraction = () => {
    if (isTouchDevice) setHovered(!hovered);
  };

  const handleRegisterClick = async (e) => {
    if (requiresAuth && !user) {
      e.preventDefault();
      e.stopPropagation();
      alert('Please login to register for this event');
      // Navigate('/auth');
      return;
    }
    
    if (onRegister && user && !isRegistered) {
      e.preventDefault();
      e.stopPropagation();
      setRegistering(true);
      await onRegister();
      setRegistering(false);
    }
  };

  return (
    <div className="w-full max-w-md h-full min-w-0">
      {/* Event Card */}
      <div className="perspective h-full w-full">
        <div
          className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
            hovered ? "rotate-y-180" : ""
          }`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleInteraction}
        >
          {/* Front */}
          <div className="relative inset-0 backface-hidden bg-gray-700 rounded-xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/60 hover:shadow-cyan-400/20 transition-all duration-500 min-h-[320px] sm:min-h-[370px] md:min-h-[400px]">
            {/* Auth required badge */}
            {requiresAuth && !user && (
              <div className="absolute top-3 left-3 z-20 bg-red-600/90 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                <FaLock className="text-xs" /> Login Required
              </div>
            )}
            
            {/* Registered badge */}
            {isRegistered && (
              <div className="absolute top-3 left-3 z-20 bg-green-600/90 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                <FaCheck className="text-xs" /> Registered
              </div>
            )}

            {/* Rest of front card content */}
            <div className="relative inset-0 rounded-xl bg-cyan-500/5 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative inset-0 bg-tech-grid opacity-10"></div>

            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-500/70"></div>
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-500/70"></div>
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-500/70"></div>
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-500/70"></div>

            <div className="absolute w-full h-full overflow-hidden">
              <img
                src={image || "https://via.placeholder.com/400x300"}
                alt={name}
                className="w-full h-full object-cover md:object-cover lg:object-cover rounded-lg"
              />
            </div>

            <div className="absolute inset-0 rounded-xl border border-cyan-400/30 animate-pulse-slow pointer-events-none"></div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl overflow-hidden border border-cyan-500/50 shadow-2xl shadow-cyan-500/30 min-h-[320px] sm:min-h-[370px] md:min-h-[400px]">
            <div className="absolute inset-0 rounded-xl bg-cyan-500/10 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-circuit-pattern opacity-15"></div>
            <div className="absolute inset-0 rounded-xl border-2 border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-500"></div>

            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80"></div>
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80"></div>
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-400/80"></div>
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-400/80"></div>

            <div className="relative h-full flex flex-col justify-between p-3 sm:p-4 md:p-6 z-10">
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent">
                  {name}
                </h3>
                <p className="text-xs sm:text-sm text-cyan-300 font-mono mb-2 sm:mb-4">
                  {status}
                </p>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base ">
                  {description}
                </p>
                <p className="text-xs sm:text-sm text-cyan-200">
                  <strong className="text-cyan-400">Organizer: </strong>
                  {organizer}
                </p>
              </div>

              {registrationLink ? (
                <a
                  href={registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-6 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-700 to-cyan-900 rounded-lg text-white hover:from-cyan-600 hover:to-cyan-800 transition-all duration-300 border border-cyan-500/50 hover:border-cyan-400/70 text-sm sm:text-base"
                  onClick={handleRegisterClick}
                >
                  Register Now <FaExternalLinkAlt className="text-xs" />
                </a>
              ) : onRegister ? (
                <button
                  onClick={handleRegisterClick}
                  disabled={isRegistered || registering}
                  className={`mb-6 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white transition-all duration-300 border text-sm sm:text-base ${
                    isRegistered 
                      ? 'bg-green-600 border-green-500 cursor-not-allowed' 
                      : registering
                      ? 'bg-cyan-800 border-cyan-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-700 to-cyan-900 border-cyan-500/50 hover:from-cyan-600 hover:to-cyan-800 hover:border-cyan-400/70'
                  }`}
                >
                  {registering ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Registering...
                    </>
                  ) : isRegistered ? (
                    <>
                      <FaCheck className="text-xs" />
                      Registered ✓
                    </>
                  ) : (
                    'Register for Event'
                  )}
                </button>
              ) : null}

              <div className="absolute top-4 right-4 flex space-x-1 z-20">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow shadow-red-500/50"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-300 shadow shadow-yellow-500/50"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-700 shadow shadow-green-500/50"></div>
              </div>
            </div>

            <div className="absolute inset-0 rounded-xl border border-cyan-400/40 animate-pulse-slow pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* More Events Link */}
      {Array.isArray(moreEvents) && moreEvents.length > 0 && slug && (
        <Link
          to={`/events/${slug}`}
          className="mb-2 mt-1 flex items-center justify-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 text-md sm:text-base underline"
        >
          View More Events <FaArrowRight className="text-xs" />
        </Link>
      )}
    </div>
  );
}

// Header Component remains the same
function Header({ title, description }) {
  return (
    <header className="text-center mb-12 relative z-10 px-2 sm:px-4">
      <h1
        className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
        style={{ fontFamily: "Goldman, sans-serif" }}
      >
        {title}
      </h1>
      <div className="max-w-4xl mx-auto p-3 sm:p-6 md:p-8 bg-black/70 rounded-lg md:rounded-2xl backdrop-blur-lg border border-cyan-500/30 relative overflow-hidden mt-6 sm:mt-12 mb-8 sm:mb-16">
        <div className="absolute inset-0 bg-hexagon-pattern-black bg-[length:60px_60px] opacity-20"></div>
        <p className="text-gray-200 text-sm sm:text-lg md:text-xl leading-relaxed font-mono">
          <span className="text-cyan-400">$~ </span>
          {description}
        </p>
      </div>
    </header>
  );
}

export default function EventsList() {
  const { body } = eventsContent;
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  
  const sections = ["Upcoming", "Yearly", "Cultural", "Technical"];

  // Fetch user's registered events
  useEffect(() => {
    if (user) {
      fetchRegisteredEvents();
    } else {
      setRegisteredEvents([]);
    }
  }, [user]);

  const fetchRegisteredEvents = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_events')
        .select('event_slug')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching registered events:', error);
        return;
      }
      
      if (data) {
        setRegisteredEvents(data.map(item => item.event_slug));
        console.log('Registered events:', data.map(item => item.event_slug));
      }
    } catch (error) {
      console.error('Error in fetchRegisteredEvents:', error);
    }
  };

  // Filter upcoming events
  useEffect(() => {
    const upcoming = body.events.filter(event => 
      event.status?.toLowerCase().includes('upcoming') || 
      event.status?.toLowerCase().includes('coming soon')
    );
    setUpcomingEvents(upcoming);
  }, [body.events]);

  // In Events.jsx - update the handleEventRegistration function
const handleEventRegistration = async (eventSlug, eventName) => {
    if (!user) {
        alert('Please login to register for events');
        Navigate('/auth');
        return false;
    }

    try {
        console.log('Registering for event:', eventSlug, eventName);
        
        const { data, error } = await supabase
            .from('user_events')
            .insert([
                { 
                    user_id: user.id, 
                    event_slug: eventSlug,
                    registered_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error('Registration error:', error);
            
            if (error.code === '23505') {
                console.log('User already registered for this event');
                setRegisteredEvents(prev => [...prev, eventSlug]);
                alert(`You're already registered for ${eventName}! Check your dashboard for the WhatsApp group link.`);
                return true;
            }
            
            throw error;
        }

        console.log('Registration successful:', data);
        setRegisteredEvents(prev => [...prev, eventSlug]);
        
        // SHOW WHATSAPP LINK IN ALERT
        const whatsappLink = whatsappGroups[eventSlug];
        if (whatsappLink) {
            alert(`🎉 Successfully registered for ${eventName}!\n\nJoin the WhatsApp group for updates:\n${whatsappLink}\n\nYou can also find this link in your dashboard.`);
        } else {
            alert(`🎉 Successfully registered for ${eventName}!\n\nCheck your dashboard for event updates.`);
        }
        
        await fetchRegisteredEvents();
        return true;
        
    } catch (error) {
        console.error('Registration failed:', error);
        alert('Failed to register for event. Please try again.');
        return false;
    }
};

  // Check if user is registered for an event
  const isEventRegistered = (eventSlug) => {
    return registeredEvents.includes(eventSlug);
  };

  return (
    <div className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white px-2 sm:px-4 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Falling binary rain */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-green-400 text-xs animate-[fall_5s_linear_infinite]"
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

        {/* Grid lines */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] md:bg-[length:50px_50px] opacity-10 animate-grid-move"></div>

        {/* Hexagon pattern */}
        <div className="absolute inset-0 bg-hexagon-pattern bg-[length:80px_80px] md:bg-[length:100px_100px] opacity-5 animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <Header
          title="Our Events"
          description="From DSA Marathons, Development, ML and Design Workshops to sessions that sharpen technical expertise, from the spirited CSS Olympics that celebrate sportsmanship to cultural highlights like ESPERANZA, CSS GO, and our flagship annual fest CSS ABACUS — our calendar is packed with opportunities to learn, grow, and celebrate. Guided by the motto Participate, Enjoy & Learn, every event is designed to build all-rounders and leave behind unforgettable memories."
        />

        {sections.map((section) => {
          // Filter events for this section
          let sectionEvents = [];
          if (section === "Upcoming") {
            sectionEvents = upcomingEvents;
          } else {
            sectionEvents = body.events.filter((event) => event.section === section);
          }

          if (sectionEvents.length === 0) return null;

          return (
            <div key={section} className="mb-12 sm:mb-16 relative z-10">
              <div className="flex items-center justify-center mb-8 sm:mb-12 p-3 sm:p-6 bg-black/60 rounded-lg border border-cyan-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
                {/* Cyberpunk border corners */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent text-center">
                  {section.toUpperCase()} EVENTS
                </h2>
              </div>

              {/* Grid Container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12 lg:gap-y-14 w-full max-w-6xl mx-auto px-2 sm:px-4 justify-items-center">
                {sectionEvents.map((event) => (
                  <EventCard
                    key={event.slug}
                    slug={event.slug}
                    name={event.name}
                    description={event.description}
                    organizer={event.organizer}
                    status={event.status}
                    image={event["poster-url"]}
                    registrationLink={event.registrationLink}
                    moreEvents={event.moreEvents}
                    requiresAuth={section === "Upcoming"}
                    onRegister={section === "Upcoming" ? () => handleEventRegistration(event.slug, event.name) : null}
                    isRegistered={isEventRegistered(event.slug)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}