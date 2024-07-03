import { palette } from "@/assets/js/palette.js";

export class Tetris {
  constructor() {
    this.tetrominoes = {
      O: {
        name: "O",
        type: 1,
        color: palette.tetrominoColor[0],
        x: 4,
        y: 0,
        rotation: 0,
        hold: false,
        pieces: [
          [
            [0, 0],
            [1, 0],
            [0, -1],
            [1, -1],
          ],
          [
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1],
          ],
          [
            [0, 0],
            [-1, 0],
            [0, 1],
            [-1, 1],
          ],
          [
            [0, 0],
            [-1, 0],
            [0, -1],
            [-1, -1],
          ],
        ],
      },
      I: {
        name: "I",
        type: 2,
        color: palette.tetrominoColor[1],
        x: 4,
        y: 0,
        rotation: 0,
        hold: false,
        pieces: [
          [
            [0, 0],
            [-1, 0],
            [1, 0],
            [2, 0],
          ],
          [
            [0, 0],
            [0, -1],
            [0, 1],
            [0, 2],
          ],
          [
            [0, 0],
            [1, 0],
            [-1, 0],
            [-2, 0],
          ],
          [
            [0, 0],
            [0, 1],
            [0, -1],
            [0, -2],
          ],
        ],
      },
      T: {
        name: "T",
        type: 3,
        color: palette.tetrominoColor[2],
        x: 4,
        y: 0,
        rotation: 0,
        hold: false,
        pieces: [
          [
            [0, 0],
            [-1, 0],
            [1, 0],
            [0, -1],
          ],
          [
            [0, 0],
            [0, -1],
            [0, 1],
            [1, 0],
          ],
          [
            [0, 0],
            [-1, 0],
            [1, 0],
            [0, 1],
          ],
          [
            [0, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ],
        ],
      },
      S: {
        name: "S",
        type: 4,
        color: palette.tetrominoColor[3],
        x: 4,
        y: 0,
        rotation: 0,
        hold: false,
        pieces: [
          [
            [0, 0],
            [-1, 0],
            [0, -1],
            [1, -1],
          ],
          [
            [0, 0],
            [1, 0],
            [0, -1],
            [1, 1],
          ],
          [
            [0, 0],
            [-1, 1],
            [1, 0],
            [0, 1],
          ],
          [
            [0, 0],
            [-1, 0],
            [-1, -1],
            [0, 1],
          ],
        ],
      },
      Z: {
        name: "Z",
        type: 5,
        color: palette.tetrominoColor[4],
        x: 4,
        y: 0,
        rotation: 0,
        hold: false,
        pieces: [
          [
            [0, 0],
            [-1, -1],
            [1, 0],
            [0, -1],
          ],
          [
            [0, 0],
            [1, 0],
            [0, 1],
            [1, -1],
          ],
          [
            [0, 0],
            [-1, 0],
            [1, 1],
            [0, 1],
          ],
          [
            [0, 0],
            [-1, 0],
            [0, -1],
            [-1, 1],
          ],
        ],
      },
      J: {
        name: "J",
        type: 6,
        color: palette.tetrominoColor[5],
        x: 4,
        y: 0,
        rotation: 0,
        hold: false,
        pieces: [
          [
            [0, 0],
            [-1, 0],
            [1, 0],
            [-1, -1],
          ],
          [
            [0, 0],
            [0, -1],
            [0, 1],
            [1, -1],
          ],
          [
            [0, 0],
            [-1, 0],
            [1, 0],
            [1, 1],
          ],
          [
            [0, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
          ],
        ],
      },
      L: {
        name: "L",
        type: 7,
        color: palette.tetrominoColor[6],
        x: 4,
        y: 0,
        rotation: 0,
        hold: false,
        pieces: [
          [
            [0, 0],
            [-1, 0],
            [1, 0],
            [1, -1],
          ],
          [
            [0, 0],
            [1, 1],
            [0, -1],
            [0, 1],
          ],
          [
            [0, 0],
            [-1, 0],
            [1, 0],
            [-1, 1],
          ],
          [
            [0, 0],
            [-1, -1],
            [0, -1],
            [0, 1],
          ],
        ],
      },
    };
    this.rotationOffset = {
      A: [
        [
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0],
        ],
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, -2],
          [1, -2],
        ],
        [
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0],
        ],
        [
          [0, 0],
          [-1, 0],
          [-1, 1],
          [0, -2],
          [-1, -2],
        ],
      ],
      I: [
        [
          [0, 0],
          [-1, 0],
          [2, 0],
          [-1, 0],
          [2, 0],
        ],
        [
          [-1, 0],
          [0, 0],
          [0, 0],
          [0, -1],
          [0, 2],
        ],
        [
          [-1, -1],
          [1, -1],
          [-2, -1],
          [1, 0],
          [-2, 0],
        ],
        [
          [0, -1],
          [0, -1],
          [0, -1],
          [0, 1],
          [0, -2],
        ],
      ],
      O: [
        [
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0],
        ],
        [
          [0, 1],
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0],
        ],
        [
          [-1, 1],
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0],
        ],
        [
          [-1, 0],
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0],
        ],
      ],
    };

    this.matrix = new Array(20).fill(0).map(() => new Array(10).fill(0));
    this.nextBag = this.getBag();
  }

  getCurrentTetromino(currentBag) {
    return currentBag[0];
  }

  updateBag(currentBag) {
    currentBag.shift();
    currentBag.push(this.nextBag.shift());

    if (!this.nextBag.length) {
      this.nextBag = this.getBag();
    }
  }

  getBag() {
    const tetrominoBag = [];
    const bag = this.shuffleBag();

    for (let i = 0; i < bag.length; i++) {
      tetrominoBag.push(this.tetrominoes[bag[i]]);
    }

    return tetrominoBag;
  }

  shuffleBag() {
    const arr = ["I", "J", "L", "O", "S", "T", "Z"];

    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  }
}
