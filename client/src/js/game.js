import "../../dist/style.css";
import "animate.css";
import "material-icons/iconfont/material-icons.css";

const Game = require("./classes/Game.js");
const Operator = require("./classes/Operator.js");
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

// 添加游戏失败图片
import latteGameFailImage from "../static/game-over/fail-latte.webp";
import frappeGameFailImage from "../static/game-over/fail-frappe.webp";
import macchiatoGameFailImage from "../static/game-over/fail-macchiato.webp";
import mochaGameFailImage from "../static/game-over/fail-mocha.webp";

utils.setImage("logo-image", mochaLogoImage);

const gameMode = sessionStorage.getItem("gameMode")

const mapCanvas = document.getElementById("map-canvas");
const previewCanvas = document.getElementById("preview-canvas");

const mapCtx = mapCanvas.getContext("2d", { alpha: false });
const previewCtx = previewCanvas.getContext("2d", { alpha: false });

const game = new Game(mapCtx, previewCtx, gameMode, mochaGameOverImage, mochaGameWinImage, mochaGameFailImage, audioUrl);
const operator = new Operator(game, audioUrl);

const scoreDiff = document.getElementById('score-diff')
const highestScoreContainer = document.getElementById('highest-score-container')
const roomContainer = document.getElementById('room-container')
const roomId = document.getElementById('room-id')
const statrtButton = document.getElementById('start-btn')
const restartButton = document.getElementById('restart-btn')

if (gameMode === "double") {
  statrtButton.classList.replace('flex', 'hidden')
  restartButton.classList.replace('flex', 'hidden')
  highestScoreContainer.classList.replace('flex', 'hidden')

  scoreDiff.classList.replace('hidden', 'block')
  roomContainer.classList.replace('hidden', 'flex')

  socket.emit('joinRoom', { room: sessionStorage.getItem('room'), ready: sessionStorage.getItem('ready'), action: 1 });

  // XXX: 一个玩家刷新后也会开始游戏
  socket.on('roomJoined', (players) => {
    roomId.innerText = players[socket.id].room

    socket.emit('updateScore', { room: sessionStorage.getItem('room'), score: game.score })
    game.startGame()
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
    Object.keys(players).forEach(key => {
      if (!players[socket.id].gameOver && key !== socket.id) {
        utils.showMessage('player 2 game over', 2000)
      }
    })
  })

  // 两个游戏结束
  socket.on('twoPlayerGameOver', (players) => {
    if (sessionStorage.getItem('scoreDiff') > 0) {
      game.gameOverImage = mochaGameWinImage
    } else {
      game.gameOverImage = mochaGameFailImage
    }
  })

  // socket.on('playerLeft', () => {
  //   location.href = 'ready.html'
  // })
}

operator.buttomMovePiece();