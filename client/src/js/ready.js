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

let countdownInterval = null;

if (!sessionStorage.getItem('room')) {
  socket.emit('createRoom');
} else {
  socket.emit('joinRoom', { room: sessionStorage.getItem('room'), ready: sessionStorage.getItem('ready'), action: 1, gameOver: sessionStorage.getItem('gameOver') });
}

socket.on('roomCreated', (players) => {
  countdown.innerText = 5

  sessionStorage.setItem('room', players[socket.id].room); // 把房间ID存在sessionStorage中
  sessionStorage.setItem('ready', players[socket.id].ready); // 把角色存在sessionStorage中
  sessionStorage.setItem('gameOver', players[socket.id].gameOver); // 把角色存在sessionStorage中

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

    utils.showMessage("Player 2 joined room!!", 1000)
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

socket.on('zeroPlayerReady', (players) => {
  const borderRegex = /^border-/
  const textRegex = /^text-/

  const textMatchedValues = String(Object.values(countdown.parentElement.classList).filter(value => textRegex.test(value)))
  const borderMatchedValues = String(Object.values(countdown.parentElement.classList).filter(value => borderRegex.test(value)))

  player1Status.innerText = 'not ready'
  player1Status.classList.replace('text-green', 'text-red')
  statusButton.innerText = 'Ready'
  countdown.parentElement.classList.replace(borderMatchedValues, 'border-red')
  countdown.parentElement.classList.replace(textMatchedValues, 'text-red')

  if (Object.keys(players).length > 1) {
    player2Status.innerText = 'not ready'
    player2Status.classList.replace('text-green', 'text-red')
    countdown.parentElement.classList.replace(borderMatchedValues, 'border-red')
    countdown.parentElement.classList.replace(textMatchedValues, 'text-red')
  }
})

socket.on('onePlayerReady', (players) => {
  const borderRegex = /^border-/
  const textRegex = /^text-/

  const textMatchedValues = String(Object.values(countdown.parentElement.classList).filter(value => textRegex.test(value)))
  const borderMatchedValues = String(Object.values(countdown.parentElement.classList).filter(value => borderRegex.test(value)))

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

  // 清除倒计时
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdown.innerText = 5
  }
})

socket.on('twoPlayerReady', (players) => {
  const borderRegex = /^border-/
  const textRegex = /^text-/

  const textMatchedValues = String(Object.values(countdown.parentElement.classList).filter(value => textRegex.test(value)))
  const borderMatchedValues = String(Object.values(countdown.parentElement.classList).filter(value => borderRegex.test(value)))

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

  // 倒计时
  readyToCountdown(countdown.innerText)
})

// 用户离开的处理逻辑
socket.on('playerLeft', () => {
  player2Id.innerText = '';
  player2Status.innerText = ''
  utils.showMessage("Player 2 left room!!", 1000)
});

// 复制房间ID
const clipboard = new Clipboard('#copy-button');

clipboard.on('success', function (e) {
  e.clearSelection();
  utils.showMessage("Copied", 1000)
});

clipboard.on('error', function (e) {
  utils.showMessage("Copy Error", 1000)
});

function readyToCountdown(seconds) {
  countdownInterval = setInterval(() => {
    seconds--;
    countdown.innerText = seconds;

    if (seconds < 0) {
      clearInterval(countdownInterval);
      location.href = "game.html"
      countdown.innerText = 5
    }
  }, 1000);
}