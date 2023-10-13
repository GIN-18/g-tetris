const $ = require("jquery");
const Shape = require("./Shape.js");
const Music = require("./Music.js");
const Operator = require("./Operator.js");
const socket = require("../utils/socket.js");
const options = require("../utils/options.js");

class Game {
  constructor(mapCtx, previewCtx) {
    this.blockSize = 20;

    this.flavor = sessionStorage.getItem("flavor");

    this.mapCtx = mapCtx;
    this.mapWidth = 10;
    this.mapHeight = 20;
    this.mapBackgroundColor = options.palette[this.flavor].mapBackgroundColor;
    this.map = [...new Array(this.mapHeight)].map(() =>
      new Array(this.mapWidth).fill(0)
    );

    this.previewCtx = previewCtx;
    this.previewWidth = 4;
    this.previewHeight = 2;
    this.previewBackgroundColor =
      options.palette[this.flavor].previewBackgroundColor;
    this.previewMap = [...new Array(this.previewHeight)].map(() =>
      new Array(this.previewWidth).fill(0)
    );

    this.gameMode = sessionStorage.getItem("gameMode") || "single";

    this.gameStart = false;
    this.gamePaused = false;
    this.gameOver = false;

    this.gameOverImage = options.palette[this.flavor].gameOverImage;

    this.music = new Music();
    this.volumeUp = true;

    this.operator = new Operator(this, this.music);

    this.shape = null;
    this.nextShape = null;
    this.shapeColor = options.palette[this.flavor].shapeColor;

    this.dropTimer = null;
    this.fastForward = false;

    this.level = 1;

    this.score = 0;
    this.highScore = localStorage.getItem("highScore") || 0;

    this.animateId = null;

    this.init();
  }

  // 初始化
  init() {
    this.nextShape = this.generateShape();
    this.setGameData();
    this.operator.buttonMovePiece();
  }

