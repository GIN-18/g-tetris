import "../../dist/style.css";
import "material-icons/iconfont/material-icons.css";

// 添加logo
import logoImageUrl from "../static/logo/logo-frappe-inline.webp";

// 添加游戏结束图片
import gameOverUrl from "../static/game-over/game-over-frappe.webp";

document.getElementById("logo-image").src = logoImageUrl;
// document.getElementById("game-over-image").src = gameOverUrl;

const Game = require("./Game.js");
const Operator = require("./Operator.js");

const mapCanvas = document.getElementById("map-canvas");
const previewCanvas = document.getElementById("preview-canvas");

const mapCtx = mapCanvas.getContext("2d", { alpha: false });
const previewCtx = previewCanvas.getContext("2d", { alpha: false });

const game = new Game(mapCtx, previewCtx);
const operator = new Operator(game);

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
