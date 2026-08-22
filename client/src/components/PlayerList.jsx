import React from 'react';
import { Crown, User } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const PlayerList = ({ players, hostId }) => {
  const { socket } = useGame();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {players?.map((p) => {
        const isCurrent = p.id === socket?.id;
        const isHost = p.id === hostId;

        return (
          <div
            key={p.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              backgroundColor: isCurrent ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-input)',
              border: '1px solid',
              borderColor: isCurrent ? 'var(--accent-cyan)' : 'var(--border-color)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isHost ? '#f59e0b' : '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0b0f19',
                  fontWeight: '800',
                  fontSize: '14px',
                }}
              >
                {p.username.charAt(0).toUpperCase()}
              </div>

              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {p.username} {isCurrent && <span style={{ color: 'var(--accent-cyan)', fontSize: '12px' }}>(You)</span>}
              </span>
            </div>

            {isHost && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#f59e0b',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                <Crown size={14} /> Host
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
