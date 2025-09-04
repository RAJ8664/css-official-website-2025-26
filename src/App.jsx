import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Member from './pages/Member'
import { Home } from './pages/Home'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/members" element={<Member />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
