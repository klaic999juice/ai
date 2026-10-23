import { WebSocketServer } from 'ws';

const PORT = Number(process.env.PORT || 8787);
const wss = new WebSocketServer({ port: PORT });

const rooms = new Map();

function makeCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

function getRoom(code) {
  return rooms.get(code);
}

function createRoom(code, host) {
  const room = {
    code,
    players: [host],
    match: {
      phase: 'kickoff',
      time: 0,
      score: { home: 0, away: 0 },
      ball: { x: 0, z: 0, vx: 0, vz: 0, y: 0.4 },
      players: {
        home: [],
        away: [],
      },
    },
  };
  rooms.set(code, room);
  return room;
}

function addPlayer(roomCode, player) {
  const room = getRoom(roomCode);
  if (!room) return null;
  if (room.players.length >= 2) return null;

  room.players.push(player);
  player.team = room.players.length === 1 ? 'home' : 'away';
  player.input = { up: false, down: false, left: false, right: false, sprint: false, pass: false, shoot: false, through: false, tackle: false, switch: false };
  return room;
}

function broadcast(room, payload) {
  const data = JSON.stringify(payload);
  room.players.forEach((player) => {
    if (player.ws.readyState === 1) {
      player.ws.send(data);
    }
  });
}

function updateMatch(room, dt) {
  const match = room.match;
  match.time += dt;

  const home = room.players.find((p) => p.team === 'home');
  const away = room.players.find((p) => p.team === 'away');

  if (home && away) {
    const homeInput = home.input || {};
    const awayInput = away.input || {};

    const homeMoveX = (homeInput.right ? 1 : 0) - (homeInput.left ? 1 : 0);
    const homeMoveZ = (homeInput.down ? 1 : 0) - (homeInput.up ? 1 : 0);
    const awayMoveX = (awayInput.right ? 1 : 0) - (awayInput.left ? 1 : 0);
    const awayMoveZ = (awayInput.down ? 1 : 0) - (awayInput.up ? 1 : 0);

    room.match.ball.x += room.match.ball.vx * dt;
    room.match.ball.z += room.match.ball.vz * dt;
    room.match.ball.vx *= 0.98;
    room.match.ball.vz *= 0.98;

    if (Math.abs(homeMoveX) > 0 || Math.abs(homeMoveZ) > 0) {
      const speed = homeInput.sprint ? 8 : 5.5;
      const nx = homeMoveX / (Math.abs(homeMoveX) + Math.abs(homeMoveZ) || 1);
      const nz = homeMoveZ / (Math.abs(homeMoveX) + Math.abs(homeMoveZ) || 1);
      home.x = Math.max(-28, Math.min(28, (home.x || 0) + nx * speed * dt));
      home.z = Math.max(-38, Math.min(38, (home.z || 0) + nz * speed * dt));
    }

    if (Math.abs(awayMoveX) > 0 || Math.abs(awayMoveZ) > 0) {
      const speed = awayInput.sprint ? 8 : 5.5;
      const nx = awayMoveX / (Math.abs(awayMoveX) + Math.abs(awayMoveZ) || 1);
      const nz = awayMoveZ / (Math.abs(awayMoveX) + Math.abs(awayMoveZ) || 1);
      away.x = Math.max(-28, Math.min(28, (away.x || 0) + nx * speed * dt));
      away.z = Math.max(-38, Math.min(38, (away.z || 0) + nz * speed * dt));
    }

    const nearBall = Math.hypot((home.x || 0) - room.match.ball.x, (home.z || 0) - room.match.ball.z) < 2.2;
    const awayNearBall = Math.hypot((away.x || 0) - room.match.ball.x, (away.z || 0) - room.match.ball.z) < 2.2;

    if (nearBall && !awayNearBall) {
      room.match.ball.vx = (home.x || 0) - room.match.ball.x;
      room.match.ball.vz = (home.z || 0) - room.match.ball.z;
    }

    if (awayNearBall && !nearBall) {
      room.match.ball.vx = (away.x || 0) - room.match.ball.x;
      room.match.ball.vz = (away.z || 0) - room.match.ball.z;
    }

    if (homeInput.shoot || awayInput.shoot) {
      const shooter = homeInput.shoot ? home : away;
      const targetX = shooter.team === 'home' ? 0 : 0;
      const targetZ = shooter.team === 'home' ? 40 : -40;
      room.match.ball.vx = (targetX - (shooter.x || 0)) * 0.9;
      room.match.ball.vz = (targetZ - (shooter.z || 0)) * 0.9;
    }

    if (room.match.ball.z > 42 && Math.abs(room.match.ball.x) < 8) {
      room.match.score.home += 1;
      room.match.ball.x = 0;
      room.match.ball.z = 0;
      room.match.ball.vx = 0;
      room.match.ball.vz = 0;
    }

    if (room.match.ball.z < -42 && Math.abs(room.match.ball.x) < 8) {
      room.match.score.away += 1;
      room.match.ball.x = 0;
      room.match.ball.z = 0;
      room.match.ball.vx = 0;
      room.match.ball.vz = 0;
    }
  }
}

wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    try {
      const message = JSON.parse(String(raw));

      if (message.type === 'create_room') {
        const code = makeCode();
        const host = {
          id: `${Date.now()}-${Math.random()}`,
          name: message.playerName || 'Player 1',
          ws,
          team: 'home',
          x: -8,
          z: 12,
          input: { up: false, down: false, left: false, right: false, sprint: false, pass: false, shoot: false, through: false, tackle: false, switch: false },
        };
        const room = createRoom(code, host);
        ws.send(JSON.stringify({ type: 'room_created', roomCode: code, playerId: host.id, team: 'home' }));
        return;
      }

      if (message.type === 'join_room') {
        const room = getRoom(message.roomCode);
        if (!room) {
          ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
          return;
        }

        const player = {
          id: `${Date.now()}-${Math.random()}`,
          name: message.playerName || 'Player 2',
          ws,
          team: 'away',
          x: 8,
          z: -12,
          input: { up: false, down: false, left: false, right: false, sprint: false, pass: false, shoot: false, through: false, tackle: false, switch: false },
        };

        const result = addPlayer(message.roomCode, player);
        if (!result) {
          ws.send(JSON.stringify({ type: 'error', message: 'Room is full' }));
          return;
        }

        ws.send(JSON.stringify({ type: 'room_joined', roomCode: message.roomCode, playerId: player.id, team: 'away' }));
        broadcast(room, { type: 'state', roomCode: message.roomCode, members: room.players.map((p) => ({ id: p.id, name: p.name, team: p.team })) });
        return;
      }

      if (message.type === 'input') {
        const room = getRoom(message.roomCode);
        if (!room) return;
        const player = room.players.find((p) => p.id === message.playerId);
        if (!player) return;
        player.input = { ...player.input, ...message.input };
      }

      if (message.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
    } catch (error) {
      console.error('Invalid websocket message', error);
    }
  });

  ws.on('close', () => {
    for (const [code, room] of rooms.entries()) {
      const remaining = room.players.filter((player) => player.ws !== ws);
      if (remaining.length !== room.players.length) {
        room.players = remaining;
        if (remaining.length === 0) {
          rooms.delete(code);
        }
      }
    }
  });
});

setInterval(() => {
  for (const room of rooms.values()) {
    updateMatch(room, 1 / 30);
    broadcast(room, {
      type: 'snapshot',
      roomCode: room.code,
      match: room.match,
      players: room.players.map((player) => ({
        id: player.id,
        name: player.name,
        team: player.team,
        x: player.x,
        z: player.z,
        input: player.input,
      })),
    });
  }
}, 1000 / 30);

console.log(`WebSocket server listening on ws://localhost:${PORT}`);
