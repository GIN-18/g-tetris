const { io } = require("socket.io-client");

const socket = io("http://192.168.1.3:3000");

module.exports = socket
