// src/Profile.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { skills } from './skills';
import netlifyIdentity from 'netlify-identity-widget';

// Helper to map scores → suggested skills (using your app’s threshold logic)
function mapScoresToSkills(mfaScores) {
  if (!mfaScores) return [];
  const THRESHOLD = 5;
  const lowCats = [];

  // Adjust these category names if needed – they should match how you classify skills
  if (mfaScores.emotional <= THRESHOLD) lowCats.push('Emotional Fitness');
  if (mfaScores.social    <= THRESHOLD) lowCats.push('Social Fitness');
  if (mfaScores.family    <= THRESHOLD) lowCats.push('Family Fitness');
  if (mfaScores.spiritual <= THRESHOLD) lowCats.push('Spiritual Fitness');

  // Assuming your `skills.js` has a `category` field that matches one of these strings
  return skills.filter((skill) => lowCats.includes(skill.category));
}

export default function Profile() {
  const [visitedSkillIds, setVisitedSkillIds] = useState([]);
  const [mfaScores, setMfaScores] = useState(null);
  const [topStrengths, setTopStrengths] = useState({ strength1: null, strength2: null });
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. If no user is logged in, skip fetching
    const user = netlifyIdentity.currentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // 2. Fetch metadata (visitedSkills, mfaScores, topStrengths)
    fetch('/.netlify/functions/getUserMetadata')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch profile data');
        return res.json();
      })
      .then(({ visitedSkills = [], mfaScores = null, topStrengths = {} }) => {
        setVisitedSkillIds(visitedSkills);
        setMfaScores(mfaScores);
        setTopStrengths(topStrengths);
        setSuggestedSkills(mapScoresToSkills(mfaScores));
      })
      .catch((err) => {
        console.error('Error loading profile:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const user = netlifyIdentity.currentUser();
  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <Header title="Your Profile" />

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* If not logged in, prompt to log in */}
        {!user && (
          <div className="text-center text-gray-600">
            <p>
              Please{' '}
              <button
                onClick={() => netlifyIdentity.open()}
                className="text-blue-600 underline"
              >
                log in
              </button>{' '}
              to view your profile.
            </p>
          </div>
        )}

        {user && (
          <>
            {/* Section 1: MFA Scores */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Latest MFA Scores</h2>
              {mfaScores ? (
                <ul className="list-disc list-inside text-gray-700">
                  <li>
                    <strong>Emotional Fitness:</strong> {mfaScores.emotional}
                  </li>
                  <li>
                    <strong>Social Fitness:</strong> {mfaScores.social}
                  </li>
                  <li>
                    <strong>Family Fitness:</strong> {mfaScores.family}
                  </li>
                  <li>
                    <strong>Spiritual Fitness:</strong> {mfaScores.spiritual}
                  </li>
                </ul>
              ) : (
                <p className="text-gray-600">
                  You haven’t entered any scores yet. Go to “Enter MFA Scores” to log your scores.
                </p>
              )}
            </section>

            {/* Section 2: Top 2 Strengths */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Top 2 Character Strengths</h2>
              {topStrengths.strength1 || topStrengths.strength2 ? (
                <ul className="list-disc list-inside text-gray-700">
                  <li>
                    <strong>Strength 1:</strong> {topStrengths.strength1}
                  </li>
                  <li>
                    <strong>Strength 2:</strong> {topStrengths.strength2}
                  </li>
                </ul>
              ) : (
                <p className="text-gray-600">
                  You haven’t selected strengths yet. Head to “Enter MFA Scores” to choose your top 2.
                </p>
              )}
            </section>

            {/* Section 3: Visited Skills */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Skills You’ve Viewed</h2>
              {visitedSkillIds.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700">
                  {visitedSkillIds.map((skillId) => {
                    const skillObj = skills.find((s) => s.id === skillId);
                    if (!skillObj) return null;
                    return (
                      <li key={skillId}>
                        <Link
                          to={`/skill/${skillId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {skillObj.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-600">
                  You haven’t viewed any skills yet. Browse the Library and click a skill to view details.
                </p>
              )}
            </section>

            {/* Section 4: Suggested Skills */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Skills We Suggest</h2>
              {suggestedSkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedSkills.map((skill) => (
                    <Link
                      to={`/skill/${skill.id}`}
                      key={skill.id}
                      className="block p-4 border rounded-lg hover:shadow-lg transition"
                    >
                      <div className="font-semibold text-[#003049]">
                        {skill.title}
                      </div>
                      <div className="text-gray-700 mt-1 line-clamp-2">
                        {skill.brief}
                      </div>
                      <span className="text-blue-600 hover:underline mt-2 inline-block">
                        Learn more →
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  {mfaScores
                    ? 'Your current scores indicate you’re on track in all areas—keep reinforcing what you’ve learned!'
                    : 'Enter your MFA Scores first to receive personalized recommendations.'}
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
