// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';                     // ← new Home component
import Library from './library';
import SkillDetail from './SkillDetail';
import EnterScores from './EnterScores';
import RepairKit from './RepairKit';

 export default function App() {
   return (
     <Router>
       <Routes>
+        <Route path="/" element={<Home />} />            {/* ← show Home at root */}
+        <Route path="/library" element={<Library />} /> {/* ← Library moved to /library */}
         <Route path="/skill/:id" element={<SkillDetail />} />
         <Route path="/enter-scores" element={<EnterScores />} />
         <Route path="/repair-kit" element={<RepairKit />} />
       </Routes>
     </Router>
   );
 }
