import "../../dist/style.css";
import "material-icons/iconfont/material-icons.css";

const Clipboard = require('clipboard');
const utils = require("./utils.js");
const socket = require("./socket.js");

import latteLogoImage from "../static/logo/logo-latte.webp";
import frappeLogoImage from "../static/logo/logo-frappe.webp";
import macchiatoLogoImage from "../static/logo/logo-macchiato.webp";
import mochaLogoImage from "../static/logo/logo-mocha.webp";

utils.setImage("logo-image", mochaLogoImage);

let playerId = null

socket.on("connect", () => {
  playerId = socket.id;
});

if (!sessionStorage.getItem('room')) {
  socket.emit('createRoom');
} else {
  socket.emit('joinRoom', { room: sessionStorage.getItem('room'), role: sessionStorage.getItem('role'), action: 1 });
}

socket.on('roomCreated', (data) => {
  sessionStorage.setItem('room', data.room); // 把房间ID存在sessionStorage中
  sessionStorage.setItem('role', data.role); // 把角色存在sessionStorage中
  document.getElementById('room-id').innerText = sessionStorage.getItem('room');

  document.getElementById('player1-id').innerText = playerId;
})

document.getElementById('room-id').innerText = sessionStorage.getItem('room');

// 刷新时重新加入房间
socket.on('roomJoined', (players) => {
  Object.keys(players).forEach(key => {
    if (key === playerId) {
      document.getElementById('player1-id').innerText = key;
    } else {
      document.getElementById('player2-id').innerText = key;
    }
  });
})

// 玩家加入提醒
socket.on('playerJoined', (players) => {
  Object.keys(players).forEach(key => {
    if (key !== playerId) {
      document.getElementById('player2-id').innerText = key;
    }
  });
})

// 复制房间ID
const clipboard = new Clipboard('#copy-button');

clipboard.on('success', function (e) {
  e.clearSelection();
  showCopyInfo("Copied")
});

clipboard.on('error', function (e) {
  showCopyInfo("Copy Error")
});

// 复制成功
function showCopyInfo(infoText) {
  const roomInfo = document.getElementById('room-info');

  const copyInfo = document.createElement('span');

  copyInfo.classList.add('fixed', 'top-2', 'right-2', 'px-2', 'py-1', 'border', 'border-green', 'rounded', 'text-xs', 'text-green')

  copyInfo.innerText = infoText;

  roomInfo.appendChild(copyInfo)

  setTimeout(() => {
    roomInfo.removeChild(copyInfo)
  }, 1000)
}