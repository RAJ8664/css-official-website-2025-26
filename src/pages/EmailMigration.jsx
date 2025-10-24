
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";

const EmailMigration = () => {
    const { user, signInWithGoogleForMigration } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [googleLoading, setGoogleLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    
    const errorFromState = location.state?.error;

    const handleGoogleMigration = async () => {
        setGoogleLoading(true);
        setMessage('');

        try {
            const { error } = await signInWithGoogleForMigration();
            
            if (error) {
                throw error;
            }
            
        } catch (error) {
            setGoogleLoading(false);
            
            
            if (error.message.includes('rate limit')) {
                setMessage('⚠️ Too many attempts. Please wait 1 hour or use a different method.');
            } else {
                setMessage('Google sign-in failed: ' + error.message);
            }
        }
    };

    const handleSkip = () => {
        localStorage.setItem('skippedCollegeMigration', 'true');
        navigate('/dashboard');
    };

    const handleEmailVerification = async () => {
        setMessage('📧 For email verification, please sign out and sign up directly with your college email address.');
    };

    return (
        <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-cyan-400 mb-2">
                        Verify College Email
                    </h1>
                    <p className="text-gray-300">
                        To access chat features, please verify your college identity using your college email.
                    </p>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">Current Email:</span>
                        <span className="font-medium text-sm">{user?.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">Status:</span>
                        <span className="px-2 py-1 rounded text-sm bg-yellow-500/20 text-yellow-400">
                            Needs Verification
                        </span>
                    </div>
                </div>

                
                <div className="mb-4">
                    <button 
                        onClick={handleGoogleMigration}
                        disabled={googleLoading}
                        className="w-full bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-gray-300"
                    >
                        {googleLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                        ) : (
                            <FcGoogle className="w-5 h-5" />
                        )}
                        {googleLoading ? 'Connecting...' : 'Verify with College Google Account'}
                    </button>
                    <p className="text-xs text-green-400 mt-2 text-center">
                        ✅ Recommended & Secure - Uses your college email account
                    </p>
                </div>

                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-800 text-gray-400">OR</span>
                    </div>
                </div>

                <div className="mb-4">
                    <button 
                        onClick={handleEmailVerification}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-lg font-medium transition-all flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Sign Up with College Email
                    </button>
                    <p className="text-xs text-yellow-400 mt-2 text-center">
                        ⚠️ You'll need to create a new account with your college email
                    </p>
                </div>

               
                <button
                    onClick={handleSkip}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg mt-2"
                >
                    Skip for Now
                </button>

                
                <div className="mt-6 p-4 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
                    <h3 className="text-sm font-medium text-cyan-300 mb-2">How to verify:</h3>
                    <ul className="text-xs text-cyan-200 space-y-1">
                        <li>• Use your <strong>college email account</strong> (nibir@cse.nits.ac.in, etc.)</li>
                        <li>• Or create a new account with your college email</li>
                        <li>• College emails are automatically verified</li>
                    </ul>
                </div>

                
                {errorFromState && (
                    <div className="mt-4 p-3 rounded-lg text-center bg-red-500/20 text-red-400">
                        {errorFromState}
                    </div>
                )}

                {message && (
                    <div className={`mt-4 p-3 rounded-lg text-center ${
                        message.includes('Failed') || message.includes('rate limit') ? 'bg-red-500/20 text-red-400' : 
                        message.includes('⚠️') ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                        {message}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Accepted domains: nits.ac.in, cse.nits.ac.in, ece.nits.ac.in, etc.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmailMigration;