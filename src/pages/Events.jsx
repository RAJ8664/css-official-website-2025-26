// pages/EventsList.jsx - COMPLETE UPDATED VERSION
import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import eventsContent from "../constants/events";
import { FaArrowRight, FaExternalLinkAlt, FaLock, FaCheck, FaHandPointer, FaInfoCircle, FaTrophy, FaGraduationCap } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import "../styles/eventsAnimation.css";

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
  isCompleted = false,
  isDirectRegistration = true,
  isCSEOnly = false
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

  const getTapMessage = () => {
    if (status?.toLowerCase() === 'upcoming') {
      return "Tap for info & register";
    }
    if (isCompleted) {
      return "Tap for event details";
    }
    return "Tap for more info";
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
          <div className={`relative inset-0 backface-hidden bg-gray-700 rounded-xl overflow-hidden border shadow-2xl transition-all duration-500 min-h-[280px] sm:min-h-[320px] md:min-h-[370px] lg:min-h-[400px] ${
            isCompleted 
              ? 'border-green-500/20 shadow-green-500/10 hover:border-green-400/60 hover:shadow-green-400/20' 
              : 'border-cyan-500/20 shadow-cyan-500/10 hover:border-cyan-400/60 hover:shadow-cyan-400/20'
          }`}>
            {/* Mobile tap indicator */}
            {isTouchDevice && !hovered && (
              <div className={`absolute top-2 right-2 z-30 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 animate-pulse ${
                isCompleted ? 'bg-green-600/90' : 'bg-cyan-600/90'
              }`}>
                <FaHandPointer className="text-xs" /> 
                <span className="hidden xs:inline">{getTapMessage()}</span>
                <span className="xs:hidden">Tap</span>
              </div>
            )}
            
            {/* Event Badges */}
            <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
              {/* Completed event badge */}
              {isCompleted && (
                <div className="bg-green-600/90 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <FaTrophy className="text-xs" /> Completed
                </div>
              )}
              
              {/* CSE Only badge */}
              {isCSEOnly && !isCompleted && (
                <div className="bg-purple-600/90 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <FaGraduationCap className="text-xs" /> CSE Only
                </div>
              )}
              
              {/* Multi-Event badge */}
              {!isDirectRegistration && !isCompleted && (
                <div className="bg-indigo-600/90 text-white px-2 py-1 rounded text-xs font-bold">
                  Multi-Event
                </div>
              )}
              
              {/* Auth required badge */}
              {requiresAuth && !user && !isCompleted && (
                <div className="bg-red-600/90 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <FaLock className="text-xs" /> Login Required
                </div>
              )}
              
              {/* Registered badge */}
              {isRegistered && !isCompleted && (
                <div className="bg-green-600/90 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <FaCheck className="text-xs" /> Registered
                </div>
              )}
            </div>

            {/* Rest of front card content */}
            <div className={`relative inset-0 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 ${
              isCompleted ? 'bg-green-500/5' : 'bg-cyan-500/5'
            }`}></div>
            <div className="relative inset-0 bg-tech-grid opacity-10"></div>

            <div className={`absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 ${
              isCompleted ? 'border-green-500/70' : 'border-cyan-500/70'
            }`}></div>
            <div className={`absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 ${
              isCompleted ? 'border-green-500/70' : 'border-cyan-500/70'
            }`}></div>
            <div className={`absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 ${
              isCompleted ? 'border-green-500/70' : 'border-cyan-500/70'
            }`}></div>
            <div className={`absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 ${
              isCompleted ? 'border-green-500/70' : 'border-cyan-500/70'
            }`}></div>

            {/* Image Container */}
            <div className="absolute w-full h-full overflow-hidden">
              <img
                src={image || "https://via.placeholder.com/400x300"}
                alt={name}
                className="w-full h-full object-cover rounded-lg"
                style={{ 
                  objectPosition: 'center',
                  minHeight: '100%',
                  minWidth: '100%'
                }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x300/1a202c/cyan?text=Event+Image";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>

            {/* Event info overlay on front card */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 to-transparent rounded-b-xl">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white line-clamp-1">
                {name}
              </h3>
              <p className={`text-xs font-mono mt-1 ${
                isCompleted ? 'text-green-300' : 'text-cyan-300'
              }`}>
                {status}
              </p>
              <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                {description}
              </p>
            </div>

            <div className={`absolute inset-0 rounded-xl border animate-pulse-slow pointer-events-none ${
              isCompleted ? 'border-green-400/30' : 'border-cyan-400/30'
            }`}></div>
          </div>

          {/* Back */}
          <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl overflow-hidden border shadow-2xl min-h-[280px] sm:min-h-[320px] md:min-h-[370px] lg:min-h-[400px] ${
            isCompleted 
              ? 'border-green-500/50 shadow-green-500/30' 
              : 'border-cyan-500/50 shadow-cyan-500/30'
          }`}>
            <div className={`absolute inset-0 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-500 ${
              isCompleted ? 'bg-green-500/10' : 'bg-cyan-500/10'
            }`}></div>
            <div className="absolute inset-0 bg-circuit-pattern opacity-15"></div>
            <div className={`absolute inset-0 rounded-xl border-2 hover:border-cyan-400/50 transition-all duration-500 ${
              isCompleted ? 'border-green-500/30 hover:border-green-400/50' : 'border-cyan-500/30'
            }`}></div>

            <div className={`absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 ${
              isCompleted ? 'border-green-400/80' : 'border-cyan-400/80'
            }`}></div>
            <div className={`absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 ${
              isCompleted ? 'border-green-400/80' : 'border-cyan-400/80'
            }`}></div>
            <div className={`absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 ${
              isCompleted ? 'border-green-400/80' : 'border-cyan-400/80'
            }`}></div>
            <div className={`absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 ${
              isCompleted ? 'border-green-400/80' : 'border-cyan-400/80'
            }`}></div>

            {/* Mobile back indicator */}
            {isTouchDevice && (
              <div className="absolute top-2 right-2 z-30 bg-purple-600/90 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                <FaInfoCircle className="text-xs" /> 
                <span className="hidden xs:inline">Tap to flip back</span>
                <span className="xs:hidden">Tap back</span>
              </div>
            )}

            <div className="relative h-full flex flex-col justify-between p-3 sm:p-4 md:p-6 z-10">
              <div className="flex-1 overflow-hidden">
                <h3 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent line-clamp-2 ${
                  isCompleted 
                    ? 'from-green-300 to-green-100' 
                    : 'from-cyan-300 to-cyan-100'
                }`}>
                  {name}
                </h3>
                
                {/* Event Badges on Back */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {isCSEOnly && (
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs flex items-center gap-1">
                      <FaGraduationCap size={10} /> CSE Only
                    </span>
                  )}
                  {!isDirectRegistration && (
                    <span className="px-2 py-1 bg-indigo-600/20 text-indigo-400 rounded text-xs">
                      Multi-Event
                    </span>
                  )}
                </div>
                
                <p className={`text-xs font-mono mb-2 sm:mb-3 ${
                  isCompleted ? 'text-green-300' : 'text-cyan-300'
                }`}>
                  {status}
                </p>
                <p className="text-gray-300 mb-3 text-xs sm:text-sm">
                  {description}
                </p>
                <p className={`text-xs mt-2 ${
                  isCompleted ? 'text-green-200' : 'text-cyan-200'
                }`}>
                  <strong className={isCompleted ? 'text-green-400' : 'text-cyan-400'}>Organizer: </strong>
                  {organizer}
                </p>
                
                {/* Show completion message for completed events */}
                {isCompleted && (
                  <div className="mt-3 p-2 bg-green-900/30 border border-green-500/30 rounded text-xs text-green-200">
                    <FaTrophy className="inline mr-1" />
                    This event has been successfully completed. Stay tuned for future events!
                  </div>
                )}

                {/* Show CSE-only message */}
                {isCSEOnly && !isCompleted && (
                  <div className="mt-3 p-2 bg-purple-900/30 border border-purple-500/30 rounded text-xs text-purple-200">
                    <FaGraduationCap className="inline mr-1" />
                    This event is exclusively for CSE students (@cse.nits.ac.in emails only)
                  </div>
                )}

                {/* Show multi-event message */}
                {!isDirectRegistration && !isCompleted && (
                  <div className="mt-3 p-2 bg-indigo-900/30 border border-indigo-500/30 rounded text-xs text-indigo-200">
                    <FaInfoCircle className="inline mr-1" />
                    This event contains multiple sub-events. Click below to view and register.
                  </div>
                )}
              </div>

              {/* Registration Buttons */}
              {!isCompleted && registrationLink ? (
                <a
                  href={registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 mb-2 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-700 to-cyan-900 rounded-lg text-white hover:from-cyan-600 hover:to-cyan-800 transition-all duration-300 border border-cyan-500/50 hover:border-cyan-400/70 text-xs sm:text-sm"
                  onClick={handleRegisterClick}
                >
                  Register Now <FaExternalLinkAlt className="text-xs" />
                </a>
              ) : !isCompleted && onRegister && isDirectRegistration ? (
                // Direct Registration Button
                <button
                  onClick={handleRegisterClick}
                  disabled={isRegistered || registering}
                  className={`mt-3 mb-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white transition-all duration-300 border text-xs sm:text-sm ${
                    isRegistered 
                      ? 'bg-green-600 border-green-500 cursor-not-allowed' 
                      : registering
                      ? 'bg-cyan-800 border-cyan-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-700 to-cyan-900 border-cyan-500/50 hover:from-cyan-600 hover:to-cyan-800 hover:border-cyan-400/70'
                  }`}
                >
                  {registering ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      Registering...
                    </>
                  ) : isRegistered ? (
                    <>
                      <FaCheck className="text-xs" />
                      Registered
                    </>
                  ) : (
                    'Register Now'
                  )}
                </button>
              ) : !isCompleted && !isDirectRegistration ? (
                // Multi-event Registration Button - Redirect to event page
                <Link
                  to={`/events/${slug}`}
                  className="mt-3 mb-2 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-700 to-purple-900 rounded-lg text-white hover:from-purple-600 hover:to-purple-800 transition-all duration-300 border border-purple-500/50 hover:border-purple-400/70 text-xs sm:text-sm"
                >
                  View Events <FaArrowRight className="text-xs" />
                </Link>
              ) : null}

              <div className="absolute top-2 left-2 flex space-x-1 z-20">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow shadow-red-500/50"></div>
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse delay-300 shadow shadow-yellow-500/50"></div>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse delay-700 shadow shadow-green-500/50"></div>
              </div>
            </div>

            <div className={`absolute inset-0 rounded-xl border animate-pulse-slow pointer-events-none ${
              isCompleted ? 'border-green-400/40' : 'border-cyan-400/40'
            }`}></div>
          </div>
        </div>
      </div>

      {/* More Events Link */}
      {Array.isArray(moreEvents) && moreEvents.length > 0 && slug && (
        <Link
          to={`/events/${slug}`}
          className="mb-2 mt-2 bg-red flex items-center justify-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 text-sm sm:text-base underline"
        >
          View More Events <FaArrowRight className="text-xs" />
        </Link>
      )}
    </div>
  );
}

function Header({ title, description }) {
  return (
    <header className="text-center mb-8 sm:mb-12 relative z-10 px-2">
      <h1
        className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 text-white"
        style={{ fontFamily: "Goldman, sans-serif" }}
      >
        {title}
      </h1>
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-black/70 rounded-lg md:rounded-xl lg:rounded-2xl backdrop-blur-lg border border-cyan-500/30 relative overflow-hidden mt-4 sm:mt-6 mb-6 sm:mb-12">
        <div className="absolute inset-0 bg-hexagon-pattern-black bg-[length:40px_40px] sm:bg-[length:50px_50px] opacity-20"></div>
        <p className="text-gray-200 text-xs sm:text-sm md:text-base lg:text-xl leading-relaxed font-mono">
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
  const [databaseEvents, setDatabaseEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const sections = ["Upcoming", "Completed", "Yearly", "Cultural", "Technical"];

  useEffect(() => {
    fetchDatabaseEvents();
    if (user) {
      fetchRegisteredEvents();
    }
    const handleEventsUpdate = () => {
      fetchDatabaseEvents();
      if (user) {
        fetchRegisteredEvents();
      }
    };

    window.addEventListener('eventsUpdated', handleEventsUpdate);

    return () => {
      window.removeEventListener('eventsUpdated', handleEventsUpdate);
    };
  }, [user, refreshTrigger]);

  useEffect(() => {
    const handleEventDeleted = (event) => {
      const { eventId, eventSlug } = event.detail;
      setDatabaseEvents(prevEvents => {
        const newEvents = prevEvents.filter(e => e.id !== eventId && e.slug !== eventSlug);
        return newEvents;
      });
      
      setRegisteredEvents(prev => prev.filter(slug => slug !== eventSlug));
      
      setTimeout(() => {
        fetchDatabaseEvents();
        if (user) {
          fetchRegisteredEvents();
        }
      }, 100);
    };

    window.addEventListener('eventDeleted', handleEventDeleted);

    return () => {
      window.removeEventListener('eventDeleted', handleEventDeleted);
    };
  }, [user]);

  const fetchDatabaseEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDatabaseEvents(data || []);
    } catch (error) {
      console.error('Error fetching events from database:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshEvents = () => {
    setRefreshTrigger(prev => prev + 1);
  };

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
      }
    } catch (error) {
      console.error('Error in fetchRegisteredEvents:', error);
    }
  };

  const getEventsForSection = (section) => {
    if (section === "Upcoming") {
      return databaseEvents.filter(event => 
        event.status?.toLowerCase() === 'upcoming' && event.is_active === true
      );
    } else if (section === "Completed") {
      return databaseEvents.filter(event => 
        event.status?.toLowerCase() === 'completed' && event.is_active === true
      );
    } else {
      const dbEvents = databaseEvents.filter(event => 
        event.section?.toLowerCase() === section.toLowerCase() && event.is_active === true
      );
      
      const contentEvents = body.events.filter(event => 
        event.section === section
      ).map(event => ({
        ...event,
        isFromContent: true, 
      }));

      const allEvents = [...dbEvents, ...contentEvents];
      const uniqueEvents = allEvents.filter((event, index, self) =>
        index === self.findIndex(e => e.slug === event.slug)
      );

      return uniqueEvents;
    }
  };

  const handleEventRegistration = async (eventSlug, eventName) => {
    if (!user) {
      alert('Please login to register for events');
      return false;
    }

    try {
      // Fetch event details including is_cse_only
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('whatsapp_group_link, name, max_participants, current_participants, is_active, is_cse_only')
        .eq('slug', eventSlug)
        .single();

      if (eventError) throw eventError;
      if (!eventData) throw new Error('Event not found');

      // ✅ CHECK IF EVENT IS CSE-ONLY AND USER IS NOT CSE STUDENT
      if (eventData.is_cse_only) {
        const userEmail = user.email;
        const isCSEStudent = userEmail.toLowerCase().endsWith('@cse.nits.ac.in');
        
        if (!isCSEStudent) {
          alert('🚫 This event is exclusively for CSE students only.\n\nYour email: ' + userEmail + '\nRequired domain: @cse.nits.ac.in');
          return false;
        }
      }

      if (!eventData.is_active) {
        alert('This event is currently not active for registration.');
        return false;
      }

      if (eventData.current_participants >= eventData.max_participants) {
        alert('Sorry, this event is already full!');
        return false;
      }

      const { data, error } = await supabase
        .from('user_events')
        .insert([
          { 
            user_id: user.id, 
            event_slug: eventSlug,
            event_name: eventData.name,
            whatsapp_group_link: eventData.whatsapp_group_link
          }
        ])
        .select();

      if (error) {
        console.error('Registration error:', error);
        
        if (error.code === '23505') {
          setRegisteredEvents(prev => [...prev, eventSlug]);
          alert(`You're already registered for ${eventName}! Check your dashboard for the WhatsApp group link.`);
          return true;
        }
        
        throw error;
      }

      const { error: updateError } = await supabase
        .from('events')
        .update({ current_participants: (eventData.current_participants || 0) + 1 })
        .eq('slug', eventSlug);

      if (updateError) {
        console.error('Error updating participant count:', updateError);
      }

      setRegisteredEvents(prev => [...prev, eventSlug]);
      
      if (eventData.whatsapp_group_link) {
        alert(`🎉 Successfully registered for ${eventName}!\n\nJoin the WhatsApp group for updates:\n${eventData.whatsapp_group_link}\n\nYou can also find this link in your dashboard.`);
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

  const isEventRegistered = (eventSlug) => {
    return registeredEvents.includes(eventSlug);
  };

  const isDatabaseEvent = (event) => {
    return event.id && !event.isFromContent;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white px-2 sm:px-3 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 md:py-8 lg:py-10 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          {[...Array(30)].map((_, i) => (
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
        <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] sm:bg-[length:40px_40px] md:bg-[length:50px_50px] opacity-10 animate-grid-move"></div>

        {/* Hexagon pattern */}
        <div className="absolute inset-0 bg-hexagon-pattern bg-[length:60px_60px] sm:bg-[length:80px_80px] md:bg-[length:100px_100px] opacity-5 animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <Header
          title="Our Events"
          description="From DSA Marathons, Development, ML and Design Workshops to sessions that sharpen technical expertise, from the spirited CSS Olympics that celebrate sportsmanship to cultural highlights like ESPERANZA, CSS GO, and our flagship annual fest CSS ABACUS — our calendar is packed with opportunities to learn, grow, and celebrate. Guided by the motto Participate, Enjoy & Learn, every event is designed to build all-rounders and leave behind unforgettable memories."
        />

        {/* Mobile Instructions */}
        <div className="md:hidden mb-6 p-3 bg-cyan-900/30 border border-cyan-500/50 rounded-lg text-center">
          <p className="text-cyan-300 text-sm flex items-center justify-center gap-2">
            <FaHandPointer className="text-cyan-400" />
            Tap on cards to flip and see registration options
          </p>
        </div>

        {sections.map((section) => {
          const sectionEvents = getEventsForSection(section);

          if (sectionEvents.length === 0) return null;

          return (
            <div key={section} className="mb-8 sm:mb-12 md:mb-16 relative z-10">
              <div className={`flex items-center justify-center mb-6 sm:mb-8 md:mb-12 p-2 sm:p-4 md:p-6 bg-black/60 rounded-lg border relative overflow-hidden ${
                section === "Completed" 
                  ? "border-green-500/30" 
                  : "border-cyan-500/30"
              }`}>
                <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
                {/* Cyberpunk border corners */}
                <div className={`absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 ${
                  section === "Completed" ? "border-green-400" : "border-cyan-400"
                }`}></div>
                <div className={`absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 ${
                  section === "Completed" ? "border-green-400" : "border-cyan-400"
                }`}></div>
                <div className={`absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 ${
                  section === "Completed" ? "border-green-400" : "border-cyan-400"
                }`}></div>
                <div className={`absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 ${
                  section === "Completed" ? "border-green-400" : "border-cyan-400"
                }`}></div>
                <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent text-center ${
                  section === "Completed"
                    ? "from-green-300 to-green-100"
                    : "from-cyan-300 to-cyan-100"
                }`}>
                  {section.toUpperCase()} EVENTS
                </h2>
              </div>

              {/* Grid Container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-x-3 sm:gap-x-4 md:gap-x-6 lg:gap-x-8 gap-y-6 sm:gap-y-8 md:gap-y-10 lg:gap-y-12 w-full max-w-6xl mx-auto px-1 sm:px-2 justify-items-center">
                {sectionEvents.map((event) => (
                  <EventCard
                    key={event.slug}
                    slug={event.slug}
                    name={event.name}
                    description={event.description}
                    organizer={event.organizer}
                    status={event.status}
                    image={event.poster_url || event['poster-url']}
                    registrationLink={event.registrationLink}
                    moreEvents={event.moreEvents}
                    requiresAuth={isDatabaseEvent(event) && section !== "Completed"}
                    onRegister={
                      isDatabaseEvent(event) && 
                      section !== "Completed" && 
                      event.is_direct_registration
                        ? () => handleEventRegistration(event.slug, event.name) 
                        : null
                    }
                    isRegistered={isEventRegistered(event.slug)}
                    isCompleted={section === "Completed"}
                    isDirectRegistration={event.is_direct_registration}
                    isCSEOnly={event.is_cse_only}
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