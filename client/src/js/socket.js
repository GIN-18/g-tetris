const { io } = require("socket.io-client");

// const socket = io("http://localhost:3000");
const socket = io('http://192.168.1.9:3000');

module.exports = socket
