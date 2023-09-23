const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require('uuid')

const Shape = require('./src/Shape.js');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});

const rooms = {}
const players = {}

let seconds = 5

io.on("connection", (socket) => {
  console.log("user connected");

  // 创建房间
  socket.on('createRoom', () => {
    console.log('create room');
    const room = generateRoomId()
    socket.join(room)

    const player = players[socket.id] = { room, ready: 0 }
    rooms[room] = { [socket.id]: player }

    socket.emit('roomCreated', rooms[room])
  })

  // 加入房间
  socket.on('joinRoom', ({ room, action, ready }) => {
    const clients = io.sockets.adapter.rooms.get(room)

    // // 房间内只有一个玩家刷新时将玩家加入房间
    if (action && !clients) {
      socket.join(room)

      const player = players[socket.id] = { room, ready }
      rooms[room] = { [socket.id]: player }

      socket.emit('roomJoined', rooms[room])
      return
    }

    // 通过房间号加入房间或者房间内有两个玩家刷新时将玩家加入房间
    if (!clients || clients.size >= 2) {
      socket.emit('roomFull')
    } else {
      socket.join(room)

      players[socket.id] = { room, ready }
      rooms[room][socket.id] = { room, ready }

      socket.emit('roomJoined', rooms[room])
      socket.to(room).emit('playerJoined', rooms[room])
    }
  })

  // 玩家准备
  socket.on('ready', ({ room, ready }) => {
    const playerId = socket.id
    const playerReady = rooms[room][playerId].ready = Number(ready)

    // 零位玩家准备
    const zeroPlayerReady = Object.keys(rooms[room]).every(key => rooms[room][key].ready == 0)

    if (zeroPlayerReady) {
      io.to(room).emit('zeroPlayerReady')
      return
    }

    // 两位玩家已准备
    const twoPlayerReady = Object.keys(rooms[room]).every(key => rooms[room][key].ready == 1)

    if (twoPlayerReady) {
      io.to(room).emit('twoPlayerReady', rooms[room])
      return
    }

    Object.keys(rooms[room]).forEach(key => {
      // 一位玩家已准备
      if ((playerReady === 1 && key === playerId) || (playerReady === 0 && key !== playerId)) {
        io.to(room).emit('onePlayerReady', rooms[room])
      }
    })
  })

  // 所有玩家都准备好了
  socket.on('allReady', (room) => {
    let timer = setInterval(() => {
      seconds--;
      io.to(room).emit('countdown', seconds)

      if (seconds <= 0) {
        clearInterval(timer);
        socket.emit('startGame')
      }
    }, 1000);
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");

    console.log('players', players);
    console.log('rooms', rooms);

    // 玩家离开房间
    const player = players[socket.id];

    if (player) {
      const { room } = player;

      delete players[socket.id];
      delete rooms[room][socket.id];
      io.to(room).emit('playerLeft', players); // 向房间内的所有玩家发送离开消息

      if (Object.keys(rooms[room]).length < 1) {
        delete rooms[room];
      }
    }
  });
});

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

function addShape() {
  shape = nextShape;
  nextShape = new Shape();
}

// 生成房间ID
function generateRoomId() {
  return uuidv4().substring(0, 8)
}

// 倒计时