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
    this.xOffset = 3;
    this.yOffset = 0;
  }

  drawPiece(piece, map) {
    let x = this.xOffset;
    let y = this.yOffset;
    for (let n = 0; n < piece.length; n++) {
      for (let m = 0; m < piece[n].length; m++) {
        if (piece[n][m]) {
          map[n + y][m + x] = "1";
        }
      }
    }
  }
  cleanPiece(piece, map) {
    let x = this.xOffset;
    let y = this.yOffset;
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
  checkBoundary(piece, map) {
    let x = this.xOffset;
    let y = this.yOffset;
    // map[y][x + piece[0].length] = 2

    // check collision with left
    if (map[y][x - 1] === 1 || map[y][x - 1] === undefined) {
      return true;
    }
    // check collision with right
    if (
      map[y][x + piece[0].length] === 1 ||
      map[y][x + piece[0].length] === undefined
    ) {
      return true;
    }

    return false
  }
}

let game = new Game();

let piece = new Piece();

let currentPiece = piece.shapes[piece.type];

piece.drawPiece(currentPiece, game.map);

// piece.checkBoundary(currentPiece, game.map);
// console.table(game.map);

move();

// test to move
function move() {
  document.documentElement.addEventListener("keydown", (e) => {
    // move to left
    if (e.keyCode === 37) {
      if (!piece.checkBoundary(currentPiece, game.map)) {
        // piece.checkBoundary(currentPiece, game.map);
        piece.cleanPiece(currentPiece, game.map);
        piece.xOffset -= 1;
        piece.drawPiece(currentPiece, game.map);
        console.table(game.map);
      }
    }
    // move to right
    if (e.keyCode === 39) {
      if (!piece.checkBoundary(currentPiece, game.map)) {
        // piece.checkBoundary(currentPiece, game.map);
        piece.cleanPiece(currentPiece, game.map);
        piece.xOffset += 1;
        piece.drawPiece(currentPiece, game.map);
        console.table(game.map);
      }
    }
    // move to bottom
    if (e.keyCode === 40) {
      piece.checkBoundary(currentPiece, game.map);
      piece.cleanPiece(currentPiece, game.map);
      piece.yOffset += 1;
      piece.drawPiece(currentPiece, game.map);
      console.table(game.map);
    }
    // rotate piece
    if (e.keyCode === 32) {
      piece.checkBoundary(currentPiece, game.map);
      piece.cleanPiece(currentPiece, game.map);
      currentPiece = piece.rotatePiece(currentPiece, game.map);
      piece.drawPiece(currentPiece, game.map);
      console.table(game.map);
    }
  });
}
