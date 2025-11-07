import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import CaptainLogin from './pages/CaptainLogin.jsx'
import CaptainSignup from './pages/CaptainSignup.jsx'
import UserLogin from './pages/UserLogin.jsx'
import Usersignup from './pages/Usersignup.jsx'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<Usersignup />} />
      </Routes>
      
    </div>
  )
}

export default App
