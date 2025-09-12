import React from 'react'

import PillNav from '../utils/PillNav';
// import logo from '/path/to/logo.svg';
import {  useLocation ,Link} from 'react-router-dom'
import { useState,useEffect } from 'react';

const Navbar = () => {
  
    const location=useLocation();
    const [activeHref, setActiveHref] = useState(location.pathname);

  useEffect(() => {
    setActiveHref(location.pathname);
  }, [location.pathname]);
  return (
        <div className="flex justify-center w-full">   {/* flexbox wrapper */}
 <PillNav
logo="https://res.cloudinary.com/dludtk5vz/image/upload/v1757083555/CSS-LOGO_scfa6u.jpg"

  logoAlt="CSS"
  items={[
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'wings', href: '/members' },
    { label: 'developers', href: '/developers' }
  ]}
  activeHref={activeHref}
  className="custom-nav"
  ease="power2.easeOut"
  baseColor="#000000"
  pillColor="#0f172a"
  hoveredPillTextColor="#06b6d4"
  pillTextColor="#ffffff"
  initialLoadAnimation={true}
// onMobileMenuClick={() => {
//     // trigger a tiny state change to refresh PillNav
//     setTimeout(() => {}, 0);
//   }}
/>        
</div>
  )
}

export default Navbar
