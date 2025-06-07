// src/Profile.js
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import { skills } from './skills'
import netlifyIdentity from 'netlify-identity-widget'

// Helper to map scores → suggested skills
function mapScoresToSkills(mfaScores) {
  if (!mfaScores) return []
  const THRESHOLD = 5
  const lowCats = []

  if (mfaScores.emotional <= THRESHOLD) lowCats.push('Emotional Fitness')
  if (mfaScores.social    <= THRESHOLD) lowCats.push('Social Fitness')
  if (mfaScores.family    <= THRESHOLD) lowCats.push('Family Fitness')
  if (mfaScores.spiritual <= THRESHOLD) lowCats.push('Spiritual Fitness')

  return skills.filter(skill => lowCats.includes(skill.category))
}

export default function Profile() {
  const [visitedSkillIds, setVisitedSkillIds] = useState([])
  const [mfaScores, setMfaScores]             = useState(null)
  const [topStrengths, setTopStrengths]       = useState({ strength1: null, strength2: null })
  const [suggestedSkills, setSuggestedSkills] = useState([])
  const [loading, setLoading]                 = useState(true)

  useEffect(() => {
    const user = netlifyIdentity.currentUser()
    if (!user) {
      setLoading(false)
      return
    }
    // Read metadata directly from the user object
    const { user_metadata = {} } = user
    const { visitedSkills = [], mfaScores = null, topStrengths = {} } = user_metadata

    setVisitedSkillIds(visitedSkills)
    setMfaScores(mfaScores)
    setTopStrengths(topStrengths)
    setSuggestedSkills(mapScoresToSkills(mfaScores))
    setLoading(false)
  }, [])

  const user = netlifyIdentity.currentUser()
  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg">Loading profile…</p>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <Header title="Your Profile" />

      <div className="container mx-auto px-4 py-8 space-y-12">
        {!user ? (
          <div className="text-center text-gray-600">
            <p>
              Please{' '}
              <button
                onClick={() => netlifyIdentity.open('login')}
                className="text-blue-600 underline"
              >
                log in
              </button>{' '}
              to view your profile.
            </p>
          </div>
        ) : (
          <>
            {/* Section: MFA Scores */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Latest MFA Scores</h2>
              {mfaScores ? (
                <ul className="list-disc list-inside text-gray-700">
                  <li><strong>Emotional:</strong> {mfaScores.emotional}</li>
                  <li><strong>Social:</strong> {mfaScores.social}</li>
                  <li><strong>Family:</strong> {mfaScores.family}</li>
                  <li><strong>Spiritual:</strong> {mfaScores.spiritual}</li>
                </ul>
              ) : (
                <p className="text-gray-600">
                  No scores yet. Go to “Enter MFA Scores” to log yours.
                </p>
              )}
            </section>

            {/* Section: Top Strengths */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Top 2 Strengths</h2>
              {(topStrengths.strength1 || topStrengths.strength2) ? (
                <ul className="list-disc list-inside text-gray-700">
                  <li><strong>Strength 1:</strong> {topStrengths.strength1}</li>
                  <li><strong>Strength 2:</strong> {topStrengths.strength2}</li>
                </ul>
              ) : (
                <p className="text-gray-600">
                  No strengths selected. Head to “Enter MFA Scores” to choose.
                </p>
              )}
            </section>

            {/* Section: Visited Skills */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Skills You’ve Viewed</h2>
              {visitedSkillIds.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700">
                  {visitedSkillIds.map(id => {
                    const skill = skills.find(s => s.id === id)
                    return (
                      skill && (
                        <li key={id}>
                          <Link to={`/skill/${id}`} className="text-blue-600 hover:underline">
                            {skill.title}
                          </Link>
                        </li>
                      )
                    )
                  })}
                </ul>
              ) : (
                <p className="text-gray-600">
                  No skills viewed yet. Browse the Library to start.
                </p>
              )}
            </section>

            {/* Section: Suggested Skills */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Skills We Suggest</h2>
              {suggestedSkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedSkills.map(skill => (
                    <Link
                      key={skill.id}
                      to={`/skill/${skill.id}`}
                      className="block p-4 border rounded-lg hover:shadow-lg transition"
                    >
                      <div className="font-semibold text-[#003049]">{skill.title}</div>
                      <p className="text-gray-700 mt-1 line-clamp-2">{skill.brief}</p>
                      <span className="text-blue-600 hover:underline mt-2 inline-block">
                        Learn more →
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  {mfaScores
                    ? 'You’re all set—keep reinforcing what you’ve learned!'
                    : 'Enter your MFA Scores first for personalized suggestions.'}
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}