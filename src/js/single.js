import "../../dist/style.css";
import "material-icons/iconfont/material-icons.css";

// 添加logo
import logoImageUrl from "../static/logo/logo-frappe-inline.webp";

// 添加游戏结束图片
import gameOverUrl from "../static/game-over/game-over-frappe.webp"

document.getElementById("logo-image").src = logoImageUrl;
// document.getElementById("game-over-image").src = gameOverUrl;

const Game = require("./Game.js");

const game = new Game(gameOverUrl);

const mapCanvas = document.getElementById("map-canvas");
const previewCanvas = document.getElementById("preview-canvas");

const mapCtx = mapCanvas.getContext("2d", { alpha: false });
const previewCtx = previewCanvas.getContext("2d", { alpha: false });

// 初始化地图颜色
mapCtx.fillStyle = "#303446";
mapCtx.fillRect(0, 0, 200, 400);

// 初始化预览框颜色
previewCtx.fillStyle = "#232634";
previewCtx.fillRect(0, 0, 82, 42);

const stopIcon = `<span class="material-icons-round !text-sm !leading-3">pause</span>`;
const startIcon = `<span class="material-icons-round !text-sm !leading-3">play_arrow</span>`;

const volumeOff = `<span class="material-icons-round !text-sm !leading-3">volume_off</span>`;
const volumeUp = `<span class="material-icons-round !text-sm !leading-3">volume_up</span>`;

let id = null;

function gameLoop() {
  if (game.gameStart) {
    game.drawMap(mapCtx);
    game.drawNextShape(previewCtx);
  }
  id = requestAnimationFrame(gameLoop);
}

document.getElementById("start-btn").addEventListener("touchend", (e) => {
  e.preventDefault();
  if (!game.gameStart) {
    game.gameStart = true;
    changeIcon("start-btn", game.gameStart, stopIcon, startIcon);
    game.startGame();
    gameLoop();
    return;
  }

  if (!game.gameOver) gameLoop();

  if (id) {
    cancelAnimationFrame(id);
    game.gamePaused = !game.gamePaused;
    changeIcon("start-btn", !game.gamePaused, stopIcon, startIcon);
    game.setDropTimer();
    id = null;
  }
});

document.getElementById("volume-btn").addEventListener("touchstart", (e) => {
  e.preventDefault();
  game.volumeUp = !game.volumeUp;
  changeIcon("volume-btn", game.volumeUp, volumeUp, volumeOff);
});

document.getElementById("restart-btn").addEventListener("touchstart", (e) => {
  e.preventDefault();
  location.reload();
});

document.getElementById("rotate-btn").addEventListener("touchstart", (e) => {
  e.preventDefault();
  game.rotateShape(1);
});

document.getElementById("drop-btn").addEventListener("touchstart", (e) => {
  e.preventDefault();
  game.dropShape();
});
document.getElementById("left-btn").addEventListener("touchstart", (e) => {
  e.preventDefault();
  game.moveLeft();
});
document.getElementById("right-btn").addEventListener("touchstart", (e) => {
  e.preventDefault();
  game.moveRight();
});
document.getElementById("down-btn").addEventListener("touchstart", (e) => {
  e.preventDefault();
  game.moveDown(true);
});

document.getElementById("down-btn").addEventListener("touchend", (e) => {
  e.preventDefault();
  game.moveDown(false);
});

document.body.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "KeyS":
      if (!game.gameStart) {
        game.startGame();
        game.gameStart = true;
      }
      break;
    case "KeyP":
      if (id) {
        cancelAnimationFrame(id);
        game.gamePaused = !game.gamePaused;
        game.setDropTimer();
        id = null;
      }
      gameLoop();
      break;
    case "KeyK":
      game.rotateShape(1);
      break;
    case "KeyH":
      game.moveLeft();
      break;
    case "KeyL":
      game.moveRight();
      break;
    case "KeyJ":
      game.moveDown(true);
      break;
    case "Space":
      game.dropShape();
      break;
  }
});

document.body.addEventListener("keyup", (e) => {
  switch (e.code) {
    case "KeyJ":
      game.moveDown(false);
      break;
  }
});

// changeIcon("start-btn", true, trueIcon, falseIcon);

function changeIcon(elementId, status, trueIcon, falseIcon) {
  const parentElement = document.getElementById(elementId);
  if (status) {
    parentElement.innerHTML = trueIcon;
  } else {
    parentElement.innerHTML = falseIcon;
  }
}
