import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const OtpVerification = () => {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { verifyOtp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email) {
            setError("Email not found. Please try signing up again.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await verifyOtp({ email, token, type: 'signup' });
            if (error) throw error;
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <div className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center px-6 py-10 overflow-hidden">
             {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(40)].map((_, i) => (
                <div key={i} className="absolute text-cyan-400 text-xs animate-[fall_6s_linear_infinite]"
                    style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 6}s`, top: "-20px" }}>
                    {Math.random() > 0.5 ? "1" : "0"}
                </div>
                ))}
            </div>
            <div className="relative max-w-md w-full bg-black/70 border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-lg">
                {/* Cyberpunk corners */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

                <h2 className="text-3xl font-bold mb-4 text-center text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" style={{ fontFamily: "Goldman, sans-serif" }}>
                    VERIFY EMAIL
                </h2>
                <p className="text-center text-gray-400 mb-6 font-mono">An OTP has been sent to {email || 'your email'}</p>

                {error && <p className="bg-red-900/50 text-red-300 text-center p-3 rounded-md mb-4 border border-red-500/50">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block mb-2 font-mono text-cyan-300">Enter OTP</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded bg-gray-800/50 border-2 border-gray-700 focus:outline-none focus:border-cyan-500 transition-all caret-cyan-400 text-center text-2xl tracking-[0.5em]"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                            maxLength="6"
                        />
                    </div>
                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 p-3 rounded font-bold transition-all disabled:opacity-50" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify & Continue'}
                    </button>
                </form>
                 <div className="flex items-center mt-6">
                    <span className="text-cyan-400 font-mono text-lg mr-2">$~</span>
                    <div className="w-[2px] h-6 bg-cyan-400 animate-blink"></div>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;