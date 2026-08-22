import React from 'react';
import { Trophy, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const Leaderboard = () => {
  const { room, socket } = useGame();
  const sortedPlayers = [...(room?.players || [])].sort((a, b) => b.score - a.score);

  return (
    <div className="card leaderboard-panel">
      <div className="leaderboard-header">
        <Trophy size={18} color="#f59e0b" />
        <span>LIVE LEADERBOARD</span>
      </div>

      <div className="leaderboard-list">
        {sortedPlayers.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '10px' }}>
            No players in room
          </div>
        ) : (
          sortedPlayers.map((player, index) => {
            const isCurrent = player.id === socket?.id;
            const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';

            return (
              <div key={player.id} className={`leaderboard-item ${rankClass}`}>
                <span className="player-rank">#{index + 1}</span>
                <span className="player-name-col">
                  {player.username}
                  {isCurrent && <span style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>(You)</span>}
                  {index === 0 && <Award size={14} color="#f59e0b" />}
                </span>
                <span className="player-score-col">{player.score}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
