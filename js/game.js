const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 180;
canvas.height = 360;

const unitPiece = 17;
const unitBlock = 18;

const width = canvas.width / unitBlock;
const height = canvas.height / unitBlock;

class Game {
  constructor() {
    this.map = [...Array(height)].map(() => Array(width).fill("0"));
  }
}

class Piece {
  constructor() {
    this.shapes = [
      [[1, 1, 1, 1]],
      [
        [2, 2],
        [2, 2],
      ],
      [
        [0, 3, 0],
        [3, 3, 3],
      ],
      [
        [0, 4, 4],
        [4, 4, 0],
      ],
      [
        [5, 5, 0],
        [0, 5, 5],
      ],
      [
        [6, 0, 0],
        [6, 6, 6],
      ],
      [
        [0, 0, 7],
        [7, 7, 7],
      ],
    ];
    this.type = Math.floor(Math.random() * this.shapes.length);
    this.xOffset = 0;
    this.yOffset = 0;
  }

  drawPiece(piece, map) {
    let x = this.xOffset / unitBlock;
    let y = this.yOffset / unitBlock;
    for (let n = 0; n < piece.length; n++) {
      for (let m = 0; m < piece[n].length; m++) {
        if (piece[n][m]) {
          map[n + y][m + x] = "1";
        }
      }
    }
  }
  cleanPiece(piece, map) {
    let x = this.xOffset / unitBlock;
    let y = this.yOffset / unitBlock;
    for (let n = 0; n < piece.length; n++) {
      for (let m = 0; m < piece[n].length; m++) {
        if (piece[n][m]) {
          map[n + y][m + x] = "0";
        }
      }
    }
  }
  rotatePiece(piece) {
    let n = piece.length;
    let m = piece[0].length;
    let tempPiece = [];
    for (let i = 0; i < m; i++) {
      tempPiece[i] = Array(n);
    }

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        tempPiece[j][n - 1 - i] = piece[i][j];
      }
    }
    return tempPiece;
  }
  checkBoundary(piece) {
    let n = piece.length;
    let m = piece[0].length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        console.log(piece[i][j]);
      }
    }
  }
}

let game = new Game();

let piece = new Piece();

let currentPiece = piece.shapes[piece.type];

piece.drawPiece(currentPiece, game.map);

move();

// test to move
function move() {
  document.documentElement.addEventListener("keydown", (e) => {
    // move to left
    if (e.keyCode === 37) {
      piece.checkBoundary(currentPiece);
      piece.cleanPiece(currentPiece, game.map);
      piece.xOffset -= unitBlock;
      piece.drawPiece(currentPiece, game.map);
      console.table(game.map);
    }
    // move to right
    if (e.keyCode === 39) {
      piece.checkBoundary(currentPiece);
      piece.cleanPiece(currentPiece, game.map);
      piece.xOffset += unitBlock;
      piece.drawPiece(currentPiece, game.map);
      console.table(game.map);
    }
    // move to bottom
    if (e.keyCode === 40) {
      piece.checkBoundary(currentPiece);
      piece.cleanPiece(currentPiece, game.map);
      piece.yOffset += unitBlock;
      piece.drawPiece(currentPiece, game.map);
      console.table(game.map);
    }
    // rotate piece
    if (e.keyCode === 32) {
      piece.checkBoundary(currentPiece);
      piece.cleanPiece(currentPiece, game.map);
      currentPiece = piece.rotatePiece(currentPiece, game.map);
      piece.drawPiece(currentPiece, game.map);
      console.table(game.map);
    }
  });
}
