// src/EnterScores.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import netlifyIdentity from 'netlify-identity-widget';

export default function EnterScores() {
  const navigate = useNavigate();

  // State for each domain’s numeric score
  const [emotionalFitness, setEmotionalFitness] = useState('');
  const [socialFitness, setSocialFitness] = useState('');
  const [familyFitness, setFamilyFitness] = useState('');
  const [spiritualFitness, setSpiritualFitness] = useState('');

  // State for top 2 character strengths
  const [strength1, setStrength1] = useState('');
  const [strength2, setStrength2] = useState('');

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
    'Humility',
  ];

  const handleSubmit = async () => {
    // Parse each input as integer (or default to 0)
    const emScore = parseInt(emotionalFitness, 10) || 0;
    const soScore = parseInt(socialFitness, 10) || 0;
    const faScore = parseInt(familyFitness, 10) || 0;
    const spScore = parseInt(spiritualFitness, 10) || 0;

    const user = netlifyIdentity.currentUser();
    if (user) {
      // Build metadata object
      const mfaScores = {
        emotional: emScore,
        social: soScore,
        family: faScore,
        spiritual: spScore,
      };
      const topStrengths = {
        strength1: strength1 || null,
        strength2: strength2 || null,
      };

      try {
        await fetch('/.netlify/functions/saveUserMetadata', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mfaScores, topStrengths }),
        });
      } catch (err) {
        console.error('Error saving metadata:', err);
      }
    }

    // Navigate to Repair Kit
    navigate('/profile');
  };

  return (
    <div className="bg-white min-h-screen overflow-y-auto pb-24 p-4">
      <Header title="Enter MFA Scores" />

      <div className="mt-4 space-y-4 max-w-md mx-auto">
        {/* Emotional Fitness */}
        <div>
          <label className="block mb-1 text-gray-700">Emotional Fitness (0–10)</label>
          <input
            type="number"
            min="0"
            max="10"
            value={emotionalFitness}
            onChange={(e) => setEmotionalFitness(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. 7"
            required
          />
        </div>

        {/* Social Fitness */}
        <div>
          <label className="block mb-1 text-gray-700">Social Fitness (0–10)</label>
          <input
            type="number"
            min="0"
            max="10"
            value={socialFitness}
            onChange={(e) => setSocialFitness(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. 5"
            required
          />
        </div>

        {/* Family Fitness */}
        <div>
          <label className="block mb-1 text-gray-700">Family Fitness (0–10)</label>
          <input
            type="number"
            min="0"
            max="10"
            value={familyFitness}
            onChange={(e) => setFamilyFitness(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. 8"
            required
          />
        </div>

        {/* Spiritual Fitness */}
        <div>
          <label className="block mb-1 text-gray-700">Spiritual Fitness (0–10)</label>
          <input
            type="number"
            min="0"
            max="10"
            value={spiritualFitness}
            onChange={(e) => setSpiritualFitness(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. 6"
            required
          />
        </div>

        {/* Top 2 Character Strengths */}
        <div>
          <label className="block mb-1 text-gray-700">
            Select Your Top 2 Character Strengths
          </label>

          {/* First dropdown */}
          <select
            value={strength1}
            onChange={(e) => setStrength1(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            required
          >
            <option value="">-- Strength 1 --</option>
            {strengthOptions.map((strength) => (
              <option key={strength} value={strength}>
                {strength}
              </option>
            ))}
          </select>

          {/* Second dropdown */}
          <select
            value={strength2}
            onChange={(e) => setStrength2(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
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
        className="mt-6 w-full p-3 bg-[#003049] text-white rounded-xl hover:bg-[#002034] transition"
        onClick={handleSubmit}
      >
        Save & Continue
      </button>
    </div>
  );
}
