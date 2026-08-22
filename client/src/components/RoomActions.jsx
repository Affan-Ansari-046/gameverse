import React, { useState } from 'react';
import { PlusCircle, LogIn, Edit2, LogOut, Clock } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const RoomActions = ({ onChangeUsername }) => {
  const { username, createRoom, joinRoom, logout } = useGame();
  const [roomCode, setRoomCode] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(60);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    joinRoom(roomCode.trim());
  };

  const handleCreate = () => {
    createRoom(selectedDuration);
  };

  const durationOptions = [
    { label: '30s Blitz', value: 30 },
    { label: '60s Standard', value: 60 },
    { label: '90s Pro', value: 90 },
    { label: '120s Endurance', value: 120 },
  ];

  return (
    <div className="card animate-fade-in" style={{ maxWidth: '460px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header User Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Logged in as</span>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--accent-cyan)' }}>{username}</h3>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn btn-outline" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={onChangeUsername} title="Change username">
            <Edit2 size={13} /> Change
          </button>
          <button className="btn btn-outline" style={{ padding: '6px 10px', fontSize: '12px', color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }} onClick={logout} title="Log Out">
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      {/* Create Room Section with Duration Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          <Clock size={16} color="var(--accent-amber)" />
          <span>Match Duration</span>
        </div>

        {/* Duration Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {durationOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`duration-pill ${selectedDuration === opt.value ? 'active' : ''}`}
              onClick={() => setSelectedDuration(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button className="btn btn-emerald pulse-btn" style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '6px' }} onClick={handleCreate}>
          <PlusCircle size={20} /> Create New Room ({selectedDuration}s)
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '13px' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        <span>OR JOIN EXISTING</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
      </div>

      {/* Join Room */}
      <form onSubmit={handleJoin} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Enter Room Code (e.g. ABC123)"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          maxLength={6}
          style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700', letterSpacing: '1px' }}
          required
        />
        <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
          <LogIn size={18} /> Join
        </button>
      </form>
    </div>
  );
};
