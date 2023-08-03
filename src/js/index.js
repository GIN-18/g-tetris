const Game = require("./Game.js")

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const game = new Game(ctx);

canvas.width = game.block * game.map[0].length;
canvas.height = game.block * game.map.length;

game.drawMap();

game.drawPiece()

// console.table(game.map)

// 测试移动
testMove();

// updateAnimation()

function testMove() {
  document.body.addEventListener("keydown", (e) => {
    // console.log(e.keyCode);
    // 旋转方块
    if (e.keyCode === 32) {
      game.rotatePiece();
    }
    // 下移
    if (e.keyCode === 74) {
      game.moveToBottom();
    }
    // 左移
    if (e.keyCode === 72) {
      game.moveToLeft();
    }
    // 右移
    if (e.keyCode === 76) {
      game.moveToRight();
    }
  });
}

// 更新动画
function updateAnimation(timer){
  console.log(timer)
  window.requestAnimationFrame(updateAnimation)
}
