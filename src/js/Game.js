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
    this.addShape();
  }

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

    this.shape.blocks.forEach((item) => {
      let x = this.shape.xOffset + item[1],
        y = this.shape.yOffset + item[0];
      if (y >= 0 && this.map[y][x]) {
        this.shape = null;
        console.log("game over");
        return;
      }
    });
  }

  // 自动下移
  gameLoop() {}

  // 方块旋转
  rotateShape(rStep) {
    let shape = this.shape;

    let tempRotation = shape.rotation;

    shape.rotation += rStep;

    let r =
      shape.rotation % shape.shapeTable[shape.shapeType[shape.type]].length;

    shape.rotation = r;

    this.setupBlocks(shape);

    shape.blocks.forEach((item) => {
      let x = shape.xOffset + item[1],
        y = shape.yOffset + item[0];
      if (this.map[y] === undefined || this.map[y][x] === undefined) {
        shape.rotation = tempRotation;
      }
    });

    this.setupBlocks(shape);
  }

  // 移动方块
  moveShape(xStep, yStep) {
    const width = this.map[0].length;
    const height = this.map.length;
    const map = this.map;

    const shape = this.shape;

    let canMove = true;

    shape.blocks.forEach((item) => {
      let x = shape.xOffset + item[1] + xStep,
        y = shape.yOffset + item[0] + yStep;
      if (x < 0 || x >= width || y >= height || (map[y] && map[y][x])) {
        canMove = false;
        return canMove;
      }
    });

    if (canMove) {
      shape.xOffset += xStep;
      shape.yOffset += yStep;
    }
    return canMove;
  }

  // 方块触底
  setShapeInMap() {
    const shape = this.shape;
    const map = this.map;

    shape.blocks.forEach((item) => {
      let x = shape.xOffset + item[1],
        y = shape.yOffset + item[0];
      map[y][x] = 1;
    });
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
}

module.exports = Game;
