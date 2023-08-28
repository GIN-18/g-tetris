const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

class Player {
  constructor(name, id) {
    this.name = name;
    this.id = id
    this.state = false;
  }
}

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  // console.log(socket.id);

  socket.on("readyUpdate", (msg) => {
    console.log(msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