  // 设置游戏信息
  setGameData() {
    this.drawArea(this.mapCtx, this.map, this.mapBackgroundColor);
    this.drawNextShape();

    $("#score").text(this.score);
    $("#highest-score").text(this.highScore);
    $("#level").text(this.level);
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
    const gameOverContainer = $("<div></div>").hide();
    const separatorElement = $(`
      <div class="absolute top-0 left-0 w-screen h-screen bg-crust bg-opacity-95"></div>
    `);
    const gameOverInfoTemplate = `
      <div id="game-over-info"
        class="z-10 flex flex-col justify-around items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 p-6 border-2 border-text rounded bg-surface0">
        <img id="game-over-image" alt="game over" />
        <div id="score-container" class="my-6 text-xs">
          <div>
            <label>YOUR SCORE:</label>
            <span id="your-score-info">${this.score}</span>
          </div>
          <div>
            <label id="another-score-label"></label>
            <span id="another-score-info"></span>
          </div>
          <div>
            <label id="again-label"></label>
            <span id="again-info"></span>
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
    gameOverContainer.html(gameOverInfoTemplate);

    $("body").append(separatorElement).append(gameOverContainer);

    gameOverContainer.fadeIn("slow");

    if (this.gameMode === "double") {
      socket.emit("gameOver", {
        room: sessionStorage.getItem("room"),
        gameOver: 1,
      });
    } else {
      this.updateHighScore();
      $("#game-over-image").attr("src", this.gameOverImage);
      $("#another-score-label").text("HIGHEST SCORE:");
      $("#another-score-info").text(this.highScore);

      $("#again-btn").on("touchstart", (e) => {
        e.preventDefault();
        location.reload();
      });
    }

    $("#quit-btn").on("touchstart", (e) => {
      e.preventDefault();
      location.href = "../index.html";
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
    this.drawMap();
    this.drawNextShape();

    try {
      const piece = this.generatePiece();

      piece.forEach((item) => {
        const x = this.shape.xOffset + item[1],
          y = this.shape.yOffset + item[0];

        if (y >= 0 && this.map[y][x]) {
          if (this.dropTimer) {
            clearInterval(this.dropTimer);
            this.dropTimer = null;
          }

          this.gameOver = true;
          this.gameStart = false;
          this.overGame();
          this.shape = null;
          this.nextShape = null;
        }
      });
    } catch (e) {}
  }

  // 方块旋转
  rotateShape(rStep) {
    if (!this.gameStart || this.gamePaused || this.gameOver || !this.dropTimer) return;

    const tempRotation = this.shape.rotation;

    this.shape.rotation += rStep;

    const r =
      this.shape.rotation %
      this.shape.shapeTable[this.shape.shapeType[this.shape.type]].length;

    this.shape.rotation = r;

    const piece = this.generatePiece();

    piece.forEach((item) => {
      const x = this.shape.xOffset + item[1],
        y = this.shape.yOffset + item[0];
      if (
        this.map[y] === undefined ||
        this.map[y][x] === undefined ||
        this.map[y][x] > 0
      ) {
        this.shape.rotation = tempRotation;
      }
    });

    this.drawMap();
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
    if (
      !this.gameStart ||
      this.gamePaused ||
      this.gameOver ||
      (enable && !this.moveShape(0, 1))
    )
      return;
    this.fastForward = enable;
    this.setDropTimer();
  }

  // 下坠
  dropShape() {
    if (this.gamePaused || !this.dropTimer) return;
    while (this.moveShape(0, 1)) {}
    this.fallToLand();
  }

  // 移动方块
  moveShape(xStep, yStep) {
    if (!this.gameStart || this.gamePaused || this.gameOver || !this.dropTimer) return;

    const width = this.map[0].length,
      height = this.map.length,
      piece = this.generatePiece();

    let canMove = true;

    piece.forEach((item) => {
      const x = this.shape.xOffset + item[1] + xStep,
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
      this.drawMap();
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
    if (this.moveShape(0, 1)) return;
    this.landShape();
  }

  // 方块触底后将方块合并到地图数组中
  landShape() {
    const piece = this.generatePiece(),
      oldLevel = this.level;

    piece.forEach((item) => {
      const x = this.shape.xOffset + item[1],
        y = this.shape.yOffset + item[0];
      this.map[y][x] = this.shape.type + 1;
    });

    const filledRows = this.getFilledRows();

    if (filledRows.length) {
      this.clearFilledRows(filledRows);
      this.updateScore(filledRows.length);
      this.updateLevel();
    } else {
      this.addShape();
    }
  }

  // 获取满行
  getFilledRows() {
    let filledRows = [];
    this.map.forEach((row, index) => {
      if (row.every((item) => !!item)) {
        filledRows.push(index);
      }
    });
    return filledRows;
  }

  // 消除满行
  clearFilledRows(filledRows) {
    if (this.dropTimer) {
      clearInterval(this.dropTimer);
      this.dropTimer = null;
    }

    let animationFrame = null;
    let progress = 0;
    const numCols = this.map[0].length;

    function animate() {
      if (progress === numCols) {
        // 动画结束
        // 删除行
        filledRows.forEach((row) => {
          this.map.splice(row, 1);
          this.map.unshift(new Array(10).fill(0));
        });

        // 添加新方块并重新启动下落计时器
        this.addShape();
        this.setDropTimer();

        // 播放音效
        this.music.fetchMusic(0.19, 0.7);

        return;
      }

      // 绘制一列小方块
      this.mapCtx.fillStyle = this.shapeColor[7];
      for (let row = 0; row < filledRows.length; row++) {
        const x = progress * 20;
        const y = filledRows[row] * 20;
        this.mapCtx.fillRect(x, y, 20, 20);
      }

      progress += 0.5;

      // 请求下一帧绘制
      animationFrame = requestAnimationFrame(animate.bind(this));
    }

    // 开始动画
    animationFrame = requestAnimationFrame(animate.bind(this));
  }

  // 更新分数
  updateScore(filledRows) {
    this.score += filledRows * this.level * 10;
    $("#score").text(this.score);

    if (this.gameMode === "double") {
      socket.emit("updateScore", {
        room: sessionStorage.getItem("room"),
        score: this.score,
      });
    }
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
      $("#level").text(this.level);
    }
  }

  // 绘制地图
  drawMap() {
    const mapCtx = this.mapCtx,
      mapBackgroundColor = this.mapBackgroundColor,
      map = this.map,
      piece = this.generatePiece(),
      shapeType = this.shape.type,
      xOffset = this.shape.xOffset,
      yOffset = this.shape.yOffset;

    this.drawArea(mapCtx, map, mapBackgroundColor);
    this.drawShape(mapCtx, piece, shapeType, xOffset, yOffset);
  }

  // 绘制下一个形状
  drawNextShape() {
    const previewCtx = this.previewCtx,
      previewMap = this.previewMap,
      previewBackgroundColor = this.previewBackgroundColor,
      piece = this.generateNextPiece(),
      shapeType = this.nextShape.type;

    this.drawArea(previewCtx, previewMap, previewBackgroundColor);
    this.drawShape(previewCtx, piece, shapeType, 0, 0);
  }

  // 绘制画布区域
  drawArea(ctx, area, backgroundColor) {
    for (let i = 0; i < area.length; i++) {
      for (let j = 0; j < area[i].length; j++) {
        ctx.fillStyle = this.setShapeColor(area[i][j], backgroundColor);
        this.drawBlock(ctx, j, i);
      }
    }
  }

  // 绘制形状
  drawShape(ctx, piece, shapeType, xOffset, yOffset) {
    ctx.fillStyle = this.setShapeColor(shapeType + 1);

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

  // 设置游戏颜色主题
  setGamePalette() {
    const flavor = sessionStorage.getItem("flavor"),
      mapBackgroundColor = options.palette[flavor].mapBackgroundColor,
      previewBackgroundColor = options.palette[flavor].previewBackgroundColor,
      shapeColor = options.palette[flavor].shapeColor,
      gameOverImage = options.palette[flavor].gameOverImage;

    this.mapBackgroundColor = mapBackgroundColor;
    this.previewBackgroundColor = previewBackgroundColor;

    this.shapeColor = shapeColor;

    this.gameOverImage = gameOverImage;

    this.drawArea(this.mapCtx, this.map, mapBackgroundColor);
    this.drawNextShape();
  }

  // 设置颜色
  setShapeColor(type, backgroundColor) {
    const colorIndex = type - 1;
    switch (type) {
      case 0:
        return backgroundColor;
      case 1:
        return this.shapeColor[colorIndex];
      case 2:
        return this.shapeColor[colorIndex];
      case 3:
        return this.shapeColor[colorIndex];
      case 4:
        return this.shapeColor[colorIndex];
      case 5:
        return this.shapeColor[colorIndex];
      case 6:
        return this.shapeColor[colorIndex];
      case 7:
        return this.shapeColor[colorIndex];
      case 8:
        return this.shapeColor[colorIndex];
    }
  }
}

module.exports = Game;
