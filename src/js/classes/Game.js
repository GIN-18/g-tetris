const Shape = require("./Shape.js");
const { base } = require("../options.js");

class Game {
  constructor(mapCtx, previewCtx, gameOverUrl) {
    this.blockSize = base.blockSize;

    this.mapCtx = mapCtx
    this.mapWidth = 10;
    this.mapHeight = 20;
    this.map = [...new Array(this.mapHeight)].map(() =>
      new Array(this.mapWidth).fill(0)
    );

    this.previewCtx = previewCtx
    this.previewWidth = 4;
    this.previewHeight = 2;
    this.previewMap = [...new Array(this.previewHeight)].map(() =>
      new Array(this.previewWidth).fill(0)
    );

    this.gameStart = false;
    this.gamePaused = false;
    this.gameOver = false;

    this.gameOverUrl = gameOverUrl;

    this.volumeUp = true;

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
    this.mapCtx.fillStyle = "#303446"
    this.mapCtx.fillRect(0, 0, 200, 400)

    this.previewCtx.fillStyle = "#232634";
    this.previewCtx.fillRect(0, 0, 82, 42);

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

  // 结束游戏
  // XXX: again按钮和quit按钮的功能
  overGame() {
    this.updateHighScore();

    const gameOverInfoTemplate = `
      <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-crust bg-opacity-95"></div>
      <div id="game-over-info"
        class="z-10 flex flex-col justify-around items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 p-6 border-2 border-text rounded bg-surface0">
        <img id="game-over-image" src="${this.gameOverUrl}" alt="game over" />
        <div class="my-6 text-xs">
          <div>
            <label>YOUR SCORE:</label>
            <span id="your-score-info">${this.score}</span>
          </div>
          <div>
            <label>HIGHEST SCORE:</label>
            <span id="highest-score-info">${this.highScore}</span>
          </div>
        </div>
        <div class="text-xs font-semibold">
          <button id="again-btn" class="w-20 py-1 border-2 border-text rounded" type="button">
            AGAIN
          </button>
          <button id="quit-btn" class="w-20 py-1 border-2 border-text rounded" type="button">
            QUIT
          </button>
        </div>
      </div>
    `;

    const gameOverContainer = document.createElement("div");

    gameOverContainer.innerHTML = gameOverInfoTemplate;

    document.body.appendChild(gameOverContainer);

    document.getElementById("again-btn").addEventListener("touchstart", () => {
      location.reload();
    });

    document.getElementById("quit-btn").addEventListener("touchstart", () => {
      location.replace("../index.html");
    });
  }

  // 生成形状
  generateShape() {
    return new Shape();
  }

  // 生成当前方块
  generatePiece() {
    return this.shape.shapeTable[this.shape.shapeType[this.shape.type]][
      this.shape.rotation
    ];
  }

  // 生成下一个方块
  generateNextPiece() {
    return this.nextShape.shapeTable[
      this.nextShape.shapeType[this.nextShape.type]
    ][this.nextShape.rotation];
  }

  // 添加方块
  // BUG: 游戏结束仍会有 this.shape 为 null 的情况
  addShape() {
    this.shape = this.nextShape;
    this.nextShape = this.generateShape();

    try {
      let piece = this.generatePiece();

      piece.forEach((item) => {
        let x = this.shape.xOffset + item[1],
          y = this.shape.yOffset + item[0];

        if (y >= 0 && this.map[y][x]) {
          if (this.dropTimer) {
            clearInterval(this.dropTimer);
            this.dropTimer = null;
          }

          this.gameOver = true;

          this.gameStart = false;

          this.shape = null;

          this.overGame();

          return;
        }
      });
    } catch (e) { }
  }

  // 方块旋转
  // BUG: 快触底时，仍可以旋转并且会覆盖已有的方块
  rotateShape(rStep) {
    if (!this.gameStart || this.gamePaused || this.gameOver) return;

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
    if (this.shape && !this.gamePaused) {
      while (this.moveShape(0, 1)) { }
      this.fallToLand();
    }
  }

  // 移动方块
  moveShape(xStep, yStep) {
    if (!this.shape || !this.gameStart || this.gamePaused || this.gameOver)
      return;

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

    // 闪烁满行
    // await this.flickeringFilledRows(filledRows);

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
  // BUG: 行数越多闪烁的时间越短
  flickeringFilledRows(filledRows) {
    return new Promise((resolve, reject) => {
      let count = 0,
        maxCount = 3;

      let intervalId = setInterval(() => {
        if (count >= maxCount) {
          clearInterval(intervalId);
          resolve("clear interval");
          return;
        }
        filledRows.forEach((row) => {
          this.map[row].fill(0);

          setTimeout(() => {
            this.map[row].fill(8);
            count++;
          }, 100);
        });
      }, 300);
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
  drawMap() {
    const mapCtx = this.mapCtx
    const map = this.map;
    const piece = this.generatePiece();

    let shapeType = this.shape.type;
    let xOffset = this.shape.xOffset;
    let yOffset = this.shape.yOffset;

    this.drawArea(
      mapCtx,
      "#303446",
      0,
      0,
      200,
      400,
      map,
      piece,
      shapeType,
      xOffset,
      yOffset
    );
  }

  drawNextShape() {
    const previewCtx = this.previewCtx
    const previewMap = this.previewMap
    const piece = this.generateNextPiece();

    let shapeType = this.nextShape.type;

    this.drawArea(previewCtx, "#232634", 0, 0, 80, 40, previewMap, piece, shapeType, 0, 0);
  }

  // 绘制画布区域
  drawArea(
    ctx,
    backgroundColor,
    canvasX,
    canvasY,
    canvasWidth,
    canvasHeight,
    area,
    piece,
    shapeType,
    xOffset,
    yOffset
  ) {
    let colorIndex = shapeType + 1;
    // console.log(ctx.canvas.id);

    // 清空预览画布
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(canvasX, canvasY, canvasWidth, canvasHeight);

    // 绘制游戏地图方格
    for (let i = 0; i < area.length; i++) {
      for (let j = 0; j < area[i].length; j++) {
        if (area[i][j]) {
          ctx.fillStyle = this.setShapeColor(area[i][j]);
          this.drawBlock(ctx, j, i);
        }
      }
    }

    // 在画布上绘制方块
    ctx.fillStyle = this.setShapeColor(colorIndex);

    for (let i = 0, length = piece.length; i < length; i++) {
      let x = piece[i][1] + xOffset;
      let y = piece[i][0] + yOffset;

      if (ctx.canvas.id === "map-canvas") {
        this.drawBlock(ctx, x, y);
      } else {
        switch (shapeType) {
          case 0:
            this.drawBlock(ctx, x, y);
            break;
          case 1:
            this.drawBlock(ctx, x, y, 0, 10);
            break;
          default:
            this.drawBlock(ctx, x, y, 10, 0);
            break;
        }
      }
    }
  }

  // 绘制方块
  drawBlock(ctx, x = 1, y = 1, xOffset = 0, yOffset = 0) {
    ctx.fillRect(
      x * this.blockSize + xOffset,
      y * this.blockSize + yOffset,
      this.blockSize,
      this.blockSize
    );
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
      case 8:
        return "#babbf1";
    }
  }
}

module.exports = Game;
