import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const OtpVerification = () => {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const { verifyOtp, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { email, message } = location.state || {};

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Redirect if user is already authenticated
    useEffect(() => {
        if (user && !authLoading) {
            console.log('User already authenticated, redirecting to dashboard');
            navigate('/dashboard', { replace: true });
        }
    }, [user, authLoading, navigate]);

    // Check if user got authenticated after OTP verification
    useEffect(() => {
        if (!loading && user) {
            console.log('User authenticated after OTP verification, redirecting...');
            navigate('/dashboard', { replace: true });
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email) {
            setError("Email not found. Please try signing up again.");
            setLoading(false);
            return;
        }

        if (!token || token.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            setLoading(false);
            return;
        }

        try {
            console.log('Verifying OTP for email:', email);
            
            // Verify OTP
            const result = await verifyOtp({ 
                email, 
                token, 
                type: 'email' 
            });

            console.log('OTP verification successful:', result);

            // Force navigation after successful OTP
            console.log('Navigating to dashboard...');
            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 1000);
        } catch (error) {
            console.error('OTP verification failed:', error);
            setError(error.message || 'Invalid OTP. Please try again.');
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendLoading(true);
        setError('');

        try {
            // For resend, we use the signup type to resend confirmation
            const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email: email,
            });

            if (resendError) throw resendError;

            setCountdown(60);
            setError('');
            alert('OTP has been resent to your email!');
        } catch (error) {
            console.error('Resend OTP error:', error);
            setError(error.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    const handleManualLoginRedirect = () => {
        navigate('/auth', { 
            state: { 
                message: 'If you have verified your email, please login with your credentials.' 
            } 
        });
    };

    // If auth is still loading, show loading screen
    if (authLoading) {
        return (
            <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-lg">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center px-6 py-10 overflow-hidden">
            {/* Background Effects */}
           
            
            <div className="relative max-w-md w-full bg-black/70 border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-lg">
                {/* Cyberpunk corners */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

                <h2 className="text-3xl font-bold mb-4 text-center text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" style={{ fontFamily: "Goldman, sans-serif" }}>
                    VERIFY EMAIL
                </h2>
                
                {message && (
                    <div className="bg-cyan-900/30 text-cyan-300 text-center p-3 rounded-md mb-4 border border-cyan-500/50">
                        {message}
                    </div>
                )}
                
                <p className="text-center text-gray-400 mb-6 font-mono">
                    {email ? `An OTP has been sent to ${email}` : 'Check your email for the verification code'}
                </p>

                {error && (
                    <div className="bg-red-900/50 text-red-300 text-center p-3 rounded-md mb-4 border border-red-500/50">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block mb-2 font-mono text-cyan-300">Enter 6-digit OTP</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded bg-gray-800/50 border-2 border-gray-700 focus:outline-none focus:border-cyan-500 transition-all caret-cyan-400 text-center text-2xl tracking-[0.5em] font-mono"
                            value={token}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setToken(value);
                            }}
                            required
                            maxLength={6}
                            placeholder="000000"
                            pattern="[0-9]{6}"
                        />
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            Enter the 6-digit code from your email
                        </p>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full bg-cyan-600 hover:bg-cyan-700 p-3 rounded font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4" 
                        disabled={loading || token.length !== 6}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verifying...
                            </span>
                        ) : (
                            'Verify & Continue'
                        )}
                    </button>
                </form>

                <div className="flex flex-col gap-3 mt-6">
                    <button 
                        onClick={handleResendOtp}
                        disabled={resendLoading || countdown > 0}
                        className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {resendLoading ? 'Sending...' : 
                         countdown > 0 ? `Resend OTP in ${countdown}s` : 
                         'Resend OTP'}
                    </button>

                    <button 
                        onClick={handleManualLoginRedirect}
                        className="w-full bg-transparent border border-cyan-500/50 hover:border-cyan-400/70 p-3 rounded font-bold transition-all text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                        Already verified? Login here
                    </button>
                </div>

                <div className="flex items-center mt-6">
                    <span className="text-cyan-400 font-mono text-lg mr-2">$~</span>
                    <div className="w-[2px] h-6 bg-cyan-400 animate-blink"></div>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;