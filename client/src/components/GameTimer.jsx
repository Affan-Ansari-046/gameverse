import React from 'react';
import { Clock } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const GameTimer = () => {
  const { room } = useGame();
  const timeRemaining = room?.game?.timeRemaining ?? 60;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="timer-display" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Clock size={18} color="#f59e0b" />
      <span>{formatTimer(timeRemaining)}</span>
    </div>
  );
};
