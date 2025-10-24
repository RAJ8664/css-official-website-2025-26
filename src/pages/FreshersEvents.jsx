import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { FaArrowLeft, FaCheck, FaUsers, FaWhatsapp, FaCopy, FaGraduationCap, FaInfoCircle, FaLock, FaCalendar, FaExternalLinkAlt, FaRegClock, FaUserFriends, FaEnvelope, FaUniversity } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FreshersEvents = () => {
  const { eventSlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subEvents, setSubEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parentEvent, setParentEvent] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [registering, setRegistering] = useState({});
  const [showCSEWarning, setShowCSEWarning] = useState(false);
  const [cseWarningEvent, setCseWarningEvent] = useState(null);

  useEffect(() => {
    fetchParentEvent();
    fetchSubEvents();
    if (user) {
      fetchRegisteredEvents();
    }
  }, [eventSlug, user]);

  const showToast = (message, type = 'info') => {
    const toastConfig = {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    switch (type) {
      case 'success':
        toast.success(message, toastConfig);
        break;
      case 'error':
        toast.error(message, toastConfig);
        break;
      case 'warning':
        toast.warning(message, toastConfig);
        break;
      case 'info':
        toast.info(message, toastConfig);
        break;
      default:
        toast(message, toastConfig);
    }
  };

  const fetchParentEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', eventSlug)
        .single();

      if (error) {
        showToast('Event not found', 'error');
        navigate('/events');
        return;
      }
      
      if (!data.is_active) {
        showToast('This event is not currently active', 'warning');
        navigate('/events');
        return;
      }

      setParentEvent(data);
    } catch (error) {
      console.error('Error fetching parent event:', error);
      showToast('Error loading event', 'error');
      navigate('/events');
    }
  };

  const fetchSubEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('sub_events')
        .select('*')
        .eq('parent_event_slug', eventSlug)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching sub-events:', error);
        throw error;
      }

      if (data && data.length > 0) {
        setSubEvents(data);
      } else {
        setSubEvents([]);
      }
    } catch (error) {
      console.error('Error in fetchSubEvents:', error);
      setSubEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredEvents = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_events')
        .select('*')
        .eq('user_id', user.id)
        .like('event_slug', `${eventSlug}-%`);
      
      if (error) throw error;
      
      if (data) {
        setRegisteredEvents(data);
      }
    } catch (error) {
      console.error('Error fetching registered sub-events:', error);
    }
  };

  const isCSEStudent = () => {
    if (!user || !user.email) return false;
    const userEmail = user.email.toLowerCase();
    return userEmail.endsWith('@cse.nits.ac.in');
  };

  const handleSubEventRegistration = async (subEventSlug, subEventName, whatsappLink, isCSEOnly = false) => {
    if (!user) {
      showToast('Please login to register for events', 'warning');
      return false;
    }

    // ✅ CHECK IF SUB-EVENT IS CSE-ONLY AND USER IS NOT FROM CSE
    if (isCSEOnly && !isCSEStudent()) {
      setCseWarningEvent({
        slug: subEventSlug,
        name: subEventName,
        whatsappLink,
        isCSEOnly
      });
      setShowCSEWarning(true);
      return false;
    }

    setRegistering(prev => ({ ...prev, [subEventSlug]: true }));

    try {
      const fullEventSlug = `${eventSlug}-${subEventSlug}`;
      
      // First check if the sub-event exists and get current participants
      const { data: subEventData, error: subEventError } = await supabase
        .from('sub_events')
        .select('max_participants, current_participants, name')
        .eq('slug', subEventSlug)
        .single();

      if (subEventError) throw subEventError;

      // Check if event is full
      if (subEventData.current_participants >= subEventData.max_participants) {
        showToast('Sorry, this event is already full!', 'warning');
        setRegistering(prev => ({ ...prev, [subEventSlug]: false }));
        return false;
      }

      const { data, error } = await supabase
        .from('user_events')
        .insert([
          { 
            user_id: user.id, 
            event_slug: fullEventSlug,
            event_name: `${parentEvent?.name} - ${subEventName}`,
            whatsapp_group_link: whatsappLink
          }
        ])
        .select();

      if (error) {
        if (error.code === '23505') {
          // Update existing registration with WhatsApp link if needed
          const { error: updateError } = await supabase
            .from('user_events')
            .update({ whatsapp_group_link: whatsappLink })
            .eq('user_id', user.id)
            .eq('event_slug', fullEventSlug);

          if (updateError) console.error('Error updating WhatsApp link:', updateError);
          
          setRegisteredEvents(prev => [...prev.filter(item => item.event_slug !== fullEventSlug), 
            { event_slug: fullEventSlug, whatsapp_group_link: whatsappLink }]);
          
          showToast(`You're already registered for ${subEventName}!`, 'info');
          setRegistering(prev => ({ ...prev, [subEventSlug]: false }));
          return true;
        }
        throw error;
      }

      // Update participant count in sub_events table
      const { error: updateCountError } = await supabase
        .from('sub_events')
        .update({ current_participants: (subEventData.current_participants || 0) + 1 })
        .eq('slug', subEventSlug);

      if (updateCountError) {
        console.error('Error updating participant count:', updateCountError);
      }

      setRegisteredEvents(prev => [...prev, ...data]);
      
      if (whatsappLink) {
        showToast(
          <div>
            <p>🎉 Successfully registered for {subEventName}!</p>
            <p className="text-sm mt-1">Click the WhatsApp button below to join the group.</p>
          </div>,
          'success'
        );
      } else {
        showToast(`🎉 Successfully registered for ${subEventName}!`, 'success');
      }
      
      await fetchRegisteredEvents();
      await fetchSubEvents();
      return true;
      
    } catch (error) {
      console.error('Registration failed:', error);
      showToast('Failed to register for event. Please try again.', 'error');
      return false;
    } finally {
      setRegistering(prev => ({ ...prev, [subEventSlug]: false }));
    }
  };

  const handleEmailMigrationRedirect = () => {
    navigate('/email-migration', { 
      state: { 
        fromEvent: eventSlug,
        requiredForEvent: cseWarningEvent?.name 
      } 
    });
  };

  const isSubEventRegistered = (subEventSlug) => {
    const fullEventSlug = `${eventSlug}-${subEventSlug}`;
    return registeredEvents.some(item => item.event_slug === fullEventSlug);
  };

  const getWhatsAppLink = (subEventSlug) => {
    const fullEventSlug = `${eventSlug}-${subEventSlug}`;
    const registration = registeredEvents.find(item => item.event_slug === fullEventSlug);
    return registration?.whatsapp_group_link || '';
  };

  const handleWhatsAppJoin = (whatsappLink, eventName) => {
    if (whatsappLink) {
      window.open(whatsappLink, '_blank', 'noopener,noreferrer');
      showToast(`Opening WhatsApp group for ${eventName}`, 'info');
    } else {
      showToast('WhatsApp link not available yet', 'warning');
    }
  };

  const copyToClipboard = (text, eventName) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`WhatsApp link for ${eventName} copied to clipboard!`, 'success');
    }).catch(() => {
      showToast('Failed to copy link', 'error');
    });
  };

  const getTimeRemaining = (dateString) => {
    if (!dateString) return null;
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Event completed';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return `In ${Math.ceil(diffDays / 7)} weeks`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading Events</p>
          <p className="text-gray-400 text-sm mt-2">Getting everything ready for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white p-4">
      <ToastContainer theme="dark" />
      
      {/* CSE Only Warning Modal */}
      {showCSEWarning && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/90 backdrop-blur-sm border border-purple-500/30 rounded-2xl max-w-md w-full p-6 animate-in fade-in duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUniversity className="text-purple-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-purple-400 mb-2">
                CSE Students Only
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                This event <span className="font-semibold text-white">{cseWarningEvent?.name}</span> is exclusively 
                for Computer Science students with <span className="text-cyan-400">@cse.nits.ac.in</span> email addresses.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-600">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium mb-2">Current Email: <span className="text-yellow-400">{user?.email}</span></p>
                  <p>To register for this event, you need to verify your CSE college email address.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleEmailMigrationRedirect}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <FaEnvelope className="text-white" />
                Verify CSE Email Address
              </button>
              
              <button
                onClick={() => setShowCSEWarning(false)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
              <h4 className="text-sm font-medium text-cyan-300 mb-2 flex items-center gap-2">
                <FaGraduationCap />
                Already have a CSE email?
              </h4>
              <p className="text-xs text-cyan-200">
                CSE students who are logged in with different emails can verify their college 
                CSE emails through our secure migration process.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/events" 
              className="text-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-2 bg-cyan-900/30 hover:bg-cyan-800/30 px-4 py-3 rounded-xl border border-cyan-500/30 active:scale-95"
            >
              <FaArrowLeft size={18} />
              <span className="font-semibold">Back</span>
            </Link>
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400 capitalize mb-2">
              {parentEvent?.name || eventSlug}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {parentEvent?.description || 'Explore and register for individual events below'}
            </p>
            
            {parentEvent?.date && (
              <div className="flex items-center justify-center sm:justify-start gap-2 text-cyan-300 text-xs sm:text-sm mt-3">
                <FaCalendar size={14} />
                <span>{new Date(parentEvent.date).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
                <span className="text-yellow-400 ml-2 flex items-center gap-1">
                  <FaRegClock size={12} />
                  {getTimeRemaining(parentEvent.date)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* CSE Notice Banner */}
        {subEvents.some(event => event.is_cse_only) && (
          <div className="mb-6 p-4 bg-purple-900/30 border border-purple-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <FaGraduationCap className="text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-purple-300 font-semibold text-sm mb-1">
                  CSE Exclusive Events Notice
                </h3>
                <p className="text-purple-200 text-xs leading-relaxed">
                  Some events are exclusively for CSE students. Only users with <span className="font-mono">@cse.nits.ac.in</span> email addresses can register. 
                  CSE students using different emails can verify their college emails through our{' '}
                  <button 
                    onClick={() => navigate('/email-migration')}
                    className="text-cyan-300 hover:text-cyan-200 underline font-medium"
                  >
                    email migration process
                  </button>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sub Events Grid - Enhanced for Mobile */}
        {subEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {subEvents.map((subEvent) => {
              const isRegistered = isSubEventRegistered(subEvent.slug);
              const whatsappLink = getWhatsAppLink(subEvent.slug);
              const isFull = subEvent.current_participants >= subEvent.max_participants;
              const availableSpots = subEvent.max_participants - subEvent.current_participants;
              const progressPercentage = Math.min(100, (subEvent.current_participants / subEvent.max_participants) * 100);

              return (
                <div 
                  key={subEvent.id} 
                  className="bg-gray-800/40 backdrop-blur-sm border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10"
                  onMouseEnter={() => setHoveredCard(subEvent.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Poster Image with Enhanced Overlay */}
                  <div className="relative h-48 sm:h-52 overflow-hidden">
                    <img
                      src={subEvent.poster_url || "https://via.placeholder.com/400x200/1a202c/cyan?text=Event+Poster"}
                      alt={subEvent.name}
                      className="w-full h-full object-cover transition-transform duration-500"
                      style={{
                        transform: hoveredCard === subEvent.id ? 'scale(1.1)' : 'scale(1)'
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x200/1a202c/cyan?text=Event+Poster";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    
                    {/* Badges Overlay - Mobile Optimized */}
                    <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
                      {subEvent.is_cse_only && (
                        <span className="px-3 py-1.5 bg-purple-600/90 text-purple-100 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                          <FaGraduationCap size={10} /> CSE Only
                        </span>
                      )}
                      {isFull && (
                        <span className="px-3 py-1.5 bg-red-600/90 text-red-100 rounded-full text-xs font-bold shadow-lg">
                          <FaLock size={10} /> Event Full
                        </span>
                      )}
                      {isRegistered && (
                        <span className="px-3 py-1.5 bg-green-600/90 text-green-100 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                          <FaCheck size={10} /> Registered
                        </span>
                      )}
                    </div>

                    {/* Event Title Overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-2 drop-shadow-lg mb-1">
                        {subEvent.name}
                      </h3>
                      <p className="text-cyan-300 text-xs font-medium">
                        {subEvent.organizer || parentEvent?.organizer}
                      </p>
                    </div>
                  </div>

                  {/* Event Details - Enhanced Layout */}
                  <div className="p-5 sm:p-6">
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                      {subEvent.description}
                    </p>
                    
                    {/* Capacity Info - Improved */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2 text-gray-300">
                          <FaUsers className="text-cyan-400" />
                          <span>{subEvent.current_participants} / {subEvent.max_participants} registered</span>
                        </div>
                        {!isFull ? (
                          <span className="text-green-400 font-semibold bg-green-900/30 px-2 py-1 rounded-full">
                            {availableSpots} spots left
                          </span>
                        ) : (
                          <span className="text-red-400 font-semibold bg-red-900/30 px-2 py-1 rounded-full">
                            Fully Booked
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-cyan-500/25"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons - Mobile Friendly */}
                    <div className="space-y-3">
                      {/* Registration Button */}
                      <button
                        onClick={() => handleSubEventRegistration(
                          subEvent.slug, 
                          subEvent.name, 
                          subEvent.whatsapp_group_link,
                          subEvent.is_cse_only
                        )}
                        disabled={isRegistered || isFull || registering[subEvent.slug]}
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
                          isRegistered
                            ? 'bg-green-600 text-white cursor-not-allowed shadow-lg'
                            : isFull
                            ? 'bg-red-600 text-white cursor-not-allowed shadow-lg'
                            : registering[subEvent.slug]
                            ? 'bg-cyan-700 text-white cursor-not-allowed'
                            : 'bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white hover:shadow-xl hover:shadow-cyan-500/25 transform active:scale-95'
                        }`}
                      >
                        {registering[subEvent.slug] ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Registering...
                          </>
                        ) : isRegistered ? (
                          <>
                            <FaCheck size={14} />
                            Registered
                          </>
                        ) : isFull ? (
                          <>
                            <FaLock size={14} />
                            Event Full
                          </>
                        ) : (
                          <>
                            Register Now
                            <FaExternalLinkAlt size={12} />
                          </>
                        )}
                      </button>

                      {/* WhatsApp Actions - Show only when registered */}
                      {isRegistered && (
                        <div className="border-t border-gray-600 pt-4 space-y-3">
                          <p className="text-green-400 text-sm font-semibold flex items-center justify-center gap-2">
                            <FaWhatsapp className="text-green-500" />
                            WhatsApp Group
                          </p>
                          
                          <div className="flex gap-2">
                            {/* WhatsApp Join Button */}
                            <button
                              onClick={() => handleWhatsAppJoin(whatsappLink, subEvent.name)}
                              disabled={!whatsappLink}
                              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
                                whatsappLink
                                  ? 'bg-green-600 hover:bg-green-700 text-white active:scale-95'
                                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <FaWhatsapp size={16} />
                              Join Group
                            </button>

                            {/* Copy Link Button */}
                            {whatsappLink && (
                              <button
                                onClick={() => copyToClipboard(whatsappLink, subEvent.name)}
                                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-all active:scale-95 flex items-center justify-center"
                                title="Copy WhatsApp link"
                              >
                                <FaCopy size={14} />
                              </button>
                            )}
                          </div>

                          {!whatsappLink && (
                            <p className="text-yellow-400 text-xs text-center flex items-center justify-center gap-1">
                              <FaInfoCircle />
                              WhatsApp group link will be shared soon
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Enhanced Empty State
          <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-cyan-500/20">
            <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaInfoCircle className="text-cyan-400 text-3xl" />
            </div>
            <h3 className="text-2xl md:text-3xl text-cyan-300 mb-4 font-bold">No Events Available Yet</h3>
            <p className="text-gray-300 max-w-md mx-auto text-base mb-2 leading-relaxed">
              There are no events currently available under {parentEvent?.name || 'this category'}.
            </p>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">
              Events will appear here once they are created by the organizers. 
              Please check back later or contact the event coordinators.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-cyan-500/25 font-semibold text-lg active:scale-95"
            >
              <FaArrowLeft size={16} />
              Back to All Events
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Bottom Padding for Better UX */}
      <div className="h-8 sm:h-4"></div>
    </div>
  );
};

export default FreshersEvents;