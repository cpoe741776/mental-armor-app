// RepairKit.js
import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { skills } from './skills';

// bring in repairMappings from wherever you defined it
import { repairMappings } from './repairMappings';

export default function RepairKit() {
  const [mode, setMode] = React.useState('emotion');
  const [selected, setSelected] = React.useState(null);
  const options = React.useMemo(() => Object.keys(repairMappings[mode]), [mode]);
  const suggestedIds = selected ? repairMappings[mode][selected] : [];
  const suggestedSkills = React.useMemo(
    () => suggestedIds.map(id => skills.find(s => s.id === id)).filter(Boolean),
    [suggestedIds]
  );

  return (
    <div className="bg-white min-h-screen overflow-y-auto pb-24 p-4">
      <Header title="Mental Armor Repair Kit" />

      <div className="flex mt-4 space-x-2">
        <button
          onClick={() => { setMode('emotion'); setSelected(null); }}
          className={`flex-1 p-2 border rounded ${mode === 'emotion' ? 'bg-[#003049] text-white' : ''}`}
        >Emotion</button>
        <button
          onClick={() => { setMode('event'); setSelected(null); }}
          className={`flex-1 p-2 border rounded ${mode === 'event' ? 'bg-[#003049] text-white' : ''}`}
        >Event</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className={`p-4 bg-white rounded shadow text-center text-gray-700 hover:bg-gray-50 ${selected === opt ? 'border-2 border-[#003049]' : ''}`}
          >{opt}</button>
        ))}
      </div>

      {selected && (
        <div className="mt-6">
          <h3 className="font-semibold text-[#003049] mb-2">Suggested Skills</h3>
          <div className="space-y-2">
            {suggestedSkills.length > 0 ? suggestedSkills.map(skill => (
              <Link
                key={skill.id}
                to={`/skill/${skill.id}`}
                className="block p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition"
              >
                <div className="font-semibold text-[#003049]">{skill.title}</div>
                <div className="text-sm text-gray-700 mt-1">{skill.brief}</div>
              </Link>
            )) : (
              <div className="text-gray-500">No suggestions available.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
