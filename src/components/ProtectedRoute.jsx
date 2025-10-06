import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading session...</div>;
    }

    if (!user) {
        return <Navigate to="/auth" />;
    }

    // After login, check if the profile is complete.
    // The profile exists because of the trigger, but scholar_id might be null.
    if (!profile?.scholar_id || !profile?.full_name) {
        return <Navigate to="/complete-profile" />;
    }

    return children;
};

export default ProtectedRoute;

