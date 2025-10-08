import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Member from './pages/Member'
import Home from './pages/Home'  
import { NavbarDemo } from './components/Navbar'
import Events from './pages/Events'
import MoreEvents from './pages/MoreEvents'
import Auth from './pages/auth';
import OtpVerification from './pages/OtpVerification';
import Dashboard from './pages/Dashboard';
import CompleteProfile from './pages/CompleteProfilePage';
import AuthProvider from './context/AuthContext';
import AuthCallback from './pages/AuthCallBack'
import Wings from './pages/Wings';
import Developers from './pages/Developers';
// ADD: Import useAuth
import { useAuth } from './context/AuthContext';

// ADD: ProtectedRoute component inside this file
const ProtectedRoute = ({ children, requireProfileCompletion = false }) => {
    const { user, loading, requiresProfileCompletion } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    if (requireProfileCompletion && requiresProfileCompletion) {
        return <Navigate to="/complete-profile" replace />;
    }

    return children;
};
const GuestRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};


const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* <NavbarDemo /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/members" element={<Member />} />
          <Route path="/events" element={<Events />} />
          <Route path="/wings" element={<Wings />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/events/:slug" element={<MoreEvents />} />
          <Route path="/auth" element={
            <GuestRoute>
                <Auth />
            </GuestRoute>
          } />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          
          {/* Protected Routes */}
          <Route 
            path="/complete-profile" 
            element={
              <ProtectedRoute >
                <CompleteProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireProfileCompletion={true}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;