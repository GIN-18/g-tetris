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

const roomId = document.getElementById("room-id");

const player1Id = document.getElementById("player1-id");
const player1Status = document.getElementById("player1-status");

const player2Id = document.getElementById("player2-id");
const player2Status = document.getElementById("player2-status");

const statusButton = document.getElementById('status-btn')
const countdown = document.getElementById('countdown')

if (!sessionStorage.getItem('room')) {
  socket.emit('createRoom');
} else {
  socket.emit('joinRoom', { room: sessionStorage.getItem('room'), ready: sessionStorage.getItem('ready'), action: 1 });
}

socket.on('roomCreated', (players) => {
  countdown.innerText = 5

  sessionStorage.setItem('room', players[socket.id].room); // 把房间ID存在sessionStorage中
  sessionStorage.setItem('ready', players[socket.id].ready); // 把角色存在sessionStorage中

  if (!Number(sessionStorage.getItem('ready'))) {

    if (!Number(sessionStorage.getItem('ready'))) {
      player1Status.innerText = 'not ready'
      player1Status.classList.add('text-red')
      statusButton.innerText = 'Ready'
    } else {
      player1Status.innerText = 'ready'
      player1Status.classList.add('text-green')
      statusButton.innerText = 'Cancel'
    }

    roomId.innerText = sessionStorage.getItem('room');

    player1Id.innerText = socket.id;
  }
})

roomId.innerText = sessionStorage.getItem('room');

// 刷新时重新加入房间
socket.on('roomJoined', (players) => {
  countdown.innerText = 5

  Object.keys(players).forEach(key => {
    if (key === socket.id) {
      player1Id.innerText = key.substring(0, 16);

      if (!Number(sessionStorage.getItem('ready'))) {
        player1Status.innerText = 'not ready'
        player1Status.classList.add('text-red')
        statusButton.innerText = 'Ready'
      } else {
        player1Status.innerText = 'ready'
        player1Status.classList.add('text-green')
        statusButton.innerText = 'Cancel'
      }

    } else {
      player2Id.innerText = key.substring(0, 16);

      if (!Number(players[key].ready)) {
        player2Status.innerText = 'not ready'
        player2Status.classList.add('text-red')
      } else {
        player2Status.innerText = 'ready'
        player2Status.classList.add('text-green')
      }
    }

    const allReady = Object.keys(players).every(key => players[key].ready == 1)

    if (allReady) {
    }
  });
})

// 玩家加入提醒
socket.on('playerJoined', (players) => {
  Object.keys(players).forEach(key => {
    player2Id.innerText = key.substring(0, 16);

    if (Number(players[key].ready) && key !== socket.id) {
      player2Status.innerText = 'ready'
      player2Status.classList.add('text-green')
    } else if (!Number(players[key].ready) && key !== socket.id) {
      player2Status.innerText = 'not ready'
      player2Status.classList.add('text-red')
    }

    showMessage("Player 2 joined room!!")
  });
})

// 玩家准备
statusButton.addEventListener('touchstart', () => {
  const ready = Number(sessionStorage.getItem('ready'))

  if (!ready) {
    sessionStorage.setItem('ready', 1)
    socket.emit('ready', { room: sessionStorage.getItem('room'), ready: sessionStorage.getItem('ready') })
  }
  else {
    sessionStorage.setItem('ready', 0)
    socket.emit('ready', { room: sessionStorage.getItem('room'), ready: sessionStorage.getItem('ready') })
  }
})

socket.on('zeroPlayerReady', () => {
  const borderRegex = /^border-/
  const textRegex = /^text-/

  const textMatchedValues = String(Object.values(countdown.parentElement.classList).filter(value => textRegex.test(value)))
  const borderMatchedValues = String(Object.values(countdown.parentElement.classList).filter(value => borderRegex.test(value)))

  console.log(textMatchedValues);

  player1Status.innerText = 'not ready'
  player1Status.classList.replace('text-green', 'text-red')
  statusButton.innerText = 'Ready'
  countdown.parentElement.classList.replace(borderMatchedValues, 'border-red')
  countdown.parentElement.classList.replace(textMatchedValues, 'text-red')

  player2Status.innerText = 'not ready'
  player2Status.classList.replace('text-green', 'text-red')
  countdown.parentElement.classList.replace(borderMatchedValues, 'border-red')
  countdown.parentElement.classList.replace(textMatchedValues, 'text-red')
})

