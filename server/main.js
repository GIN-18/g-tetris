const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("user connected");

  // 创建房间
  socket.on("createRoom", () => {
    const room = generateRoomId();
    socket.join(room);

    rooms[room] = {
      [socket.id]: {
        room,
        ready: 0,
        score: 0,
      }
    };

    socket.emit("roomCreated", rooms[room]);
  });

  // 加入房间
  socket.on("joinRoom", ({ action, room, ready, score }) => {
    const clients = io.sockets.adapter.rooms.get(room);

    socket.join(room);

    rooms[room][socket.id] = {
      room,
      ready,
      score,
    };

    socket.emit("roomJoined", rooms[room]);

    //  玩家刷新时提醒玩家加入房间
    if (action) {
      socket.to(room).emit("playerJoined", rooms[room]);
      return;
    }

    // 未找到房间
    if (!clients) {
      socket.emit("roomNotFound");
      return;
    }

    // 通过房间号加入房间或者房间内有两个玩家刷新时将玩家加入房间
    if (clients.size >= 2) {
      socket.emit("roomFull");
      return;
    }
  });

  // 玩家准备
  socket.on("ready", ({ room, ready }) => {
    emitByAttr(
      socket.id,
      room,
      "ready",
      ready,
      "zeroPlayerReady",
      "onePlayerReady",
      "twoPlayerReady"
    );
  });

  // 更新分数
  socket.on("updateScore", ({ room, score }) => {
    rooms[room][socket.id].score = score;
    io.to(room).emit("updateScore", rooms[room]);
  });

  // 开始游戏
  socket.on("startGame", ({ room, gameStart }) => {
    emitByAttr(
      socket.id,
      room,
      "gameStart",
      gameStart,
      "zeroStartGame",
      "oneStartGame",
      "twoStartGame"
    );
  });

  // 游戏结束
  socket.on("gameOver", ({ room, gameOver }) => {
    emitByAttr(
      socket.id,
      room,
      "gameOver",
      gameOver,
      "zeroPlayerGameOver",
      "onePlayerGameOver",
      "twoPlayerGameOver"
    );
  });

  // 再一次游戏
  socket.on("again", ({ room, again }) => {
    emitByAttr(
      socket.id,
      room,
      "again",
      again,
      "zeroPlayerAgain",
      "onePlayerAgain",
      "twoPlayerAgain"
    );
  });

  // 玩家离开房间
  socket.on("disconnect", () => {
    console.log("user disconnected");

    // 玩家离开房间就从房间中删除玩家
    for (const room in rooms) {
      delete rooms[room][socket.id];
    }
  });
});

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// 生成房间ID
function generateRoomId() {
  return uuidv4().substring(0, 8);
}

// 根据属性值发出事件
function emitByAttr(
  playerId,
  room,
  attr,
  attrValue,
  zeroEvent,
  oneEvent,
  twoEvent
) {
  try {
    const status = (rooms[room][playerId][attr] = Number(attrValue));

    const zeroCheck = Object.keys(rooms[room]).every(
      (key) => rooms[room][key][attr] == 0
    );

    if (zeroCheck) {
      io.to(room).emit(zeroEvent, rooms[room]);
      return;
    }

    const twoCheck = Object.keys(rooms[room]).every(
      (key) => rooms[room][key][attr] == 1
    );

    if (twoCheck && Object.keys(rooms[room]).length > 1) {
      io.to(room).emit(twoEvent, rooms[room]);
      return;
    }

    Object.keys(rooms[room]).forEach((key) => {
      if ((status && key === playerId) || (!status && key !== playerId)) {
        io.to(room).emit(oneEvent, rooms[room]);
        return;
      }
    });
  } catch (error) { }
}
