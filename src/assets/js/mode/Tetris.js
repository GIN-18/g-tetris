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

  constructor(width, height) {
    this.matrix = new Array(height).fill(0).map(() => new Array(width).fill(0))

    this.currentBag = Tetris.getBag()
    this.nextBag = Tetris.getBag()

    this.activeTetromino = null
    this.holdTetromino = null

    this.level = 1
    this.lines = 0
    this.score = 0

    this.gameOver = false

    this.oldLines = 0
    this.lastRenderTime = 0

    this.tetrisNum = 0
    this.comboNum = 0
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

  addTetromino() {
    if (!this.activeTetromino || !this.checkGameover()) {
      this.activeTetromino = this.currentBag[0] // 在当前背包中获取第一个方块作为当前方块
      this.updateBag() // 更新背包
      return
    }

    this.gameOver = true
  }

  moveTetromino(xStep, yStep) {
    const piece = this.activeTetromino.pieces[this.activeTetromino.rotation]
    const w = this.matrix[0].length
    const h = this.matrix.length

    let canMove = true

    for (let i = 0; i < piece.length; i++) {
      const x = piece[i][0] + this.activeTetromino.x + xStep
      const y = piece[i][1] + this.activeTetromino.y + yStep

      if (x < 0 || x >= w || y >= h || this.matrix[y][x]) {
        canMove = false
        return canMove
      }
    }

    if (canMove) {
      this.activeTetromino.x += xStep
      this.activeTetromino.y += yStep
      return canMove
    }
  }

  rotateTetromino(rotationStep) {
    const rotationInfo = this.checkRotation(rotationStep, 0)

    if (rotationInfo.canRotate) {
      this.activeTetromino.x += rotationInfo.wallKickXOffset
      this.activeTetromino.y += rotationInfo.wallKickYOffset
      this.activeTetromino.rotation = rotationInfo.nextRotation
    }
  }

  landTetromino() {
    this.updateHoldLock()
    this.mergeMatrix()
    this.updateLines()
    this.updateLevel()
    this.updateScore()
    this.checkTetris()
    this.checkCombo()
    this.clearFilledLines()
    this.resetTetrominoLocation()
    this.addTetromino()
  }

  clearFilledLines() {
    const filledLines = this.getFilledLines() // 获取满行
    const width = this.matrix[0].length

    if (!filledLines.length) return // 没有满行直接返回

    for (let i = 0; i < filledLines.length; i++) {
      this.matrix.splice(filledLines[i], 1) // 删除满行
      this.matrix.unshift(new Array(width).fill(0)) // 在数组顶部插入空行
    }
  }

  // 合并当前方块到地图矩阵
  mergeMatrix() {
    const type = this.activeTetromino.type
    const piece = this.activeTetromino.pieces[this.activeTetromino.rotation]

    for (let i = 0; i < piece.length; i++) {
      const x = piece[i][0] + this.activeTetromino.x
      const y = piece[i][1] + this.activeTetromino.y

      this.matrix[y][x] = type
    }
  }

  updateHoldTetromino() {
    let tempTetromino = null

    if (!this.holdTetromino) {
      this.resetTetrominoLocation()
      this.holdTetromino = this.activeTetromino
      this.holdTetromino.holdLock = true
      this.addTetromino()
    } else if (!this.holdTetromino.holdLock) {
      this.resetTetrominoLocation()
      tempTetromino = this.activeTetromino
      this.activeTetromino = this.holdTetromino
      this.holdTetromino = tempTetromino
      this.holdTetromino.holdLock = true
    }
  }

  updateHoldLock() {
    if (this.holdTetromino) {
      this.holdTetromino.holdLock = false
    }
  }

  updateBag() {
    this.currentBag.shift() // 在当前背包中删除第一个方块
    this.currentBag.push(this.nextBag.shift()) // 在当前背包中添加下一个背包中添加第一个方块

    // 如果下一个背包为空，就重新洗牌
    if (!this.nextBag.length) {
      this.nextBag = Tetris.getBag()
    }
  }

  updateLines() {
    this.lines += this.getLines()
  }

  updateLevel() {
    this.level += this.getLevelIncrement()
  }

  updateScore() {
    this.score += this.getScore()
  }

  // 获取消除的行数
  getLines() {
    return this.getFilledLines().length
  }

  getLevelIncrement() {
    const increment = Math.floor(this.lines / 10)

    if (increment > 0 && Math.abs(this.oldLines - this.lines) >= 10) {
      this.oldLines += 10
      return 1
    }

    return 0
  }

  // TODO: update score acording to T-Spin, T-Spin Mini, BackToBack and Combo
  getScore() {
    let index, score
    const lineScore = [100, 300, 500, 800]

    if (!this.getLines()) {
      score = 0
    } else {
      index = this.getLines() - 1
      score = lineScore[index] * this.level
    }

    return score
  }

  getDropInterval() {
    return Math.pow(0.8 - (this.level - 1) * 0.007, this.level - 1)
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

  checkRotation(rotationStep, wallKickIndex) {
    if (wallKickIndex > 4) {
      return {
        canRotate: false,
      }
    }

    let wallKickXOffset = 0
    let wallKickYOffset = 0
    let nextRotation = 0
    let currentRotation = this.activeTetromino.rotation

    nextRotation = (currentRotation + rotationStep) % 4

    if (nextRotation < 0) {
      nextRotation = 3
    }

    const nextRotationTetromino = this.activeTetromino.pieces[nextRotation]
    const name = this.remapTetrominoName(this.activeTetromino.name)

    wallKickXOffset =
      Tetris.rotationOffset[name][currentRotation][wallKickIndex][0] -
      Tetris.rotationOffset[name][nextRotation][wallKickIndex][0]

    wallKickYOffset =
      Tetris.rotationOffset[name][currentRotation][wallKickIndex][1] -
      Tetris.rotationOffset[name][nextRotation][wallKickIndex][1]

    for (let i = 0; i < nextRotationTetromino.length; i++) {
      const x =
        nextRotationTetromino[i][0] + this.activeTetromino.x + wallKickXOffset
      const y =
        nextRotationTetromino[i][1] + this.activeTetromino.y + wallKickYOffset

      if (
        !this.matrix[y] ||
        this.matrix[y][x] ||
        this.matrix[y][x] === undefined
      ) {
        return this.checkRotation(rotationStep, wallKickIndex + 1)
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
      return
    }
    this.comboNum = 0
  }

  checkTetris() {
    if (this.getLines() === 4) {
      this.tetrisNum += 1
      return
    }
    this.tetrisNum = 0
  }

  checkGameover() {
    const piece = this.activeTetromino.pieces[this.activeTetromino.rotation]

    for (let i = 0; i < piece.length; i++) {
      const x = piece[i][0] + this.activeTetromino.x
      const y = piece[i][1] + this.activeTetromino.y

      if (this.matrix[y][x]) {
        return true
      }
    }

    return false
  }

  resetTetrominoLocation() {
    this.activeTetromino.x = 4
    this.activeTetromino.y = 1
    this.activeTetromino.rotation = 0
  }

  remapTetrominoName(name) {
    const arr = ['T', 'Z', 'S', 'J', 'L']
    if (arr.includes(name)) {
      return 'A'
    }
    return name
  }
}
