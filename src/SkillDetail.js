// src/SkillDetail.js
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
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
        .then(updatedUser => {
          console.log('✅ Visited skills updated:', updatedUser.user_metadata.visitedSkills)
          setVisited(true)
        })
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
    <div className="bg-white min-h-screen overflow-y-auto pb-24">

      <div className="container mx-auto px-4 py-8 space-y-8">
        {skill.videoUrl && (
          <div className="flex justify-center mb-8">
            <video
              src={skill.videoUrl}
              controls
              muted
              autoPlay
              loop={false}
              playsInline
              className="w-full max-w-3xl rounded-lg shadow"
              onError={() => console.warn(`Video failed to load: ${skill.videoUrl}`)}
            />
          </div>
        )}

        <div className="bg-gray-100 p-6 rounded-lg shadow flex items-center">
          {skill.trainerImage && (
            <img
              src={skill.trainerImage}
              alt={skill.trainer}
              className="w-16 h-16 rounded-full object-cover mr-6"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">{skill.title}</h1>
            <p className="text-gray-700 mb-1">
              <strong>Category:</strong> {skill.category}
            </p>
            <p className="text-gray-700 mb-1">{skill.brief}</p>
            <p className="text-gray-700">
              <strong>Trainer:</strong> {skill.trainer}
            </p>
          </div>
        </div>

        <div className="flex space-x-6 border-b border-gray-200 pb-2">
          {['definitions', 'examples', 'video'].map(key => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`pb-2 ${
                tab === key
                  ? 'border-b-2 border-blue-600 font-semibold text-gray-900'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {key === 'definitions' ? 'Definition' : key === 'examples' ? 'Examples' : 'Video'}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {tab === 'definitions' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-2">Definition</h2>
              <p className="text-gray-700">{skill.definition}</p>
            </div>
          )}

          {tab === 'examples' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-2">Real-World Examples</h2>
              {Array.isArray(skill.examples) && skill.examples.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {skill.examples.map((ex, idx) => (
                    <li key={idx}>{ex}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No examples available for this skill.</p>
              )}
            </div>
          )}

          {tab === 'video' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-2">Video</h2>
              {skill.videoUrl ? (
                !showVideo ? (
                  <div className="relative">
                    {skill.videoThumbnail ? (
                      <img
                        src={skill.videoThumbnail}
                        alt={`${skill.title} thumbnail`}
                        className="w-full h-auto rounded"
                        onError={() => console.warn(`Thumbnail load failed`)}
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500">No thumbnail available</span>
                      </div>
                    )}
                    <button
                      onClick={() => setShowVideo(true)}
                      className="absolute inset-0 flex items-center justify-center text-white text-4xl"
                    >
                      ▶
                    </button>
                  </div>
                ) : (
                  <div>
                    <video
                      src={skill.videoUrl}
                      controls
                      muted
                      playsInline
                      className="w-full h-auto rounded mb-2"
                      onError={() => console.warn(`Video failed to load`)}
                    />
                    <button
                      onClick={() => setShowVideo(false)}
                      className="mt-2 text-blue-600 hover:underline"
                    >
                      Hide Video
                    </button>
                  </div>
                )
              ) : (
                <p className="text-gray-600">No video available for this skill.</p>
              )}
            </div>
          )}

          {Array.isArray(skill.details) && skill.details.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-2">How to Practice / Details</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {skill.details.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {visited && (
        <div className="fixed top-16 right-4 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded">
          You've viewed this skill.
        </div>
      )}

      <Link
        to="/repair-kit"
        className="fixed bottom-4 left-4 right-4 p-3 bg-blue-700 text-white rounded-lg shadow-lg text-center hover:bg-blue-800"
      >
        Practice Now
      </Link>
    </div>
  )
}