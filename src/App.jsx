import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Member from './pages/Member'
import Home from './pages/Home'  
// import Layout from './components/Layout'
import Developers from './pages/Developers'
import  Wings from './pages/Wings'
import EditorialsComingSoon from './pages/Editorials'
import { NavbarDemo } from './components/Navbar'
import Events from './pages/Events'
import MoreEvents from './pages/MoreEvents'


import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Member from './pages/Member';
import Home from './pages/Home';
import Developers from './pages/Developers';
import Wings from './pages/Wings';
import EditorialsComingSoon from './pages/Editorials';
import Navbar from './components/Navbar'; // Use your updated Navbar
import Auth from './pages/auth';
import OtpVerification from './pages/OtpVerification';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';
// import Events from './pages/Events';

const App = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/members" element={<Member />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/wings" element={<Wings />} />
        <Route path= "/events" element={<Events />}/>
         <Route path="/events/:slug" element={<MoreEvents />} />
        <Route path="/editorials" element={<EditorialsComingSoon />} />
        {/* <Route path="/events" element={<Events />} /> */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/auth" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;