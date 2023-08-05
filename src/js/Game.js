const Piece = require("./Piece.js");

class Game {
  constructor(ctx) {
    this.block = 18;
    this.direction = "";
    this.ctx = ctx;
    this.level = 1;
    this.score = 0;
    this.gameOver = false;
    this.map = [...new Array(22)].map(() => new Array(10).fill(0));
    this.piece = new Piece();
  }
  // 生成形状
  generatePiece() {
    return this.piece.shape[this.piece.rotation];
  }
  // 设置颜色
  setColor(number) {
    switch (number) {
      case 1:
        this.ctx.fillStyle = this.piece.shapeColor[0];
        break;
      case 2:
        this.ctx.fillStyle = this.piece.shapeColor[1];
        break;
      case 3:
        this.ctx.fillStyle = this.piece.shapeColor[2];
        break;
      case 4:
        this.ctx.fillStyle = this.piece.shapeColor[3];
        break;
      case 5:
        this.ctx.fillStyle = this.piece.shapeColor[4];
        break;
      case 6:
        this.ctx.fillStyle = this.piece.shapeColor[5];
        break;
      case 7:
        this.ctx.fillStyle = this.piece.shapeColor[6];
        break;
      default:
        this.ctx.fillStyle = "#303446";
        break;
    }
  }
  // 渲染地图
  drawMap() {
    for (let r = 2; r < this.map.length; r++) {
      for (let c = 0; c < this.map[r].length; c++) {
        this.setColor(this.map[r][c]);
        this.ctx.fillRect(
          c * this.block,
          r * this.block,
          this.block - 1,
          this.block - 1
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
          if (y >= 2) {
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
  }
  // 清除方块
  cleanPiece() {
    let piece = this.generatePiece();
    let x = this.piece.xOffset;
    let y = this.piece.yOffset;

    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {
        if (piece[r][c]) {
          if (y >= 2) {
            this.ctx.fillStyle = "#303446";
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

        this.drawMap();
      }
    }
  }
  // 判断游戏结束
  checkGameOver() {
    let piece = this.generatePiece();

    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {
        let x = this.piece.xOffset + c;
        let y = this.piece.yOffset + r;

        if (piece[r][c]) {
          if (this.map[y - 1] === undefined && this.map[y + 1][x] > 0) {
            this.gameOver = true;
            alert("game over");
            return
          }
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
            (this.map[y][x - 1] === undefined || this.map[y][x - 1] > 0) &&
            this.direction === "left"
          ) {
            return true;
          }
          // 右边缘检测
          if (
            (this.map[y][x + 1] === undefined || this.map[y][x + 1] > 0) &&
            this.direction === "right"
          ) {
            return true;
          }
          // 下边缘检测
          if (
            (this.map[y + 1] === undefined || this.map[y + 1][x] > 0) &&
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
    if (!this.gameOver) {
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
  }
  // 移动方块
  movePiece(direction) {
    this.checkGameOver()
    if (!this.gameOver) {
      this.direction = direction;

      if (!this.checkCollision()) {
        this.cleanPiece();
        if (direction === "left") {
          this.piece.xOffset -= 1;
        } else if (direction === "right") {
          this.piece.xOffset += 1;
        }
        this.drawPiece();
      }

      if (direction === "bottom") {
        if (!this.checkCollision()) {
          this.cleanPiece();
          this.piece.yOffset += 1;
          this.drawPiece();
          return;
        }
        this.cleanPieceInMap();
        this.piece = new Piece();
        this.cleanPiece();
        this.piece.yOffset = 0;
        this.drawPiece();
      }
    }
  }
  // 添加分数
  addScore(filledRows) {}
}

module.exports = Game;
