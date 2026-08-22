import { generateTarget } from './targetGenerator.js';

export const startGame = (io, room) => {
  if (!room) return { error: 'Room not found.' };

  if (room.players.length < 2) {
    return { error: 'At least 2 players are required to start the game.' };
  }

  // Reset scores and set game status
  room.status = 'playing';
  room.game.active = true;
  const matchDuration = room.game.duration || 60;
  room.game.timeRemaining = matchDuration;
  room.players.forEach(p => p.score = 0);

  // Generate initial target
  room.game.currentTarget = generateTarget();

  // Clear existing timer if any
  if (room.game.timerInterval) {
    clearInterval(room.game.timerInterval);
  }

  // Broadcast game-started event
  io.to(room.id).emit('game-started', {
    startTime: Date.now(),
    duration: matchDuration,
    target: room.game.currentTarget,
    players: room.players,
  });

  // Start server countdown loop
  room.game.timerInterval = setInterval(() => {
    room.game.timeRemaining -= 1;

    if (room.game.timeRemaining <= 0) {
      clearInterval(room.game.timerInterval);
      room.game.timerInterval = null;
      endGame(io, room);
    } else {
      io.to(room.id).emit('game-state', {
        timeRemaining: room.game.timeRemaining,
        target: room.game.currentTarget,
        players: room.players,
      });
    }
  }, 1000);

  return { success: true };
};

export const processTargetHit = (io, room, socketId, targetId) => {
  if (!room || !room.game.active) return false;

  // Validate target ID matches active currentTarget
  if (!room.game.currentTarget || room.game.currentTarget.id !== targetId) {
    return false; // Already claimed or invalid target
  }

  const player = room.players.find(p => p.id === socketId);
  if (!player) return false;

  // Award +10 points
  player.score += 10;

  // Generate next target
  room.game.currentTarget = generateTarget();

  // Broadcast updated score and new target position to all room members
  io.to(room.id).emit('game-state', {
    timeRemaining: room.game.timeRemaining,
    target: room.game.currentTarget,
    players: room.players,
    hitBy: {
      socketId,
      username: player.username,
    }
  });

  return true;
};

export const endGame = (io, room) => {
  if (!room) return;

  room.game.active = false;
  room.status = 'finished';

  if (room.game.timerInterval) {
    clearInterval(room.game.timerInterval);
    room.game.timerInterval = null;
  }

  // Sort leaderboard descending by score
  const leaderboard = [...room.players].sort((a, b) => b.score - a.score);
  const winner = leaderboard.length > 0 ? leaderboard[0] : null;

  io.to(room.id).emit('game-over', {
    winner,
    leaderboard,
  });
};

export const restartGame = (io, room) => {
  if (!room) return;

  if (room.game.timerInterval) {
    clearInterval(room.game.timerInterval);
    room.game.timerInterval = null;
  }

  room.status = 'lobby';
  room.game.active = false;
  room.game.timeRemaining = room.game.duration || 60;
  room.game.currentTarget = null;
  room.players.forEach(p => p.score = 0);

  io.to(room.id).emit('room-state', {
    id: room.id,
    hostId: room.hostId,
    status: room.status,
    players: room.players,
  });
};
