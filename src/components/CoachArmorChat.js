// src/components/CoachArmorChat.js
import React, { useState, useEffect, useRef } from 'react';
import { skills } from '../skills';
import { getAIResponse } from '../utils/armorAI';
import { speakResponse as speakWithFallback } from '../utils/tts-fallback';

export default function CoachArmorChat({ selectedCoach }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    setMessages([]);
  }, [selectedCoach]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsThinking(true);

    try {
      const aiReply = await getAIResponse(newMessages, selectedCoach);
      const coachMessage = aiReply?.trim() || "I'm not sure how to answer that, but I’m here for you.";

      if (voiceEnabled && selectedCoach?.name) {
        await speakWithFallback(coachMessage, selectedCoach.name);
      }

      setMessages([...newMessages, { role: 'assistant', content: coachMessage }]);
    } catch (error) {
      console.error("AI or TTS Error:", error);
      setMessages([...newMessages, { role: 'assistant', content: "Something went wrong." }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleSkillClick = async (skill) => {
    const query = `Tell me more about the skill "${skill.title}".`;
    const newMessages = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInput('');
    setIsThinking(true);

    try {
      const aiReply = await getAIResponse(newMessages, selectedCoach);
      if (voiceEnabled && selectedCoach?.name) {
        await speakWithFallback(aiReply, selectedCoach.name);
      }
      setMessages([...newMessages, { role: 'assistant', content: aiReply }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: "Something went wrong." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {selectedCoach && (
        <div className="flex items-center gap-4 mb-4">
          <img
            src={selectedCoach.image}
            alt={selectedCoach.name}
            className="h-14 w-14 rounded-full object-cover border border-gray-400"
          />
          <div>
            <h2 className="text-xl font-semibold">{selectedCoach.name}</h2>
            <p className="text-sm text-gray-600 italic">{selectedCoach.traits}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-bold text-gray-700">{selectedCoach?.name} is coaching</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Voice</span>
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              voiceEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          >
            {voiceEnabled ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="border-2 border-gray-300 p-3 h-96 overflow-y-auto rounded-xl bg-gray-50"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`my-2 text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <strong>{msg.role === 'user' ? 'You' : selectedCoach?.name || 'Coach'}:</strong>{' '}
            {msg.role === 'assistant' ? (
              <span dangerouslySetInnerHTML={{ __html: msg.content }} />
            ) : (
              msg.content
            )}
          </div>
        ))}
        {isThinking && (
          <div className="italic text-gray-500 mt-2">
            {selectedCoach?.name || 'Coach'} is typing
            <span className="animate-pulse">...</span>
          </div>
        )}
      </div>

      <div className="flex items-center mt-4">
        <input
          type="text"
          placeholder="How are you feeling today?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full p-2 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>

      <div className="flex justify-end mt-2">
        <button
          onClick={() => setMessages([])}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Clear Chat
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">🧠 Mental Armor Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => handleSkillClick(skill)}
              title={skill.brief}
              className="px-3 py-1 text-sm bg-indigo-100 border border-gray-300 rounded hover:bg-indigo-200 transition"
            >
              {skill.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}