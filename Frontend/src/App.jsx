import React from 'react'
import Navbar from './components/Navbar'
import PlanTrip from './components/PlanTrip'
import Blog from './components/Blog'
import Feedback from './components/Feedback'
import Itinerary from './components/Itinerary'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<PlanTrip />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/feedback' element={<Feedback />} />
          <Route path='/Itinerary' element={<Itinerary />} />
        
        </Routes>
      </Router>
    </>
  )
}

export default App
