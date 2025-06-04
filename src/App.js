// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import Library from './library';
import SkillDetail from './SkillDetail';
import EnterScores from './EnterScores';
import RepairKit from './RepairKit';
import Profile from './profile'; // ← import the new component

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/skill/:id" element={<SkillDetail />} />
        <Route path="/enter-scores" element={<EnterScores />} />
        <Route path="/repair-kit" element={<RepairKit />} />
        <Route path="/profile" element={<Profile />} />  {/* ← new route */}
      </Routes>
    </Router>
  );
}