const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const Shape = require('./src/Shape.js');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});

let shape = null
let nextShape = new Shape();

function addShape() {
  shape = nextShape;
  nextShape = new Shape();
}

addShape()

io.on("connection", (socket) => {
  console.log("user connected");

  socket.emit('addShape', {
    shape,
    nextShape,
  });

  socket.on('landShape', () => {
    addShape()
    socket.emit('addShape', {
      shape,
      nextShape,
    });
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
