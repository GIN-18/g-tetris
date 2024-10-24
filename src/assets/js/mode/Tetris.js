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

  static initMatrix() {
    // return new Array(20).fill(0).map(() => new Array(10).fill(0))
    return new Array(22).fill(0).map(() => new Array(10).fill(0))
  }

  constructor() {
    this.matrix = Tetris.initMatrix()

    this.currentBag = Tetris.getBag()
    this.nextBag = Tetris.getBag()

    this.activeTetromino = null
    this.holdTetromino = null

    this.level = 5
    this.lines = 0
    this.score = 0

    this.gameOver = false

    this.tetrisCount = 0
    this.comboCount = 0
    this.backToBackCount = 0
    this.TSpinCount = 0

    this.oldLines = 0
    this.gameLoopTimer = null

    this.tetrominoLockTimer = null
    this.lockDelay = 500

    this.isSoftDrop = false
  }

  resetGame() {
    clearInterval(this.gameLoopTimer)

    this.matrix = Tetris.initMatrix()

    this.currentBag = Tetris.getBag()
    this.nextBag = Tetris.getBag()

    this.activeTetromino = null
    this.holdTetromino = null

    this.level = 1
    this.lines = 0
    this.score = 0

    this.gameOver = false

    this.tetrisCount = 0
    this.comboCount = 0
    this.backToBackCount = 0
    this.TSpinCount = 0

    this.oldLines = 0
    this.gameLoopTimer = null

    this.tetrominoLockTimer = null
    this.lockDelay = 500

    this.isSoftDrop = false
  }

  gameLoop() {
    if (this.checkGameover()) return

    if (!this.activeTetromino) {
      this.addTetromino()
    }

    if (this.gameLoopTimer) {
      clearInterval(this.gameLoopTimer)
      this.gameLoopTimer = null
    }

    const dropDelay = this.getDropDelay() // 获取下落间隔时间

    this.gameLoopTimer = setInterval(() => {
      if (this.checkCanMove(0, 1) && !this.checkTetrominoLock()) {
        this.activeTetromino.y += 1
      } else {
        this.lockTetromino()
      }
    }, dropDelay)
  }

  addTetromino() {
    // 产生新方块的时候处理游戏结束
    if (this.checkGameover()) {
      clearInterval(this.gameLoopTimer)
      this.gameOver = true
      return
    }

    this.activeTetromino = this.currentBag[0] // 在当前背包中获取第一个方块作为当前方块
    this.updateBag() // 更新背包
  }

  moveLeft() {
    if (this.checkCanMove(-1, 0)) {
      this.activeTetromino.x += -1

      if (this.checkTetrominoLock()) {
        this.resetTetrominoLock()
      }
    }
  }

  moveRight() {
    if (this.checkCanMove(1, 0)) {
      this.activeTetromino.x += 1

      if (this.checkTetrominoLock()) {
        this.resetTetrominoLock()
      }
    }
  }

  hardDrop() {
    if (!this.activeTetromino) return

    this.updateScoreByHardDrop() // 硬降更新分数

    // 下落直到触底
    while (!this.checkTetrominoLock() && this.checkCanMove(0, 1)) {
      this.activeTetromino.y += 1
    }

    // 硬降时直接锁定
    this.resetTetrominoLock()
    this.landTetromino()
  }

  // TODO: 按钮连续降落
  softDrop(enable) {
    if (!this.activeTetromino) return

    if (enable && this.checkCanMove(0, 1)) {
      this.activeTetromino.y += 1
      this.score += 1
    }
  }

  rotateRight() {
    this.rotateTetromino(1)
  }

  rotateLeft() {
    this.rotateTetromino(-1)
  }

  rotateFlip() {
    this.rotateTetromino(2)
  }

  rotateTetromino(rotationStep) {
    if (!this.activeTetromino) return

    this.resetTetrominoLock()

    const rotationInfo = this.checkRotation(rotationStep, 0)

    if (rotationInfo.canRotate) {
      this.activeTetromino.x += rotationInfo.wallKickXOffset
      this.activeTetromino.y += rotationInfo.wallKickYOffset
      this.activeTetromino.rotation = rotationInfo.nextRotation
    }

    this.lockTetromino()
  }

  lockTetromino() {
    if (!this.checkTetrominoLock()) return // 不能锁定时直接返回

    // 锁定时停止游戏
    if (this.gameLoopTimer) {
      clearInterval(this.gameLoopTimer)
      this.gameLoopTimer = null
    }

    // 延迟锁定
    this.tetrominoLockTimer = setTimeout(() => {
      this.landTetromino() // 方块落地
    }, this.lockDelay)
  }

  landTetromino() {
    this.updateHoldLock()
    this.mergeMatrix()
    this.checkTetris()
    this.checkCombo()
    this.updateLines()
    this.updateLevel()
    this.updateScore()
    this.clearFilledLines()
    this.resetTetrominoLocation()
    this.addTetromino()
    this.gameLoop()
  }

  clearFilledLines() {
    const filledLines = this.getFilledLines() // 获取满行
    const width = this.matrix[0].length

    if (!filledLines.length) return

    this.resetBackToBackCount() // 重置背靠背次数
    // this.checkTSpin() // NOTE: 是否在这里检查T-Spin

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
    if (!this.activeTetromino) return

    let tempTetromino = null

    if (!this.holdTetromino) {
      clearInterval(this.gameLoopTimer)
      this.resetTetrominoLock()
      this.resetTetrominoLocation()
      this.holdTetromino = this.activeTetromino
      this.holdTetromino.holdLock = true
      this.addTetromino()
      this.gameLoop()
    } else if (!this.holdTetromino.holdLock) {
      clearInterval(this.gameLoopTimer)
      this.resetTetrominoLock()
      this.resetTetrominoLocation()
      tempTetromino = this.activeTetromino
      this.activeTetromino = this.holdTetromino
      this.holdTetromino = tempTetromino
      this.holdTetromino.holdLock = true
      this.gameLoop()
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

  updateScoreByHardDrop() {
    const increment = this.getBottomDistance() * 2
    this.score += increment
  }

  updateScoreBySoftDrop() {
    if (this.isSoftDrop) {
      this.score += 1
    }
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

  // TODO: update score acording to T-Spin
  getScore() {
    let index, score
    const lineScore = [100, 300, 500, 800]

    if (!this.getLines()) {
      score = 0
      return score
    }

    index = this.getLines() - 1
    score = lineScore[index] * this.level

    if (this.comboCount > 0) {
      score += 50 * this.level * (this.comboCount - 1)
    }

    if (this.backToBackCount > 1) {
      score += score * 1.5
    }

    return score
  }

  getDropDelay() {
    return Math.pow(0.8 - (this.level - 1) * 0.007, this.level - 1) * 1000
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

  // 获取当前方块距离底部的距离
  getBottomDistance() {
    const y = this.activeTetromino.y
    return this.getLandTetrominoYOffset(y) - y
  }

  getLandTetrominoYOffset(offset) {
    const tetromino = this.activeTetromino
    const piece = tetromino.pieces[tetromino.rotation]
    const h = this.matrix.length - 2

    for (let i = 0; i < piece.length; i++) {
      const x = piece[i][0] + tetromino.x
      const y = piece[i][1] + offset

      if (
        offset >= tetromino.y &&
        (y > h || (this.matrix[y] && this.matrix[y + 1][x]))
      ) {
        return offset
      }
    }
    return this.getLandTetrominoYOffset(offset + 1)
  }

  checkCanMove(xStep, yStep) {
    const piece = this.activeTetromino.pieces[this.activeTetromino.rotation]
    const w = this.matrix[0].length
    const h = this.matrix.length

    for (let i = 0; i < piece.length; i++) {
      const x = piece[i][0] + this.activeTetromino.x + xStep
      const y = piece[i][1] + this.activeTetromino.y + yStep

      // 碰撞检测
      if (x < 0 || x >= w || y >= h || this.matrix[y][x]) return false
    }

    return true
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

  checkTetris() {
    if (this.getLines() === 4) {
      this.backToBackCount += 1
      this.tetrisCount += 1
      return
    }
    this.tetrisCount = 0
  }

  checkCombo() {
    if (this.getLines()) {
      this.comboCount += 1
      return
    }
    this.comboCount = 0
  }

  // TODO: check T-Spin
  checkTSpin() {
    console.log('check T-Spin')
  }

  // 检查当前方块是否可以锁定
  checkTetrominoLock() {
    // 如果当前方块距离底部的距离等于0，可以触发锁定
    if (this.getBottomDistance() === 0) {
      return true
    }
    return false
  }

  // 如果地图的第一行已经存在方块的话，游戏结束
  checkGameover() {
    return this.matrix[1].some((item) => item > 0)
  }

  resetTetrominoLocation() {
    this.activeTetromino.x = 4
    this.activeTetromino.y = 1
    this.activeTetromino.rotation = 0
  }

  resetBackToBackCount() {
    const lines = [1, 2, 3]

    if (lines.includes(this.getLines())) {
      this.backToBackCount = 0
    }
  }

  resetTetrominoLock() {
    if (this.tetrominoLockTimer) {
      clearTimeout(this.tetrominoLockTimer)
      this.tetrominoLockTimer = null
      this.gameLoop()
    }
  }

  remapTetrominoName(name) {
    const arr = ['T', 'Z', 'S', 'J', 'L']
    if (arr.includes(name)) {
      return 'A'
    }
    return name
  }
}
