const Shape = require("./Shape.js");
const Score = require("./Score.js");
const Operator = require("./Operator.js");

class Game {
  constructor() {
    this.block = 20;

    this.map = null;

    this.shape = null;
    this.nextShape = null;

    this.level = 1;

    this.gameStatus = 0;

    this.init();
  }

  // 初始化
  init() {
    this.map = [...this.generateMap(10, 20)];
    this.nextShape = this.generateShape();
    this.setMap();
  }

  // 渲染地图
  setMap() {}

  // 绘制
  draw() {}

  // 生成地图
  generateMap(width, height) {
    return [...new Array(height)].map(() => new Array(width).fill(0));
  }

  // 生成形状
  generateShape() {
    const type = Math.floor(Math.random() * 7);
    const shape = new Shape(type);

    this.setupBlocks(shape);

    return shape;
  }

  // 添加方块
  addShape() {
    this.shape = this.nextShape;
    this.nextShape = this.generateShape();

    for (let i = 0, length = this.shape.blocks.length; i < length; i++) {
      let x = this.shape.blocks[i][1] + this.shape.xOffset,
        y = this.shape.blocks[i][0] + this.shape.yOffset;

      // 游戏结束判断
      if (y >= 0 && this.map[y][x]) {
        this.shape = null;
        console.log("game over");
        return;
      }
    }
  }

  // 自动下移
  gameLoop() {}

  // 方块旋转
  rotateShape(rStep) {
    let shape = this.shape;

    shape.rotation += rStep;

    let r =
      shape.rotation % shape.shapeTable[shape.shapeType[shape.type]].length;

      shape.rotation = r;

      this.setupBlocks(shape);
  }

  // 获取方块的坐标
  setupBlocks(shape) {
    if (shape.blocks.length) {
      shape.blocks.splice(0, shape.blocks.length);
    }

    const piece = shape.shapeTable[shape.shapeType[shape.type]][shape.rotation];

    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {
        if (piece[r][c]) {
          shape.blocks.push([r, c]);
        }
      }
    }
  }

  // 移动方块
  moveShape(xStep, yStep, rStep) {
    const width = this.map[0].length;
    const height = this.map.length;

    const shape = this.shape;

    let canMove = true;

    this.rotateShape(rStep);

    for (let i = 0, length = shape.blocks.length; i < length; i++) {

      let x = shape.xOffset + shape.blocks[i][1] + xStep,
        y = shape.yOffset + shape.blocks[i][0] + yStep;

      if (
        x < 0 ||
        x >= width ||
        y >= height ||
        (this.map[x] && this.map[x][y])
      ) {
        canMove = false;
        // return true
        // console.log("can not move");
      }
    }

    if (canMove) {
      shape.xOffset += xStep;
      shape.yOffset += yStep;
    } else {
      this.rotateShape(-rStep);
    }
  }
}

module.exports = Game;
