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



const App = () => {
  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/members" element={<Member />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/wings" element={<Wings />} />
        <Route path= "/events" element={<Events />}/>
         <Route path="/events/:slug" element={<MoreEvents />} />
        <Route path="/editorials" element={<EditorialsComingSoon />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
