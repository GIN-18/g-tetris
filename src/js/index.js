import "../../dist/style.css";
import "material-icons/iconfont/material-icons.css";

const Game = require("./Game.js");

const mapCanvas = document.getElementById("map-canvas");

const ctx = mapCanvas.getContext("2d", { alpha: false });

const game = new Game();

game.addShape();

gameLoop();

function gameLoop() {
  draw("#303446", "#c6d0f5");
  requestAnimationFrame(gameLoop);
}

// 绘制方块
function draw(mapBackgroundColor, shapeColor) {
  ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);

  ctx.fillStyle = mapBackgroundColor;
  ctx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);

  ctx.fillStyle = shapeColor;

  for (let i = 0, length = game.shape.blocks.length; i < length; i++) {
    let x = game.shape.blocks[i][1] + game.shape.xOffset;
    let y = game.shape.blocks[i][0] + game.shape.yOffset;

    // ctx.strokeRect(x * game.block, y * game.block, game.block, game.block);
    ctx.fillRect(x * game.block, y * game.block, game.block, game.block);
  }
}

document.body.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "Space":
      game.moveShape(0, 0, 1);
      break;
    case "KeyH":
      game.moveShape(-1, 0, 0);
      break;
    case "KeyL":
      game.moveShape(1, 0, 0);
      break;
    case "KeyJ":
      game.moveShape(0, 1, 0);
      break;
  }
});
