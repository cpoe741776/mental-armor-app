import React, { useState, useEffect, useRef } from 'react';
import { skills } from '../skills';
import { personalities } from '../utils/armorAI';
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
    console.log("Selected coach changed:", selectedCoach);
  }, [selectedCoach]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

 const systemPrompt = selectedCoach
    ? `You are ${selectedCoach.name}, a Mental Armor resilience coach. Your background is: ${selectedCoach.title}. Your style is: ${personalities[selectedCoach.name]}. Respond as this character while helping the user with their struggles.

If you identify anything that appears to demonstrate suicidal ideation from users in the United States, gently encourage them to call or text 988 (Suicide & Crisis Lifeline).
If it appears the user is in the United Kingdom, encourage them to call 111 or contact Samaritans at 116 123.`
    : `You are a helpful Mental Armor resilience coach.

If you identify anything that appears to demonstrate suicidal ideation from users in the United States, gently encourage them to call or text 988 (Suicide & Crisis Lifeline).
If it appears the user is in the United Kingdom, encourage them to call 111 or contact Samaritans at 116 123.`;


  const handleSend = async () => {
    if (!input.trim()) return;
    // Keyword detection logic
const riskKeywords = ['suicide', 'kill myself', 'end it all', 'to die', 'have nothing left', "shoot myself"];
const inputLower = input.toLowerCase();
const containsRisk = riskKeywords.some(keyword => inputLower.includes(keyword));
const dynamicPrompt = containsRisk
  ? systemPrompt + "\n\nThe user may be in crisis. Respond with extra care and repeat crisis line options."
  : systemPrompt;
if (containsRisk) {
  console.warn("🚨 Risk keyword detected:", input);
  // Optional: you can log, notify, or auto-augment the systemPrompt
}

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsThinking(true);

    try {
      const aiReply = await getAIResponse(newMessages, selectedCoach, dynamicPrompt);

      let coachMessage = aiReply?.trim();
      if (!coachMessage) {
        coachMessage = selectedCoach?.name === 'Terry'
          ? "Life in the Bronx? It's tough, but you've gotta find the humor in the hard times. Now, what else can I help with?"
          : "That’s a great question! While I don’t have a skill that fits right now, I’m happy to chat about anything else!";
      }

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

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
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
        style={{ border: '1px solid #ccc', padding: 10, height: 400, overflowY: 'auto', borderRadius: 10, background: '#f9f9f9' }}
        className="border-2 border-gray-300"
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: '10px 0', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <strong>{msg.role === 'user' ? 'You' : selectedCoach?.name || 'Coach'}:</strong>{' '}
            {msg.role === 'assistant' ? (
              <span dangerouslySetInnerHTML={{ __html: msg.content }} />
            ) : (
              msg.content
            )}
          </div>
        ))}
        {isThinking && (
          <div className="italic text-gray-500">
            {selectedCoach?.name || 'Coach'} is typing
            <span className="animate-pulse">...</span>
          </div>
        )}
      </div>

      <div className="flex items-center mt-4">
        <input
          id="coach-chat-input"
          name="coachChatInput"
          type="text"
          placeholder="How are you feeling today?"
          autoComplete="on"
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

      <div style={{ marginTop: 20 }}>
        <h3 className="text-lg font-semibold mb-2">🧠 Mental Armor Skills</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {skills.map((skill, index) => (
            <button
              key={index}
              title={skill.brief}
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
                  const aiReply = await getAIResponse(newMessages, selectedCoach, systemPrompt);

                  if (voiceEnabled && selectedCoach?.name) {
                    await speakWithFallback(aiReply, selectedCoach.name);
                  }

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
