import React, { useState } from 'react';
import CoachArmorChat from './components/CoachArmorChat';

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

export default function CoachPage() {
  const [selectedCoach, setSelectedCoach] = useState(null);

  return (
    <div className="flex flex-col md:flex-row p-6 gap-6">
      {/* Left: Coach Cards */}
      <div className="md:w-1/3 space-y-4">
        <h2 className="text-2xl font-bold mb-2 text-center">Choose Your Coach</h2>
        {coaches.map((coach, index) => (
          <button
            key={index}
            className={`w-full bg-white rounded-2xl shadow-md p-4 text-center transition transform hover:scale-105 focus:outline-none focus:ring-2 ${
              selectedCoach?.name === coach.name ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedCoach(coach)}
          >
            <img
              src={coach.image}
              alt={coach.name}
              className="mx-auto mb-3 rounded-full h-20 w-20 object-cover border-2 border-gray-300"
            />
            <h3 className="text-lg font-semibold">{coach.name}</h3>
            <p className="text-sm text-gray-500">{coach.title}</p>
            <p className="text-sm text-gray-600 mt-1 italic">{coach.traits}</p>
          </button>
        ))}
      </div>

      {/* Right: Chat Panel */}
      <div className="md:w-2/3">
        {selectedCoach ? (
          <CoachArmorChat selectedCoach={selectedCoach} />
        ) : (
          <div className="text-center text-gray-500 italic mt-10 md:mt-0">
            Please select a coach to begin chatting.
          </div>
        )}
      </div>
    </div>
  );
}