const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const Shape = require('./src/Shape.js')

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});

const shape = new Shape();

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {

  socket.emit("start", shape);

  socket.on('drop', (data) => {
    if (data) {
      socket.emit("newShape", new Shape());
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
