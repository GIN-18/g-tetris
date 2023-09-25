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

io.on("connection", (socket) => {
  console.log("user connected");

  // 创建房间
  socket.on('createRoom', () => {
    const room = generateRoomId()
    socket.join(room)

    const player = players[socket.id] = { room, ready: 0, score: 0, gameOver: 0 }
    rooms[room] = { [socket.id]: player }

    socket.emit('roomCreated', rooms[room])
  })

  // 加入房间
  socket.on('joinRoom', ({ room, ready, score, action, gameOver }) => {
    const clients = io.sockets.adapter.rooms.get(room)

    // // 房间内只有一个玩家刷新时将玩家加入房间
    if (action && !clients) {
      socket.join(room)

      const player = players[socket.id] = { room, ready, score, gameOver }
      rooms[room] = { [socket.id]: player }

      socket.emit('roomJoined', rooms[room])
      return
    }

    // 通过房间号加入房间或者房间内有两个玩家刷新时将玩家加入房间
    if (!clients || clients.size >= 2) {
      socket.emit('roomFull')
    } else {
      socket.join(room)

      players[socket.id] = { room, ready, score, gameOver }
      rooms[room][socket.id] = players[socket.id]
      // rooms[room][socket.id] = { room, ready, score }

      socket.emit('roomJoined', rooms[room])
      socket.to(room).emit('playerJoined', rooms[room])
    }
  })

  // 玩家准备
  socket.on('ready', ({ room, ready }) => {
    try {
      const playerId = socket.id
      const playerReady = rooms[room][playerId].ready = Number(ready)

      // 零位玩家准备
      const zeroPlayerReady = Object.keys(rooms[room]).every(key => rooms[room][key].ready == 0)

      if (zeroPlayerReady) {
        io.to(room).emit('zeroPlayerReady', rooms[room])
        return
      }

      // 两位玩家已准备
      const twoPlayerReady = Object.keys(rooms[room]).every(key => rooms[room][key].ready == 1)

      if (twoPlayerReady && Object.keys(rooms[room]).length == 2) {
        io.to(room).emit('twoPlayerReady', rooms[room])
        return
      }

      Object.keys(rooms[room]).forEach(key => {
        // 一位玩家已准备
        if ((playerReady === 1 && key === playerId) || (playerReady === 0 && key !== playerId)) {
          io.to(room).emit('onePlayerReady', rooms[room])
        }
      })
    } catch (error) {
      console.log(error);
    }
  })

  // 更新分数
  socket.on('updateScore', ({ room, score }) => {
    const playerId = socket.id;

    rooms[room][playerId].score = score;
    io.to(room).emit('updateScore', rooms[room]);
  })

  // 游戏结束
  socket.on('gameOver', ({ room, gameOver }) => {
    const playerId = socket.id
    const playerGameOver = rooms[room][playerId].gameOver = Number(gameOver)

    // 两位玩家游戏结束
    const twoPlayerGameOver = Object.keys(rooms[room]).every(key => rooms[room][key].gameOver == 1)

    if (twoPlayerGameOver && Object.keys(rooms[room]).length == 2) {
      io.to(room).emit('twoPlayerGameOver', rooms[room])
      return
    }

    Object.keys(rooms[room]).forEach(key => {
      // 一位玩家游戏结束
      if ((playerGameOver === 1 && key === playerId) || (playerGameOver === 0 && key !== playerId)) {
        io.to(room).emit('onePlayerGameOver', rooms[room])
      }
    })
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");

    // 玩家离开房间
    const player = players[socket.id];

    if (player) {
      const { room } = player;

      delete players[socket.id];
      delete rooms[room][socket.id];
      io.to(room).emit('playerLeft'); // 向房间内的所有玩家发送离开消息

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