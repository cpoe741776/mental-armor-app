// src/App.js
import React, { useEffect } from 'react'
import netlifyIdentity from 'netlify-identity-widget'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './home'
import Library from './library'
import SkillDetail from './SkillDetail'
import EnterScores from './EnterScores'
import RepairKit from './RepairKit'
import Profile from './profile'

// Note: netlifyIdentity.init() is called in src/index.js
export default function App() {
  // When login completes, close modal and reload to capture JWT
  useEffect(() => {
    netlifyIdentity.on('login', () => {
      netlifyIdentity.close()
      window.location.reload()
    })
  }, [])

  return (
    <Router>
      <header className="p-4 bg-gray-100 flex justify-between items-center">
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/library" className="hover:underline">Library</Link>
          <Link to="/enter-scores" className="hover:underline">Enter Scores</Link>
          <Link to="/repair-kit" className="hover:underline">Repair Kit</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>
        </nav>
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => netlifyIdentity.open('login')}
        >
          Log In
        </button>
      </header>
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/skill/:id" element={<SkillDetail />} />
          <Route path="/enter-scores" element={<EnterScores />} />
          <Route path="/repair-kit" element={<RepairKit />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </Router>
  )
}