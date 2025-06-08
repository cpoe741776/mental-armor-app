import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import { skills } from './skills'
import netlifyIdentity from 'netlify-identity-widget'
import MFADials from './components/MFADials'

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

  // Load user metadata into state
  const loadMetadata = (u) => {
    const { user_metadata = {} } = u
    const {
      visitedSkills      = [],
      mfaScores: rawScores = null,
      topStrengths: strengths = {},
      avatar: avatarId   = '',
    } = user_metadata

    setVisitedSkillIds(visitedSkills)

    // Parse and set MFA scores
    const scores = rawScores
      ? {
          emotional: parseFloat(rawScores.emotional),
          social:    parseFloat(rawScores.social),
          family:    parseFloat(rawScores.family),
          spiritual: parseFloat(rawScores.spiritual),
        }
      : null
    setMfaScores(scores)

    setTopStrengths(strengths)
    setSuggestedSkills(mapScoresToSkills(scores))
    setAvatar(avatarId)
  }

  // Initialize on mount
  useEffect(() => {
    netlifyIdentity.init()
    const u = netlifyIdentity.currentUser()
    if (u) {
      setUser(u)
      loadMetadata(u)
    }
    setLoading(false)

    const onLogin = (u) => { setUser(u); loadMetadata(u) }
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

  // Reload metadata when user object is updated (e.g., after avatar change)
  useEffect(() => {
    if (user) {
      loadMetadata(user)
    }
  }, [user])

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
    user.update({ user_metadata: metadata })
      .then(u => setUser(u))
      .catch(err => alert('Error updating avatar: ' + err.message))
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
      <div className="container mx-auto px-4 py-8">
        {!user ? (
          <div className="text-center text-gray-600">
            <p>
              Please <button onClick={handleLoginClick} className="text-blue-600 underline">log in</button> to view your profile.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Left Column */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3">
                {avatar && (
                  <img src={AVATARS.find(a => a.id===avatar)?.src} alt="Your avatar" className="w-12 h-12 rounded-full" />
                )}
                <div><strong>Email:</strong> {user.email}</div>
              </div>
              <section>
                <h2 className="text-xl font-semibold mb-2">Your MFA Scores</h2>
                {mfaScores ? (
                  <ul className="list-disc list-inside text-gray-700">
                    <li><strong>Emotional:</strong> {mfaScores.emotional.toFixed(1)}</li>
                    <li><strong>Social:</strong>    {mfaScores.social.toFixed(1)}</li>
                    <li><strong>Family:</strong>    {mfaScores.family.toFixed(1)}</li>
                    <li><strong>Spiritual:</strong> {mfaScores.spiritual.toFixed(1)}</li>
                  </ul>
                ) : (<p className="text-gray-600">No scores yet. Enter MFA scores.</p>)}
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-2">Your Top Strengths</h2>
                {(topStrengths.strength1 || topStrengths.strength2) ? (
                  <ul className="list-disc list-inside text-gray-700">"+
            "<li><strong>1:</strong> {topStrengths.strength1}</li>
" +
            "<li><strong>2:</strong> {topStrengths.strength2}</li>
" +
            "</ul>
                ) : (<p className="text-gray-600">No strengths selected.</p>)}
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-2">Skills You’ve Viewed</h2>
                {visitedSkillIds.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700">
                    {visitedSkillIds.map(id => {
                      const skill = skills.find(s => s.id === id)
                      return skill ? (
                        <li key={id}><Link to={`/skill/${id}`} className="text-blue-600 hover:underline">{skill.title}</Link></li>
                      ) : null
                    })}
                  </ul>
                ) : (<p className="text-gray-600">No skills viewed yet.</p>)}
              </section>
            </div>

            {/* Center Column */}
            <div className="space-y-8">
              {mfaScores && <MFADials scores={mfaScores} />}
              <section>
                <h2 className="text-xl font-semibold mb-2">Skills We Suggest</h2>
                {suggestedSkills.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {suggestedSkills.map(skill => (
                      <Link key={skill.id} to={`/skill/${skill.id}`} className="block p-4 border rounded-lg hover:shadow-lg">
                        <div className="font-semibold text-[#003049]">{skill.title}</div>
                        <p className="text-gray-700 mt-1 line-clamp-2">{skill.brief}</p>
                        <span className="text-blue-600 hover:underline mt-2 inline-block">Learn more →</span>
                      </Link>
                    ))}
                  </div>
                ) : (<p className="text-gray-600">Enter your MFA scores to see suggestions.</p>)}
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="space-y-2">
                <button onClick={handleResetPassword} className="w-full px-4 py-2 bg-yellow-400 rounded">Reset Password</button>
                <button onClick={handleLogoutClick} className="w-full px-4 py-2 bg-red-400 rounded">Log Out</button>
              </div>
              <section>
                <h2 className="text-xl font-semibold mb-2 text-center">Choose your Avatar</h2>
                <div className="grid grid-cols-2 gap-2 justify-items-center">
                  {AVATARS.map(a => (
                    <img key={a.id} src={a.src} alt={a.id} className={`w-16 h-16 rounded-full cursor-pointer border-2 ${avatar===a.id?'border-blue-500':'border-transparent'}`} onClick={()=>updateAvatar(a.id)} />
                  ))}
                </div>
              </section>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
