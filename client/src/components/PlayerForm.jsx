import React, { useState } from 'react';
import { User, Play, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const PlayerForm = ({ onComplete }) => {
  const { username, setUsername } = useGame();
  const [inputName, setInputName] = useState(username || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = inputName.trim();
    if (clean.length < 3 || clean.length > 20) {
      setError('Username must be between 3 and 20 characters.');
      return;
    }
    setUsername(clean);
    if (onComplete) onComplete();
  };

  return (
    <div className="card animate-fade-in" style={{ maxWidth: '420px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(56, 189, 248, 0.12)', borderRadius: '50%', marginBottom: '16px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
        <User size={36} color="var(--accent-cyan)" />
      </div>
      <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Enter Player Identity</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
        Choose a display handle to enter the multiplayer battle arena.
      </p>

      {error && (
        <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. Maverick_99"
          value={inputName}
          onChange={(e) => {
            setInputName(e.target.value);
            setError('');
          }}
          minLength={3}
          maxLength={20}
          autoFocus
          required
        />
        <button type="submit" className="btn btn-primary pulse-btn" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
          <Sparkles size={18} /> ENTER GAMEVERSE
        </button>
      </form>
    </div>
  );
};
