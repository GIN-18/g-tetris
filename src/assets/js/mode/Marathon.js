import { Tetris } from './Tetris.js'

export class Marathon extends Tetris {
  constructor() {
    super()

    this.level = 1
    this.score = 0
    this.oldLines = 0
  }

  // @override
  softDrop(enable) {
    if (!this.activeTetromino) return

    if (enable && this.checkCanMove(0, 1)) {
      this.setManeuver('softDrop')
      this.activeTetromino.y += 1
      this.score += 1 // 软降更新分数
    }
  }

  // @override
  hardDrop() {
    if (!this.activeTetromino) return

    this.setManeuver('hardDrop')
    this.updateScoreByHardDrop() // 硬降更新分数

    // 下落直到触底
    while (this.checkCanMove(0, 1)) {
      this.activeTetromino.y += 1
    }

    // 硬降时直接锁定
    this.resetTetrominoLock()
    this.landTetromino()
  }

  // @override
  landTetromino() {
    this.updateHoldLock()
    this.mergeMatrix()
    this.checkCombo()
    this.updateScoreByTSpin()
    this.updateScoreByMiniTSpin()
    this.clearFilledLines()
    this.resetTetrominoLocation()
    this.addTetromino()
    this.gameLoop()
  }

  // @override
  clearFilledLines() {
    const filledLines = this.getFilledLines()
    const width = this.matrix[0].length

    if (!filledLines.length) return

    this.checkTetris()
    this.updateLines()
    this.updateLevel()
    this.updateScore()
    this.resetBackToBackCount() // 重置背靠背次数

    for (let i = 0; i < filledLines.length; i++) {
      this.matrix.splice(filledLines[i], 1) // 删除满行
      this.matrix.unshift(new Array(width).fill(0)) // 在数组顶部插入空行
    }
  }

  // 更新等级
  updateLevel() {
    this.level += this.getLevelIncrement()
  }

  // 更新下落速度
  updateDropDelay() {
    return Math.pow(0.8 - (this.level - 1) * 0.007, this.level - 1) * 1000
  }

  updateScore() {
    this.score += this.getScore()
  }

  updateScoreByHardDrop() {
    const increment = this.getBottomDistance() * 2
    this.score += increment
  }

  updateScoreByTSpin() {
    const scoreTable = {
      'T-Spin': 400,
      'T-Spin Single': 800,
      'T-Spin Double': 1200,
      'T-Spin Triple': 1600,
    }

    const type = this.getTSpinType()

    if (scoreTable[type]) {
      this.score += scoreTable[type] * this.level
    }
  }

  updateScoreByMiniTSpin() {
    const scoreTable = {
      'Mini T-Spin': 100,
      'Mini T-Spin Single': 200,
      'Mini T-Spin Double': 400,
    }

    const type = this.getMiniTSpinType()

    if (scoreTable[type]) {
      this.score += scoreTable[type] * this.level
    }
  }

  // 获取得分
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

  // 获取等级增量（每10行加1）
  getLevelIncrement() {
    const increment = Math.floor(this.lines / 10)

    if (increment > 0 && Math.abs(this.oldLines - this.lines) >= 10) {
      this.oldLines += 10
      return 1
    }

    return 0
  }
}
