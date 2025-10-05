import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const OtpVerification = () => {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const { verifyOtp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Email not provided. Please sign up again.");
            return;
        }
        try {
            const { error } = await verifyOtp({ email, token, type: 'signup' });
            if (error) throw error;
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h2>
                <p className="text-center mb-4">An OTP has been sent to {email}</p>
                {/* ... (form with OTP input and submit button) */}
            </div>
        </div>
    );
};

export default OtpVerification;