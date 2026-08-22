import React, { useState } from 'react';
import { Play, Copy, Check, Users, ShieldAlert, ArrowLeft, LogOut, Clock } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { PlayerList } from './PlayerList';

export const Lobby = () => {
  const { room, socket, startGame, leaveRoom, logout } = useGame();
  const [copied, setCopied] = useState(false);

  const isHost = room?.hostId === socket?.id;
  const playerCount = room?.players?.length || 0;
  const canStart = playerCount >= 2;
  const duration = room?.game?.duration || 60;

  const handleCopyCode = () => {
    if (!room?.id) return;
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card animate-fade-in" style={{ maxWidth: '540px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Lobby Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>MULTIPLAYER LOBBY</span>
            <span style={{ fontSize: '11px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> {duration}s Match
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
            ROOM: <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{room?.id}</span>
          </h2>
        </div>

        <button className="btn btn-outline" onClick={handleCopyCode} style={{ padding: '8px 14px', fontSize: '13px' }}>
          {copied ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      {/* Player Capacity Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-input)', padding: '12px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
          <Users size={18} color="var(--accent-cyan)" />
          <span>CONNECTED PLAYERS</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '14px', color: 'var(--text-secondary)' }}>
          {playerCount} / 8 Players
        </span>
      </div>

      {/* Players List */}
      <PlayerList players={room?.players} hostId={room?.hostId} />

      {/* Host Controls or Waiting State */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isHost ? (
          <>
            {!canStart && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontSize: '13px', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <ShieldAlert size={16} />
                <span>At least 2 players are required to start match. Share room code!</span>
              </div>
            )}
            <button
              className="btn btn-emerald pulse-btn"
              style={{ padding: '14px', fontSize: '16px', width: '100%' }}
              onClick={startGame}
              disabled={!canStart}
            >
              <Play size={20} /> START MATCH ({duration}s)
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '14px', fontStyle: 'italic', fontSize: '14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            👑 Waiting for host to start the match...
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={leaveRoom}>
            <ArrowLeft size={16} /> Leave Room
          </button>
          <button className="btn btn-outline" style={{ flex: 1, color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }} onClick={logout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};
