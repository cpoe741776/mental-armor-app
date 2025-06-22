import React, { useState, useEffect } from 'react';
import { skills } from '../skills';
import { personalities } from '../utils/armorAI';
import { getAIResponse } from '../utils/armorAI';


export default function CoachArmorChat({ selectedCoach }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Clear the chat when the coach changes
  useEffect(() => {
    setMessages([]); // Clear the chat messages when selectedCoach changes
  }, [selectedCoach]);

  const systemPrompt = selectedCoach
    ? `You are ${selectedCoach.name}, a Mental Armor resilience coach. Your background is: ${selectedCoach.title}. Your style is: ${selectedCoach.personalities}. Respond as this character while helping the user with their struggles.`
    : `You are a helpful Mental Armor resilience coach.`;

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsThinking(true);

    try {
      const aiReply = await getAIResponse(newMessages, systemPrompt);
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

  const handleClearChat = () => {
    setMessages([]);  // This will clear the chat
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      {/* Coach Image */}
      {selectedCoach && (
        <div className="flex items-center gap-4 mb-4">
          <img
            src={selectedCoach.image}
            alt={selectedCoach.name}
            className="h-14 w-14 rounded-full object-cover border border-gray-400"
          />
          <div>
            <h2 className="text-xl font-semibold">{selectedCoach.name}</h2>
            <p className="text-sm text-gray-600 italic">{personalities[selectedCoach.name]}</p>
          </div>
        </div>
      )}
{/* Coach's response with space after their name */}
      <div style={{ marginBottom: '20px' }}>
        {selectedCoach && (
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {selectedCoach.name}: {/* Space before response */}
          </p>
        )}
        {/* Add space between name and response */}
        <div style={{ marginTop: '10px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ margin: '10px 0', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
              <strong>{msg.role === 'user' ? 'You' : selectedCoach?.name || 'Coach'}:</strong>
              {msg.role === 'assistant' ? (
                <span dangerouslySetInnerHTML={{ __html: msg.content }} />
              ) : (
                msg.content
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Box */}
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
            <strong>{msg.role === 'user' ? 'You' : selectedCoach?.name || 'Coach'}:</strong> 
            {msg.role === 'assistant' ? (
              // Render HTML using dangerouslySetInnerHTML
              <span dangerouslySetInnerHTML={{ __html: msg.content }} />
            ) : (
              msg.content
            )}
          </div>
        ))}
        {isThinking && <div><em>{selectedCoach?.name || 'Coach'} is thinking...</em></div>}
      </div>

      {/* Input Field with Outline */}
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

      {/* Clear Chat Button */}
      <div className="flex justify-end mt-2">
        <button
          onClick={handleClearChat}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Clear Chat
        </button>
      </div>

      {/* Skills Panel */}
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
                  const aiReply = await getAIResponse(newMessages, systemPrompt);
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