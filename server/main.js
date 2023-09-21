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

const players = {}

io.on("connection", (socket) => {
  console.log("user connected");

  // 创建房间
  socket.on('createRoom', () => {
    const room = generateRoomId()
    socket.join(room)
    players[socket.id] = { room, ready: 0 }
    socket.emit('roomCreated', players[socket.id])
  })

  // 加入房间
  socket.on('joinRoom', ({ room, action, ready }) => {
    const clients = io.sockets.adapter.rooms.get(room)

    // 房间内只有一个玩家刷新时将玩家加入房间
    if (action && !clients) {
      socket.join(room)
      players[socket.id] = { room, ready }
      socket.emit('roomJoined', players)
      return
    }

    // 通过房间号加入房间或者房间内有两个玩家刷新时将玩家加入房间
    if (!clients || clients.size >= 2) {
      socket.emit('roomFull')
    } else {
      socket.join(room)
      players[socket.id] = { room, ready: 0 }
      socket.emit('roomJoined', players)
      socket.to(room).emit('playerJoined', players)
    }
  })

  // 玩家准备
  socket.on('ready', ({ room, ready }) => {
    players[socket.id].ready = ready

    if (players[socket.id].ready == 1) {
      io.to(room).emit('playerReady', players)
    } else {
      io.to(room).emit('playerNotReady', players)
    }
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");

    // 玩家离开房间
    const player = players[socket.id];
    if (player) {
      const { room } = player;
      delete players[socket.id];
      io.to(room).emit('playerLeft', players); // 向房间内的所有玩家发送离开消息
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