const { Application, Graphics, Ticker } = require("pixi.js");

const Piece = require("./Piece.js");
const Score = require("./Score.js");
const Operator = require("./Operator.js");

class Game {
  constructor() {
    this.mapHeight = 20;
    this.mapWidth = 10;

    this.previewAreaHeight = 2;
    this.previewAreaWidth = 4;

    this.block = 18;
    this.blockRounded = 2;

    this.level = 1;

    this.time = 0;
    this.speed = 1;
    this.isUpdateAnimation = true
    this.ticker = Ticker.shared

    this.gameStart = false;
    this.gameOver = false;

    this.pageBackgroundColor = "#292c3c";
    this.mapBackgroundColor = "#303446";
    this.previewBoxBackgroundColor = "#414559";

    this.map = [...new Array(this.mapHeight)].map(() =>
      new Array(this.mapWidth).fill(0)
    );

    this.mapArea = new Application({
      width: this.mapWidth * this.block,
      height: this.mapHeight * this.block,
      backgroundColor: this.pageBackgroundColor,
    });

    this.previewArea = new Application({
      width: this.previewAreaWidth * this.block,
      height: this.previewAreaHeight * this.block,
      backgroundColor: this.previewBoxBackgroundColor,
    });

    this.mapGraphics = new Graphics();
    this.previewGraphics = new Graphics();

    this.piece = new Piece();
    this.nextPiece = this.generateNextPiece();
    this.score = new Score();
    this.operator = new Operator(this);

    this.init();
  }
  init() {
    this.setGameData();
    this.drawMap();
    this.drawPiece();
    this.previewPiece();
    this.updateAnimation();
  }

  // 设置游戏场地
  setGameData() {
    // 绘制游戏画布
    document.getElementById("game-body").appendChild(this.mapArea.view);

    // 绘制预览方块画布
    document.getElementById("piece-preview").appendChild(this.previewArea.view);

    // 设置游戏数据
    document.getElementById("level").innerText = this.level;
    document.getElementById("highest-score").innerText = this.score.highScore;
  }

  // 生成形状
  generatePiece() {
    return this.piece.shape[this.piece.rotation];
  }

  // 下一个方块
  generateNextPiece() {
    return new Piece();
  }

  // 渲染地图
  drawMap() {
    for (let r = 0; r < this.mapHeight; r++) {
      for (let c = 0; c < this.mapWidth; c++) {
        let fillColor = this.setColor(this.map[r][c]);

        this.mapGraphics.beginFill(fillColor, 1);
        this.mapGraphics.drawRoundedRect(
          c * this.block,
          r * this.block,
          this.block - 1,
          this.block - 1,
          this.blockRounded
        );
        this.mapGraphics.endFill();
      }
    }
    this.mapArea.stage.addChild(this.mapGraphics);
  }

  // 预览方块
  previewPiece() {
    const tempNextPiece = this.nextPiece.shape[this.nextPiece.rotation];
    const pieceColor = this.nextPiece.shapeColor[this.nextPiece.type];

    for (let r = 0; r < tempNextPiece.length; r++) {
      for (let c = 0; c < tempNextPiece[r].length; c++) {
        if (tempNextPiece[r][c]) {
          this.previewGraphics.beginFill(pieceColor, 1);
          this.previewGraphics.drawRoundedRect(
            c * this.block,
            r * this.block,
            this.block - 1,
            this.block - 1,
            this.blockRounded
          );
        }
        this.previewGraphics.endFill();
      }
    }
    this.previewArea.stage.addChild(this.previewGraphics);
  }

  // 清除预览方块
  cleanPreviewPiece() {
    for (let r = 0; r < this.previewAreaHeight; r++) {
      for (let c = 0; c < this.previewAreaWidth; c++) {
        this.previewGraphics.beginFill(this.previewBoxBackgroundColor, 1);
        this.previewGraphics.drawRoundedRect(
          c * this.block,
          r * this.block,
          this.block - 1,
          this.block - 1,
          this.blockRounded
        );
        this.previewGraphics.endFill();
      }
    }
    this.previewArea.stage.addChild(this.previewGraphics);
  }

