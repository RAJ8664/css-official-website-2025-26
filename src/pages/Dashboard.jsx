import React, { useEffect, useState } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';
import { supabase } from '/src/supabaseClient.js';
import { useNavigate } from 'react-router-dom';

// --- Badge Definitions ---
const badges = [
    { name: 'Event Enthusiast', threshold: 1, icon: '🌟', description: 'Attended your first event!' },
    { name: 'Active Participant', threshold: 3, icon: '🏆', description: 'Attended 3 events.' },
    { name: 'Community Pillar', threshold: 5, icon: '🛡️', description: 'Attended 5 events.' },
    { name: 'CSS Legend', threshold: 10, icon: '👑', description: 'Attended 10 or more events!' },
];

const Dashboard = () => {
    const { user, signOut, loading: authLoading } = useAuth(); // ADD: authLoading
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [attendedEvents, setAttendedEvents] = useState([]);
    const [dataLoading, setDataLoading] = useState(true); // CHANGE: renamed to dataLoading

    useEffect(() => {
        // ADD: Redirect if no user and auth is done loading
        if (!user && !authLoading) {
            navigate('/auth');
            return;
        }

        if (user) {
            fetchData();
        }
    }, [user, authLoading, navigate]); // ADD: authLoading to dependencies

    const fetchData = async () => {
        if (!user) return;

        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
            } else {
                setProfile(data);
            }
        };

        const fetchAttendedEvents = async () => {
            const { data, error } = await supabase
                .from('user_events')
                .select('events(name, date)')
                .eq('user_id', user.id);
            
            if(error) {
                console.error('Error fetching attended events:', error);
            } else {
                setAttendedEvents(data || []); // ADD: default to empty array
            }
        };

        setDataLoading(true);
        await Promise.all([fetchProfile(), fetchAttendedEvents()]);
        setDataLoading(false);
    }

    const handleLogout = async () => {
        await signOut();
        navigate('/'); // CHANGE: navigate to home instead of login
    };

    // CHANGE: Updated loading check
    if (authLoading || dataLoading) {
        return (
            <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-lg">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // ADD: Return null if no user (redirect will happen)
    if (!user) {
        return null;
    }

    const earnedBadges = badges.filter(badge => attendedEvents.length >= badge.threshold);

    return (
        <div className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white px-4 py-10 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(40)].map((_, i) => (
                    <div key={i} className="absolute text-cyan-400 text-xs animate-[fall_6s_linear_infinite]"
                        style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 6}s`, top: "-20px" }}>
                        {Math.random() > 0.5 ? "1" : "0"}
                    </div>
                ))}
            </div>

            <div className="relative max-w-4xl mx-auto bg-black/70 border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-lg">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <img
                        src={profile?.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.email}`}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-cyan-500 shadow-lg"
                    />
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold" style={{ fontFamily: "Goldman, sans-serif" }}>{profile?.full_name || user?.email}</h1>
                        <p className="text-cyan-400 font-mono mt-1">Scholar ID: {profile?.scholar_id || 'N/A'}</p>
                        <p className="text-gray-400 mt-1">Events Attended: {attendedEvents.length}</p>
                    </div>
                    <button onClick={handleLogout} className="ml-auto bg-red-600/80 hover:bg-red-700/80 text-white font-bold py-2 px-4 rounded transition-all">
                        Logout
                    </button>
                </div>

                <div className="my-8 border-t border-cyan-500/20"></div>

                {/* --- Badges Section --- */}
                <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Goldman, sans-serif" }}>Badges Earned</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {badges.map((badge) => (
                            <div key={badge.name} className={`p-4 rounded-lg text-center transition-all ${earnedBadges.some(b => b.name === badge.name) ? 'bg-cyan-900/50 border border-cyan-700' : 'bg-gray-800/50 border border-gray-700 opacity-40'}`}>
                                <div className="text-5xl">{badge.icon}</div>
                                <h3 className="font-bold mt-2">{badge.name}</h3>
                                <p className="text-xs text-gray-400">{badge.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                 <div className="my-8 border-t border-cyan-500/20"></div>

                {/* --- Attended Events Section --- */}
                <div>
                     <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Goldman, sans-serif" }}>Activity Log</h2>
                     <div className="space-y-2 font-mono">
                        {attendedEvents.length > 0 ? (
                            attendedEvents.map((event, index) => (
                                <div key={index} className="bg-gray-800/50 p-3 rounded-md flex justify-between items-center">
                                    <span>Registered for <span className="text-cyan-400">{event.events.name}</span></span>
                                    <span className="text-gray-500 text-sm">{new Date(event.events.date).toLocaleDateString()}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No events attended yet. Go register for one!</p>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;