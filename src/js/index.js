import "../../dist/style.css";
import "material-icons/iconfont/material-icons.css";

// 添加logo
import imageUrl from "../static/logo/logo-frappe-inline.webp";

document.getElementById("logo-image").src = imageUrl;

const Game = require("./Game.js");

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

const game = new Game();

gameLoop();

function gameLoop() {
  if (game.gameStart) {
    drawMap();
    drawNextShape();
  }
  requestAnimationFrame(gameLoop);
}

function drawMap() {
  let piece = game.generatePiece();

  // 清空画布
  mapCtx.fillStyle = "#303446";
  mapCtx.fillRect(0, 0, 200, 400);

  // 绘制地图中的方块
  for (let i = 0; i < game.map.length; i++) {
    for (let j = 0; j < game.map[i].length; j++) {

      if (game.map[i][j]) {
        mapCtx.fillStyle = game.setShapeColor(game.map[i][j]);
        mapCtx.fillRect(j * 20, i * 20, 20, 20);
      }
    }
  }

  // 绘制方块
  mapCtx.fillStyle = game.setShapeColor(game.shape.type + 1);
  for (let i = 0, length = piece.length; i < length; i++) {
    let x = piece[i][1] + game.shape.xOffset;
    let y = piece[i][0] + game.shape.yOffset;

    mapCtx.fillRect(x * 20, y * 20, 20, 20);
  }
}

function drawNextShape() {
  previewCtx.fillStyle = "#232634";
  previewCtx.fillRect(0, 0, 80, 40);

  let nextPiece = game.generateNextPiece();

  previewCtx.fillStyle = game.setShapeColor(game.nextShape.type + 1);
  for (let i = 0, length = nextPiece.length; i < length; i++) {
    let x = nextPiece[i][1];
    let y = nextPiece[i][0];

    if (game.nextShape.type === 0) {
      previewCtx.fillRect(x * 20, y * 20, 20, 20);
    } else if (game.nextShape.type === 1) {
      previewCtx.fillRect(x * 20, y * 20 + 10, 20, 20);
    } else {
      previewCtx.fillRect(x * 20 + 10, y * 20, 20, 20);
    }
  }
}

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
      game.gamePaused = !game.gamePaused;
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
