const Piece = require("./Piece.js");

class Game {
  constructor(ctx) {
    this.block = 18;
    this.direction = "";
    this.ctx = ctx;
    this.map = [...new Array(20)].map(() => new Array(10).fill(0));
    this.piece = new Piece();
  }
  // 生成形状
  generatePiece() {
    return this.piece.shape[this.piece.rotation];
  }
  // 渲染地图
  drawMap() {
    for (let r = 0; r < this.map.length; r++) {
      for (let c = 0; c < this.map[r].length; c++) {
        this.ctx.fillStyle = "#303446";
        this.ctx.fillRect(
          c * this.block,
          r * this.block,
          this.block,
          this.block
        );
      }
    }
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
          this.ctx.fillStyle = pieceColor;
          this.ctx.fillRect(
            c * this.block + x * this.block,
            r * this.block + y * this.block,
            this.block - 1,
            this.block - 1
          );
        }
      }
    }
  }
  // 清除方块
  cleanPiece() {
    let piece = this.generatePiece();
    let x = this.piece.xOffset;
    let y = this.piece.yOffset;

    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {
        if (piece[r][c]) {
          this.ctx.fillStyle = "#303446";
          this.ctx.fillRect(
            c * this.block + x * this.block,
            r * this.block + y * this.block,
            this.block,
            this.block
          );
        }
      }
    }
  }
  // 在地图上设置方块
  setPieceInMap() {
    let piece = this.generatePiece();
    let x = this.piece.xOffset;
    let y = this.piece.yOffset;

    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {
        if (piece[r][c]) {
          this.map[r + y][c + x] = 1;
        }
      }
    }
  }
  // 在地图上清除方块
  cleanPieceInMap() {
    let piece = this.generatePiece();
    let x = this.piece.xOffset;
    let y = this.piece.yOffset;

    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {
        if (piece[r][c]) {
          this.map[r + y][c + x] = 0;
        }
      }
    }
  }
  // 碰撞检测
  checkCollision() {
    let piece = this.generatePiece();

    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {
        let x = this.piece.xOffset + c;
        let y = this.piece.yOffset + r;

        if (piece[r][c]) {
          // 左边缘检测
          if (
            (this.map[y][x - 1] === undefined || this.map[y][x - 1] === 1) &&
            this.direction === "left"
          ) {
            return true;
          }
          // 右边缘检测
          if (
            (this.map[y][x + 1] === undefined || this.map[y][x + 1] === 1) &&
            this.direction === "right"
          ) {
            return true;
          }
          // 下边缘检测
          if (
            (this.map[y + 1] === undefined || this.map[y + 1][x] === 1) &&
            this.direction === "bottom"
          ) {
            this.setPieceInMap();
            return true;
          }
        }
      }
    }
    return false;
  }

  // 方块旋转
  rotatePiece() {
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
            this.map[y][x] === 1
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
  // 方块下移
  moveToBottom() {
    this.direction = "bottom";
    if (!this.checkCollision()) {
      this.cleanPiece();
      this.piece.yOffset += 1;
      this.drawPiece();
      return;
    }
    this.piece = new Piece();
    this.cleanPiece();
    this.piece.yOffset = 0;
    this.drawPiece();
  }
  // 方块左移
  moveToLeft() {
    this.direction = "left";
    if (!this.checkCollision()) {
      this.cleanPiece();
      this.piece.xOffset -= 1;
      this.drawPiece();
    }
  }
  // 方块右移
  moveToRight() {
    this.direction = "right";
    if (!this.checkCollision()) {
      this.cleanPiece();
      this.piece.xOffset += 1;
      this.drawPiece();
    }
  }
}

module.exports = Game;
