import { EVENTS } from './events.js';
import { sanitizeUsername, sanitizeMessage } from '../utils/validation.js';
import { 
  createRoom, 
  joinRoom, 
  getRoom, 
  leaveRoom 
} from '../game/roomManager.js';
import { 
  startGame, 
  processTargetHit, 
  restartGame 
} from '../game/gameManager.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // 1. Create Room
    socket.on(EVENTS.CREATE_ROOM, ({ username, duration }) => {
      const cleanName = sanitizeUsername(username);
      if (!cleanName || cleanName.length < 3) {
        return socket.emit(EVENTS.ERROR_MESSAGE, { message: 'Username must be at least 3 characters long.' });
      }

      const room = createRoom(socket.id, cleanName, duration);
      socket.join(room.id);

      console.log(`[Room Created] Room ID: ${room.id} by ${cleanName}`);

      socket.emit(EVENTS.ROOM_CREATED, {
        roomId: room.id,
        room,
      });

      io.to(room.id).emit(EVENTS.ROOM_STATE, {
        id: room.id,
        hostId: room.hostId,
        status: room.status,
        players: room.players,
      });
    });

    // 2. Join Room
    socket.on(EVENTS.JOIN_ROOM, ({ roomId, username }) => {
      const cleanName = sanitizeUsername(username);
      if (!cleanName || cleanName.length < 3) {
        return socket.emit(EVENTS.ERROR_MESSAGE, { message: 'Username must be at least 3 characters long.' });
      }

      if (!roomId) {
        return socket.emit(EVENTS.ERROR_MESSAGE, { message: 'Please enter a valid room code.' });
      }

      const result = joinRoom(roomId, socket.id, cleanName);

      if (result.error) {
        return socket.emit(EVENTS.ERROR_MESSAGE, { message: result.error });
      }

      const { room } = result;
      socket.join(room.id);

      console.log(`[Player Joined] ${cleanName} joined room ${room.id}`);

      // Broadcast updated room state to all members
      io.to(room.id).emit(EVENTS.ROOM_STATE, {
        id: room.id,
        hostId: room.hostId,
        status: room.status,
        players: room.players,
      });

      // System chat notification
      io.to(room.id).emit(EVENTS.CHAT_MESSAGE, {
        username: 'System',
        message: `${cleanName} joined the room!`,
        timestamp: Date.now(),
        isSystem: true,
      });
    });

    // 3. Start Game (Host Only)
    socket.on(EVENTS.START_GAME, ({ roomId }) => {
      const room = getRoom(roomId);
      if (!room) {
        return socket.emit(EVENTS.ERROR_MESSAGE, { message: 'Room not found.' });
      }

      if (room.hostId !== socket.id) {
        return socket.emit(EVENTS.ERROR_MESSAGE, { message: 'Only the room host can start the game.' });
      }

      const result = startGame(io, room);
      if (result.error) {
        return socket.emit(EVENTS.ERROR_MESSAGE, { message: result.error });
      }

      console.log(`[Game Started] Room ID: ${room.id}`);
    });

    // 4. Target Click (Server-Authoritative Score Validation)
    socket.on(EVENTS.TARGET_CLICK, ({ roomId, targetId }) => {
      const room = getRoom(roomId);
      if (!room) return;

      processTargetHit(io, room, socket.id, targetId);
    });

    // 5. Send Chat Message
    socket.on(EVENTS.SEND_MESSAGE, ({ roomId, message }) => {
      const cleanText = sanitizeMessage(message);
      if (!cleanText) return;

      const room = getRoom(roomId);
      if (!room) return;

      const player = room.players.find(p => p.id === socket.id);
      if (!player) return;

      io.to(room.id).emit(EVENTS.CHAT_MESSAGE, {
        username: player.username,
        message: cleanText,
        timestamp: Date.now(),
        isSystem: false,
      });
    });

    // 6. Restart Game (Host Only)
    socket.on(EVENTS.RESTART_GAME, ({ roomId }) => {
      const room = getRoom(roomId);
      if (!room) return;

      if (room.hostId !== socket.id) {
        return socket.emit(EVENTS.ERROR_MESSAGE, { message: 'Only the host can restart the game.' });
      }

      restartGame(io, room);
    });

    // 7. Leave Room / Disconnect
    const handleLeave = () => {
      const result = leaveRoom(socket.id);
      if (result && result.roomId) {
        socket.leave(result.roomId);
        if (!result.roomDeleted && result.room) {
          io.to(result.roomId).emit(EVENTS.ROOM_STATE, {
            id: result.room.id,
            hostId: result.room.hostId,
            status: result.room.status,
            players: result.room.players,
          });

          if (result.removedPlayer) {
            io.to(result.roomId).emit(EVENTS.CHAT_MESSAGE, {
              username: 'System',
              message: `${result.removedPlayer.username} left the room.`,
              timestamp: Date.now(),
              isSystem: true,
            });
          }
        }
      }
    };

    socket.on(EVENTS.LEAVE_ROOM, handleLeave);
    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
      handleLeave();
    });
  });
};
