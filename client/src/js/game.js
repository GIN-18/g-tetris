import "../../dist/style.css";
import 'animate.css'
import "material-icons/iconfont/material-icons.css";

import confetti from "canvas-confetti";

const Game = require("./classes/Game.js");
const utils = require("./utils/utils.js");
const options = require("./utils/options.js");
const socket = require("./utils/socket.js")

const mapCanvas = document.getElementById("map-canvas");
const previewCanvas = document.getElementById("preview-canvas");

const mapCtx = mapCanvas.getContext("2d", { alpha: false });
const previewCtx = previewCanvas.getContext("2d", { alpha: false });

const game = new Game(mapCtx, previewCtx);

let playerLeftTimer = null

utils.setPagePaltte()
game.setGamePalette()
utils.highlightCurrentOption('.menu-item', 'flavor')

if (sessionStorage.getItem('gameMode') === "double") {
  const scoreDiff = document.getElementById('score-diff')
  const roomId = document.getElementById('room-id')

  utils.setClassName('replace', 'flex', 'hidden', 'highest-score-container', 'start-btn', 'restart-btn') // 隐藏最高分、开始按钮和重新开始按钮
  utils.setClassName('replace', 'hidden', 'flex', 'score-diff', 'room-container') // 显示分数差和房间信息

  socket.emit('joinRoom', { action: 1, room: sessionStorage.getItem('room'), ready: 0, page: 'game' });

  socket.on('roomJoined', (players) => {
    const playerId = socket.id

    roomId.innerText = players[playerId].room
    sessionStorage.setItem('ready', players[playerId].ready)
    sessionStorage.setItem('page', players[playerId].page)

    if (playerLeftTimer) {
      clearTimeout(playerLeftTimer)
    }

    socket.emit('startGame', { room: sessionStorage.getItem('room'), gameStart: 1 })
  })

  socket.on('oneStartGame', (players) => {
    const allInGame = Object.values(players).every(player => player.page === 'game')

    if (!allInGame && Object.keys(players).length > 1) location.href = 'ready.html'
  })

  socket.on('twoStartGame', () => {
    setTimeout(() => {
      socket.emit('updateScore', { room: sessionStorage.getItem('room'), score: game.score })
      game.startGame()
    }, 100)
  })

  socket.on('updateScore', (players) => {
    let player1Key = null
    let player2Key = null

    Object.keys(players).forEach(key => {
      try {
        if (key === socket.id) player1Key = key
        if (key !== socket.id) player2Key = key

        const different = players[player1Key].score - players[player2Key].score

        sessionStorage.setItem('scoreDiff', different)

        if (!different) {
          scoreDiff.innerText = '0'
          utils.setClassName('replace', 'text-red', 'text-green', 'score-diff')
        } else if (different > 0) {
          scoreDiff.innerText = '+' + different
          utils.setClassName('replace', 'text-red', 'text-green', 'score-diff')
        } else {
          scoreDiff.innerText = different
          utils.setClassName('replace', 'text-green', 'text-red', 'score-diff')
        }
      } catch (error) { }
    })
  })

  // 一个玩家游戏结束提示这个玩家游戏结束
  socket.on('onePlayerGameOver', (players) => {
    const flavor = sessionStorage.getItem('flavor')

    Object.keys(players).forEach(key => {
      if (players[socket.id].gameOver && key === socket.id) {
        utils.setImage('game-over-image', options.palette[flavor].gameOverImage)
        utils.setClassName('add', 'hidden', null, 'again-btn', 'quit-btn')
        utils.setClassName('replace', 'my-6', 'mt-6', 'score-container')
      } else if (!players[socket.id].gameOver && key !== socket.id) {
        utils.showMessage('player 2 game over', 'hint', 5000)
      }
    })
  })

  // 两个玩家游戏结束
  socket.on('twoPlayerGameOver', () => {
    const flavor = sessionStorage.getItem('flavor')

    if (sessionStorage.getItem('scoreDiff') > 0) {
      utils.setImage('game-over-image', options.palette[flavor].winImage)
      utils.setClassName('remove', null, 'hidden', 'again-btn', 'quit-btn')
      utils.setClassName('replace', 'mt-6', 'my-6', 'score-container')
      playConfetti()
    } else {
      utils.setImage('game-over-image', options.palette[flavor].failImage)
      utils.setClassName('remove', null, 'hidden', 'again-btn', 'quit-btn')
      utils.setClassName('replace', 'mt-6', 'my-6', 'score-container')
    }

    document.getElementById('again-btn').addEventListener('touchstart', () => {
      socket.emit('again', { room: sessionStorage.getItem('room'), again: 1 })
    })
  })

  socket.on('onePlayerAgain', () => {
    const againLabel = document.getElementById('again-label'),
      againInfo = document.getElementById('again-info')

    againLabel.innerText = 'AGAIN: '
    utils.setClassName('add', 'text-red', null, 'again-info')
    againInfo.innerText = '1 / 2'
  })

  socket.on('twoPlayerAgain', () => {
    const againLabel = document.getElementById('again-label'),
      againInfo = document.getElementById('again-info')

    againLabel.innerText = 'AGAIN: '
    utils.setClassName('replace', 'text-red', 'text-green', 'again-info')
    againInfo.innerText = '2 / 2'

    setTimeout(() => {
      location.reload()
    }, 100)
  })

  socket.on('playerLeftGame', () => {
    playerLeftTimer = setTimeout(() => {
      location.href = 'ready.html'
    }, 300)
  })
}

// 放礼花
function playConfetti() {
  const flavor = sessionStorage.getItem('flavor');
  const colors = options.palette[flavor].shapeColor;

  confetti({
    particleCount: 60,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: colors
  });
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: colors
  });
}