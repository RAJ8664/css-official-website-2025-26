import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                <p className="mb-6">Welcome, {user?.email}!</p>
                <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 p-2 rounded">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;