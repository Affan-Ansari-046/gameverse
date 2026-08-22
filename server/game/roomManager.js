import { generateRoomId } from '../utils/generateRoomId.js';
import { generateTarget } from './targetGenerator.js';

// Global In-Memory Rooms Map: roomId -> Room Object
const rooms = new Map();

// Global Player -> Room Mapping: socketId -> roomId
const playerRooms = new Map();

export const createRoom = (hostSocketId, username, duration = 60) => {
  let roomId = generateRoomId();
  while (rooms.has(roomId)) {
    roomId = generateRoomId();
  }

  const validDuration = [30, 60, 90, 120].includes(Number(duration)) ? Number(duration) : 60;

  const room = {
    id: roomId,
    hostId: hostSocketId,
    status: 'lobby', // 'lobby' | 'playing' | 'finished'
    players: [
      {
        id: hostSocketId,
        username,
        score: 0,
        isHost: true,
      }
    ],
    game: {
      active: false,
      duration: validDuration,
      timeRemaining: validDuration,
      currentTarget: null,
      timerInterval: null,
    },
    createdAt: Date.now(),
  };

  rooms.set(roomId, room);
  playerRooms.set(hostSocketId, roomId);

  return room;
};

export const getRoom = (roomId) => {
  if (!roomId) return null;
  return rooms.get(roomId.toUpperCase()) || null;
};

export const getPlayerRoom = (socketId) => {
  const roomId = playerRooms.get(socketId);
  if (!roomId) return null;
  return rooms.get(roomId) || null;
};

export const joinRoom = (roomId, socketId, username) => {
  const cleanRoomId = roomId.toUpperCase();
  const room = rooms.get(cleanRoomId);

  if (!room) {
    return { error: 'Room not found. Please check the code.' };
  }

  if (room.status === 'playing') {
    return { error: 'Game is currently in progress. Unable to join.' };
  }

  if (room.players.length >= 8) {
    return { error: 'Room has reached maximum capacity (8 players).' };
  }

  // Check if player already in room
  const existingPlayer = room.players.find(p => p.id === socketId);
  if (!existingPlayer) {
    room.players.push({
      id: socketId,
      username,
      score: 0,
      isHost: false,
    });
  }

  playerRooms.set(socketId, cleanRoomId);
  return { room };
};

export const leaveRoom = (socketId) => {
  const roomId = playerRooms.get(socketId);
  if (!roomId) return null;

  const room = rooms.get(roomId);
  playerRooms.delete(socketId);

  if (!room) return null;

  const playerIndex = room.players.findIndex(p => p.id === socketId);
  let removedPlayer = null;

  if (playerIndex !== -1) {
    removedPlayer = room.players[playerIndex];
    room.players.splice(playerIndex, 1);
  }

  // If room becomes empty, clear timer and delete room
  if (room.players.length === 0) {
    if (room.game.timerInterval) {
      clearInterval(room.game.timerInterval);
    }
    rooms.delete(roomId);
    return { roomId, roomDeleted: true };
  }

  // If host disconnected, reassign host to next remaining player
  if (room.hostId === socketId && room.players.length > 0) {
    room.hostId = room.players[0].id;
    room.players[0].isHost = true;
  }

  return { roomId, room, removedPlayer };
};

export const deleteRoom = (roomId) => {
  const room = rooms.get(roomId);
  if (room) {
    if (room.game.timerInterval) {
      clearInterval(room.game.timerInterval);
    }
    room.players.forEach(p => playerRooms.delete(p.id));
    rooms.delete(roomId);
  }
};
