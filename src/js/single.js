import "../../dist/style.css";
import "material-icons/iconfont/material-icons.css";

import audioUrl from "../static/audio/music.mp3";

// 添加logo
import logoImageUrl from "../static/logo/logo-frappe-inline.webp";
document.getElementById("logo-image").src = logoImageUrl;

// 添加游戏结束图片
import gameOverUrl from "../static/game-over/game-over-frappe.webp";

const Game = require("./classes/Game.js");
const Music = require("./classes/Music.js")
const Operator = require("./classes/Operator.js");

const mapCanvas = document.getElementById("map-canvas");
const previewCanvas = document.getElementById("preview-canvas");

const mapCtx = mapCanvas.getContext("2d", { alpha: false });
const previewCtx = previewCanvas.getContext("2d", { alpha: false });

const game = new Game(mapCtx, previewCtx, gameOverUrl);
const music = new Music(audioUrl)
const operator = new Operator(game, music);

let id = null;

function gameLoop() {
  if (game.gameStart) {
    game.drawMap();
    game.drawNextShape();
  }
  id = requestAnimationFrame(gameLoop);
}

gameLoop();

operator.buttomMovePiece();