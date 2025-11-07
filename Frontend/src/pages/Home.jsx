import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'   // ✅ Import framer-motion

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 h-screen flex flex-col justify-center items-center text-center">
        {/* Main Content */}
        <div className="space-y-8 max-w-3xl">
          {/* Hero Title */}
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Your Ride, Your Way
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300">
            Experience seamless transportation at your fingertips
          </p>

          {/* CTA Button with Framer Motion */}
          <motion.button
            onClick={() => navigate('/register')}
            animate={{ y: [0, -10, 0] }}                     // Bounce motion
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 20px rgba(59,130,246,0.5)" // Glow on hover
            }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full 
                       text-lg font-semibold transition duration-300"
          >
            Get Started
          </motion.button>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 rounded-2xl bg-gray-800/50 backdrop-blur">
              <div className="text-blue-400 text-2xl mb-3">🚗</div>
              <h3 className="text-xl font-semibold mb-2">Quick Pickup</h3>
              <p className="text-gray-400">Fast and reliable rides whenever you need</p>
            </div>
            <div className="p-6 rounded-2xl bg-gray-800/50 backdrop-blur">
              <div className="text-emerald-400 text-2xl mb-3">💰</div>
              <h3 className="text-xl font-semibold mb-2">Best Rates</h3>
              <p className="text-gray-400">Competitive pricing for every journey</p>
            </div>
            <div className="p-6 rounded-2xl bg-gray-800/50 backdrop-blur">
              <div className="text-blue-400 text-2xl mb-3">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Top Drivers</h3>
              <p className="text-gray-400">Professional and courteous service</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
