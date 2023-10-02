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

    const player = players[socket.id] = { room, ready: 0, score: 0, gameOver: 0, page: 'ready' }
    rooms[room] = { [socket.id]: player }

    socket.emit('roomCreated', rooms[room])
  })

  // 加入房间
  socket.on('joinRoom', ({ action, room, ready, score, gameOver, page }) => {
    const clients = io.sockets.adapter.rooms.get(room)

    // // 房间内只有一个玩家刷新时将玩家加入房间
    if (action && !clients) {
      socket.join(room)

      const player = players[socket.id] = { room, ready, score, gameOver, page }
      rooms[room] = { [socket.id]: player }

      socket.emit('roomJoined', rooms[room])
      return
    }

    // 通过房间号加入房间或者房间内有两个玩家刷新时将玩家加入房间
    if (!clients || clients.size >= 2) {
      socket.emit('roomFull')
    } else {
      socket.join(room)

      players[socket.id] = { room, ready, score, gameOver, page }
      rooms[room][socket.id] = players[socket.id]

      socket.emit('roomJoined', rooms[room])
      socket.to(room).emit('playerJoined', rooms[room])
    }
  })

  // 玩家准备
  socket.on('ready', ({ room, ready }) => {
    const playerId = socket.id
    emitByAttr(playerId, room, 'ready', ready, 'zeroPlayerReady', 'onePlayerReady', 'twoPlayerReady')
  })

  // 更新分数
  socket.on('updateScore', ({ room, score }) => {
    const playerId = socket.id;

    rooms[room][playerId].score = score;
    io.to(room).emit('updateScore', rooms[room]);
  })

  socket.on('startGame', ({ room, ready }) => {
    const playerId = socket.id;
    emitByAttr(playerId, room, 'ready', ready, 'zeroStartGame', 'oneStartGame', 'twoStartGame')

    // const twoPlayerReady = Object.keys(rooms[room]).every(key => Number(rooms[room][key].ready) === 1)

    // if (twoPlayerReady && Object.keys(rooms[room]).length === 2) {
    //   io.to(room).emit('gameStart')
    // }
  })

  // 游戏结束
  socket.on('gameOver', ({ room, gameOver }) => {
    const playerId = socket.id
    emitByAttr(playerId, room, 'gameOver', gameOver, 'zeroPlayerGameOver', 'onePlayerGameOver', 'twoPlayerGameOver')
  })

  // 再一次游戏
  socket.on('again', ({ room, again }) => {
    const playerId = socket.id
    emitByAttr(playerId, room, 'again', again, 'zeroPlayerAgain', 'onePlayerAgain', 'twoPlayerAgain')
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");

    // 玩家离开房间
    const player = players[socket.id];

    if (player) {
      const { room } = player;

      delete players[socket.id];
      delete rooms[room][socket.id];
      io.to(room).emit('playerLeft', rooms[room]); // 向房间内的所有玩家发送离开消息

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

// 生成房间ID
function generateRoomId() {
  return uuidv4().substring(0, 8)
}

// 根据属性值发出事件
function emitByAttr(playerId, room, attr, attrValue, zeroEvent, oneEvent, twoEvent) {
  try {
    const status = rooms[room][playerId][attr] = Number(attrValue);

    const zeroCheck = Object.keys(rooms[room]).every(key => rooms[room][key][attr] == 0)

    if (zeroCheck) {
      io.to(room).emit(zeroEvent, rooms[room]);
      return
    }

    const twoCheck = Object.keys(rooms[room]).every(key => rooms[room][key][attr] == 1)

    if (twoCheck && Object.keys(rooms[room]).length > 1) {
      io.to(room).emit(twoEvent, rooms[room]);
      return
    }

    Object.keys(rooms[room]).forEach(key => {
      if ((status && key === playerId) || (!status && key !== playerId)) {
        io.to(room).emit(oneEvent, rooms[room]);
        return
      }
    })
  } catch (error) { }
}