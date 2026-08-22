import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const Chat = () => {
  const { messages, sendMessage } = useGame();
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText('');
  };

  return (
    <div className="card chat-panel">
      <div className="leaderboard-header">
        <MessageSquare size={16} color="var(--accent-cyan)" />
        <span>ROOM CHAT</span>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 'auto', textAlign: 'center' }}>
            Say hello to room players!
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`chat-line ${msg.isSystem ? 'system' : ''}`}>
              {!msg.isSystem && <span className="chat-username">{msg.username}: </span>}
              <span>{msg.message}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Type message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
          style={{ padding: '8px 12px', fontSize: '13px' }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px' }}>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
