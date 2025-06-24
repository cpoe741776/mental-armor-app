import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { skills } from '../skills';
import netlifyIdentity from 'netlify-identity-widget';

export default function ProfileReflections() {
  const [reflections, setReflections] = useState({});
  const [timestamps, setTimestamps] = useState({});
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const user = netlifyIdentity.currentUser();
    if (!user) return;
    const metadata = user.user_metadata || {};
    setReflections(metadata.reflections || {});
    setTimestamps(metadata.reflectionTimestamps || {});
  }, []);

  const sortedKeys = Object.keys(reflections).sort((a, b) => {
    const timeA = new Date(timestamps[a] || 0);
    const timeB = new Date(timestamps[b] || 0);
    return timeB - timeA;
  });

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Your Reflections</h2>
      {sortedKeys.length === 0 ? (
        <p className="text-gray-600">You haven’t saved any reflections yet.</p>
      ) : (
        <div className="space-y-4">
          {sortedKeys.map((id) => {
            const skill = skills.find(s => s.id === id);
            if (!skill) return null;
            const text = reflections[id];
            const showAll = expanded[id];
            const truncated = text.length > 300 && !showAll ? `${text.slice(0, 300)}...` : text;
            return (
              <div key={id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-blue-700 mb-1">
                  <Link to={`/skill/${id}`} className="hover:underline">{skill.title}</Link>
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {timestamps[id] ? new Date(timestamps[id]).toLocaleString() : 'Unknown date'}
                </p>
                <p className="text-gray-800 text-sm whitespace-pre-wrap">
                  {truncated}
                </p>
                {text.length > 300 && (
                  <button
                    onClick={() => setExpanded(prev => ({ ...prev, [id]: !showAll }))}
                    className="mt-1 text-blue-500 hover:underline text-sm"
                  >
                    {showAll ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}