  // 绘制方块
  drawPiece() {
    let piece = this.generatePiece();
    let pieceColor = this.piece.shapeColor[this.piece.type];
    let x = this.piece.xOffset;
    let y = this.piece.yOffset;

    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {
        if (piece[r][c]) {
          this.mapGraphics.beginFill(pieceColor, 1);
          this.mapGraphics.drawRoundedRect(
            c * this.block + x * this.block,
            r * this.block + y * this.block,
            this.block - 1,
            this.block - 1,
            this.blockRounded
          );
          this.mapGraphics.endFill();
        }
      }
    }
    this.mapArea.stage.addChild(this.mapGraphics);
  }

  // 清除方块
  cleanPiece() {
    let piece = this.generatePiece();
    let x = this.piece.xOffset;
    let y = this.piece.yOffset;

    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {
        if (piece[r][c]) {
          this.mapGraphics.beginFill(this.mapBackgroundColor, 1);
          this.mapGraphics.drawRoundedRect(
            c * this.block + x * this.block,
            r * this.block + y * this.block,
            this.block - 1,
            this.block - 1,
            this.blockRounded
          );
          this.mapGraphics.endFill();
        }
      }
    }
    this.mapArea.stage.addChild(this.mapGraphics);
  }

  // 在地图上设置方块
  setPieceInMap() {
    let piece = this.generatePiece();
    let x = this.piece.xOffset;
    let y = this.piece.yOffset;

    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {
        if (piece[r][c]) {
          this.map[r + y][c + x] = piece[r][c];
        }
      }
    }
  }

  // 自动下移
  updateAnimation() {
    this.ticker.add((delta)=>{
      this.time += delta * this.level;
      if (this.time > 60 && this.gameStart && this.isUpdateAnimation) {
        this.movePiece(0, 1);
        this.time = 0;
      }
    })
  }

  // 方块旋转
  rotatePiece() {
    if (!this.gameStart) return;

    let tempRotation = this.piece.rotation;

    this.cleanPiece();

    this.piece.rotation += 1;
    this.piece.rotation = this.piece.rotation % this.piece.shape.length;

    let piece = this.generatePiece();

    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {
        let x = this.piece.xOffset + c;
        let y = this.piece.yOffset + r;
        if (piece[r][c]) {
          if (
            this.map[y] === undefined ||
            this.map[y][x] === undefined ||
            this.map[y][x] > 0
          ) {
            this.piece.rotation = tempRotation;
            this.drawPiece();
            return;
          }
        }
      }
    }

    this.drawPiece();
  }

  // 移动方块
  // TODO: 判断失败仍会产生一个新的方块
  movePiece(xStep, yStep) {
    if (!this.gameStart) return;

    if(this.gameOver) return

    let canMove = true;

    let piece = this.generatePiece();

    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {
        let x = this.piece.xOffset + c;
        let y = this.piece.yOffset + r;

        if (piece[r][c]) {
          // 游戏结束
          if (this.map[y - 1] === undefined && this.map[y + 1][x]) {
            this.gameOver = true
            alert("game over")
            return;
          }
          // 左右碰撞检测
          if (this.map[y][x + xStep] === undefined || this.map[y][x + xStep]) {
            canMove = false;
            return;
          }
          // 下边缘检测
          if (this.map[y + yStep] === undefined || this.map[y + yStep][x]) {
            this.setPieceInMap();
            this.cleanPieceInMap();
            this.piece = this.nextPiece;
            this.nextPiece = this.generateNextPiece();
            this.cleanPreviewPiece();
            this.previewPiece();
            this.drawPiece();
            canMove = false;
            return;
          }
        }
      }
    }

    if (canMove) {
      this.cleanPiece();
      this.piece.xOffset += xStep;
      this.piece.yOffset += yStep;
      this.drawPiece();
    }
  }

  // 在地图上清除方块
  cleanPieceInMap() {
    let filledRows = [];

    for (let r = 0; r < this.map.length; r++) {
      const isRowFilled = this.map[r].every((item) => item > 0);

      if (isRowFilled) {
        // 获取满行
        filledRows.push(r);
        // 删除满行
        this.map.splice(r, 1);
        // 在顶部添加一个全0的新行
        this.map.unshift(new Array(10).fill(0));

        this.addScore(filledRows.length, this.level);

        this.updateLevel();

        this.drawMap();
      }
    }
  }

  // 添加分数
  addScore(filledRows, level) {
    this.score.updateScore(filledRows, level);
    document.getElementById("score").innerText = this.score.score;

    this.score.updateHighScore();
  }

  // 更新游戏等级
  updateLevel() {
    const nextLevelScore = this.level * 300;
    if (this.score.score >= nextLevelScore) {
      this.level += 1;
      this.updateLevel();
    }
    document.getElementById("level").innerText = this.level;
  }

  // 设置颜色
  setColor(number) {
    switch (number) {
      case 1:
        return this.piece.shapeColor[0];
      case 2:
        return this.piece.shapeColor[1];
      case 3:
        return this.piece.shapeColor[2];
      case 4:
        return this.piece.shapeColor[3];
      case 5:
        return this.piece.shapeColor[4];
      case 6:
        return this.piece.shapeColor[5];
      case 7:
        return this.piece.shapeColor[6];
      default:
        return this.mapBackgroundColor;
    }
  }
}

module.exports = Game;
