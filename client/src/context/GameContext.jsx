import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { socket, isConnected } = useSocket();
  const [username, setUsernameState] = useState(() => {
    return localStorage.getItem('gameverse_username') || '';
  });

  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [gameOverData, setGameOverData] = useState(null);

  const setUsername = (name) => {
    setUsernameState(name);
    if (name) {
      localStorage.setItem('gameverse_username', name);
    } else {
      localStorage.removeItem('gameverse_username');
    }
  };

  useEffect(() => {
    if (!socket) return;

    // Listen to Server Events
    socket.on('room-created', ({ roomId, room: roomData }) => {
      setRoom(roomData);
      setMessages([]);
      setGameOverData(null);
    });

    socket.on('room-state', (roomData) => {
      setRoom(prev => ({ ...prev, ...roomData }));
    });

    socket.on('game-started', ({ target, players }) => {
      setGameOverData(null);
      setRoom(prev => ({
        ...prev,
        status: 'playing',
        players,
        game: {
          active: true,
          timeRemaining: 60,
          currentTarget: target,
        }
      }));
    });

    socket.on('game-state', ({ timeRemaining, target, players }) => {
      setRoom(prev => ({
        ...prev,
        players: players || prev?.players,
        game: {
          active: true,
          timeRemaining: timeRemaining !== undefined ? timeRemaining : prev?.game?.timeRemaining,
          currentTarget: target || prev?.game?.currentTarget,
        }
      }));
    });

    socket.on('chat-message', (chatMsg) => {
      setMessages(prev => [...prev, chatMsg]);
    });

    socket.on('game-over', ({ winner, leaderboard }) => {
      setGameOverData({ winner, leaderboard });
      setRoom(prev => ({
        ...prev,
        status: 'finished',
        game: { ...prev?.game, active: false }
      }));
    });

    socket.on('error-message', ({ message }) => {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 4000);
    });

    return () => {
      socket.off('room-created');
      socket.off('room-state');
      socket.off('game-started');
      socket.off('game-state');
      socket.off('chat-message');
      socket.off('game-over');
      socket.off('error-message');
    };
  }, [socket]);

  // Socket Actions
  const createRoom = (duration = 60) => {
    if (!socket || !username) return;
    socket.emit('create-room', { username, duration });
  };

  const joinRoom = (roomId) => {
    if (!socket || !username || !roomId) return;
    socket.emit('join-room', { roomId, username });
  };

  const startGame = () => {
    if (!socket || !room?.id) return;
    socket.emit('start-game', { roomId: room.id });
  };

  const clickTarget = (targetId) => {
    if (!socket || !room?.id || !targetId) return;
    socket.emit('target-click', { roomId: room.id, targetId });
  };

  const sendMessage = (text) => {
    if (!socket || !room?.id || !text) return;
    socket.emit('send-message', { roomId: room.id, message: text });
  };

  const restartGame = () => {
    if (!socket || !room?.id) return;
    socket.emit('restart-game', { roomId: room.id });
  };

  const leaveRoom = () => {
    if (socket && room?.id) {
      socket.emit('leave-room', { roomId: room.id });
    }
    setRoom(null);
    setMessages([]);
    setGameOverData(null);
  };

  const logout = () => {
    leaveRoom();
    setUsername('');
  };

  return (
    <GameContext.Provider value={{
      socket,
      isConnected,
      username,
      setUsername,
      room,
      messages,
      errorMessage,
      gameOverData,
      createRoom,
      joinRoom,
      startGame,
      clickTarget,
      sendMessage,
      restartGame,
      leaveRoom,
      logout,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
