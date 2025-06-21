// src/components/CoachArmorChat.js

import React, { useState } from 'react';
import { skills } from '../skills';
import { getAIResponse } from '../utils/armorAI';

export default function CoachArmorChat({ selectedCoach }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsThinking(true);

    try {
      const aiReply = await getAIResponse(newMessages, selectedCoach?.name);
      setMessages([...newMessages, { role: 'assistant', content: aiReply }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: "Something went wrong." }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>🛡️ {selectedCoach?.name || 'Coach'} is here to help</h2>

      <div style={{
        border: '1px solid #ccc',
        padding: 10,
        height: 400,
        overflowY: 'auto',
        borderRadius: 10,
        background: '#f9f9f9'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: '10px 0', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <strong>{msg.role === 'user' ? 'You' : selectedCoach?.name || 'Coach'}:</strong> {msg.content}
          </div>
        ))}
        {isThinking && <div><em>{selectedCoach?.name || 'Coach'} is thinking...</em></div>}
      </div>

      <input
        id="coach-chat-input"
        name="coachChatInput"
        type="text"
        placeholder="How are you feeling today?"
        autoComplete="on"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{ width: '80%', padding: 10, marginTop: 10 }}
      />
      <button onClick={handleSend} style={{ padding: '10px 20px', marginLeft: 10 }}>Send</button>

      <div style={{ marginTop: 20 }}>
        <h3>🧠 Mental Armor Skills</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {Object.values(skills).map((skill, index) => (
            <button
              key={index}
              title={skill.description}
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                background: '#e6f0ff',
                border: '1px solid #ccc',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
              onClick={async () => {
                const newInput = `Tell me more about the skill "${skill.title}".`;
                const newMessages = [...messages, { role: 'user', content: newInput }];
                setMessages(newMessages);
                setInput('');
                setIsThinking(true);
                try {
                  const aiReply = await getAIResponse(newMessages, selectedCoach?.name);
                  setMessages([...newMessages, { role: 'assistant', content: aiReply }]);
                } catch (err) {
                  setMessages([...newMessages, { role: 'assistant', content: "Something went wrong." }]);
                } finally {
                  setIsThinking(false);
                }
              }}
            >
              {skill.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}