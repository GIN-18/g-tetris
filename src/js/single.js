import "../../dist/style.css";
import "material-icons/iconfont/material-icons.css";

// 导入音频文件
import audioUrl from "../static/audio/music.mp3";
// 添加logo
import logoImageUrl from "../static/logo/logo-frappe-inline.webp";
// 添加游戏结束图片
import gameOverUrl from "../static/game-over/game-over-frappe.webp";

document.getElementById("logo-image").src = logoImageUrl;

const Game = require("./classes/Game.js");
const Music = require("./classes/Music.js")
const Operator = require("./classes/Operator.js");

const mapCanvas = document.getElementById("map-canvas");
const previewCanvas = document.getElementById("preview-canvas");

const mapCtx = mapCanvas.getContext("2d", { alpha: false });
const previewCtx = previewCanvas.getContext("2d", { alpha: false });

const music = new Music(audioUrl)
const game = new Game(mapCtx, previewCtx, gameOverUrl, music);
const operator = new Operator(game, music);

function gameLoop() {
  if (game.gameStart) {
    game.drawMap();
    game.drawNextShape();
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();

operator.buttomMovePiece();