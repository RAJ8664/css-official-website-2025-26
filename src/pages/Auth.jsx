import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [scholarId, setScholarId] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, requiresProfileCompletion, signIn, signUp, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (requiresProfileCompletion) {
                navigate('/complete-profile');
                return;
            }
            navigate('/');
        }
    }, [user, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            if (isLogin) {
                // Login flow
                const { data, error } = await signIn({ email, password });
                
                if (error) {
                    console.error('Login error:', error);
                    throw error;
                }
                
                navigate('/dashboard');
                
            } else {
                // Signup flow
                
                if (!fullName.trim() || !scholarId.trim()) {
                    throw new Error('Please fill in all fields');
                }

                if (password.length < 6) {
                    throw new Error('Password must be at least 6 characters long');
                }

                // Use the updated signUp function that includes profile data
                const result= await signUp(email, password, fullName, scholarId);

                if (result.error) {
                    console.error('Signup error:', result.error);
                    throw result.error;
                }


                // Navigate to OTP verification
                navigate('/otp-verification', { 
                    state: { 
                        email,
                        message: 'Check your email for verification code!' 
                    } 
                });
            }
        } catch (error) {
            console.error('Auth process error:', error);
            setError(error.message || 'An error occurred during authentication');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (error) {
            setError(error.message || 'Google sign-in failed');
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setScholarId('');
        setFullName('');
        setError('');
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        resetForm();
    };

    return (
        <div className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center px-6 py-10 overflow-hidden">
            
            <div className="relative max-w-md w-full bg-black/70 border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-lg">
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

                <h2 className="text-4xl font-bold mb-6 text-center text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" style={{ fontFamily: "Goldman, sans-serif" }}>
                    {isLogin ? 'LOGIN' : 'SIGN UP'}
                </h2>
                
                {error && (
                    <div className="bg-red-900/50 text-red-300 text-center p-3 rounded-md mb-4 border border-red-500/50">
                        {error}
                    </div>
                )}
                
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
                                placeholder="Enter your full name"
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
                            placeholder="Enter your email"
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
                                placeholder="Enter your scholar ID"
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
                            placeholder="Enter your password"
                            minLength={6}
                        />
                        {!isLogin && (
                            <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters long</p>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full bg-cyan-600 hover:bg-cyan-700 p-3 rounded font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            isLogin ? 'Login' : 'Sign Up'
                        )}
                    </button>
                </form>
                
                <div className="my-4 flex items-center">
                    <div className="flex-grow border-t border-gray-700"></div>
                    <span className="mx-4 text-gray-500">OR</span>
                    <div className="flex-grow border-t border-gray-700"></div>
                </div>
                
                <button 
                    onClick={handleGoogleSignIn} 
                    className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                    disabled={loading}
                >
                    {/* <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg> */}
                    <FcGoogle className='w-5 h-5' />
                    Continue with Google
                </button>
                
                <p className="text-center mt-6 text-gray-300">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button 
                        onClick={toggleMode} 
                        className="text-cyan-400 hover:text-cyan-300 ml-2 font-bold transition-colors"
                        type="button"
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;