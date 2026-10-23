# Stadium Clash

A browser-based 3D football game prototype built with React, Vite, Three.js, and a separate WebSocket multiplayer backend.

## Overview

This project includes:
- A Vite + React + TypeScript frontend for the game UI and 3D pitch
- A Three.js and React Three Fiber stadium scene
- A playable local match with AI teammates/opponents, scoring, timer, and UI
- A WebSocket server for matchmaking and room-based online play
- Supabase-ready client configuration for profiles, leaderboard, and match history
- Unit tests for key gameplay logic

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- 3D: Three.js, React Three Fiber, Drei
- Physics: @react-three/rapier
- Multiplayer server: Node.js + WebSocket server
- Database: Supabase client integration prepared
- Deployment: Vercel frontend, separate Node hosting for multiplayer backend

## Local development

1. Install dependencies:

   npm install

2. Start the multiplayer server:

   npm run server

3. Start the frontend in another terminal:

   npm run dev

4. Open the app in a browser:

   http://localhost:5173

## Environment variables

Copy `.env.example` to `.env` and fill in your values.

Example:

```bash
cp .env.example .env
```

The main variables are:
- `VITE_WS_URL` for the multiplayer backend
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Tests

Run gameplay logic tests:

```bash
npm test
```

## Production build

```bash
npm run build
```

## Vercel deployment

Frontend:
1. Import the repo into Vercel
2. Set the framework as Vite
3. Configure the build command: `npm run build`
4. Configure output directory: `dist`
5. Set production env vars: `VITE_WS_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

Multiplayer backend:
1. Deploy `server/index.js` to a persistent Node host such as Render, Railway, Fly.io, or a VPS
2. Expose the WebSocket port (default 8787)
3. Point `VITE_WS_URL` at the deployed host

## Notes

- The local match is fully playable with keyboard/mobile controls.
- The multiplayer server is authoritative for room creation, join logic, player state, and basic validation.
- The project is intentionally structured to allow extension into a more advanced production football game.
