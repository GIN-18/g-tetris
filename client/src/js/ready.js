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

if (!sessionStorage.getItem('room')) {
  socket.emit('createRoom');
} else {
  socket.emit('joinRoom', { room: sessionStorage.getItem('room'), action: 1, role: sessionStorage.getItem('role') });
}

socket.on('roomCreated', ({ room, role }) => {
  sessionStorage.setItem('room', room); // 把房间ID存在sessionStorage中
  sessionStorage.setItem('role', role); // 把角色存在sessionStorage中
  document.getElementById('room-id').innerText = sessionStorage.getItem('room');

  document.getElementById('player1-id').innerText = socket.id;
})

document.getElementById('room-id').innerText = sessionStorage.getItem('room');

// 刷新时重新加入房间
socket.on('roomJoined', (players) => {
  Object.keys(players).forEach(key => {
    if (key === socket.id) {
      document.getElementById('player1-id').innerText = key;
    } else {
      document.getElementById('player2-id').innerText = key;
    }
  });
})

// 玩家加入提醒
socket.on('playerJoined', (players) => {
  Object.keys(players).forEach(key => {
    if (key !== socket.id) {
      document.getElementById('player2-id').innerText = key;
    }
  });
})

// 用户离开的处理逻辑
socket.on('playerLeft', () => {
  document.getElementById('player2-id').innerText = '';
});

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