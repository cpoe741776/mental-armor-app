// src/library.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { skills } from './skills';

export default function Library() {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Values & Meaning', 'Resilient Thinking', 'Social Resilience'];

  // Filter by category, then by searchTerm (checks title, brief, or any benefit)
  const visible = skills.filter((s) => {
    const categoryMatch = filter === 'All' || s.category === filter;

    if (searchTerm.trim() === '') {
      return categoryMatch;
    }

    const term = searchTerm.toLowerCase();
    const inTitle = s.title.toLowerCase().includes(term);
    const inBrief = s.brief.toLowerCase().includes(term);
    const inBenefits = s.benefits.some((b) => b.toLowerCase().includes(term));

    return categoryMatch && (inTitle || inBrief || inBenefits);
  });

  return (
    <div className="bg-white min-h-screen overflow-y-auto pb-24">
      {/* Shared header */}
     

      <div className="p-4">
        {/* Search field */}
        <input
          type="text"
          placeholder="Search skills…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {/* Category‐filter buttons */}
        <div className="flex overflow-x-auto space-x-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded ${
                filter === cat ? 'bg-[#003049] text-white' : 'border text-[#003049]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of skill cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((skill) => (
            <Link
              key={skill.id}
              to={`/skill/${skill.id}`}
              className="bg-white rounded-2xl shadow hover:shadow-lg transform hover:scale-105 transition p-4 flex flex-col items-center text-center"
            >
              {/* ↓ Trainer intro video (if available) */}
              {skill.videoUrl ? (
                <video
                  src={skill.videoUrl}
                   className="w-half h-16 rounded mb-3 object-cover"
                   muted
                   loop
                   autoPlay
                   playsInline
                   preload="metadata"
                  onError={() => console.warn(`Video failed to load: ${skill.videoUrl}`)}
                />
              ) : (
                <img
                  src={skill.trainerImage}
                  alt={skill.trainer}
                  className="w-16 h-16 rounded-full mb-3 object-cover"
                />
              )}

              <div className="font-semibold text-[#003049]">{skill.title}</div>
              <div className="text-xs text-gray-500 mb-2">{skill.category}</div>
              <div className="text-sm text-gray-700">{skill.brief}</div>
            </Link>
          ))}

          {visible.length === 0 && (
            <div className="col-span-full text-center text-gray-500 mt-8">
              No skills match your search/filters.
            </div>
          )}
        </div>
      </div>

      {/* Fixed “+” button → takes user to Enter MFA Scores */}
      <Link
        to="/enter-scores"
        className="fixed bottom-4 right-4 p-4 bg-[#003049] text-white rounded-full shadow-lg"
      >
        +
      </Link>
    </div>
  );
}