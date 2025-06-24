// src/SkillDetail.js
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { skills } from './skills'
import netlifyIdentity from 'netlify-identity-widget'

export default function SkillDetail() {
  const { id } = useParams()
  const skill = skills.find(s => s.id === id)
  const [tab, setTab] = useState('definitions')
  const [showVideo, setShowVideo] = useState(false)
  const [visited, setVisited] = useState(false)

  useEffect(() => {
    if (!skill) return
    const user = netlifyIdentity.currentUser()
    if (!user) return

    const metadata = user.user_metadata || {}
    const visitedSkills = metadata.visitedSkills || []

    if (!visitedSkills.includes(id)) {
      const updatedList = [...visitedSkills, id]
      user
        .update({ data: { ...metadata, visitedSkills: updatedList } })
        .then(updatedUser => setVisited(true))
        .catch(err => console.error('❌ Error updating visitedSkills:', err))
    } else {
      setVisited(true)
    }
  }, [id, skill])

  if (!skill) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-red-600">Skill not found.</p>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Video Section */}
        {skill.videoUrl && !showVideo && skill.videoThumbnail && (
          <div className="relative cursor-pointer" onClick={() => setShowVideo(true)}>
            <img
              src={skill.videoThumbnail}
              alt="Video thumbnail"
              className="w-full rounded-xl shadow-md"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-5xl bg-black bg-opacity-50 px-4 py-2 rounded-full">
                ▶
              </div>
            </div>
          </div>
        )}

        {showVideo && skill.videoUrl && (
          <div>
            <video
              src={skill.videoUrl}
              controls
              muted
              playsInline
              className="w-full rounded-xl shadow"
            />
            <button
              onClick={() => setShowVideo(false)}
              className="mt-2 text-blue-600 hover:underline"
            >
              Hide Video
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className="flex items-start gap-6 bg-gray-100 p-6 rounded-xl shadow">
          {skill.trainerImage && (
            <img
              src={skill.trainerImage}
              alt={skill.trainer}
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold mb-1">{skill.title}</h1>
            <p className="text-gray-700 italic mb-2">{skill.brief}</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Category:</strong> {skill.category}</p>
              {skill.domains && (
                <p><strong>Domains:</strong> {skill.domains.map(d => <span key={d} className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-1 px-2 py-0.5 rounded-full">{d}</span>)}</p>
              )}
              <p><strong>Trainer:</strong> {skill.trainer}</p>
              <p><strong>Recommended by:</strong> {skill.recommendedBy}</p>
            </div>
          </div>
        </div>

        {/* Core Info */}
        <div className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Goal</h2>
            <p className="text-gray-700">{skill.goal}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">When to Use</h2>
            <p className="text-gray-700">{skill.when}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Benefits</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {skill.benefits.map((b, idx) => <li key={idx}>{b}</li>)}
            </ul>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-6 border-b border-gray-200 pb-2">
          {['definitions', 'examples'].map(key => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`pb-2 capitalize ${
                tab === key
                  ? 'border-b-2 border-blue-600 font-semibold text-gray-900'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'definitions' && skill.definitions && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Key Definitions</h2>
            <dl className="divide-y divide-gray-200">
              {skill.definitions.map((d, idx) => (
                <div key={idx} className="py-2">
                  <dt className="font-medium text-gray-800">{d.term}</dt>
                  <dd className="text-gray-700 ml-4">{d.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {tab === 'examples' && skill.examples && (
          <div className="bg-white p-6 rounded-xl shadow space-y-3">
            <h2 className="text-xl font-semibold mb-2">Examples</h2>
            {skill.examples.map((e, idx) => (
              <p key={idx} className="text-gray-700">{e}</p>
            ))}
          </div>
        )}

        {/* How to Practice */}
        {skill.how && skill.how.length > 0 && (
          <div className="bg-blue-50 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">How to Practice</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {skill.how.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
        )}

        {/* Steps */}
        {skill.steps && skill.steps.length > 0 && (
          <div className="bg-green-50 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Skill Steps</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-1">
              {skill.steps.map((step, idx) => <li key={idx}>{step}</li>)}
            </ol>
          </div>
        )}

        {/* Visited Indicator */}
        {visited && (
          <div className="fixed top-16 right-4 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded shadow-md">
            You’ve viewed this skill.
          </div>
        )}
      </div>
    </div>
  )
}
