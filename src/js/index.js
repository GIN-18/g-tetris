const Game = require("./Game.js")

const game = new Game();

game.drawMap();

game.drawPiece()

game.updateLevel()

// 测试移动
testMove();

if(!game.gameOver){
  // updateAnimation()
}

function testMove() {
  document.body.addEventListener("keydown", (e) => {
    // console.log(e.keyCode);
    // 旋转方块
    if (e.keyCode === 32) {
      game.rotatePiece();
    }
    // 下移
    if (e.keyCode === 74) {
      game.movePiece('bottom');
    }
    // 左移
    if (e.keyCode === 72) {
      game.movePiece('left');
    }
    // 右移
    if (e.keyCode === 76) {
      game.movePiece('right');
    }
  });
}

let lastTime = 0
let intervalTime = 0
let level = game.level

// 更新动画
function updateAnimation(time) {
  if (!time) time = lastTime
  intervalTime += level * (time - lastTime)
  if (intervalTime > 1000) {
    intervalTime = 0
    game.movePiece('bottom')
  }
  lastTime = time
  requestAnimationFrame(updateAnimation)
}
