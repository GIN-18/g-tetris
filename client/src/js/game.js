import "../../dist/style.css";
import "material-icons/iconfont/material-icons.css";

import confetti from 'canvas-confetti';

const Game = require("./classes/Game.js");
const Operator = require("./classes/Operator.js");
const Music = require('./classes/Music.js')
const utils = require("./utils.js");
const options = require("./options.js");
const socket = require("./socket.js")

// 导入音频文件
import audioUrl from "../static/audio/music.mp3";

// 添加logo
import latteLogoImage from "../static/logo/logo-latte.webp";
import frappeLogoImage from "../static/logo/logo-frappe.webp";
import macchiatoLogoImage from "../static/logo/logo-macchiato.webp";
import mochaLogoImage from "../static/logo/logo-mocha.webp";

options.palette.latte.logoImage = latteLogoImage;
options.palette.frappe.logoImage = frappeLogoImage;
options.palette.macchiato.logoImage = macchiatoLogoImage;
options.palette.mocha.logoImage = mochaLogoImage;

// 添加游戏结束图片
import latteGameOverImage from "../static/game-over/game-over-latte.webp";
import frappeGameOverImage from "../static/game-over/game-over-frappe.webp";
import macchiatoGameOverImage from "../static/game-over/game-over-macchiato.webp";
import mochaGameOverImage from "../static/game-over/game-over-mocha.webp";

options.palette.latte.gameOverImage = latteGameOverImage;
options.palette.frappe.gameOverImage = frappeGameOverImage;
options.palette.macchiato.gameOverImage = macchiatoGameOverImage;
options.palette.mocha.gameOverImage = mochaGameOverImage;

// 添加游戏胜利图片
import latteGameWinImage from "../static/game-over/win-latte.webp";
import frappeGameWinImage from "../static/game-over/win-frappe.webp";
import macchiatoGameWinImage from "../static/game-over/win-macchiato.webp";
import mochaGameWinImage from "../static/game-over/win-mocha.webp";

options.palette.latte.winImage = latteGameWinImage;
options.palette.frappe.winImage = frappeGameWinImage;
options.palette.macchiato.winImage = macchiatoGameWinImage;
options.palette.mocha.winImage = mochaGameWinImage;

// 添加游戏失败图片
import latteGameFailImage from "../static/game-over/fail-latte.webp";
import frappeGameFailImage from "../static/game-over/fail-frappe.webp";
import macchiatoGameFailImage from "../static/game-over/fail-macchiato.webp";
import mochaGameFailImage from "../static/game-over/fail-mocha.webp";

options.palette.latte.failImage = latteGameFailImage;
options.palette.frappe.failImage = frappeGameFailImage;
options.palette.macchiato.failImage = macchiatoGameFailImage;
options.palette.mocha.failImage = mochaGameFailImage;

utils.setImage("logo-image", mochaLogoImage);

// 设置flavor
const bodyElement = document.body;
const flavor = bodyElement.classList[0];
sessionStorage.setItem('flavor', flavor)

const gameMode = sessionStorage.getItem("gameMode")

const mapCanvas = document.getElementById("map-canvas");
const previewCanvas = document.getElementById("preview-canvas");

const mapCtx = mapCanvas.getContext("2d", { alpha: false });
const previewCtx = previewCanvas.getContext("2d", { alpha: false });

const shapeColor = options.palette[flavor].shapeColor;

const music = new Music(audioUrl)
const game = new Game(mapCtx, previewCtx, shapeColor, gameMode, mochaGameOverImage, music);
const operator = new Operator(game, music);

let playerLeftTimer = null

if (gameMode === "double") {
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

operator.buttomMovePiece();

function playConfetti() {
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
};