// src/RepairKit.js
import React from 'react';
import { Link } from 'react-router-dom';
import { skills } from './skills';

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

export default function RepairKit() {
  const [mode, setMode] = React.useState('emotion');
  const [selected, setSelected] = React.useState(null);

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
      {/* Optional page title */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-[#003049]">Repair Kit</h1>
      </div>

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

      <div className="grid grid-cols-3 gap-4 mt-4">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className={`p-4 bg-white rounded shadow text-center text-gray-700 hover:bg-gray-50 ${
              selected === opt ? 'border-2 border-[#003049]' : ''
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

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
  );
}
