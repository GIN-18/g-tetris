import "animate.css";
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

const gameMode = sessionStorage.getItem("gameMode")

const mapCanvas = document.getElementById("map-canvas");
const previewCanvas = document.getElementById("preview-canvas");

const mapCtx = mapCanvas.getContext("2d", { alpha: false });
const previewCtx = previewCanvas.getContext("2d", { alpha: false });

const music = new Music(audioUrl)
const game = new Game(mapCtx, previewCtx, gameMode, mochaGameOverImage, music);
const operator = new Operator(game, music);

// 设置flavor
const bodyElement = document.body;
const flavor = bodyElement.classList[0];
sessionStorage.setItem('flavor', flavor)

if (gameMode === "double") {

  const scoreDiff = document.getElementById('score-diff')
  const roomId = document.getElementById('room-id')

  utils.setClassName('replace', 'flex', 'hidden', 'highest-score-container', 'start-btn', 'restart-btn')
  utils.setClassName('replace', 'hidden', 'flex', 'score-diff', 'room-container')

  socket.emit('joinRoom', { room: sessionStorage.getItem('room'), ready: sessionStorage.getItem('ready'), action: 1, page: 'game' });

  // XXX: 一个玩家刷新后也会开始游戏
  socket.on('roomJoined', (players) => {
    const playerId = socket.id
    const allInGame = Object.values(players).every((player) => player.page === 'game')

    sessionStorage.setItem('page', players[playerId].page)
    roomId.innerText = players[playerId].room

    if (allInGame) {
      socket.emit('startGame', sessionStorage.getItem('room'))
    } else {
      location.href = 'ready.html'
    }
  })

  socket.on('gameStart', () => {
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
          scoreDiff.classList.replace('text-red', 'text-green')
        } else if (different > 0) {
          scoreDiff.innerText = '+' + different
          scoreDiff.classList.replace('text-red', 'text-green')
        } else {
          scoreDiff.innerText = different
          scoreDiff.classList.replace('text-green', 'text-red')
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

  // 两个游戏结束
  socket.on('twoPlayerGameOver', () => {
    const againButton = document.getElementById('again-btn')
    const flavor = sessionStorage.getItem('flavor')

    if (sessionStorage.getItem('scoreDiff') > 0) {
      utils.setImage('game-over-image', options.palette[flavor].winImage)
      playConfetti()
    } else {
      utils.setImage('game-over-image', options.palette[flavor].failImage)
      utils.setClassName('remove', null, 'hidden', 'again-btn', 'quit-btn')
      utils.setClassName('replace', 'mt-6', 'my-6', 'score-container')
    }
  })

  socket.on('playerLeft', () => {
    setTimeout(() => {
      location.href = 'ready.html'
    }, 100)
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

// function tick() {
//   const start = Date.now();
//   const remain = Math.max(0, start + 60 - Date.now())
//   const s = game.shape.xOffset
//   const e = game.shape.xOffset + game.blockSize
//   console.log(s, e);
// }