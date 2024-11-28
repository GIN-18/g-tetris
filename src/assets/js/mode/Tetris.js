export class Tetris {
  static ARR_List = [0, 10, 50, 100, 150]
  static DAS_List = [0, 50, 100, 200, 300, 500]

  static palette = {
    ghostPieceColor: '#7c7c7c',
    tetrominoColor: [
      '#f8b800',
      '#3cbcfc',
      '#9878f8',
      '#58d854',
      '#f85898',
      '#6888fc',
      '#f87858',
    ],
  }

  static tetrominoes = {
    O: {
      name: 'O',
      type: 1,
      color: Tetris.palette.tetrominoColor[0],
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
      color: Tetris.palette.tetrominoColor[1],
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
      color: Tetris.palette.tetrominoColor[2],
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
      color: Tetris.palette.tetrominoColor[3],
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
      color: Tetris.palette.tetrominoColor[4],
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
      color: Tetris.palette.tetrominoColor[5],
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
      color: Tetris.palette.tetrominoColor[6],
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
    return new Array(22).fill(0).map(() => new Array(10).fill(0))
  }

  constructor(DAR = 200, ARR = 50) {
    this.matrix = Tetris.initMatrix()

    this.blockSize = 16

    this.currentBag = Tetris.getBag()
    this.nextBag = Tetris.getBag()

    this.activeTetromino = null
    this.holdTetromino = null

    this.lines = 0

    this.gameOver = false

    this.tetrisCount = 0
    this.comboCount = 0
    this.maxComboCount = 0
    this.backToBackCount = 0
    this.maxBackToBackCount = 0

    this.TSpinCount = 0
    this.TSpinType = ''

    this.miniTSpinCount = 0
    this.miniTSpinType = ''

    this.gameLoopTimerId = null

    this.tetrominoLockTimer = null
    this.lockDelay = 500

    this.maneuver = '' // 当前的动作

    this.dropDelay = 1000 // 下落间隔

    this.DAS_ID = null
    this.DAS = DAR
    this.ARR = ARR
    this.DAS_Counter = 0

    this.lastTimestamp = performance.now()

    this.messageList = []
    this.messageDuration = 1000
  }

  resetGame() {
    this.stopGameLoop()
    this.resetTetrominoLocation()

    this.matrix = Tetris.initMatrix()

    this.blockSize = 16

    this.currentBag = Tetris.getBag()
    this.nextBag = Tetris.getBag()

    this.activeTetromino = null
    this.holdTetromino = null

    this.lines = 0

    this.gameOver = false

    this.tetrisCount = 0
    this.comboCount = 0
    this.maxComboCount = 0
    this.backToBackCount = 0
    this.maxBackToBackCount = 0

    this.TSpinCount = 0
    this.TSpinType = ''

    this.miniTSpinCount = 0
    this.miniTSpinType = ''

    this.gameLoopTimerId = null

    this.tetrominoLockTimer = null
    this.lockDelay = 500

    this.maneuver = ''

    this.dropDelay = 1000

    this.DAS_ID = null
    this.DAS_Counter = 0

    this.lastTimestamp = performance.now()

    this.messageList = []
    this.messageDuration = 1000
  }

  playGame() {
    if (!this.activeTetromino) {
      this.addTetromino()
    }

    this.gameLoop()
  }

  gameLoop(timestamp) {
    if (this.checkGameOver()) {
      this.handleGameOver()
      return
    }

    if (timestamp === undefined) {
      timestamp = performance.now()
    }

    const deltaTime = timestamp - this.lastTimestamp

    if (deltaTime >= this.dropDelay) {
      if (this.checkCanMove(0, 1)) {
        this.setManeuver('drop')
        this.activeTetromino.y += 1
      }

      this.lastTimestamp = timestamp
    }

    // 处理消息
    if (this.messageList.length > 0) {
      this.messageDuration -= 10
    }

    if (this.messageDuration <= 0) {
      this.messageList.shift()
      this.messageDuration = 1000
    }

    this.gameLoopTimerId = requestAnimationFrame((timestamp) =>
      this.gameLoop(timestamp),
    )

    if (!this.checkCanMove(0, 1)) {
      this.lockTetromino()
    }
  }

  stopGameLoop() {
    cancelAnimationFrame(this.gameLoopTimerId)
  }

  addMessage(message) {
    if (this.messageList.length) {
      this.messageList.length = 0
      this.messageDuration = 1000
    }

    this.messageList.push(message)
  }

  addTetromino() {
    // 产生新方块的时候处理游戏结束
    if (this.checkGameOver()) {
      this.handleGameOver()
      return
    }

    this.updateMaxComboCount()
    this.DAS_Counter = 0

    this.activeTetromino = this.currentBag[0] // 在当前背包中获取第一个方块作为当前方块
    this.updateBag() // 更新背包
  }

  handleGameOver() {
    this.stopGameLoop()
    this.gameOver = true
  }

  moveLeft(enable) {
    this.setManeuver('left')
    this.moveHorizontal(-1, enable)
  }

  moveRight(enable) {
    this.setManeuver('right')
    this.moveHorizontal(1, enable)
  }

  hardDrop() {
    if (!this.activeTetromino) return

    this.setManeuver('hardDrop')

    // 下落直到触底
    while (this.checkCanMove(0, 1)) {
      this.activeTetromino.y += 1
    }

    // 硬降时直接锁定
    this.stopGameLoop()
    this.resetTetrominoLock()
    this.landTetromino()
  }

  softDrop(enable) {
    if (!this.activeTetromino) return

    if (enable && this.checkCanMove(0, 1)) {
      this.setManeuver('softDrop')
      this.dropDelay = 10

      if (this.tetrominoLockTimer) {
        this.resetTetrominoLock()
      }
    } else if (!enable) {
      this.dropDelay = 1000
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

  moveHorizontal(direction, enable) {
    if (this.activeTetromino && this.checkCanMove(direction, 0) && enable) {
      this.activeTetromino.x += direction

      if (this.tetrominoLockTimer) {
        this.stopGameLoop()
        this.resetTetrominoLock()
        this.gameLoop()
      }
    }

    if (this.DAS_ID) {
      clearInterval(this.DAS_ID)
      this.DAS_Counter = 0
    }

    if (enable) {
      this.DAS_ID = setInterval(() => {
        this.DAS_Counter += this.ARR || 10

        if (this.DAS_Counter >= this.DAS) {
          if (this.activeTetromino && this.checkCanMove(direction, 0)) {
            this.activeTetromino.x += direction

            if (this.tetrominoLockTimer) {
              this.stopGameLoop()
              this.resetTetrominoLock()
              this.gameLoop()
            }
          }
        }
      }, this.ARR)
    }
  }

  rotateTetromino(rotationStep) {
    if (!this.activeTetromino) return

    const rotationInfo = this.checkRotation(rotationStep, 0)

    if (rotationInfo.canRotate) {
      this.maneuver = 'rotate'

      this.activeTetromino.x += rotationInfo.wallKickXOffset
      this.activeTetromino.y += rotationInfo.wallKickYOffset
      this.activeTetromino.rotation = rotationInfo.nextRotation

      if (this.tetrominoLockTimer) {
        this.stopGameLoop()
        this.resetTetrominoLock()
        this.gameLoop()
      }
    }
  }

  lockTetromino() {
    if (!this.checkTetrominoLock()) return // 不能锁定时直接返回

    this.stopGameLoop()

    // 延迟锁定
    this.tetrominoLockTimer = setTimeout(() => {
      this.landTetromino() // 方块落地
    }, this.lockDelay)
  }

  // 方块落地
  landTetromino() {
    this.updateHoldLock() // 更新hold锁定状态
    this.mergeMatrix() // 合并当前方块到地图矩阵

    this.setTSpinType()
    this.setMiniTSpinType()

    // 处理有满行的情况
    if (this.getLines()) {
      this.comboCount += 1 // 满行时，combo加1
      this.showMessageForNormalClear() // 1,2,3消行的提示
      this.updateTetrisCount() // 如果4满行， tetris加1
      this.updateLines() // 更新行数
      this.resetBackToBackCount() // 重置背靠背次数
      this.clearFilledLines()
    } else {
      // 处理没有满行的情况
      this.comboCount = 0 // 没有满行的时候重置combo
    }

    this.resetTetrominoLocation()
    this.addTetromino()
    this.gameLoop()
  }

  clearFilledLines() {
    const filledLines = this.getFilledLines() // 获取满行
    const width = this.matrix[0].length

    for (let i = 0; i < filledLines.length; i++) {
      this.matrix.splice(filledLines[i], 1) // 删除满行
      this.matrix.unshift(new Array(width).fill(0)) // 在数组顶部插入空行
    }
  }

  showMessageForNormalClear() {
    const lines = this.getLines()

    if (lines === 4 || this.checkTSpin() || this.checkMiniTSpin()) return

    let messageTable = null

    if (this.comboCount >= 2) {
      messageTable = {
        1: `SINGLE\n${this.comboCount - 1} COMBO`,
        2: `DOUBLE\n${this.comboCount - 1} COMBO`,
        3: `TRIPLE\n${this.comboCount - 1} COMBO`,
      }
    } else {
      messageTable = {
        1: 'SINGLE',
        2: 'DOUBLE',
        3: 'TRIPLE',
      }
    }

    this.addMessage(`${messageTable[lines]}`)
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
      this.stopGameLoop()
      this.resetTetrominoLock()
      this.resetTetrominoLocation()
      this.holdTetromino = this.activeTetromino
      this.holdTetromino.holdLock = true
      this.addTetromino()
      this.gameLoop()
      return
    }

    if (!this.holdTetromino.holdLock) {
      this.stopGameLoop()
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

  updateTetrisCount() {
    if (this.getLines() === 4) {
      this.tetrisCount += 1
      this.backToBackCount += 1 // tetris时，B2B次数加1

      // tetris时的提示
      if (this.backToBackCount >= 2 && this.comboCount >= 2) {
        this.addMessage(
          `${this.backToBackCount - 1} B2B\nTETRIS\n${this.comboCount - 1} COMBO`,
        )
      } else if (this.backToBackCount >= 2) {
        this.addMessage(`${this.backToBackCount - 1} B2B\nTETRIS`)
      } else if (this.comboCount >= 2) {
        this.addMessage(`TETRIS\n${this.comboCount - 1} COMBO`)
      } else {
        this.addMessage('TETRIS')
      }
    }
  }

  updateMaxComboCount() {
    if (this.comboCount > this.maxComboCount) {
      this.maxComboCount = this.comboCount - 1
    }
  }

  // 获取消除的行数
  getLines() {
    return this.getFilledLines().length
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

  setTSpinType() {
    if (!this.checkTSpin()) {
      this.TSpinType = ''
      return
    }

    this.TSpinCount += 1

    if (!this.getLines()) {
      this.TSpinType = 'T-Spin'
      return
    }

    this.backToBackCount += 1

    let TSpinTypes = null

    if (this.backToBackCount >= 2 && this.comboCount >= 2) {
      TSpinTypes = {
        1: `${this.backToBackCount - 1} B2B\nT-Spin Single\n${this.comboCount - 1} COMBO`,
        2: `${this.backToBackCount - 1} B2B\nT-Spin Double\n${this.comboCount - 1} COMBO`,
        3: `${this.backToBackCount - 1} B2B\nT-Spin Triple\n${this.comboCount - 1} COMBO`,
      }
    } else if (this.backToBackCount >= 2) {
      TSpinTypes = {
        1: `${this.backToBackCount - 1} B2B\nT-Spin Single`,
        2: `${this.backToBackCount - 1} B2B\nT-Spin Double`,
        3: `${this.backToBackCount - 1} B2B\nT-Spin Triple`,
      }
    } else if (this.comboCount >= 2) {
      TSpinTypes = {
        1: `T-Spin Single\n${this.comboCount - 1} COMBO`,
        2: `T-Spin Double\n${this.comboCount - 1} COMBO`,
        3: `T-Spin Triple\n${this.comboCount - 1} COMBO`,
      }
    } else {
      TSpinTypes = {
        1: 'T-Spin Single',
        2: 'T-Spin Double',
        3: 'T-Spin Triple',
      }
    }

    this.addMessage(TSpinTypes[this.getLines()])
    this.TSpinType = TSpinTypes[this.getLines()]
  }

  setMiniTSpinType() {
    if (!this.checkMiniTSpin()) {
      this.miniTSpinType = ''
      return
    }

    this.miniTSpinCount += 1

    if (!this.getLines()) {
      this.miniTSpinType = 'Mini\nT-Spin'
      return
    }

    this.backToBackCount += 1

    let TSpinTypes = null

    if (this.backToBackCount >= 2 && this.comboCount >= 2) {
      TSpinTypes = {
        1: `${this.backToBackCount - 1} B2B\nMini\nT-Spin Single\n${this.comboCount - 1} COMBO`,
        2: `${this.backToBackCount - 1} B2B\nMini\nT-Spin Double\n${this.comboCount - 1} COMBO`,
      }
    } else if (this.backToBackCount >= 2) {
      TSpinTypes = {
        1: `${this.backToBackCount - 1} B2B\nMini\nT-Spin Single`,
        2: `${this.backToBackCount - 1} B2B\nMini\nT-Spin Double`,
      }
    } else if (this.comboCount >= 2) {
      TSpinTypes = {
        1: `Mini\nT-Spin Single\n${this.comboCount - 1} COMBO`,
        2: `Mini\nT-Spin Double\n${this.comboCount - 1} COMBO`,
      }
    } else {
      TSpinTypes = {
        1: 'Mini\nT-Spin Single',
        2: 'Mini\nT-Spin Double',
      }
    }

    this.addMessage(TSpinTypes[this.getLines()])
    this.miniTSpinType = TSpinTypes[this.getLines()]
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

  // TODO:  踢墙后，头部一个顶角存在方块，背部两个底角存在方块，也表现为T-Spin
  checkTSpin() {
    if (this.activeTetromino.name !== 'T') return

    const { isTop1, isTop2, isBottom1, isBottom2 } =
      this.checkTCornerExistence()

    // 最后的操作是旋转；两个顶角都存在方块；任意一个底角存在方块，表现为T-Spin
    if (
      this.maneuver === 'rotate' &&
      isTop1 &&
      isTop2 &&
      (isBottom1 || isBottom2)
    ) {
      return true
    }

    return false
  }

  checkMiniTSpin() {
    if (this.activeTetromino.name !== 'T') return

    const { isTop1, isTop2, isBottom1, isBottom2 } =
      this.checkTCornerExistence()

    if (
      this.maneuver === 'rotate' &&
      (isTop1 || isTop2) &&
      !(isTop1 && isTop2) &&
      ((!isBottom1 && !isBottom2) || (isBottom1 && isBottom2))
    ) {
      return true
    }

    return false
  }

  // 检查T块的顶角和底角是否存在方块
  checkTCornerExistence() {
    // T型方块所在3x3网格中4个角的坐，下标0,1为顶角坐标，2,3为底角坐标
    const corners = [
      // 0旋的顶角坐标
      [
        [1, -1],
        [-1, -1],
        [-1, 1],
        [1, 1],
      ],
      // R旋的顶角坐标
      [
        [1, -1],
        [1, 1],
        [-1, -1],
        [-1, 1],
      ],
      // 2旋的顶角坐标
      [
        [-1, 1],
        [1, 1],
        [1, -1],
        [-1, -1],
      ],
      // L旋的顶角坐标
      [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ],
    ]

    // 获取4个角落地的坐标
    const movedCorners = corners[this.activeTetromino.rotation].map((item) => [
      item[0] + this.activeTetromino.x,
      item[1] + this.activeTetromino.y,
    ])

    const matrix = this.matrix
    const top1 = movedCorners[0] // 第一个顶角坐标
    const top2 = movedCorners[1] // 第二个顶角坐标
    const bottom1 = movedCorners[2] // 第一个底角坐标
    const bottom2 = movedCorners[3] // 第二个底角坐标

    const isTop1 = matrix[top1[1]] && matrix[top1[1]][top1[0]] // 第一个顶角是否存在方块
    const isTop2 = matrix[top2[1]] && matrix[top2[1]][top2[0]] // 第二个顶角是否存在方块
    const isBottom1 = matrix[bottom1[1]] && matrix[bottom1[1]][bottom1[0]] // 第一个底角是否存在方块
    const isBottom2 = matrix[bottom2[1]] && matrix[bottom2[1]][bottom2[0]] // 第二个底角是否存在方块

    return {
      isTop1,
      isTop2,
      isBottom1,
      isBottom2,
    }
  }

  // 检查当前方块是否可以锁定
  checkTetrominoLock() {
    // 如果当前方块距离底部的距离等于0，可以触发锁定
    if (this.getBottomDistance() === 0) {
      return true
    }
    return false
  }

  checkGameOver() {
    return this.matrix[1].some((item) => item > 0) // 如果地图的第一行已经存在方块的话，游戏结束
  }

  // 设置当前操作
  setManeuver(maneuver) {
    this.maneuver = maneuver
  }

  resetTetrominoLocation() {
    if (this.activeTetromino) {
      this.activeTetromino.x = 4
      this.activeTetromino.y = 1
      this.activeTetromino.rotation = 0
    }
  }

  resetBackToBackCount() {
    const lines = [1, 2, 3]

    if (
      lines.includes(this.getLines()) &&
      !this.checkTSpin() &&
      !this.checkMiniTSpin()
    ) {
      if (this.backToBackCount > this.maxBackToBackCount) {
        this.maxBackToBackCount = this.backToBackCount - 1
      }
      this.backToBackCount = 0
    }
  }

  resetTetrominoLock() {
    clearTimeout(this.tetrominoLockTimer)
    this.tetrominoLockTimer = null
  }

  remapTetrominoName(name) {
    const arr = ['T', 'Z', 'S', 'J', 'L']
    if (arr.includes(name)) {
      return 'A'
    }
    return name
  }

  clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  drawHoldTetromino(ctx) {
    if (!this.holdTetromino) return

    const tetromino = this.holdTetromino
    const name = tetromino.name
    const color = tetromino.color
    const piece = tetromino.pieces[0]

    if (tetromino.holdLock) {
      ctx.fillStyle = Tetris.palette.ghostPieceColor
    } else {
      ctx.fillStyle = color
    }

    for (let i = 0; i < piece.length; i++) {
      const x = piece[i][0] + this.getDrawXOffset(name, 1.5, 1)
      const y = piece[i][1] + this.getDrawYOffset(name, 1.5, 2)

      ctx.fillRect(
        x * this.blockSize,
        y * this.blockSize,
        this.blockSize,
        this.blockSize,
      )
    }
  }

  drawBag(ctx) {
    const bag = this.currentBag

    for (let i = 0; i < bag.length; i++) {
      const color = bag[i].color
      const tetromino = bag[i].pieces[0]
      const xOffset = this.getDrawXOffset(bag[i].name, 0.5, 0)
      const yOffset = this.getDrawYOffset(bag[i].name, -0.5, 0)

      ctx.fillStyle = color
      for (let j = 0; j < tetromino.length; j++) {
        const x = tetromino[j][0] + 1 + xOffset
        const y = tetromino[j][1] + 1 + i * 3 + yOffset
        ctx.fillRect(
          x * this.blockSize,
          y * this.blockSize,
          this.blockSize,
          this.blockSize,
        )
      }
    }
  }

  drawMatrix(ctx) {
    const w = this.matrix[0].length
    const h = this.matrix.length

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!this.matrix[y][x]) continue

        ctx.fillStyle = Tetris.palette.tetrominoColor[this.matrix[y][x] - 1]

        ctx.fillRect(
          x * this.blockSize,
          (y - 2) * this.blockSize,
          this.blockSize,
          this.blockSize,
        )
      }
    }
  }

  drawGhostPiece(ctx) {
    const tetromino = this.activeTetromino
    const color = Tetris.palette.ghostPieceColor
    const ghostPieceYOffset = this.getLandTetrominoYOffset(tetromino.y)
    const piece = tetromino.pieces[tetromino.rotation]

    ctx.fillStyle = color

    for (let i = 0; i < piece.length; i++) {
      const x = piece[i][0] + tetromino.x
      const y = piece[i][1] + ghostPieceYOffset

      ctx.fillRect(
        x * this.blockSize,
        (y - 2) * this.blockSize,
        this.blockSize,
        this.blockSize,
      )
    }
  }

  drawActiveTetromino(ctx) {
    const tetromino = this.activeTetromino
    const color = tetromino.color
    const piece = tetromino.pieces[tetromino.rotation]

    ctx.fillStyle = color

    for (let i = 0; i < piece.length; i++) {
      const x = piece[i][0] + tetromino.x
      const y = piece[i][1] + tetromino.y

      ctx.fillRect(
        x * this.blockSize,
        (y - 2) * this.blockSize,
        this.blockSize,
        this.blockSize,
      )
    }
  }

  drawText(ctx, text, fontSize = '12px') {
    const lines = text.toString().split('\n')
    const lineHight = parseInt(fontSize) * 2

    ctx.font = `${fontSize} 'Press Start 2p'`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#f8f8f8'

    lines.forEach((line, index) => {
      ctx.fillText(
        line,
        ctx.canvas.width / 2,
        ctx.canvas.height / 2 + (index - (lines.length - 1) / 2) * lineHight,
      )
    })
  }

  getDrawXOffset(name, xStep, otherXStep) {
    const arr = ['T', 'L', 'J', 'S', 'Z']

    if (arr.includes(name)) {
      return xStep
    }

    return otherXStep
  }

  getDrawYOffset(name, yStep, otherYStep) {
    if (name === 'I') {
      return yStep
    }

    return otherYStep
  }
}
