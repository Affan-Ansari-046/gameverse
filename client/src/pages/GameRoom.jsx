import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameBoard } from '../components/GameBoard';
import { Leaderboard } from '../components/Leaderboard';
import { Chat } from '../components/Chat';
import { GameTimer } from '../components/GameTimer';
import { GameOver } from '../components/GameOver';
import { Target, Copy, Check, ArrowLeft, LogOut } from 'lucide-react';

export const GameRoom = () => {
  const { room, leaveRoom, logout, gameOverData } = useGame();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!room?.id) return;
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="gameverse-container">
      {/* Game Over Modal Popup */}
      {room?.status === 'finished' && <GameOver />}

      {/* Top Navigation Header */}
      <nav className="navbar">
        <div className="brand-logo">
          <Target size={24} color="var(--accent-cyan)" />
          <span>GAMEVERSE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="room-badge">
            <span>ROOM: {room?.id}</span>
            <button className="copy-btn" onClick={handleCopy} title="Copy Room Code">
              {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
            </button>
          </div>

          <GameTimer />

          <button className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '13px' }} onClick={leaveRoom} title="Leave Room">
            <ArrowLeft size={16} /> Leave Room
          </button>
          <button className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '13px', color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }} onClick={logout} title="Log Out">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Game Screen Grid */}
      <div className="gameroom-grid">
        <GameBoard />

        <div className="sidebar-column">
          <Leaderboard />
          <Chat />
        </div>
      </div>
    </div>
  );
};
