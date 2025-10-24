import React, { useState } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';
import { supabase } from '/src/supabaseClient.js';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
    const { user, refreshProfile } = useAuth();
    const [fullName, setFullName] = useState('');
    const [scholarId, setScholarId] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        
        if (!fullName.trim() || !scholarId.trim() || !contactNumber.trim()) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        
        const cleanPhoneNumber = contactNumber.replace(/\D/g, '');
        const phoneRegex = /^[6-9]\d{9}$/; 
        if (!phoneRegex.test(cleanPhoneNumber)) {
            setError('Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9');
            setLoading(false);
            return;
        }

        try {
            const { data, error: updateError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName.trim(),
                    scholar_id: scholarId.trim(),
                    contact_number: cleanPhoneNumber, 
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', user.id)
                .select();

            if (updateError) throw updateError;
            
            
            await refreshProfile();
            
            
            navigate('/dashboard');
        } catch (error) {
            console.error('Profile completion error:', error);
            setError(error.message || 'Failed to complete profile');
        }
        setLoading(false);
    };

    const handlePhoneChange = (e) => {
        
        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
        setContactNumber(digitsOnly);
    };

    return (
        <div className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center px-6 py-10">
            <div className="relative max-w-md w-full bg-black/70 border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-lg">
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

                <h2 className="text-3xl font-bold mb-4 text-center text-white" style={{ fontFamily: "Goldman, sans-serif" }}>
                    Complete Your Profile
                </h2>
                <p className="text-center text-gray-400 mb-6 font-mono">
                    Please provide your details to continue.
                </p>

                {error && <p className="bg-red-900/50 text-red-300 text-center p-3 rounded-md mb-4 border border-red-500/50">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-mono text-cyan-300">Full Name</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded bg-gray-800/50 border-2 border-gray-700 focus:outline-none focus:border-cyan-500 transition-all caret-cyan-400"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-2 font-mono text-cyan-300">Scholar ID</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded bg-gray-800/50 border-2 border-gray-700 focus:outline-none focus:border-cyan-500 transition-all caret-cyan-400"
                            value={scholarId}
                            onChange={(e) => setScholarId(e.target.value)}
                            required
                            placeholder="Enter your scholar ID"
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block mb-2 font-mono text-cyan-300">Contact Number</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="text-gray-400 font-mono">+91</span>
                            </div>
                            <input
                                type="tel"
                                className="w-full p-3 pl-12 rounded bg-gray-800/50 border-2 border-gray-700 focus:outline-none focus:border-cyan-500 transition-all caret-cyan-400"
                                value={contactNumber}
                                onChange={handlePhoneChange}
                                required
                                placeholder="88228*****"
                                maxLength="10"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1 font-mono">
                            Enter 10-digit Indian mobile number (starts with 6, 7, 8, or 9)
                        </p>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full bg-cyan-600 hover:bg-cyan-700 p-3 rounded font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save and Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;