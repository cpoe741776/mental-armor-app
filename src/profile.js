// src/profile.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { skills } from './skills';
import MFADials from './components/MFADials';
import { BlacksmithShop } from './components/BlacksmithComponents';
import netlifyIdentity from 'netlify-identity-widget';
import { auth } from './auth';
import ProfileReflections from './components/ProfileReflections';
import { MODULE_DATA } from './pages/WordForgePage';


const labelMap = {
  emotional: 'Emotional Fitness',
  social: 'Social Fitness',
  family: 'Family Fitness',
  spiritual: 'Spiritual Fitness',
};

function mapScoresToSkills(mfaScores) {
  if (!mfaScores) return [];
  const lowDims = Object.entries(mfaScores)
    .filter(([, score]) => score < 3.5)
    .map(([dim]) => dim);

  return skills.filter(skill => {
    const domains = Array.isArray(skill.domains) ? skill.domains : [skill.domains];
    return domains.some(d => lowDims.includes(d));
  });
}

const AVATARS = [
  { id: 'flower', src: '/avatars/flower.png' },
  { id: 'summit', src: '/avatars/summit.png' },
  { id: 'bicycle', src: '/avatars/bicycle.png' },
  { id: 'sapling', src: '/avatars/sapling.png' },
  { id: 'phoenix', src: '/avatars/phoenix.png' },
  { id: 'wave', src: '/avatars/wave.png' },
  { id: 'sunrise', src: '/avatars/sunrise.png' },
  { id: 'trail', src: '/avatars/trail.png' },
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState('');
  const [visitedSkillIds, setVisited] = useState([]);
  const [mfaScores, setMfaScores] = useState(null);
  const [topStrengths, setStrengths] = useState({ strength1: null, strength2: null });
  const [suggestedSkills, setSuggest] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMetadata = (u) => {
    const md = u.user_metadata || {};
    const scores = md.mfaScores
      ? {
          emotional: +md.mfaScores.emotional,
          social: +md.mfaScores.social,
          family: +md.mfaScores.family,
          spiritual: +md.mfaScores.spiritual,
        }
      : null;

    setVisited(md.visitedSkills ?? []);
    setMfaScores(scores);
    setStrengths(md.topStrengths ?? {});
    setSuggest(mapScoresToSkills(scores));
    setWordForgeLevels(md.wordForgeLevels ?? {});
    console.log('🧩 Loaded Word Forge Levels:', md.wordForgeLevels);

    setAvatar(md.avatar || localStorage.getItem('selectedAvatar') || '');
  };

  useEffect(() => {
    netlifyIdentity.init();
    const u = netlifyIdentity.currentUser();
    if (u) {
      setUser(u);
      loadMetadata(u);
    }
    setLoading(false);

    const onLogin = (u) => {
      setUser(u);
      loadMetadata(u);
    };
    const onLogout = () => {
      setUser(null);
      setVisited([]);
      setMfaScores(null);
      setStrengths({ strength1: null, strength2: null });
      setSuggest([]);
      setAvatar('');
      localStorage.removeItem('selectedAvatar');
    };

    netlifyIdentity.on('login', onLogin);
    netlifyIdentity.on('logout', onLogout);
    return () => {
      netlifyIdentity.off('login', onLogin);
      netlifyIdentity.off('logout', onLogout);
    };
  }, []);

  useEffect(() => {
    if (user) loadMetadata(user);
  }, [user]);

  const handleResetPassword = () => {
    if (!user) return alert('Please log in first');
    auth.requestPasswordRecovery(user.email)
      .then(() => alert(`Reset email sent to ${user.email}`))
      .catch(err => alert('Error: ' + err.message));
  };

  const updateAvatar = (newAvatar) => {
    if (!user) return;
    user.update({ user_metadata: { ...(user.user_metadata || {}), avatar: newAvatar } })
      .then(u => {
        setUser(u);
        setAvatar(newAvatar);
        localStorage.setItem('selectedAvatar', newAvatar);
      })
      .catch(err => alert('Error updating avatar: ' + err.message));
  };
  const [wordForgeLevels, setWordForgeLevels] = useState({});
const masteredSkills = MODULE_DATA.filter(mod => wordForgeLevels[mod.id] >= 8);


  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24 text-[#003049]">
      <div className="container mx-auto px-4 py-8">
        {!user ? (
          <div className="text-center text-gray-600">
            <p>
              Please{' '}
              <button onClick={() => netlifyIdentity.open('login')} className="text-blue-600 underline">
                log in
              </button>{' '}
              to view your profile.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                {avatar && (
                  <img src={AVATARS.find(a => a.id === avatar)?.src} alt="Your avatar" className="w-12 h-12 rounded-full" />
                )}
                <div><strong>Email:</strong> {user.email}</div>
              </div>
              <div className="flex items-center space-x-2">
                {AVATARS.map(a => (
                  <img
                    key={a.id}
                    src={a.src}
                    alt={a.id}
                    className={`w-10 h-10 rounded-full cursor-pointer border-2 ${avatar === a.id ? 'border-blue-500' : 'border-transparent'}`}
                    onClick={() => updateAvatar(a.id)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <button onClick={handleResetPassword} className="w-full px-4 py-2 bg-yellow-400 rounded">
                  Click to reset password if needed
                </button>
              </div>
             <section className="mb-8">
  <div className="flex flex-col md:flex-row justify-between items-stretch space-y-6 md:space-y-0 md:space-x-6">
    <div className="w-full md:w-1/2 bg-gray-50 rounded-xl p-4">
      <MFADials scores={mfaScores} />
    </div>
    <div className="w-full md:w-1/2 bg-gray-50 rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-2 text-center">Your Mental Armor Blacksmith</h2>
      <p className="text-center text-sm text-gray-600 mb-4">
        Assess your gear. Strengthen your readiness. Reforge what’s vulnerable.
      </p>
      <BlacksmithShop domainScores={mfaScores} suggestedSkills={suggestedSkills} />
    </div>
  </div>
</section>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-8">
                  <section>
                    <h2 className="text-xl font-semibold mb-2">Your Top Strengths</h2>
                    {(topStrengths.strength1 || topStrengths.strength2) ? (
                      <ul className="list-disc list-inside text-gray-700">
                        <li><strong>1:</strong> {topStrengths.strength1}</li>
                        <li><strong>2:</strong> {topStrengths.strength2}</li>
                      </ul>
                    ) : <p className="text-gray-600">No strengths selected.</p>}
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-2">Skills You’ve Viewed</h2>
                    {visitedSkillIds.length > 0 ? (
                      <ul className="list-disc list-inside text-gray-700">
                        {visitedSkillIds.map(id => {
                          const skill = skills.find(s => s.id === id);
                          return skill ? (
                            <li key={id}>
                              <Link to={`/skill/${id}`} className="text-blue-600 hover:underline">
                                {skill.title}
                              </Link>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    ) : <p className="text-gray-600">No skills viewed yet.</p>}
                  </section>
<section>
  <h2 className="text-xl font-semibold mb-2">🧩 Word Forge Mastery</h2>
  {masteredSkills.length > 0 ? (
    <ul className="list-disc list-inside text-gray-700">
      {masteredSkills.map(({ id, name }) => (
        <li key={id}>{name}</li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-600">You haven’t reached Level 8 on any skill yet. Keep forging!</p>
  )}
</section>

                  <ProfileReflections />
                </div>

                <div className="md:col-span-2 space-y-8">
                  {mfaScores && (
                    <section>
                      <h2 className="text-xl font-semibold mb-2 text-center">Skills We Suggest</h2>
                      {Object.entries(mfaScores).map(([dim, score]) => {
                        const label = labelMap[dim];
                        const bgMap = {
                          emotional: 'bg-red-50',
                          social: 'bg-blue-50',
                          family: 'bg-yellow-50',
                          spiritual: 'bg-purple-50',
                        };
                        const skillsFor = suggestedSkills.filter(skill =>
                          Array.isArray(skill.domains) && skill.domains.includes(dim)
                        );

                        if (score >= 3.5) {
                          return (
                            <p key={dim} className="text-green-600 mb-6 text-center">
                              Your {label} is Thriving! Well done!
                            </p>
                          );
                        }

                        return (
                          <div key={dim} className={`mb-12 ${bgMap[dim]} rounded-xl p-4`}>
                            <p className="font-semibold mb-3 text-lg text-center">
                              To increase your {label}, we recommend:
                            </p>
                            {skillsFor.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {skillsFor.map(skill => (
                                  <div key={skill.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
                                    <h3 className="text-lg font-medium mb-2">{skill.title}</h3>
                                    <div className="flex items-center mb-3">
                                      {skill.trainerImage && (
                                        <img src={skill.trainerImage} alt={skill.trainer} className="w-8 h-8 rounded-full mr-2" />
                                      )}
                                      <p className="text-sm text-gray-500">Trainer: {skill.trainer}</p>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-4">{skill.benefits[0]}</p>
                                    <Link to={`/skill/${skill.id}`} className="mt-auto text-blue-600 hover:underline text-sm">
                                      Learn more
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-600 text-center">No recommendations at this time.</p>
                            )}
                          </div>
                        );
                      })}
                    </section>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
