import "../../dist/style.css";
import "animate.css";
import "material-icons/iconfont/material-icons.css";

const Game = require("./classes/Game.js");
const Operator = require("./classes/Operator.js");
const utils = require("./utils.js");
const options = require("./options.js");

// 导入音频文件
import audioUrl from "../static/audio/music.mp3";

// 添加logo
import latteLogoImage from "../static/logo/logo-latte.webp";
import frappeLogoImage from "../static/logo/logo-frappe.webp";
import macchiatoLogoImage from "../static/logo/logo-macchiato.webp";
import mochaLogoImage from "../static/logo/logo-mocha.webp";

// 添加游戏结束图片
import latteGameOverImage from "../static/game-over/game-over-latte.webp";
import frappeGameOverImage from "../static/game-over/game-over-frappe.webp";
import macchiatoGameOverImage from "../static/game-over/game-over-macchiato.webp";
import mochaGameOverImage from "../static/game-over/game-over-mocha.webp";

options.palette.latte.logoImage = latteLogoImage;
options.palette.frappe.logoImage = frappeLogoImage;
options.palette.macchiato.logoImage = macchiatoLogoImage;
options.palette.mocha.logoImage = mochaLogoImage;

options.palette.latte.gameOverImage = latteGameOverImage;
options.palette.frappe.gameOverImage = frappeGameOverImage;
options.palette.macchiato.gameOverImage = macchiatoGameOverImage;
options.palette.mocha.gameOverImage = mochaGameOverImage;

utils.setImage("logo-image", mochaLogoImage);

const mapCanvas = document.getElementById("map-canvas");
const previewCanvas = document.getElementById("preview-canvas");

const mapCtx = mapCanvas.getContext("2d", { alpha: false });
const previewCtx = previewCanvas.getContext("2d", { alpha: false });

const game = new Game(mapCtx, previewCtx, mochaGameOverImage, audioUrl);
const operator = new Operator(game, audioUrl);

function gameLoop() {
  if (game.gameStart) {
    game.drawMap();
    game.drawNextShape();
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();

operator.buttomMovePiece();