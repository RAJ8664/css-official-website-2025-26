// AuthCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
       
        if (user) {
            navigate('/dashboard', { replace: true });
        } else {
            // If no user after a reasonable time, redirect to auth
            const timeout = setTimeout(() => {
                navigate('/auth', { replace: true });
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                <p className="text-lg">Completing authentication...</p>
                <p className="text-sm text-gray-400 mt-2">You will be redirected shortly</p>
            </div>
        </div>
    );
};

export default AuthCallback;