// components/AdminRoute.jsx - COMPLETE FIXED VERSION
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAdmin, adminLoading } = useAdmin();
  const { user, loading } = useAuth();

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-lg">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;