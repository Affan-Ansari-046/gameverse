import React from 'react';
import { useGame } from './context/GameContext';
import { Home } from './pages/Home';
import { Lobby } from './components/Lobby';
import { GameRoom } from './pages/GameRoom';
import { AlertCircle } from 'lucide-react';

export const App = () => {
  const { room, errorMessage } = useGame();

  const renderCurrentView = () => {
    if (!room) {
      return <Home />;
    }

    if (room.status === 'lobby') {
      return (
        <div className="gameverse-container">
          <Lobby />
        </div>
      );
    }

    return <GameRoom />;
  };

  return (
    <>
      {errorMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#be123c',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {renderCurrentView()}
    </>
  );
};
