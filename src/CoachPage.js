import React, { useState } from 'react';
import CoachArmorChat from './components/CoachArmorChat';
import Rhonda from '/rhonda.jpg';
import Jill from '/jill.jpg';
import AJ from '/aj.jpg';
import Terry from '/terry.jpg';
import Scotty from '/scotty.jpg';
import Chris from '/chris.jpg';

const coaches = [
  {
    name: 'Rhonda',
    title: 'Surgeon & General',
    traits: 'Bold · Organized · No Excuses',
    image: Rhonda,
  },
  {
    name: 'Jill',
    title: 'Psychologist',
    traits: 'Warm · Insightful · Bridge-Builder',
    image: Jill,
  },
  {
    name: 'AJ',
    title: 'Positive Psychology Expert',
    traits: 'Cheery · Driven · Self-Made',
    image: AJ,
  },
  {
    name: 'Terry',
    title: 'MSW, Irish Bronx Native',
    traits: 'Witty · Tough-Love · Approachable',
    image: Terry,
  },
  {
    name: 'Scotty',
    title: 'Retired Tactical Officer',
    traits: 'Humble · Faith-Filled · Compassionate',
    image: Scotty,
  },
  {
    name: 'Chris',
    title: 'Infantryman & Resilience Leader',
    traits: 'Reflective · Legacy-Focused · Purpose-Driven',
    image: Chris,
  }
];

export default function CoachPage() {
  const [selectedCoach, setSelectedCoach] = useState(null);

  return (
    <div className="p-6">
      <h1 className="text-center text-3xl font-bold mb-4">🛡️ Talk to Coach Armor</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {coaches.map((coach, index) => (
          <button
            key={index}
            className={`bg-white rounded-2xl shadow-md p-4 text-center transition transform hover:scale-105 focus:outline-none focus:ring-2 ${selectedCoach?.name === coach.name ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedCoach(coach)}
          >
            <img
              src={coach.image}
              alt={coach.name}
              className="mx-auto mb-3 rounded-full h-24 w-24 object-cover border-2 border-gray-300"
            />
            <h3 className="text-xl font-semibold">{coach.name}</h3>
            <p className="text-sm text-gray-500">{coach.title}</p>
            <p className="text-sm text-gray-600 mt-1 italic">{coach.traits}</p>
          </button>
        ))}
      </div>

      {selectedCoach ? (
        <CoachArmorChat selectedCoach={selectedCoach} />
      ) : (
        <p className="text-center text-gray-500 italic">Please select a coach to begin chatting.</p>
      )}
    </div>
  );
}