socket.on('onePlayerReady', (players) => {
  const borderRegex = /^border-/
  const textRegex = /^text-/

  const textMatchedValues = String(Object.values(countdown.parentElement.classList).filter(value => textRegex.test(value)))
  const borderMatchedValues = String(Object.values(countdown.parentElement.classList).filter(value => borderRegex.test(value)))

  console.log('one player ready');

  // 玩家1状态
  Object.keys(players).forEach(key => {
    if (Number(players[key].ready) && key === socket.id) {
      player1Status.innerText = 'ready'
      player1Status.classList.replace('text-red', 'text-green')
      statusButton.innerText = 'Cancel'
      countdown.parentElement.classList.replace(borderMatchedValues, 'border-yellow')
      countdown.parentElement.classList.replace(textMatchedValues, 'text-yellow')
    } else if (!Number(players[key].ready) && key === socket.id) {
      player1Status.innerText = 'not ready'
      player1Status.classList.replace('text-green', 'text-red')
      statusButton.innerText = 'Ready'
      countdown.parentElement.classList.replace(borderMatchedValues, 'border-yellow')
      countdown.parentElement.classList.replace(textMatchedValues, 'text-yellow')
    }

    // 玩家2状态
    if (Number(players[key].ready) && key !== socket.id) {
      player2Status.innerText = 'ready'
      player2Status.classList.replace('text-red', 'text-green')
      countdown.parentElement.classList.replace(borderMatchedValues, 'border-yellow')
      countdown.parentElement.classList.replace(textMatchedValues, 'text-yellow')
    } else if (!Number(players[key].ready) && key !== socket.id) {
      player2Status.innerText = 'not ready'
      player2Status.classList.replace('text-green', 'text-red')
      countdown.parentElement.classList.replace(borderMatchedValues, 'border-yellow')
      countdown.parentElement.classList.replace(textMatchedValues, 'text-yellow')
    }
  })
})

socket.on('twoPlayerReady', (players) => {
  const borderRegex = /^border-/
  const textRegex = /^text-/

  const textMatchedValues = String(Object.values(countdown.parentElement.classList).filter(value => textRegex.test(value)))
  const borderMatchedValues = String(Object.values(countdown.parentElement.classList).filter(value => borderRegex.test(value)))

  console.log('two player ready');

  // 玩家1状态
  Object.keys(players).forEach(key => {
    if (Number(players[key].ready) && key === socket.id) {
      player1Status.innerText = 'ready'
      player1Status.classList.replace('text-red', 'text-green')
      statusButton.innerText = 'Cancel'
      countdown.parentElement.classList.replace(borderMatchedValues, 'border-green')
      countdown.parentElement.classList.replace(textMatchedValues, 'text-green')
    } else if (!Number(players[key].ready) && key === socket.id) {
      player1Status.innerText = 'not ready'
      player1Status.classList.replace('text-green', 'text-red')
      statusButton.innerText = 'Ready'
      countdown.parentElement.classList.replace(borderMatchedValues, 'border-green')
      countdown.parentElement.classList.replace(textMatchedValues, 'text-green')
    }

    // 玩家2状态
    if (Number(players[key].ready) && key !== socket.id) {
      player2Status.innerText = 'ready'
      player2Status.classList.replace('text-red', 'text-green')
      countdown.parentElement.classList.replace(borderMatchedValues, 'border-green')
      countdown.parentElement.classList.replace(textMatchedValues, 'text-green')
    } else if (!Number(players[key].ready) && key !== socket.id) {
      player2Status.innerText = 'not ready'
      player2Status.classList.replace('text-green', 'text-red')
      countdown.parentElement.classList.replace(borderMatchedValues, 'border-green')
      countdown.parentElement.classList.replace(textMatchedValues, 'text-green')
    }
  })
})

// 用户离开的处理逻辑
socket.on('playerLeft', () => {
  player2Id.innerText = '';
  player2Status.innerText = ''
  showMessage("Player 2 left room!!")
});

// 复制房间ID
const clipboard = new Clipboard('#copy-button');

clipboard.on('success', function (e) {
  e.clearSelection();
  showMessage("Copied")
});

clipboard.on('error', function (e) {
  showMessage("Copy Error")
});

// 复制成功
function showMessage(infoText) {
  const roomInfo = document.getElementById('room-info');

  const copyInfo = document.createElement('span');

  copyInfo.classList.add('fixed', 'top-2', 'right-2', 'px-2', 'py-1', 'border', 'border-green', 'rounded', 'text-xs', 'text-green')

  copyInfo.innerText = infoText;

  roomInfo.appendChild(copyInfo)

  setTimeout(() => {
    roomInfo.removeChild(copyInfo)
  }, 1000)
}