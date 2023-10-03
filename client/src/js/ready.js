import "../../dist/style.css";
import 'animate.css'
import "material-icons/iconfont/material-icons.css";

const Clipboard = require('clipboard');
const utils = require("./utils/utils.js");
const socket = require("./utils/socket.js");

utils.setPagePaltte()

sessionStorage.setItem('gameMode', 'double')

const roomId = document.getElementById("room-id");

const player1Id = document.getElementById("player1-id");
const player1Status = document.getElementById("player1-status");

const player2Id = document.getElementById("player2-id");
const player2Status = document.getElementById("player2-status");

const statusButton = document.getElementById('status-btn')
const countdownContainer = document.getElementById('countdown-container')
const countdown = document.getElementById('countdown')

let countdownInterval = null;

if (!sessionStorage.getItem('room')) {
  socket.emit('createRoom');
} else {
  socket.emit('joinRoom', { action: 1, room: sessionStorage.getItem('room'), ready: 0, page: "ready" });
}

socket.on('roomCreated', (players) => {
  const playerId = socket.id

  countdown.innerText = 5

  sessionStorage.setItem('room', players[playerId].room)
  sessionStorage.setItem('ready', players[playerId].ready)
  sessionStorage.setItem('page', players[playerId].page)

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

  player1Id.innerText = playerId;
})

roomId.innerText = sessionStorage.getItem('room');

// 刷新时重新加入房间
socket.on('roomJoined', (players) => {
  const playerId = socket.id

  countdown.innerText = 5

  Object.keys(players).forEach(key => {
    if (key === playerId) {
      player1Id.innerText = key.substring(0, 16);

      if (!Number(players[key].ready)) {
        player1Status.innerText = 'not ready'
        player1Status.classList.add('text-red')
        statusButton.innerText = 'Ready'
      } else {
        socket.emit('ready', { room: sessionStorage.getItem('room'), ready: sessionStorage.getItem('ready') })
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
        socket.emit('ready', { room: sessionStorage.getItem('room'), ready: sessionStorage.getItem('ready') })
        player2Status.innerText = 'ready'
        player2Status.classList.add('text-green')
      }
    }
  });
})

// 玩家加入提醒
socket.on('playerJoined', (players) => {
  const playerId = socket.id

  Object.keys(players).forEach(key => {
    player2Id.innerText = key.substring(0, 16);

    if (Number(players[key].ready) && key !== playerId) {
      player2Status.innerText = 'ready'
      player2Status.classList.add('text-green')
    } else if (!Number(players[key].ready) && key !== playerId) {
      player2Status.innerText = 'not ready'
      player2Status.classList.add('text-red')
    }
  });

  socket.emit('ready', { room: sessionStorage.getItem('room'), ready: sessionStorage.getItem('ready') })
  utils.showMessage("Player 2 joined room!!", 'hint', 1500)
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
  player1Status.innerText = 'not ready'
  player1Status.classList.replace('text-green', 'text-red')
  statusButton.innerText = 'Ready'

  if (Object.keys(players).length > 1) {
    player2Status.innerText = 'not ready'
    player2Status.classList.replace('text-green', 'text-red')
  }

  countdownContainer.classList.replace(matchClassName().borderMatchedValues, 'border-red')
  countdownContainer.classList.replace(matchClassName().textMatchedValues, 'text-red')
})

socket.on('onePlayerReady', (players) => {
  // 玩家1状态
  Object.keys(players).forEach(key => {
    if (Number(players[key].ready) && key === socket.id) {
      player1Status.innerText = 'ready'
      player1Status.classList.replace('text-red', 'text-green')
      statusButton.innerText = 'Cancel'
    } else if (!Number(players[key].ready) && key === socket.id) {
      player1Status.innerText = 'not ready'
      player1Status.classList.replace('text-green', 'text-red')
      statusButton.innerText = 'Ready'
    }

    // 玩家2状态
    if (Number(players[key].ready) && key !== socket.id) {
      player2Status.innerText = 'ready'
      player2Status.classList.replace('text-red', 'text-green')
    } else if (!Number(players[key].ready) && key !== socket.id) {
      player2Status.innerText = 'not ready'
      player2Status.classList.replace('text-green', 'text-red')
    }
  })

  countdownContainer.classList.replace(matchClassName().borderMatchedValues, 'border-yellow')
  countdownContainer.classList.replace(matchClassName().textMatchedValues, 'text-yellow')

  // 清除倒计时
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdown.innerText = 5
  }
})

socket.on('twoPlayerReady', () => {
  // 玩家1状态
  player1Status.innerText = 'ready'
  player1Status.classList.replace('text-red', 'text-green')
  statusButton.innerText = 'Cancel'

  // 玩家2状态
  player2Status.innerText = 'ready'
  player2Status.classList.replace('text-red', 'text-green')

  countdownContainer.classList.replace(matchClassName().borderMatchedValues, 'border-green')
  countdownContainer.classList.replace(matchClassName().textMatchedValues, 'text-green')

  // 倒计时
  readyToCountdown(countdown.innerText)
})

// 用户离开的处理逻辑
socket.on('playerLeftRoom', () => {
  player2Id.innerText = '';
  player2Status.innerText = ''
  utils.showMessage("Player 2 left room!!", 'error', 1500)
});

// 复制房间ID
const clipboard = new Clipboard('#copy-button');

clipboard.on('success', (e) => {
  e.clearSelection();
  utils.showMessage("Copied", 'hint', 1500)
});

clipboard.on('error', (e) => {
  utils.showMessage("Copy Error", 'error', 1500)
});

// 倒计时
function readyToCountdown(seconds) {
  countdownInterval = setInterval(() => {
    seconds--;
    countdown.innerText = seconds;

    if (seconds <= 0) {
      clearInterval(countdownInterval);
      location.href = "game.html"
    }
  }, 1000);
}

function matchClassName() {
  const borderRegex = /^border-/
  const textRegex = /^text-/

  const textMatchedValues = String(Object.values(countdownContainer.classList).filter(value => textRegex.test(value)))
  const borderMatchedValues = String(Object.values(countdownContainer.classList).filter(value => borderRegex.test(value)))

  return {
    textMatchedValues,
    borderMatchedValues
  }
}