// src/SkillDetail.js
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header';
import { skills } from './skills';

export default function SkillDetail() {
  const { id } = useParams();
  const skill = skills.find((s) => s.id === id) || skills[0];
  const [tab, setTab] = useState('definitions');
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="bg-white min-h-screen overflow-y-auto pb-24">
      <Header title={skill.title} />

      {/* Trainer Info + “Play Intro” */}
      <div className="p-4">
        <div className="flex items-center">
          <img
            src={skill.trainerImage}
            alt={skill.trainer}
            className="w-12 h-12 rounded-full mr-4 object-cover"
          />
          <div>
            <div className="font-medium text-[#003049]">Trainer: {skill.trainer}</div>
            <div className="text-sm text-gray-500">{skill.category}</div>
          </div>
        </div>

        {/* Only render “Play Intro” if skill.videoUrl exists */}
        {skill.videoUrl && (
          <div className="mt-4">
            {!showVideo ? (
              <button
                onClick={() => setShowVideo(true)}
                className="inline-flex items-center px-4 py-2 bg-[#003049] text-white rounded shadow hover:bg-[#002437] transition"
              >
                ▶ Play Intro
              </button>
            ) : (
              <div className="mt-2">
                <video
                  src={skill.videoUrl}
                  controls
                  muted
                  loop={false}
                  playsInline
                  className="w-full h-auto rounded-lg shadow"
                  onError={() => console.warn(`Video failed to load: ${skill.videoUrl}`)}
                />
                <button
                  onClick={() => setShowVideo(false)}
                  className="mt-2 text-sm text-[#003049] hover:underline"
                >
                  ← Close Video
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Goal / When / Benefits / Definitions or Steps */}
      <div className="p-4">
        <div className="mt-4 bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-[#003049]">Goal</h2>
          <p className="text-gray-700">{skill.goal}</p>
          <h2 className="font-semibold text-[#003049] mt-3">When</h2>
          <p className="text-gray-700">{skill.when}</p>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Benefits</h3>
          <ul className="list-disc pl-6 text-gray-700">
            {skill.benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <div className="flex border-b">
            <button
              onClick={() => setTab('definitions')}
              className={`flex-1 p-2 ${
                tab === 'definitions' ? 'border-b-2 border-[#003049] font-semibold' : ''
              }`}
            >
              Definitions
            </button>
            <button
              onClick={() => setTab('steps')}
              className={`flex-1 p-2 ${
                tab === 'steps' ? 'border-b-2 border-[#003049] font-semibold' : ''
              }`}
            >
              Steps
            </button>
          </div>
          <div className="mt-2 text-gray-700">
            {tab === 'definitions' ? (
              <ul className="list-disc pl-6">
                {skill.definitions.map((d, i) => (
                  <li key={i}>
                    <strong>{d.term}:</strong> {d.definition}
                  </li>
                ))}
              </ul>
            ) : (
              <ol className="list-decimal pl-6">
                {skill.steps.map((s) => (
                  <li key={s.number}>
                    <strong>{s.title}:</strong> {s.description}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>

      {/* “Practice Now” Button */}
      <Link
        to="/repair-kit"
        className="fixed bottom-4 left-4 right-4 p-3 bg-[#003049] text-white rounded-xl shadow-lg text-center"
      >
        Practice Now
      </Link>
    </div>
  );
}
