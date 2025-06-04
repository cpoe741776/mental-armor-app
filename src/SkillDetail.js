// src/SkillDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header';
import { skills } from './skills';
import netlifyIdentity from 'netlify-identity-widget';

export default function SkillDetail() {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);
  const [tab, setTab] = useState('definitions');
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const found = skills.find((s) => s.id === id);
    setSkill(found);

    const user = netlifyIdentity.currentUser();
    if (user && found) {
      fetch('/.netlify/functions/getUserMetadata')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch metadata');
          return res.json();
        })
        .then(({ visitedSkills = [] }) => {
          if (!visitedSkills.includes(found.id)) {
            const updated = [...visitedSkills, found.id];
            fetch('/.netlify/functions/saveUserMetadata', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ visitedSkills: updated }),
            }).catch((err) =>
              console.error('Error saving visitedSkills:', err)
            );
          }
        })
        .catch((err) => {
          console.error('Error fetching visitedSkills:', err);
        });
    }
  }, [id]);

  if (!skill) {
    return (
      <div className="p-8 text-center text-gray-600">
        <p className="text-lg">Skill not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen overflow-y-auto pb-24">
      <Header title={skill.title} />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* If an introduction video exists, show it centered at top */}
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
              onError={() =>
                console.warn(`Video failed to load: ${skill.videoUrl}`)
              }
            />
          </div>
        )}

        {/* Top Card: trainer image on left (small) + brief info */}
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

        {/* Tab Navigation */}
        <div className="flex space-x-6 border-b border-gray-200 pb-2">
          <button
            onClick={() => setTab('definitions')}
            className={`pb-2 ${
              tab === 'definitions'
                ? 'border-b-2 border-blue-600 font-semibold text-gray-900'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Definition
          </button>
          <button
            onClick={() => setTab('examples')}
            className={`pb-2 ${
              tab === 'examples'
                ? 'border-b-2 border-blue-600 font-semibold text-gray-900'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Examples
          </button>
          <button
            onClick={() => setTab('video')}
            className={`pb-2 ${
              tab === 'video'
                ? 'border-b-2 border-blue-600 font-semibold text-gray-900'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Video
          </button>
        </div>

        {/* Tab Panels */}
        <div className="space-y-6">
          {/* Definition Tab */}
          {tab === 'definitions' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-2">Definition</h2>
              <p className="text-gray-700">{skill.definition}</p>
            </div>
          )}

          {/* Examples Tab */}
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

          {/* Video Tab */}
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
                        onError={() =>
                          console.warn(
                            `Thumbnail failed to load: ${skill.videoThumbnail}`
                          )
                        }
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
                      onError={() =>
                        console.warn(`Video failed to load: ${skill.videoUrl}`)
                      }
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

          {/* Additional Details Section */}
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

      {/* “Practice Now” Button pinned at bottom */}
      <Link
        to="/repair-kit"
        className="fixed bottom-4 left-4 right-4 p-3 bg-blue-700 text-white rounded-lg shadow-lg text-center hover:bg-blue-800"
      >
        Practice Now
      </Link>
    </div>
  );
}
