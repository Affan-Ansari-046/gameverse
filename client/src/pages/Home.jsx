import React from 'react';
import { useGame } from '../context/GameContext';
import { PlayerForm } from '../components/PlayerForm';
import { RoomActions } from '../components/RoomActions';
import { Target, Zap, Shield, Users } from 'lucide-react';

export const Home = () => {
  const { username, setUsername } = useGame();

  return (
    <div className="gameverse-container">
      <div className="home-layout">
        <div className="home-title">
          <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '20px', marginBottom: '12px' }}>
            <Target size={48} color="var(--accent-cyan)" />
          </div>
          <h1>GAME<span>VERSE</span></h1>
          <p>Real-Time Multiplayer Reaction Arena</p>
        </div>

        {!username ? (
          <PlayerForm />
        ) : (
          <RoomActions onChangeUsername={() => setUsername('')} />
        )}

        {/* Feature Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '20px', textAlignment: 'center' }}>
          <div className="card" style={{ padding: '14px', fontSize: '12px' }}>
            <Zap size={20} color="var(--accent-amber)" style={{ margin: '0 auto 6px auto' }} />
            <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Low Latency</strong>
            <span style={{ color: 'var(--text-muted)' }}>Socket.IO Real-Time</span>
          </div>
          <div className="card" style={{ padding: '14px', fontSize: '12px' }}>
            <Shield size={20} color="var(--accent-emerald)" style={{ margin: '0 auto 6px auto' }} />
            <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Server Authoritative</strong>
            <span style={{ color: 'var(--text-muted)' }}>Zero-Trust Scoring</span>
          </div>
          <div className="card" style={{ padding: '14px', fontSize: '12px' }}>
            <Users size={20} color="var(--accent-cyan)" style={{ margin: '0 auto 6px auto' }} />
            <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Up to 8 Players</strong>
            <span style={{ color: 'var(--text-muted)' }}>Synchronized Matches</span>
          </div>
        </div>
      </div>
    </div>
  );
};
