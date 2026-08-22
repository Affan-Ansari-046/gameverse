import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupSocketHandlers } from './socket/socketHandler.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

// Attach Socket.IO
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

setupSocketHandlers(io);

// Comprehensive Keep-Alive Health Check Endpoint
const handleHealthCheck = (req, res) => {
  const connectedSockets = io.sockets.sockets.size;
  const memoryUsage = process.memoryUsage();
  
  res.status(200).json({
    status: 'ok',
    service: 'GameVerse Real-Time Engine',
    uptimeSeconds: Math.floor(process.uptime()),
    connectedPlayers: connectedSockets,
    memoryUsageMB: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    },
    timestamp: new Date().toISOString(),
  });
};

// Expose health routes for uptime monitors (Render, UptimeRobot, BetterStack, Cron)
app.get('/health', handleHealthCheck);
app.get('/api/health', handleHealthCheck);

// Root Ping Route
app.get('/', (req, res) => {
  res.send('🎮 GameVerse Server is Live & Healthy! Socket.IO is ready.');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🎮 GameVerse Server listening on port ${PORT}`);
  console.log(`⚡ Real-Time Socket.IO Reaction Arena ready`);
  console.log(`💚 Health Check Route: http://localhost:${PORT}/health`);
  console.log(`========================================================`);

  // Optional Self-Ping Keep-Alive loop for Free Cloud Hosting (e.g., Render / Glitch)
  const selfUrl = process.env.SERVER_URL || process.env.RENDER_EXTERNAL_URL;
  if (selfUrl) {
    console.log(`📡 Auto Keep-Alive enabled for: ${selfUrl}/health`);
    setInterval(() => {
      fetch(`${selfUrl}/health`)
        .then(r => r.json())
        .then(d => console.log(`[Keep-Alive Ping] Server self-ping OK (${d.uptimeSeconds}s uptime)`))
        .catch(err => console.warn(`[Keep-Alive Ping Error] ${err.message}`));
    }, 10 * 60 * 1000); // Ping every 10 minutes to prevent sleeping
  }
});
