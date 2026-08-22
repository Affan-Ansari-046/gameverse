import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, LogOut, Medal } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const GameOver = () => {
  const { gameOverData, room, socket, restartGame, leaveRoom } = useGame();

  const winner = gameOverData?.winner || room?.players?.[0];
  const leaderboard = gameOverData?.leaderboard || room?.players || [];
  const isHost = room?.hostId === socket?.id;

  useEffect(() => {
    try {
      // Launch celebratory particle confetti cannon
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.55 }
      });
    } catch (e) {
      // Fallback
    }
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="winner-trophy">🏆</div>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px' }}>
          MATCH OVER — CHAMPION
        </span>
        <h2 className="winner-name">{winner?.username || 'No Winner'}</h2>

        {/* Podium Standings Section */}
        <div style={{ backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: '18px', marginBottom: '24px', textAlign: 'left', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            <Medal size={14} color="var(--accent-amber)" /> FINAL LEADERBOARD STANDINGS
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {leaderboard.map((p, idx) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: idx === 0 ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                  border: idx === 0 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                  fontSize: '14px',
                  fontWeight: idx === 0 ? 800 : 500,
                  color: idx === 0 ? 'var(--accent-amber)' : 'var(--text-primary)',
                }}
              >
                <span>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`} {p.username}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{p.score} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {isHost ? (
            <button className="btn btn-emerald pulse-btn" style={{ flex: 1 }} onClick={restartGame}>
              <RefreshCw size={16} /> PLAY AGAIN
            </button>
          ) : (
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontStyle: 'italic', margin: 'auto' }}>
              👑 Waiting for host to restart game...
            </div>
          )}

          <button className="btn btn-outline" style={{ flex: 1 }} onClick={leaveRoom}>
            <LogOut size={16} /> LEAVE ROOM
          </button>
        </div>
      </div>
    </div>
  );
};
