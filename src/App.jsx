import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Member from './pages/Member'
import { Home } from './pages/Home'
import Layout from './components/Layout'
const App = () => {
  return (
    <>
      <BrowserRouter>
      <Layout>    
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/members" element={<Member />} />
        </Routes>
        </Layout>
      </BrowserRouter>
    </>
  )
}

export default App
