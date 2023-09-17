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

const players = []

io.on("connection", (socket) => {
  console.log("user connected");

  // 创建房间
  socket.on('createRoom', () => {
    const room = generateRoomId()
    socket.join(room)
    socket.emit('roomCreated', room)
    console.log(room)
  })

  // 加入房间
  socket.on('joinRoom', (room) => {
    const clients = io.sockets.adapter.rooms.get(room)

    if (!clients || clients.size >= 2) {
      socket.emit('roomFull')
      console.log('room is full');
    } else {
      socket.join(room)
      socket.emit('roomJoined', room)
      console.log('room joined')
    }
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
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