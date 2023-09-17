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

socket.on("connect", () => {
  console.log(socket.id);
});

if (!sessionStorage.getItem('room')) {
  socket.emit('createRoom');
} else {
  socket.emit('joinRoom', sessionStorage.getItem('room'));
}


socket.on('roomCreated', (room) => {
  sessionStorage.setItem('room', room); // 把房间ID存在sessionStorage中
  document.getElementById('room-id').innerText = sessionStorage.getItem('room');
})

document.getElementById('room-id').innerText = sessionStorage.getItem('room');

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