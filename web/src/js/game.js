import '../css/style.css';
import 'animate.css';
import 'material-icons/iconfont/material-icons.css';

import confetti from 'canvas-confetti';

const $ = require('jquery');
const _ = require('lodash');
const Game = require('./classes/Game.js');
const utils = require('./utils/utils.js');
const options = require('./utils/options.js');
const socket = require('./utils/socket.js');

const mapCanvas = document.getElementById('map-canvas');
const nextShapeCanvas = document.getElementById('next-shape-canvas');

const mapCtx = mapCanvas.getContext('2d');
const nextShapeCtx = nextShapeCanvas.getContext('2d');

const game = new Game(mapCtx, nextShapeCtx);

utils.preventZoom();
utils.setPagePaltte();
utils.highlightCurrentOption('.menu-item', 'flavor');

// 双人模式
if (sessionStorage.getItem('gameMode') === 'double') {
  const scoreDiff = $('#score-diff');

  // 隐藏最高分，开始按钮，重新开始按钮
  $('#highest-score-container, #start-btn, #restart-btn').remove()
  // 显示得分差，房间容器
  $('#score-diff, #room-container').removeClass('hidden').addClass('flex');

  setInfoByReady();

  if (!sessionStorage.getItem('room')) {
    // 第一次进入时，创建房间
    socket.emit('createRoom');
  } else {
    // 刷新进入时，加入房间
    socket.emit('joinRoom', {
      action: 1,
      room: sessionStorage.getItem('room'),
      ready: sessionStorage.getItem('ready'),
      score: 0,
    });
  }

  // 房间创建成功
  socket.on('roomCreated', (players) => {
    const room = players[socket.id].room;

    sessionStorage.setItem('room', room)

    $('#room, #room-id').text(room)
    $('#players').text(`${_.size(players)} / 2`)
  })

  // 加入房间成功
  socket.on('roomJoined', (players) => {
    $('#room, #room-id').text(players[socket.id].room);
    $('#players').text(`${_.size(players)} / 2`);

    sessionStorage.setItem("ready", players[socket.id].ready);
  });

  // 玩家2加入房间成功
  socket.on('playerJoined', (players) => {
    $('#players').text(`${_.size(players)} / 2`)
    utils.showMessage('Player 2 joined', 'success', 1000)
  });

  // 游戏准备
  $('#ready-btn').on('click', () => {
    const ready = Number(sessionStorage.getItem('ready'));

    if (ready) {
      sessionStorage.setItem('ready', 0);
    } else {
      sessionStorage.setItem('ready', 1);
    }

    setInfoByReady()

    socket.emit('ready', {
      room: sessionStorage.getItem('room'),
      ready: sessionStorage.getItem('ready'),
    });
  })

  // 一位玩家已准备
  socket.on('onePlayerReady', (players) => {
    const ready = Number(players[socket.id].ready);

    if (ready) {
      utils.showMessage('Player 2 not ready', 'error', 2000);
    } else {
      utils.showMessage('Player 2 ready', 'success', 2000);
    }
  })

  // 两位玩家已准备
  socket.on('twoPlayerReady', () => {
    socket.emit('startGame', {
      room: sessionStorage.getItem('room'),
      gameStart: 1,
    })
  })

  socket.on('twoStartGame', () => {
    $('#partition').hide()
    $('#ready-container').removeClass('flex').addClass('hidden')

    socket.emit('updateScore', {
      room: sessionStorage.getItem('room'),
      score: game.score,
    });

    game.gamePlay = true;
    game.startGame();
    game.setDropTimer();
  });

  socket.on("updateScore", (players) => {
    const playerId = socket.id;
    let player1Key = null;
    let player2Key = null;

    Object.keys(players).forEach((key) => {
      try {
        if (key === playerId) player1Key = key;
        if (key !== playerId) player2Key = key;

        const different = players[player1Key].score - players[player2Key].score;

        sessionStorage.setItem("scoreDiff", different);

        if (!different) {
          scoreDiff.text(0);
          $("#score-diff").removeClass("text-red").addClass("text-green");
        } else if (different > 0) {
          scoreDiff.text(`+${different}`);
          $("#score-diff").removeClass("text-red").addClass("text-green");
        } else {
          scoreDiff.text(different);
          $("#score-diff").removeClass("text-green").addClass("text-red");
        }
      } catch (error) { }
    });
  });

  // 一个玩家游戏结束提示这个玩家游戏结束
  socket.on("onePlayerGameOver", (players) => {
    const playerId = socket.id;

    Object.keys(players).forEach((player) => {
      if (players[playerId].gameOver && player === playerId) {
        $("#game-over-title").text("GAME OVER");
        $("#again-btn, #quit-btn").addClass("hidden");
        $("#score-container").removeClass("my-6").addClass("mt-6");
      } else if (!players[playerId].gameOver && player !== playerId) {
        utils.showMessage("player 2 game over", "hint", 5000);
      }
    });
  });

  // 两个玩家游戏结束
  socket.on("twoPlayerGameOver", () => {
    if (sessionStorage.getItem("scoreDiff") > 0) {
      $("#game-over-title").text("VICTORY");
      $("#again-btn, #quit-btn").removeClass("hidden");
      $("#score-container").removeClass("mt-6").addClass("my-6");
      playConfetti();
    } else {
      $("#game-over-title").text("TRY AGAIN");
      $("#again-btn, #quit-btn").removeClass("hidden");
      $("#score-container").removeClass("mt-6").addClass("my-6");
    }

    $("#again-btn").on("touchstart", () => {
      socket.emit("again", { room: sessionStorage.getItem("room"), again: 1 });
    });
  });

  // 一个玩家再来一次
  socket.on("onePlayerAgain", () => {
    $('#again-label').text('AGAIN: ');
    $('#again-info').text('1 / 2').addClass('text-red');
  });

  // 两个玩家再来一次
  socket.on("twoPlayerAgain", () => {
    $('#again-label').text('AGAIN: ');
    $('#again-info').text('2 / 2').removeClass('text-red').addClass('text-green');

    setTimeout(() => {
      location.reload();
    }, 100);
  });
}

// 放礼花
function playConfetti() {
  const flavor = sessionStorage.getItem("flavor");
  const colors = options.palette[flavor].shapeColor;

  confetti({
    particleCount: 60,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: colors,
  });
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: colors,
  });
}

function setInfoByReady() {
  const ready = Number(sessionStorage.getItem('ready'));

  if (ready) {
    $('#ready').text('ready');
    $('#ready-btn').text('Cancel');
  } else {
    $('#ready').text('not ready');
    $('#ready-btn').text('Ready');
  }
}