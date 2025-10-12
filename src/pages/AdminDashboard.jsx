// pages/AdminDashboard.jsx - MOBILE OPTIMIZED VERSION
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { FaDownload, FaWhatsapp, FaEye, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaBars, FaTimes } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    organizer: '',
    status: 'Upcoming',
    section: 'Upcoming',
    slug: '',
    poster_url: '',
    whatsapp_group_link: '',
    date: '',
    max_participants: 100,
    requires_auth: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add this useEffect to both AdminDashboard and Events components
  useEffect(() => {
    // Subscribe to events table changes
    const eventsSubscription = supabase
      .channel('events-changes')
      .on('postgres_changes', 
        { 
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public', 
          table: 'events' 
        }, 
        (payload) => {
          fetchEvents(); // Refresh events list
        }
      )
      .subscribe();

    // Subscribe to user_events table changes
    const userEventsSubscription = supabase
      .channel('user-events-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_events' 
        }, 
        (payload) => {
          if (user) {
            fetchRegisteredEvents(); // Refresh user registrations
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      eventsSubscription.unsubscribe();
      userEventsSubscription.unsubscribe();
    };
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Updated fetchRegistrations function with better error handling
  const fetchRegistrations = async (eventSlug) => {
    try {
      
      // First, let's try a different approach - fetch user_events and profiles separately
      const { data: userEvents, error: userEventsError } = await supabase
        .from('user_events')
        .select('*')
        .eq('event_slug', eventSlug)
        .order('registered_at', { ascending: false });

      if (userEventsError) throw userEventsError;


      if (!userEvents || userEvents.length === 0) {
        setRegistrations(prev => ({
          ...prev,
          [eventSlug]: []
        }));
        return;
      }

      // Get all user IDs from registrations
      const userIds = userEvents.map(ue => ue.user_id);
      
      // Fetch profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;


      // Combine the data
      const combinedData = userEvents.map(ue => {
        const userProfile = profiles?.find(p => p.user_id === ue.user_id);
        return {
          ...ue,
          profiles: userProfile || null
        };
      });

      
      setRegistrations(prev => ({
        ...prev,
        [eventSlug]: combinedData
      }));

    } catch (error) {
      console.error('Error fetching registrations:', error);
      alert('Error fetching registrations: ' + error.message);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...formData,
          created_by: user.id,
          is_active: true,
          current_participants: 0
        }])
        .select();

      if (error) throw error;

      alert('Event created successfully!');
      setShowCreateForm(false);
      resetForm();
      fetchEvents();
      window.dispatchEvent(new CustomEvent('eventsUpdated'));
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event: ' + error.message);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('events')
        .update(formData)
        .eq('id', editingEvent.id);

      if (error) throw error;

      alert('Event updated successfully!');
      setEditingEvent(null);
      resetForm();
      fetchEvents();
      window.dispatchEvent(new CustomEvent('eventsUpdated'));

    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      organizer: '',
      status: 'Upcoming',
      section: 'Upcoming',
      slug: '',
      poster_url: '',
      whatsapp_group_link: '',
      date: '',
      max_participants: 100,
      requires_auth: true
    });
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      organizer: event.organizer,
      status: event.status,
      section: event.section,
      slug: event.slug,
      poster_url: event.poster_url,
      whatsapp_group_link: event.whatsapp_group_link,
      date: event.date ? event.date.split('+')[0] : '',
      max_participants: event.max_participants,
      requires_auth: event.requires_auth
    });
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event? This will also delete all registrations for this event.')) return;

    try {
        
        // Store the event being deleted
        const eventToDelete = events.find(e => e.id === eventId);
        if (!eventToDelete) {
            console.error('❌ Event not found in local state');
            alert('Event not found!');
            return;
        }


        // First delete registrations
        const eventSlug = eventToDelete.slug;
        
        if (eventSlug) {
            const { error: regError } = await supabase
                .from('user_events')
                .delete()
                .eq('event_slug', eventSlug);

            if (regError) {
                console.error('❌ Error deleting registrations:', regError);
                throw regError;
            }
        }

        // Then delete event
        const { data, error } = await supabase
            .from('events')
            .delete()
            .eq('id', eventId)
            .select(); // Add select to see what was deleted


        if (error) {
            console.error('❌ Error deleting event:', error);
            throw error;
        }


        // Update the UI immediately
        setEvents(prevEvents => {
            const newEvents = prevEvents.filter(event => event.id !== eventId);
            return newEvents;
        });
        
        // Also clear registrations if we were viewing this event
        if (selectedEvent && selectedEvent.id === eventId) {
            setSelectedEvent(null);
            setRegistrations(prev => {
                const newRegistrations = { ...prev };
                delete newRegistrations[eventSlug];
                return newRegistrations;
            });
        }
        window.dispatchEvent(new CustomEvent('eventDeleted', {
          detail: { eventId, eventSlug }
        }));
        alert('Event and all registrations deleted successfully!');
        
    } catch (error) {
        console.error('💥 Error in handleDeleteEvent:', error);
        alert('Failed to delete event: ' + error.message);
        
        // If deletion failed, refresh the events list to ensure consistency
        fetchEvents();
    }
  };

  const handleToggleEvent = async (eventId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_active: !currentStatus })
        .eq('id', eventId);

      if (error) throw error;

      alert(`Event ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchEvents();
      window.dispatchEvent(new CustomEvent('eventsUpdated'));
    } catch (error) {
      console.error('Error toggling event:', error);
      alert('Failed to update event: ' + error.message);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const exportRegistrations = (eventSlug) => {
    const eventRegistrations = registrations[eventSlug] || [];
    const csvContent = [
      ['Name', 'Scholar ID', 'Email', 'Branch', 'Year', 'Registration Date', 'Status'],
      ...eventRegistrations.map(reg => [
        reg.profiles?.full_name || 'N/A',
        reg.profiles?.scholar_id || 'N/A',
        reg.profiles?.email || 'N/A',
        reg.profiles?.branch || 'N/A',
        reg.profiles?.year || 'N/A',
        new Date(reg.registered_at).toLocaleDateString(),
        reg.attendance_status || 'registered'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${eventSlug}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const updateAttendanceStatus = async (registrationId, status) => {
    try {
      const { error } = await supabase
        .from('user_events')
        .update({ attendance_status: status })
        .eq('id', registrationId);

      if (error) throw error;

      // Refresh registrations
      if (selectedEvent) {
        fetchRegistrations(selectedEvent.slug);
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Failed to update attendance status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-4xl font-bold" style={{ fontFamily: "Goldman, sans-serif" }}>
              Admin Dashboard
            </h1>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-cyan-400"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
          <button
            onClick={() => {
              setEditingEvent(null);
              setShowCreateForm(true);
              resetForm();
            }}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-all flex items-center gap-2 justify-center text-sm sm:text-base"
          >
            Create New Event
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6 ${mobileMenuOpen ? 'block' : 'hidden'} sm:flex`}>
          <button
            onClick={() => {
              setActiveTab('events');
              setMobileMenuOpen(false);
            }}
            className={`px-4 py-3 sm:py-2 rounded-lg font-semibold transition-all text-sm sm:text-base ${
              activeTab === 'events' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Manage Events
          </button>
          <button
            onClick={() => {
              setActiveTab('registrations');
              setMobileMenuOpen(false);
            }}
            className={`px-4 py-3 sm:py-2 rounded-lg font-semibold transition-all text-sm sm:text-base ${
              activeTab === 'registrations' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            View Registrations
          </button>
        </div>

        {/* Create/Edit Event Modal */}
        {(showCreateForm || editingEvent) && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-4">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-cyan-300 mb-2 text-sm sm:text-base">Event Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500 text-sm sm:text-base"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          name: e.target.value,
                          slug: editingEvent ? formData.slug : generateSlug(e.target.value)
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-300 mb-2 text-sm sm:text-base">Slug *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500 text-sm sm:text-base"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      disabled={editingEvent}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-cyan-300 mb-2 text-sm sm:text-base">Description *</label>
                  <textarea
                    required
                    rows="3"
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500 text-sm sm:text-base"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-cyan-300 mb-2 text-sm sm:text-base">Organizer *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500 text-sm sm:text-base"
                      value={formData.organizer}
                      onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-300 mb-2 text-sm sm:text-base">Status *</label>
                    <select
                      className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500 text-sm sm:text-base"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-cyan-300 mb-2 text-sm sm:text-base">Date *</label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500 text-sm sm:text-base"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-cyan-300 mb-2 text-sm sm:text-base">Poster URL</label>
                    <input
                      type="url"
                      className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500 text-sm sm:text-base"
                      value={formData.poster_url}
                      onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-300 mb-2 text-sm sm:text-base">WhatsApp Group Link *</label>
                    <input
                      type="url"
                      required
                      className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500 text-sm sm:text-base"
                      value={formData.whatsapp_group_link}
                      onChange={(e) => setFormData({ ...formData, whatsapp_group_link: e.target.value })}
                      placeholder="https://chat.whatsapp.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-300 mb-2 text-sm sm:text-base">Max Participants</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500 text-sm sm:text-base"
                      value={formData.max_participants}
                      onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requires_auth"
                    className="mr-2"
                    checked={formData.requires_auth}
                    onChange={(e) => setFormData({ ...formData, requires_auth: e.target.checked })}
                  />
                  <label htmlFor="requires_auth" className="text-cyan-300 text-sm sm:text-base">
                    Requires Authentication
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex-1 text-sm sm:text-base"
                  >
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingEvent(null);
                      resetForm();
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all flex-1 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Events Management Tab */}
        {activeTab === 'events' && (
          <div className="bg-black/70 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-4">Manage Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-cyan-300 flex-1 pr-2">{event.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold flex-shrink-0 ${
                      event.is_active ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                    }`}>
                      {event.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-xs sm:text-sm mb-2">{event.organizer} • {event.status}</p>
                  <p className="text-gray-300 text-xs sm:text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex justify-between">
                      <span>Slug:</span>
                      <span className="text-cyan-300 text-xs truncate ml-2">{event.slug}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Participants:</span>
                      <span>{event.current_participants}/{event.max_participants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="text-xs">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    {event.whatsapp_group_link && (
                      <div className="flex justify-between items-center">
                        <span>WhatsApp:</span>
                        <a 
                          href={event.whatsapp_group_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300"
                        >
                          <FaWhatsapp className="inline" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setActiveTab('registrations');
                        fetchRegistrations(event.slug);
                      }}
                      className="flex-1 min-w-[80px] bg-blue-600 hover:bg-blue-700 text-white py-2 px-2 rounded text-xs transition-all flex items-center justify-center gap-1"
                    >
                      <FaEye size={12} /> View
                    </button>
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="flex-1 min-w-[80px] bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-2 rounded text-xs transition-all flex items-center justify-center gap-1"
                    >
                      <FaEdit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleEvent(event.id, event.is_active)}
                      className={`flex-1 min-w-[80px] py-2 px-2 rounded text-xs transition-all flex items-center justify-center gap-1 ${
                        event.is_active 
                          ? 'bg-orange-600 hover:bg-orange-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white`}
                    >
                      {event.is_active ? <FaToggleOff size={12} /> : <FaToggleOn size={12} />} {event.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="flex-1 min-w-[80px] bg-red-600 hover:bg-red-700 text-white py-2 px-2 rounded text-xs transition-all flex items-center justify-center gap-1"
                    >
                      <FaTrash size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {events.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No events found. Create your first event to get started.
              </div>
            )}
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div className="bg-black/70 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 text-center sm:text-left">
                {selectedEvent ? `Registrations for ${selectedEvent.name}` : 'Select an event to view registrations'}
              </h2>
              {selectedEvent && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => exportRegistrations(selectedEvent.slug)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all flex items-center gap-2 justify-center text-sm"
                  >
                    <FaDownload size={14} /> Export CSV
                  </button>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-all text-sm"
                  >
                    Back to Events
                  </button>
                </div>
              )}
            </div>

            {!selectedEvent ? (
              <div className="text-center py-8 text-gray-400">
                Please select an event from the Events tab to view registrations
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-cyan-900/30 p-3 sm:p-4 rounded-lg border border-cyan-500/30">
                    <div className="text-cyan-300 text-xs sm:text-sm">Total Registrations</div>
                    <div className="text-lg sm:text-2xl font-bold text-white">
                      {(registrations[selectedEvent.slug] || []).length}
                    </div>
                  </div>
                  <div className="bg-cyan-900/30 p-3 sm:p-4 rounded-lg border border-cyan-500/30">
                    <div className="text-cyan-300 text-xs sm:text-sm">Event Capacity</div>
                    <div className="text-lg sm:text-2xl font-bold text-white">
                      {selectedEvent.max_participants}
                    </div>
                  </div>
                  <div className="bg-cyan-900/30 p-3 sm:p-4 rounded-lg border border-cyan-500/30">
                    <div className="text-cyan-300 text-xs sm:text-sm">Remaining Slots</div>
                    <div className="text-lg sm:text-2xl font-bold text-white">
                      {Math.max(0, selectedEvent.max_participants - (registrations[selectedEvent.slug] || []).length)}
                    </div>
                  </div>
                  <div className="bg-cyan-900/30 p-3 sm:p-4 rounded-lg border border-cyan-500/30">
                    <div className="text-cyan-300 text-xs sm:text-sm">Status</div>
                    <div className="text-base sm:text-xl font-bold text-white capitalize">
                      {selectedEvent.status}
                    </div>
                  </div>
                </div>

                {/* Registrations Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left text-gray-400">
                    <thead className="text-xs uppercase bg-gray-700 text-cyan-300">
                      <tr>
                        <th className="px-2 py-2 sm:px-4 sm:py-3">Name</th>
                        <th className="px-2 py-2 sm:px-4 sm:py-3">Scholar ID</th>
                        <th className="px-2 py-2 sm:px-4 sm:py-3 hidden sm:table-cell">Email</th>
                        <th className="px-2 py-2 sm:px-4 sm:py-3">Branch</th>
                        <th className="px-2 py-2 sm:px-4 sm:py-3 hidden md:table-cell">Year</th>
                        <th className="px-2 py-2 sm:px-4 sm:py-3">Reg Date</th>
                        <th className="px-2 py-2 sm:px-4 sm:py-3">Status</th>
                        <th className="px-2 py-2 sm:px-4 sm:py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(registrations[selectedEvent.slug] || []).map((registration) => (
                        <tr key={registration.id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                          <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-white">
                            <div className="max-w-[80px] sm:max-w-none truncate">
                              {registration.profiles?.full_name || 'N/A'}
                            </div>
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-3 font-mono text-xs">
                            {registration.profiles?.scholar_id || 'N/A'}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-3 hidden sm:table-cell">
                            <div className="max-w-[120px] truncate">
                              {registration.profiles?.email || 'N/A'}
                            </div>
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-3">
                            <div className="max-w-[60px] sm:max-w-none truncate">
                              {registration.profiles?.branch || 'N/A'}
                            </div>
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-3 hidden md:table-cell">
                            {registration.profiles?.year || 'N/A'}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs">
                            {new Date(registration.registered_at).toLocaleDateString()}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-3">
                            <select
                              value={registration.attendance_status || 'registered'}
                              onChange={(e) => updateAttendanceStatus(registration.id, e.target.value)}
                              className="bg-gray-700 border border-gray-600 rounded px-1 py-1 text-xs text-white w-full max-w-[100px]"
                            >
                              <option value="registered">Registered</option>
                              <option value="attended">Attended</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="no-show">No Show</option>
                            </select>
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-3">
                            {selectedEvent.whatsapp_group_link && (
                              <a 
                                href={selectedEvent.whatsapp_group_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-400 hover:text-green-300"
                                title="Join WhatsApp Group"
                              >
                                <FaWhatsapp size={14} />
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {(registrations[selectedEvent.slug] || []).length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No registrations found for this event.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;