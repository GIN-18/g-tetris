import {Game} from "./Game.js"

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const game = new Game(ctx);

const block = game.block;

const width = block * game.map.width;
const height = block * game.map.height;

canvas.width = width;
canvas.height = height;

// 初始化游戏
game.setPieceInMap();

game.renderGame();

// console.table(game.map.area);

// 测试移动
testMove();

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
