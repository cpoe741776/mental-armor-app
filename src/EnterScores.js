// src/EnterScores.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import netlifyIdentity from 'netlify-identity-widget'

export default function EnterScores() {
  const navigate = useNavigate()

  // State for each domain’s numeric score
  const [emotionalFitness, setEmotionalFitness] = useState('')
  const [socialFitness, setSocialFitness]     = useState('')
  const [familyFitness, setFamilyFitness]     = useState('')
  const [spiritualFitness, setSpiritualFitness] = useState('')

  // State for top 2 character strengths
  const [strength1, setStrength1] = useState('')
  const [strength2, setStrength2] = useState('')

  // Replace these with your actual 24 character strength names:
  const strengthOptions = [
    'Wisdom', 'Courage', 'Humanity', 'Justice', 'Temperance', 'Transcendence',
    'Creativity', 'Curiosity', 'Open-Mindedness', 'Love of Learning', 'Perspective',
    'Bravery', 'Persistence', 'Integrity', 'Vitality', 'Kindness', 'Social Intelligence',
    'Teamwork', 'Fairness', 'Leadership', 'Self-Regulation', 'Prudence', 'Forgiveness', 'Humility',
  ]

  const handleSubmit = () => {
    const user = netlifyIdentity.currentUser()
    if (!user) {
      alert('Please log in first')
      return
    }

    // Parse each input as integer (or default to 0)
    const mfaScores = {
      emotional: parseInt(emotionalFitness, 10) || 0,
      social:    parseInt(socialFitness, 10)     || 0,
      family:    parseInt(familyFitness, 10)     || 0,
      spiritual: parseInt(spiritualFitness, 10)  || 0,
    }
    const topStrengths = {
      strength1: strength1 || null,
      strength2: strength2 || null,
    }

    // Use GoTrue client to update user_metadata directly
    user
      .update({ data: { mfaScores, topStrengths } })
      .then(updatedUser => {
        console.log('✅ Metadata saved:', updatedUser.user_metadata)
        navigate('/profile')
      })
      .catch(err => {
        console.error('❌ Failed to save metadata:', err)
        alert('Save failed: ' + err.message)
      })
  }

  return (
    <div className="bg-white min-h-screen overflow-y-auto pb-24 p-4">
      <Header title="Enter MFA Scores" />

      <div className="mt-4 space-y-4 max-w-md mx-auto">
        {/* Emotional Fitness */}
        <div>
          <label className="block mb-1 text-gray-700">Emotional Fitness (0–10)</label>
          <input
            type="number" min="0" max="10"
            value={emotionalFitness}
            onChange={e => setEmotionalFitness(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. 7"
            required
          />
        </div>

        {/* Social Fitness */}
        <div>
          <label className="block mb-1 text-gray-700">Social Fitness (0–10)</label>
          <input
            type="number" min="0" max="10"
            value={socialFitness}
            onChange={e => setSocialFitness(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. 5"
            required
          />
        </div>

        {/* Family Fitness */}
        <div>
          <label className="block mb-1 text-gray-700">Family Fitness (0–10)</label>
          <input
            type="number" min="0" max="10"
            value={familyFitness}
            onChange={e => setFamilyFitness(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. 8"
            required
          />
        </div>

        {/* Spiritual Fitness */}
        <div>
          <label className="block mb-1 text-gray-700">Spiritual Fitness (0–10)</label>
          <input
            type="number" min="0" max="10"
            value={spiritualFitness}
            onChange={e => setSpiritualFitness(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. 6"
            required
          />
        </div>

        {/* Top 2 Character Strengths */}
        <div>
          <label className="block mb-1 text-gray-700">Select Your Top 2 Character Strengths</label>

          {/* First dropdown */}
          <select
            value={strength1}
            onChange={e => {
              const val = e.target.value
              setStrength1(val)
              // If second strength matches new first, reset second
              if (val === strength2) setStrength2('')
            }}
            className="w-full p-2 border rounded mb-2"
            required
          >
            <option value="">-- Strength 1 --</option>
            {strengthOptions
              .filter(str => str !== strength2)
              .map(str => (
                <option key={str} value={str}>{str}</option>
              ))}
          </select>

          {/* Second dropdown: filter out the first selection */}
          <select
            value={strength2}
            onChange={e => setStrength2(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Strength 2 --</option>
            {strengthOptions
              .filter(str => str !== strength1)
              .map(str => (
                <option key={str} value={str}>{str}</option>
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
  )
}
