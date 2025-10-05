import React from 'react';
import PillNav from '../utils/PillNav';
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const Navbar = () => {
  const location = useLocation();
  const [activeHref, setActiveHref] = useState(location.pathname);
  const { user, signOut } = useAuth(); // Get user and signOut from context

  useEffect(() => {
    setActiveHref(location.pathname);
  }, [location.pathname]);

  // Define navigation items
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Wings', href: '/wings' },
    { label: 'Members', href: '/members' },
    { label: 'Developers', href: '/developers' },
    { label: 'Events', href: '/events' },
    { label: 'Editorials', href: '/editorials' },
  ];

  return (
    <div className="flex justify-center w-full">
      <PillNav
        logo="https://res.cloudinary.com/dludtk5vz/image/upload/v1757083555/CSS-LOGO_scfa6u.jpg"
        logoAlt="CSS"
        items={navItems}
        activeHref={activeHref}
        className="custom-nav"
        ease="power2.easeOut"
        baseColor="#000000"
        pillColor="#0f172a"
        hoveredPillTextColor="#06b6d4"
        pillTextColor="#ffffff"
        initialLoadAnimation={true}
      >
        {/* Authentication Status */}
        <div className="flex items-center gap-4 ml-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <img
                  src={user.user_metadata.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.email}`}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full"
                />
              </Link>
              <button
                onClick={signOut}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Login
              </button>
            </Link>
          )}
        </div>
      </PillNav>
    </div>
  );
};

export default Navbar;