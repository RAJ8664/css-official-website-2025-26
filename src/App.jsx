import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Member from './pages/Member'
import Home from './pages/Home'
import Developers from './pages/Developers'
import  Wings from './pages/Wings'
import EditorialsComingSoon from './pages/Editorials'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/members" element={<Member />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/wings" element={<Wings />} />
        <Route path="/editorials" element={<EditorialsComingSoon />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
