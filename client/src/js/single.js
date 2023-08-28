import "../../dist/style.css";
import "animate.css"
import "material-icons/iconfont/material-icons.css";

const Game = require("./classes/Game.js");
const Music = require("./classes/Music.js");
const Operator = require("./classes/Operator.js");
const utils = require("./utils.js");

// 导入音频文件
import audioUrl from "../static/audio/music.mp3";

// 添加logo
import latteLogoImage from "../static/logo/logo-latte.webp";
import frappeLogoImage from "../static/logo/logo-frappe.webp";
import macchiatoLogoImage from "../static/logo/logo-macchiato.webp";
import mochaLogoImage from "../static/logo/logo-mocha.webp";

// 添加游戏结束图片
import latteGameOverImage from "../static/logo/logo-latte.webp";
import frappeGameOverImage from "../static/logo/logo-frappe.webp";
import macchiatoGameOverImage from "../static/logo/logo-macchiato.webp";
import mochaGameOverImage from "../static/logo/logo-mocha.webp";

utils.setImage("logo-image", mochaLogoImage);

const mapCanvas = document.getElementById("map-canvas");
const previewCanvas = document.getElementById("preview-canvas");

const mapCtx = mapCanvas.getContext("2d", { alpha: false });
const previewCtx = previewCanvas.getContext("2d", { alpha: false });

const music = new Music(audioUrl);
const game = new Game(mapCtx, previewCtx, frappeGameOverImage, music);
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
