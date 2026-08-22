# GameVerse — Real-Time Multiplayer Mini-Game Platform

**GameVerse is a real-time multiplayer reaction game built using React, Node.js, Express, and Socket.IO.**

![GameVerse Platform](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20Socket.IO%20%7C%20React%20%7C%20Vite-blue)

---

## 🚀 Key Features

* **Create & Join Game Rooms**: Short, shareable 6-character room codes (e.g. `ABC123`).
* **Server-Authoritative Game Logic**: All 60-second timers, score claims (+10 pts), and target percentage coordinates (`x, y`) are calculated and validated strictly on the Node.js server.
* **Real-Time Synchronized Reaction Arena**: Shared target position across all players with instant score updates.
* **Live Multiplayer Leaderboard**: Instant rank calculations updating live without page reloads.
* **Multiplayer Lobby & Host Management**: Min 2 / Max 8 players per room with automatic host reassignment on disconnection.
* **Room-Based Live Chat**: Instant messaging isolated per room.
* **Celebratory Game Over Podium**: Winner announcement with final standings table and canvas confetti effects.

---

## 🛠️ Installation & Setup

### 1. Clone & Navigate

```bash
git clone <repository-url>
cd gameverse
```

### 2. Backend Server Setup

```bash
cd server
npm install
npm start
```
*Server runs on `http://localhost:5000`*

### 3. Frontend App Setup

```bash
cd client
npm install
npm run dev
```
*App runs on `http://localhost:5173`*

---

## 🧪 Testing Multiplayer Locally

1. Open `http://localhost:5173` in **Browser Window 1**.
2. Enter username **Affan** and click **Create New Room**.
3. Copy the generated Room Code (e.g., `ABC123`).
4. Open `http://localhost:5173` in an **Incognito / Second Browser Window**.
5. Enter username **John**, paste Room Code `ABC123`, and click **Join**.
6. On Window 1 (Host), click **START GAME NOW**.
7. Click the targets appearing on the game canvas in either window — observe **instant score updates**, **synchronized target movements**, **live timer sync**, and **real-time chat**!

---

## 📡 Socket.IO Event Specification

| Event Name | Direction | Description |
| :--- | :--- | :--- |
| `create-room` | Client ➔ Server | Creates a new game room with host |
| `join-room` | Client ➔ Server | Joins an existing room by code |
| `start-game` | Client ➔ Server | Host triggers 60s game countdown |
| `target-click` | Client ➔ Server | Claims target hit for server validation |
| `send-message` | Client ➔ Server | Sends room chat message |
| `restart-game` | Client ➔ Server | Host restarts completed game |
| `leave-room` | Client ➔ Server | Leaves active room |
| `room-created` | Server ➔ Client | Emits initial room object |
| `room-state` | Server ➔ Client | Syncs room players & host state |
| `game-started` | Server ➔ Client | Signals match start with first target |
| `game-state` | Server ➔ Client | Broadcasts countdown timer & new target |
| `game-over` | Server ➔ Client | Signals end of match & final rankings |
| `error-message` | Server ➔ Client | Emits validation or capacity error toast |
