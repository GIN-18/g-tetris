import { palette } from '@/assets/js/palette.js'

export class Tetris {
  static tetrominoes = {
    O: {
      name: 'O',
      type: 1,
      color: palette.tetrominoColor[0],
      x: 4,
      y: 1,
      rotation: 0,
      holdLock: false,
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
      name: 'I',
      type: 2,
      color: palette.tetrominoColor[1],
      x: 4,
      y: 1,
      rotation: 0,
      holdLock: false,
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
      name: 'T',
      type: 3,
      color: palette.tetrominoColor[2],
      x: 4,
      y: 1,
      rotation: 0,
      holdLock: false,
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
      name: 'S',
      type: 4,
      color: palette.tetrominoColor[3],
      x: 4,
      y: 1,
      rotation: 0,
      holdLock: false,
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
      name: 'Z',
      type: 5,
      color: palette.tetrominoColor[4],
      x: 4,
      y: 1,
      rotation: 0,
      holdLock: false,
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
      name: 'J',
      type: 6,
      color: palette.tetrominoColor[5],
      x: 4,
      y: 1,
      rotation: 0,
      holdLock: false,
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
      name: 'L',
      type: 7,
      color: palette.tetrominoColor[6],
      x: 4,
      y: 1,
      rotation: 0,
      holdLock: false,
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
  }

  static rotationOffset = {
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
  }

  constructor(matrix, currentBag) {
    this.matrix = matrix
    this.currentBag = currentBag
    this.nextBag = Tetris.getBag()
    this.oldLines = 0
    this.lastRenderTime = 0
    this.comboNum = 0
    this.isCombo = false
  }

  static generateMatrix(width, height) {
    return new Array(height).fill(0).map(() => new Array(width).fill(0))
  }

  static getBag() {
    const tetrominoBag = []
    const bag = Tetris.shuffleBag()

    for (let i = 0; i < bag.length; i++) {
      tetrominoBag.push(Tetris.tetrominoes[bag[i]])
    }

    return tetrominoBag
  }

  static shuffleBag() {
    const arr = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']

    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }

    return arr
  }

  moveTetromino(activeTetromino, xStep, yStep) {
    const piece = activeTetromino.pieces[activeTetromino.rotation]
    const w = this.matrix[0].length
    const h = this.matrix.length

    let canMove = true

    for (let i = 0; i < piece.length; i++) {
      const x = piece[i][0] + activeTetromino.x + xStep
      const y = piece[i][1] + activeTetromino.y + yStep

      if (x < 0 || x >= w || y >= h || this.matrix[y][x]) {
        canMove = false
        return canMove
      }
    }

    if (canMove) {
      activeTetromino.x += xStep
      activeTetromino.y += yStep
      return canMove
    }
  }

  rotateTetromino(activeTetromino, rotationStep) {
    const rotationInfo = this.checkRotation(activeTetromino, rotationStep, 0)

    if (rotationInfo.canRotate) {
      activeTetromino.x += rotationInfo.wallKickXOffset
      activeTetromino.y += rotationInfo.wallKickYOffset
      activeTetromino.rotation = rotationInfo.nextRotation
    }
  }

  updateHoldTetromino(activeTetromino, holdTetromino) {
    let tempTetromino = null

    if (!holdTetromino) {
      this.resetTetrominoOption(activeTetromino)
      holdTetromino = activeTetromino
      holdTetromino.holdLock = true
      activeTetromino = this.getActiveTetromino()
      this.updateBag()
    } else if (!holdTetromino.holdLock) {
      this.resetTetrominoOption(activeTetromino)
      tempTetromino = activeTetromino
      activeTetromino = holdTetromino
      holdTetromino = tempTetromino
      holdTetromino.holdLock = true
    }

    return {
      holdTetromino,
      activeTetromino,
    }
  }

  getDropInterval(level) {
    return Math.pow(0.8 - (level - 1) * 0.007, level - 1)
  }

  getLines() {
    return this.getFilledLines().length
  }

  getLevelIncrement(lines) {
    const increment = Math.floor(lines / 10)

    if (increment > 0 && Math.abs(this.oldLines - lines) >= 10) {
      this.oldLines += 10
      return 1
    }

    return 0
  }

