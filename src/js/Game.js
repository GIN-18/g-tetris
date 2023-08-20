const Shape = require("./Shape.js");
const Score = require("./Score.js");
const Operator = require("./Operator.js");

class Game {
  constructor() {
    this.gameStart = false;
    this.gamePaused = false;
    this.gameOver = false;

    this.map = [...new Array(20)].map(() => new Array(10).fill(0));

    this.shape = null;
    this.nextShape = null;

    this.dropTimer = null;
    this.fastForward = false;

    this.level = 1;

    this.score = 0;
    this.highScore = localStorage.getItem("highScore") || 0;

    this.init();
  }

  // 初始化
  init() {
    this.nextShape = this.generateShape();
    this.setGameData();
  }

  // 设置游戏信息
  setGameData() {
    document.getElementById("score").innerText = this.score;
    document.getElementById("highest-score").innerText = this.highScore;
    document.getElementById("level").innerText = this.level;
  }

  // 开始游戏
  startGame() {
    this.gameStart = true;
    this.addShape();
    this.setDropTimer();
  }

  // 生成形状
  generateShape() {
    return new Shape();
  }

  // 生成当前方块
  generatePiece() {
    if (this.shape) {
      return this.shape.shapeTable[this.shape.shapeType[this.shape.type]][
        this.shape.rotation
      ];
    }
  }

  // 生成下一个方块
  generateNextPiece() {
    if (this.shape) {
      return this.nextShape.shapeTable[
        this.nextShape.shapeType[this.nextShape.type]
      ][this.nextShape.rotation];
    }
  }

  // 添加方块
  addShape() {
    this.shape = this.nextShape;
    this.nextShape = this.generateShape();

    let piece = this.generatePiece();

    piece.forEach((item) => {
      let x = this.shape.xOffset + item[1],
        y = this.shape.yOffset + item[0];

      if (y >= 0 && this.map[y][x]) {
        if (this.dropTimer) {
          clearInterval(this.dropTimer);
          this.dropTimer = null;
        }

        this.shape = null;

        this.gameOver = true;

        console.log("game over");

        alert("game over");

        return;
      }
    });
  }

  // 方块旋转
  rotateShape(rStep) {
    let tempRotation = this.shape.rotation;

    this.shape.rotation += rStep;

    let r =
      this.shape.rotation %
      this.shape.shapeTable[this.shape.shapeType[this.shape.type]].length;

    this.shape.rotation = r;

    let piece = this.generatePiece();

    piece.forEach((item) => {
      let x = this.shape.xOffset + item[1],
        y = this.shape.yOffset + item[0];
      if (this.map[y] === undefined || this.map[y][x] === undefined) {
        this.shape.rotation = tempRotation;
      }
    });
  }

  // 左移
  moveLeft() {
    this.moveShape(-1, 0);
  }

  // 右移
  moveRight() {
    this.moveShape(1, 0);
  }

  // 下移
  moveDown(enable) {
    if (this.fastForward === enable || this.gameOver) return;
    if (enable && !this.moveShape(0, 1)) return;
    this.fastForward = enable;
    this.setDropTimer();
  }

  // 下坠
  dropShape() {
    if (this.shape) {
      while (this.moveShape(0, 1)) {}
      this.fallToLand();
    }
  }

  // 移动方块
  moveShape(xStep, yStep) {
    if(!this.gameStart) return
    if (this.shape) {
      const width = this.map[0].length;
      const height = this.map.length;

      let canMove = true;

      let piece = this.generatePiece();

      piece.forEach((item) => {
        let x = this.shape.xOffset + item[1] + xStep,
          y = this.shape.yOffset + item[0] + yStep;
        if (
          x < 0 ||
          x >= width ||
          y >= height ||
          (this.map[y] && this.map[y][x])
        ) {
          canMove = false;
          return canMove;
        }
      });

      if (canMove) {
        this.shape.xOffset += xStep;
        this.shape.yOffset += yStep;
      }
      return canMove;
    }
  }

  setDropTimer() {
    let timestep = Math.round(80 + 800 * Math.pow(0.75, this.level - 1));
    timestep = Math.max(10, timestep);

    if (this.fastForward) {
      timestep = 80;
    }

    if (this.dropTimer || this.gamePaused) {
      clearInterval(this.dropTimer);
      this.dropTimer = null;
    }

    if (!this.gamePaused) {
      this.dropTimer = setInterval(() => {
        this.fallToLand();
      }, timestep);
    }
  }

  fallToLand() {
    if (!this.moveShape(0, 1)) {
      this.landShape();
      this.addShape();
    }
  }

  // 方块触底后将方块合并到地图数组中
  landShape() {
    let piece = this.generatePiece();

    let isFilled = false,
      filledRows = [],
      oldLevel = this.level;

    piece.forEach((item) => {
      let x = this.shape.xOffset + item[1],
        y = this.shape.yOffset + item[0];
      this.map[y][x] = this.shape.type + 1;
    });

    // 判断是否有满行
    this.map.forEach((row, index) => {
      isFilled = row.every((item) => !!item);

      if (isFilled) {
        filledRows.push(index);
      }
    });

    // 在行首添加空行
    filledRows.forEach((row) => {
      this.map.splice(row, 1);
      this.map.unshift(new Array(10).fill(0));
    });

    if (filledRows.length) {
      this.updateScore(filledRows.length, this.level);
      this.updateLevel();
    }

    if (oldLevel !== this.level) {
      this.setDropTimer();
    }
  }

  // 闪烁满行
  flickeringFilledRows(filledRows) {
    filledRows.forEach((element) => {
      this.map[element].fill(8);
    });
  }

  // 更新分数
  updateScore(filledRows, level) {
    this.score += filledRows * level * 10;
    document.getElementById("score").innerText = this.score;
  }

  // 更新最高分数
  updateHighScore() {
    if (this.score > this.highScore) {
      localStorage.setItem("highScore", this.score);
    }
  }

  // 更新等级
  updateLevel() {
    const nextLevelScore = (this.level + 1) * 100 * this.level;

    if (this.score >= nextLevelScore) {
      this.level += 1;
      this.updateLevel();
      document.getElementById("level").innerText = this.level;
    }
  }

  // 设置颜色
  setShapeColor(type) {
    const shape = this.shape;

    let colorIndex = type - 1;

    switch (type) {
      case 1:
        return shape.shapeColor[colorIndex];
      case 2:
        return shape.shapeColor[colorIndex];
      case 3:
        return shape.shapeColor[colorIndex];
      case 4:
        return shape.shapeColor[colorIndex];
      case 5:
        return shape.shapeColor[colorIndex];
      case 6:
        return shape.shapeColor[colorIndex];
      case 7:
        return shape.shapeColor[colorIndex];
    }
  }
}

module.exports = Game;
