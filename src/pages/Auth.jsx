import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [scholarId, setScholarId] = useState('');
    const [fullName, setFullName] = useState(''); // Add full name state
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, signUp, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                const { error } = await signIn({ email, password });
                if (error) throw error;
                navigate('/dashboard');
            } else {
                const { data, error } = await signUp({
                    email,
                    password,
                    options: {
                        data: {
                            scholar_id: scholarId,
                            full_name: fullName, // Add full name to metadata
                        },
                        channel: 'email',
                    }
                });
                if (error) throw error;
                if (data.user && data.user.identities && data.user.identities.length === 0) {
                    navigate('/otp-verification', { state: { email } });
                } else {
                    alert('Check your email for a verification link!');
                }
            }
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <div className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center px-6 py-10 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(40)].map((_, i) => (
                <div key={i} className="absolute text-cyan-400 text-xs animate-[fall_6s_linear_infinite]"
                    style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 6}s`, top: "-20px" }}>
                    {Math.random() > 0.5 ? "1" : "0"}
                </div>
                ))}
            </div>
            <div className="relative max-w-md w-full bg-black/70 border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-lg">
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

                <h2 className="text-4xl font-bold mb-6 text-center text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" style={{ fontFamily: "Goldman, sans-serif" }}>
                    {isLogin ? 'LOGIN' : 'SIGN UP'}
                </h2>
                {error && <p className="bg-red-900/50 text-red-300 text-center p-3 rounded-md mb-4 border border-red-500/50">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                         <div className="mb-4">
                            <label className="block mb-2 font-mono text-cyan-300">Full Name</label>
                            <input
                                type="text"
                                className="w-full p-3 rounded bg-gray-800/50 border-2 border-gray-700 focus:outline-none focus:border-cyan-500 transition-all caret-cyan-400"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block mb-2 font-mono text-cyan-300">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 rounded bg-gray-800/50 border-2 border-gray-700 focus:outline-none focus:border-cyan-500 transition-all caret-cyan-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block mb-2 font-mono text-cyan-300">Scholar ID</label>
                            <input
                                type="text"
                                className="w-full p-3 rounded bg-gray-800/50 border-2 border-gray-700 focus:outline-none focus:border-cyan-500 transition-all caret-cyan-400"
                                value={scholarId}
                                onChange={(e) => setScholarId(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="mb-6">
                        <label className="block mb-2 font-mono text-cyan-300">Password</label>
                        <input
                            type="password"
                            className="w-full p-3 rounded bg-gray-800/50 border-2 border-gray-700 focus:outline-none focus:border-cyan-500 transition-all caret-cyan-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 p-3 rounded font-bold transition-all disabled:opacity-50" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>
                <div className="my-4 flex items-center">
                    <div className="flex-grow border-t border-gray-700"></div>
                    <span className="mx-4 text-gray-500">OR</span>
                    <div className="flex-grow border-t border-gray-700"></div>
                </div>
                <button onClick={handleGoogleSignIn} className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded font-bold transition-all disabled:opacity-50" disabled={loading}>
                    Continue with Google
                </button>
                <p className="text-center mt-6">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="text-cyan-400 hover:text-cyan-300 ml-2 font-bold">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;
