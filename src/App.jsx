import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Member from './pages/Member'
import Home from './pages/Home'
import Developers from './pages/Developers'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/members" element={<Member />} />
        <Route path="/developers" element={<Developers />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
