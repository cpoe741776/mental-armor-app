import React from 'react';

import blacksmithHigh from '../assets/blacksmiths/blacksmith_high.webm';
import blacksmithMod from '../assets/blacksmiths/blacksmith_mod.webm';
import blacksmithLow from '../assets/blacksmiths/blacksmith_low.webm';

const blacksmithMap = {
  high: {
    src: blacksmithHigh,
    alt: 'Confident blacksmith standing proudly – battle ready',
  },
  mod: {
    src: blacksmithMod,
    alt: 'Blacksmith inspecting armor – focused on repairs',
  },
  low: {
    src: blacksmithLow,
    alt: 'Blacksmith sleeves rolled up – ready to dig into heavy repairs',
  },
};

const Blacksmith = ({ status }) => {
  const blacksmith = blacksmithMap[status];

  if (!blacksmith) return null;

  return (
    <div className="flex justify-center mb-4">
      <video
  src={blacksmith.src}
  autoPlay
  loop
  muted
  playsInline
  className="object-contain"
  style={{
    maxHeight: '80px',
    width: '100%',
    maxWidth: '160px',
    borderRadius: '8px',
  }}
  title={blacksmith.alt}
/>
    </div>
  );
};

export default Blacksmith;