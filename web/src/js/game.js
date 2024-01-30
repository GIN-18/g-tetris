import '../css/style.css';
import 'animate.css';
import 'material-icons/iconfont/material-icons.css';

import confetti from 'canvas-confetti';

const $ = require('jquery');
const _ = require('lodash');
const Game = require('./classes/Game.js');
const Clipboard = require('clipboard')
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

// 单人模式移除分隔层和准备层
if (!sessionStorage.getItem('gameMode')) {
  $('#sparator').removeClass('block').addClass('hidden');
  $('#ready-container').removeClass('flex').addClass('hidden');
}

// 双人模式
if (sessionStorage.getItem('gameMode') === 'double') {
  // 隐藏最高分，开始按钮，重新开始按钮
  $('#highest-score-container, #start-btn, #restart-btn').remove()
  // 显示得分差，房间容器
  $('#score-diff, #room-container').removeClass('hidden').addClass('flex');

  $('#sparator').removeClass('hidden').addClass('block');
  $('#ready-container').removeClass('hidden').addClass('flex');

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

    // 刷新进入房间发送一个准备的请求
    socket.emit('ready', {
      room: sessionStorage.getItem('room'),
      ready: sessionStorage.getItem('ready')
    })
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
    utils.showMessage('Player 2 joined', 'success', 2000)
  });

  // 游戏准备
  $('#ready').on('touchstart', () => {
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

  // 退出按钮
  $('#quit').on('touchstart', () => {
    location.href = './index.html';
  })

  // 复制房间号
  const clipboard = new Clipboard('#room-container');
  // 复制成功触发
  clipboard.on("success", (e) => {
    e.clearSelection();
    utils.showMessage("Copied", "success", 1500);
  });
  // 复制失败触发
  clipboard.on("error", (e) => {
    utils.showMessage("Copy Error", "error", 1500);
  });

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
    // 发送开始游戏请求
    socket.emit('startGame', {
      room: sessionStorage.getItem('room'),
      gameStart: 1,
    })
  })

  socket.on('twoStartGame', () => {
    $('#sparator').removeClass('block').addClass('hidden'); // 隐藏分隔层
    $('#ready-container').removeClass('flex').addClass('hidden'); // 隐藏准备层

    // 更新分数
    socket.emit('updateScore', {
      room: sessionStorage.getItem('room'),
      score: game.score,
    });

    // 开始游戏
    game.gamePlay = true;
    game.startGame();
    game.setDropTimer();
  });

  socket.on("updateScore", (players) => {
    const scoreArray = [];

    for (let player in players) {
      if (player === socket.id) {
        scoreArray[0] = players[player].score; // 本人玩家的分数存在数组的首位
      } else {
        scoreArray[1] = players[player].score; // 玩家2的分数存在数组的第二位
      }
    }

    const scoreDiff = scoreArray[0] - scoreArray[1]; // 获取分数差

    sessionStorage.setItem("scoreDiff", scoreDiff);

    if (!scoreDiff) {
      $('#score-diff')
        .text(0)
        .removeClass("text-red")
        .addClass("text-green");
    } else if (scoreDiff > 0) {
      $('#score-diff')
        .text(`+${scoreDiff}`)
        .removeClass("text-red")
        .addClass("text-green");
    } else {
      $('#score-diff')
        .text(scoreDiff)
        .removeClass("text-green")
        .addClass("text-red");
    }
  });

  // 一个玩家游戏结束提示这个玩家游戏结束
  socket.on('onePlayerGameOver', (players) => {
    const gameOver = players[socket.id].gameOver;

    if (gameOver) {
      $('#game-over-title').text('GAME OVER');
    } else {
      utils.showMessage('player 2 game over', 'hint', 5000);
    }
  });

  // 两个玩家游戏结束
  socket.on('twoPlayerGameOver', () => {
    if (sessionStorage.getItem("scoreDiff") > 0) {
      $("#game-over-title").text("VICTORY");
      playConfetti();
    } else {
      $("#game-over-title").text("TRY AGAIN");
    }

    $("#score-container").removeClass("mt-6").addClass("my-6");

    $("#again-btn").on("touchstart", () => {
      socket.emit("again", {
        room: sessionStorage.getItem("room"),
        again: 1,
      });
    });

    $('#quit-btn').on('touchstart', (e) => {
      e.preventDefault();
      location.href = '../../index.html';
    });
  });

  // 一个玩家再来一次
  socket.on("onePlayerAgain", () => {
    $('#again-info').text('1 / 2').addClass('text-yellow');
  });

  // 两个玩家再来一次
  socket.on('twoPlayerAgain', () => {
    $('#again-info').text('2 / 2').removeClass('text-yellow').addClass('text-green');
    location.reload();
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
    $('#ready-status').text('ready').removeClass('text-red').addClass('text-green');
    $('#ready').text('Cancel');
  } else {
    $('#ready-status').text('not ready').removeClass('text-green').addClass('text-red');
    $('#ready').text('Ready');
  }
}