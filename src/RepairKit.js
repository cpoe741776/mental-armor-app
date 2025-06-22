import React from 'react';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import CoachArmorChat from './components/CoachArmorChat';
import { skills } from './skills';

const coaches = [
  {
    name: 'Rhonda',
    title: 'Surgeon & General',
    traits: 'Bold · Organized · No Excuses',
    image: '/rhonda.jpg',
  },
  {
    name: 'Jill',
    title: 'Psychologist',
    traits: 'Warm · Insightful · Bridge-Builder',
    image: '/jill.jpg',
  },
  {
    name: 'AJ',
    title: 'Positive Psychology Expert',
    traits: 'Cheery · Driven · Self-Made',
    image: '/aj.jpg',
  },
  {
    name: 'Terry',
    title: 'MSW, Irish Bronx Native',
    traits: 'Witty · Tough-Love · Approachable',
    image: '/terry.jpg',
  },
  {
    name: 'Scotty',
    title: 'Retired Tactical Officer',
    traits: 'Humble · Faith-Filled · Compassionate',
    image: '/scotty.jpg',
  },
  {
    name: 'Chris',
    title: 'Infantryman & Resilience Leader',
    traits: 'Reflective · Legacy-Focused · Purpose-Driven',
    image: '/chris.jpg',
  }
];

export default function RepairKit() {
  const [mode, setMode] = React.useState('emotion');
  const [selected, setSelected] = React.useState(null);
  const [selectedCoach, setSelectedCoach] = useState(null);  // New state for selected coach

  const options = React.useMemo(
    () => Object.keys(repairMappings[mode]),
    [mode]
  );

  const suggestedSkills = React.useMemo(() => {
    const ids = selected ? repairMappings[mode][selected] : [];
    return ids
      .map((id) => skills.find((s) => s.id === id))
      .filter(Boolean);
  }, [mode, selected]);

  return (
    <div className="bg-white min-h-screen overflow-y-auto pb-24 p-4">
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-[#003049]">Repair Kit</h1>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* First Column: Repair Kit Options (Emotion/Event) */}
        <div className="space-y-4">
          {/* Mode Selection (Emotion/Event) */}
          <div className="flex mt-4 space-x-2">
            <button
              onClick={() => {
                setMode('emotion');
                setSelected(null);
              }}
              className={`flex-1 p-2 border rounded ${
                mode === 'emotion' ? 'bg-[#003049] text-white' : ''
              }`}
            >
              Emotion
            </button>
            <button
              onClick={() => {
                setMode('event');
                setSelected(null);
              }}
              className={`flex-1 p-2 border rounded ${
                mode === 'event' ? 'bg-[#003049] text-white' : ''
              }`}
            >
              Event
            </button>
          </div>

          {/* Suggested Skills */}
          <div className="space-y-4">
            {selected && (
              <div className="mt-6">
                <h3 className="font-semibold text-[#003049] mb-2">Suggested Skills</h3>
                <div className="space-y-2">
                  {suggestedSkills.length > 0 ? (
                    suggestedSkills.map((skill) => (
                      <Link
                        key={skill.id}
                        to={`/skill/${skill.id}`}
                        className="block p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition"
                      >
                        <div className="font-semibold text-[#003049]">{skill.title}</div>
                        <div className="text-sm text-gray-700 mt-1">{skill.brief}</div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-gray-500">No suggestions available.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Second Column: Chat Panel */}
        <div className="space-y-4">
          {selectedCoach ? (
            <CoachArmorChat selectedCoach={selectedCoach} />
          ) : (
            <div className="text-center text-gray-500 italic mt-10 md:mt-0">
              Please select a coach to begin chatting.
            </div>
          )}
        </div>

        {/* Third Column: Coach Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Choose Your Coach</h3>
          {coaches.map((coach, index) => (
            <button
              key={index}
              className={`w-full bg-white rounded-2xl shadow-md p-3 text-center transition transform hover:scale-105 focus:outline-none focus:ring-2 ${
                selectedCoach?.name === coach.name ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedCoach(coach)}
            >
              <img
                src={coach.image}
                alt={coach.name}
                className="mx-auto mb-3 rounded-full h-16 w-16 object-cover border-2 border-gray-300"
              />
              <h3 className="text-sm font-semibold">{coach.name}</h3>
              <p className="text-xs text-gray-500">{coach.title}</p>
              <p className="text-xs text-gray-600 mt-1 italic">{coach.traits}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const repairMappings = {
  emotion: {
    Anxious: ['mindfulness', 'reframe', 'spiritual_resilience', 'whats_most_important', 'values_based_living'],
    Overwhelmed: ['reframe', 'mindfulness', 'whats_most_important', 'values_based_living'],
    Sad: ['gratitude', 'spiritual_resilience', 'good_listening_celebrate_news'],
    Angry: ['reframe', 'balance_your_thinking', 'interpersonal_problem_solving'],
    Frustrated: ['balance_your_thinking', 'reframe', 'mindfulness'],
    Lonely: ['good_listening_celebrate_news', 'social_support'],
    Insecure: ['values_based_living', 'flex'],
    Stressed: ['mindfulness', 'spiritual_resilience', 'balance_your_thinking'],
  },
  event: {
    'Problem with a person(s)': ['interpersonal_problem_solving', 'good_listening_celebrate_news'],
    'Loss of a relationship': ['spiritual_resilience', 'gratitude', 'good_listening_celebrate_news'],
    'Heavy Workload': ['balance_your_thinking', 'mindfulness', 'science_of_resilience'],
    'Life Dissatisfaction': ['values_based_living', 'flex', 'spiritual_resilience'],
    'Unexpected Change': ['science_of_resilience', 'mindfulness', 'reframe'],
  },
};