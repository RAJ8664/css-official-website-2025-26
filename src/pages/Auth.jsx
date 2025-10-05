import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signIn, signUp, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const { error } = await signIn({ email, password });
                if (error) throw error;
                navigate('/dashboard');
            } else {
                const { error } = await signUp({ email, password });
                if (error) throw error;
                navigate('/otp-verification', { state: { email } });
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {/* Email and password inputs */}
                </form>
                <button onClick={handleGoogleSignIn} className="w-full bg-red-600 hover:bg-red-700 p-2 rounded mt-4">
                    Sign In with Google
                </button>
                <p className="text-center mt-4">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 ml-2">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;