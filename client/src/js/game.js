import "../css/style.css";
import "animate.css";
import "material-icons/iconfont/material-icons.css";

import confetti from "canvas-confetti";

const $ = require("jquery");
const _ = require("lodash");
const Game = require("./classes/Game.js");
const utils = require("./utils/utils.js");
const options = require("./utils/options.js");
const socket = require("./utils/socket.js");

const mapCanvas = document.getElementById("map-canvas");
const previewCanvas = document.getElementById("preview-canvas");

const mapCtx = mapCanvas.getContext("2d", { alpha: false });
const previewCtx = previewCanvas.getContext("2d", { alpha: false });

const game = new Game(mapCtx, previewCtx);

let playerLeftTimer = null;

utils.preventZoom();
utils.setPagePaltte();
utils.highlightCurrentOption(".menu-item", "flavor");

if (sessionStorage.getItem("gameMode") === "double") {
  const scoreDiff = $("#score-diff");

  $("#highest-score-container, #start-btn, #restart-btn")
    .removeClass("flex")
    .addClass("hidden");
  $("#score-diff, #room-container").removeClass("hidden").addClass("flex");

  socket.emit("joinRoom", {
    action: 1,
    room: sessionStorage.getItem("room"),
    ready: 0,
    page: "game",
  });

  socket.on("roomJoined", (players) => {
    const playerId = socket.id;

    $("#room-id").text(players[playerId].room);
    sessionStorage.setItem("ready", players[playerId].ready);
    sessionStorage.setItem("page", players[playerId].page);

    if (playerLeftTimer) {
      clearTimeout(playerLeftTimer);
    }

    socket.emit("startGame", {
      room: sessionStorage.getItem("room"),
      gameStart: 1,
    });
  });

  socket.on("oneStartGame", (players) => {
    const allInGame = Object.values(players).every(
      (player) => player.page === "game"
    );

    if (!allInGame && _.size(players) > 1) location.href = "ready.html";
  });

  socket.on("twoStartGame", () => {
    setTimeout(() => {
      socket.emit("updateScore", {
        room: sessionStorage.getItem("room"),
        score: game.score,
      });
      game.startGame();
    }, 100);
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
    const flavor = sessionStorage.getItem("flavor");

    Object.keys(players).forEach((player) => {
      if (players[playerId].gameOver && player === playerId) {
        $("#game-over-image").attr(
          "src",
          options.palette[flavor].gameOverImage
        );
        $("#again-btn, #quit-btn").addClass("hidden");
        $("#score-container").removeClass("my-6").addClass("mt-6");
      } else if (!players[playerId].gameOver && player !== playerId) {
        utils.showMessage("player 2 game over", "hint", 5000);
      }
    });
  });

  // 两个玩家游戏结束
  socket.on("twoPlayerGameOver", () => {
    const flavor = sessionStorage.getItem("flavor");

    if (sessionStorage.getItem("scoreDiff") > 0) {
      $("#game-over-image").attr("src", options.palette[flavor].winImage);
      $("#again-btn, #quit-btn").removeClass("hidden");
      $("#score-container").removeClass("mt-6").addClass("my-6");
      playConfetti();
    } else {
      $("#game-over-image").attr("src", options.palette[flavor].failImage);
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

  // 玩家离开游戏界面
  socket.on("playerLeftGame", () => {
    playerLeftTimer = setTimeout(() => {
      location.href = "ready.html";
    }, 300);
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
