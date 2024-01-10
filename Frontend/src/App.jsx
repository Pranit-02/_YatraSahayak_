import React, { useState } from 'react'
import Navbar from './components/Navbar'
import PlanTrip from './components/PlanTrip'
import Blog from './pages/Blog'
import Home from './pages/Home'
import Feedback from './components/Feedback/Feedback'
import Itinerary from './components/Itinerary'
import HomePage from './components/HomePage/HomePage'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/plan' element={<PlanTrip />} />
          <Route path='/blog' exact element={<Home />} />
          <Route path='/blog-details/:id' element={<Blog />} />
          <Route path='/feedback' element={<Feedback />} />
          <Route path='/Itinerary' element={<Itinerary />} />
        
        </Routes>
      </Router>
    </>
  )
}

export default App
