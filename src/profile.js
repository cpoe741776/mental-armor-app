import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import { skills } from './skills'
import netlifyIdentity from 'netlify-identity-widget'

// Helper: map MFA scores → suggested skills
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

// Eight resilience avatars
const AVATARS = [
  { id: 'flower',  src: '/avatars/flower.png' },
  { id: 'summit',  src: '/avatars/summit.png' },
  { id: 'bicycle', src: '/avatars/bicycle.png' },
  { id: 'sapling', src: '/avatars/sapling.png' },
  { id: 'phoenix', src: '/avatars/phoenix.png' },
  { id: 'wave',    src: '/avatars/wave.png' },
  { id: 'sunrise', src: '/avatars/sunrise.png' },
  { id: 'trail',   src: '/avatars/trail.png' },
]

export default function Profile() {
  const [user, setUser] = useState(null)
  const [avatar, setAvatar] = useState('')
  const [visitedSkillIds, setVisitedSkillIds] = useState([])
  const [mfaScores, setMfaScores] = useState(null)
  const [topStrengths, setTopStrengths] = useState({ strength1: null, strength2: null })
  const [suggestedSkills, setSuggestedSkills] = useState([])
  const [loading, setLoading] = useState(true)

  // load profile metadata
  const loadMetadata = (u) => {
    const { user_metadata = {} } = u
    const {
      visitedSkills = [],
      mfaScores: scores = null,
      topStrengths: strengths = {},
      avatar: avatarId = '',
    } = user_metadata
    setVisitedSkillIds(visitedSkills)
    setMfaScores(scores)
    setTopStrengths(strengths)
    setSuggestedSkills(mapScoresToSkills(scores))
    setAvatar(avatarId)
  }

  useEffect(() => {
    netlifyIdentity.init()
    const u = netlifyIdentity.currentUser()
    if (u) {
      setUser(u)
      loadMetadata(u)
    }
    setLoading(false)

    const onLogin = (u) => {
      setUser(u)
      loadMetadata(u)
    }
    const onLogout = () => {
      setUser(null)
      setVisitedSkillIds([])
      setMfaScores(null)
      setTopStrengths({ strength1: null, strength2: null })
      setSuggestedSkills([])
      setAvatar('')
    }

    netlifyIdentity.on('login', onLogin)
    netlifyIdentity.on('logout', onLogout)
    return () => {
      netlifyIdentity.off('login', onLogin)
      netlifyIdentity.off('logout', onLogout)
    }
  }, [])

  const handleLoginClick    = () => netlifyIdentity.open('login')
  const handleLogoutClick   = () => netlifyIdentity.logout()
  const handleResetPassword = () => {
    if (!user) return
    netlifyIdentity.forgotPassword(user.email, (err) => {
      if (err) alert('Error sending reset email: ' + err.message)
      else alert(`Password reset email sent to ${user.email}.`)
    })
  }
  const updateAvatar = (newAvatar) => {
    if (!user) return
    const metadata = { ...(user.user_metadata || {}), avatar: newAvatar }
    user
      .update({ user_metadata: metadata })
      .then((u) => {
        setUser(u)
        setAvatar(newAvatar)
      })
      .catch((err) => alert('Error updating avatar: ' + err.message))
  }

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
      <div className="container mx-auto px-4 py-8 space-y-8">
        {!user ? (
          <div className="text-center text-gray-600">
            <p>
              Please{' '}
              <button
                onClick={handleLoginClick}
                className="text-blue-600 underline"
              >
                log in
              </button>{' '}
              to view your profile.
            </p>
          </div>
        ) : (
          <>
            {/* Header with email & actions */}
            <div className="flex items-center justify-between">
              <div><strong>Email:</strong> {user.email}</div>
              <div className="space-x-2">
                <button
                  onClick={handleResetPassword}
                  className="px-3 py-1 bg-yellow-400 rounded"
                >
                  Reset Password
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="px-3 py-1 bg-red-400 rounded"
                >
                  Log Out
                </button>
              </div>
            </div>

            {/* Side-by-side: Scores/Strengths and Avatars */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left: Scores & Strengths */}
              <div className="flex-1 space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-3">Your MFA Scores</h2>
                  {mfaScores ? (
                    <ul className="list-disc list-inside text-gray-700">
                      <li><strong>Emotional:</strong> {mfaScores.emotional}</li>
                      <li><strong>Social:</strong>    {mfaScores.social}</li>
                      <li><strong>Family:</strong>    {mfaScores.family}</li>
                      <li><strong>Spiritual:</strong> {mfaScores.spiritual}</li>
                    </ul>
                  ) : (
                    <p className="text-gray-600">
                      No scores yet. Go to “Enter MFA Scores” to log yours.
                    </p>
                  )}
                </section>
                <section>
                  <h2 className="text-2xl font-semibold mb-3">Your Top 2 Strengths</h2>
                  {(topStrengths.strength1 || topStrengths.strength2) ? (
                    <ul className="list-disc list-inside text-gray-700">
                      <li><strong>1:</strong> {topStrengths.strength1}</li>
                      <li><strong>2:</strong> {topStrengths.strength2}</li>
                    </ul>
                  ) : (
                    <p className="text-gray-600">
                      No strengths selected. Head to “Enter MFA Scores.”
                    </p>
                  )}
                </section>
              </div>

              {/* Right: Avatar Picker */}
              <div className="w-32">
                <h2 className="text-xl font-semibold mb-2 text-center">Avatar</h2>
                <div className="grid grid-cols-2 gap-2">
                  {AVATARS.map((a) => (
                    <img
                      key={a.id}
                      src={a.src}
                      alt={a.id}
                      className={`w-16 h-16 rounded-full cursor-pointer border-2 ${
                        avatar === a.id ? 'border-blue-500' : 'border-transparent'
                      }`}
                      onClick={() => updateAvatar(a.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Other sections unchanged... */}
          </>
        )}
      </div>
    </div>
  )
}
