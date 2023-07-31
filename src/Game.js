import { Map } from "./Map.js";
import { Piece } from "./Piece.js";

export class Game {
  constructor(ctx) {
    this.block = 18;
    this.direction = "";
    this.ctx = ctx;
    this.map = new Map();
    this.piece = new Piece();
  }
  // 生成形状
  generatePiece() {
    return this.piece.shape[this.piece.rotation];
  }
  // 渲染地图
  renderGame() {
    for (let r = 0; r < this.map.area.length; r++) {
      for (let c = 0; c < this.map.area[r].length; c++) {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(
          c * this.block,
          r * this.block,
          this.block,
          this.block
        );
        if (this.map.area[r][c] === 1) {
          this.ctx.fillStyle = "red";
          this.ctx.fillRect(
            c * this.block,
            r * this.block,
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
          this.map.area[r + y][c + x] = 1;
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
          this.map.area[r + y][c + x] = 0;
        }
      }
    }
  }
  // 碰撞检测
  checkCollision() {
    let isCollision = false;
    let piece = this.generatePiece();
    let area = this.map.area;
    let rows = [];

    // 水平方向检测
    for (let r = 0; r < piece.length; r++) {
      // 获取方块的有效高度
      if (piece[r].includes(this.piece.type + 1)) {
        rows.push(r);
      }

      for (let c = 0; c < piece[r].length; c++) {
        let x = this.piece.xOffset + c;
        let y = this.piece.yOffset + r;

        if (piece[r][c]) {
          // 左边的碰撞检测
          if (!area[y][x - 1]) {
            if (area[y][x - 1] === undefined && this.direction === "left") {
              isCollision = true;
            }
          }
          // 右边的碰撞检测
          if (!area[y][x + 1]) {
            if (area[y][x + 1] === undefined && this.direction === "right") {
              isCollision = true;
            }
          }
        }
      }
    }

    // 触底检测
    if (
      area[rows.length + this.piece.yOffset] === undefined &&
      this.direction === "bottom"
    ) {
      isCollision = true;
    }

    return isCollision;
  }

  // 方块旋转
  // TODO: 修改旋转方块后，方块越界
  rotatePiece() {
    this.cleanPieceInMap();
    this.piece.rotation += 1;
    if (this.piece.rotation === this.piece.shape.length) {
      this.piece.rotation = 0;
    }
    this.setPieceInMap();
    this.renderGame();
  }
  // 方块下移
  moveToBottom() {
    this.direction = "bottom";
    if (!this.checkCollision()) {
      this.cleanPieceInMap();
      this.piece.yOffset += 1;
      this.setPieceInMap();
      this.renderGame();
      return;
    }
    this.piece = new Piece();
    this.piece.yOffset = 0;
    this.setPieceInMap();
    this.renderGame();
  }
  // 方块左移
  moveToLeft() {
    this.direction = "left";
    if (!this.checkCollision()) {
      this.cleanPieceInMap();
      this.piece.xOffset -= 1;
      this.setPieceInMap();
      this.renderGame();
    }
  }
  // 方块右移
  moveToRight() {
    this.direction = "right";
    if (!this.checkCollision()) {
      this.cleanPieceInMap();
      this.piece.xOffset += 1;
      this.setPieceInMap();
      this.renderGame();
    }
  }
}
