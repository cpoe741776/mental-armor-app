// src/EnterScores.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

export default function EnterScores() {
  const navigate = useNavigate();

  // Replace these with your actual 24 character strength names:
  const strengthOptions = [
    'Wisdom',
    'Courage',
    'Humanity',
    'Justice',
    'Temperance',
    'Transcendence',
    'Creativity',
    'Curiosity',
    'Open-Mindedness',
    'Love of Learning',
    'Perspective',
    'Bravery',
    'Persistence',
    'Integrity',
    'Vitality',
    'Kindness',
    'Social Intelligence',
    'Teamwork',
    'Fairness',
    'Leadership',
    'Self-Regulation',
    'Prudence',
    'Forgiveness',
    'Humility'
  ];

  return (
    <div className="bg-white min-h-screen overflow-y-auto pb-24 p-4">
      <Header title="Enter MFA Scores" />

      <div className="mt-4 space-y-4">
        {['Emotional Fitness', 'Social Fitness', 'Family Fitness', 'Spiritual Fitness'].map((domain) => (
          <div key={domain}>
            <label className="block mb-1 text-gray-700">{domain}</label>
            <input
              type="number"
              placeholder="Score"
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 text-gray-700">Select Your Top 2 Character Strengths</label>

          {/* First dropdown */}
          <select className="w-full p-2 border rounded mb-2">
            <option value="">-- Strength 1 --</option>
            {strengthOptions.map((strength) => (
              <option key={strength} value={strength}>
                {strength}
              </option>
            ))}
          </select>

          {/* Second dropdown */}
          <select className="w-full p-2 border rounded">
            <option value="">-- Strength 2 --</option>
            {strengthOptions.map((strength) => (
              <option key={strength} value={strength}>
                {strength}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="mt-6 w-full p-3 bg-[#003049] text-white rounded-xl"
        onClick={() => {
          // Handle saving scores & strengths here, then navigate:
          navigate('/repair-kit');
        }}
      >
        Save & Continue
      </button>
    </div>
  );
}
