// src/Coach.js
import React from 'react';
import CoachArmorChat from './components/CoachArmorChat';

export default function Coach() {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>🛡️ Talk to Coach Armor</h1>
      <CoachArmorChat />
    </div>
  );
}