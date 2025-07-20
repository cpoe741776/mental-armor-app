// src/App.js
import React, { useEffect } from 'react'
import netlifyIdentity from 'netlify-identity-widget'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


// Import your consolidated Header component
import Header from './Header'
import Home from './home'
import Library from './library'
import SkillDetail from './SkillDetail'
import EnterScores from './EnterScores'
import RepairKit from './RepairKit'
import Profile from './profile'
import WordForgePage from './pages/WordForgePage';


// Note: netlifyIdentity.init() is called in src/index.js
export default function App() {
  useEffect(() => {
    // 1) When login completes in the widget, close it and reload to pick up the JWT
    netlifyIdentity.on('login', () => {
      netlifyIdentity.close()
      window.location.reload()
    })

    // 2) If the URL contains a recovery_token, immediately open the reset form
    if (window.location.hash.includes('recovery_token=')) {
      netlifyIdentity.open()
    }

    // Cleanup listener on unmount
    return () => {
      netlifyIdentity.off('login')
    }
  }, [])

  return (
    <Router>
      {/* Single header, with nav and login/logout built into Header.js */}
      <Header />

      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/skill/:id" element={<SkillDetail />} />
          <Route path="/enter-scores" element={<EnterScores />} />
          <Route path="/repair-kit" element={<RepairKit />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wordforge" element={<WordForgePage />} />


        </Routes>
      </main>
    </Router>
  )
}
