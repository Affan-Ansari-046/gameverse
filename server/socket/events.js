export const EVENTS = {
  // Client -> Server
  CREATE_ROOM: 'create-room',
  JOIN_ROOM: 'join-room',
  START_GAME: 'start-game',
  TARGET_CLICK: 'target-click',
  SEND_MESSAGE: 'send-message',
  RESTART_GAME: 'restart-game',
  LEAVE_ROOM: 'leave-room',

  // Server -> Client
  ROOM_CREATED: 'room-created',
  ROOM_STATE: 'room-state',
  GAME_STARTED: 'game-started',
  GAME_STATE: 'game-state',
  TARGET_UPDATED: 'target-updated',
  SCORE_UPDATED: 'score-updated',
  CHAT_MESSAGE: 'chat-message',
  GAME_OVER: 'game-over',
  ERROR_MESSAGE: 'error-message',
};
