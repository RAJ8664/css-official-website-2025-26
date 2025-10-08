import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Member from './pages/Member'
import Home from './pages/Home'
import Developers from './pages/Developers'
import Wings from './pages/Wings'
import EditorialsComingSoon from './pages/Editorials'
import { NavbarDemo } from './components/Navbar'
import Events from './pages/Events'
import MoreEvents from './pages/MoreEvents'

const App = () => {
  return (
    <BrowserRouter>
      <NavbarDemo />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/members" element={<Member />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/wings" element={<Wings />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<MoreEvents />} />
        <Route path="/editorials" element={<EditorialsComingSoon />} />
        <Route path="/login" element={<Login />} /> {/* Added Login route */}
      </Routes>
    </BrowserRouter>
  )
}

// Placeholder Login component (create this in pages/Login.js if needed)
const Login = () => <h1>Login Page</h1>

export default App