  // TODO: update score acording to T-Spin, T-Spin Mini, BackToBack and Combo
  getScore(level) {
    const lineScore = [100, 300, 500, 800]
    let index, score

    if (!this.getLines()) {
      score = 0
    } else {
      index = this.getLines() - 1
      score = lineScore[index] * level
    }

    return score
  }

  checkGameover(activeTetromino) {
    const piece = activeTetromino.pieces[activeTetromino.rotation]

    for (let i = 0; i < piece.length; i++) {
      const x = piece[i][0] + activeTetromino.x
      const y = piece[i][1] + activeTetromino.y

      if (this.matrix[y][x]) {
        return true
      }
    }

    return false
  }

  checkRotation(activeTetromino, rotationStep, wallKickIndex) {
    if (wallKickIndex > 4) {
      return {
        canRotate: false,
      }
    }

    let wallKickXOffset = 0
    let wallKickYOffset = 0
    let nextRotation = 0
    let currentRotation = activeTetromino.rotation

    nextRotation = (currentRotation + rotationStep) % 4

    if (nextRotation < 0) {
      nextRotation = 3
    }

    const nextRotationTetromino = activeTetromino.pieces[nextRotation]
    const name = this.remapTetrominoName(activeTetromino.name)

    wallKickXOffset =
      Tetris.rotationOffset[name][currentRotation][wallKickIndex][0] -
      Tetris.rotationOffset[name][nextRotation][wallKickIndex][0]

    wallKickYOffset =
      Tetris.rotationOffset[name][currentRotation][wallKickIndex][1] -
      Tetris.rotationOffset[name][nextRotation][wallKickIndex][1]

    for (let i = 0; i < nextRotationTetromino.length; i++) {
      const x =
        nextRotationTetromino[i][0] + activeTetromino.x + wallKickXOffset
      const y =
        nextRotationTetromino[i][1] + activeTetromino.y + wallKickYOffset

      if (
        !this.matrix[y] ||
        this.matrix[y][x] ||
        this.matrix[y][x] === undefined
      ) {
        return this.checkRotation(
          activeTetromino,
          rotationStep,
          wallKickIndex + 1,
        )
      }
    }

    return {
      canRotate: true,
      wallKickXOffset,
      wallKickYOffset,
      nextRotation,
    }
  }

  checkCombo() {
    if (this.getLines()) {
      this.comboNum += 1
    } else {
      this.comboNum = 0
    }

    if (this.comboNum > 1) {
      this.isCombo = true
    } else {
      this.isCombo = false
    }
  }

  remapTetrominoName(name) {
    const arr = ['T', 'Z', 'S', 'J', 'L']
    if (arr.includes(name)) {
      return 'A'
    }
    return name
  }

  mergeMatrix(activeTetromino) {
    const type = activeTetromino.type
    const piece = activeTetromino.pieces[activeTetromino.rotation]

    for (let i = 0; i < piece.length; i++) {
      const x = piece[i][0] + activeTetromino.x
      const y = piece[i][1] + activeTetromino.y

      this.matrix[y][x] = type
    }
  }

  clearFilledLines() {
    const filledLines = this.getFilledLines() // 获取满行
    const width = this.matrix[0].length

    this.checkCombo()

    if (!filledLines.length) return // 没有满行直接返回

    for (let i = 0; i < filledLines.length; i++) {
      this.matrix.splice(filledLines[i], 1) // 删除满行
      this.matrix.unshift(new Array(width).fill(0)) // 在数组顶部插入空行
    }
  }

  getFilledLines() {
    const filledLines = []

    for (let i = 0; i < this.matrix.length; i++) {
      const isFilled = this.matrix[i].includes(0)

      if (!isFilled) {
        filledLines.push(i)
      }
    }

    return filledLines
  }

  getActiveTetromino() {
    return this.currentBag[0]
  }

  updateBag() {
    this.currentBag.shift()
    this.currentBag.push(this.nextBag.shift())

    if (!this.nextBag.length) {
      this.nextBag = Tetris.getBag()
    }
  }

  resetTetrominoOption(activeTetromino) {
    activeTetromino.x = 4
    activeTetromino.y = 1
    activeTetromino.rotation = 0
  }
}
