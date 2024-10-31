import { Tetris } from './Tetris.js'

export class Marathon extends Tetris {
  constructor() {
    super()

    this.level = 1
    this.score = 0
    this.oldLines = 0
    this.dropDelay = null

    this.coinCount = 0
    this.starCount = 0

    this.coinIncrement = 99
    this.scoreIncrement = 100000
  }

  /**
   * 根据当前关卡级别（level）计算下落速度
   *
   * @return {number} 下落速度（毫秒）
   */
  updateDropDelay() {
    return Math.pow(0.8 - (this.level - 1) * 0.007, this.level - 1) * 1000
  }

  /**
   * 根据当前等级（level）和等级增量（getLevelIncrement()）计算下一个等级，并将level属性更新为下一个等级
   */
  updateLevel() {
    this.level += this.getLevelIncrement()
  }

  /**
   * 更新当前分数，将获取的分数（getScore()）添加到当前分数中，触发可能的coinCount和starCount增加
   */
  updateScore() {
    this.score += this.getScore()

    if (this.score >= this.scoreIncrement) {
      this.score = this.score - this.scoreIncrement
      this.coinCount += 1
    }

    if (this.coinCount >= this.coinIncrement) {
      this.starCount += 1
      this.coinCount = this.coinCount - this.coinIncrement
    }
  }

  /**
   * 根据底部距离（getBottomDistance()）计算分数增量，并将当前分数（score）增加该增量
   * 分数增量计算公式：底部距离 * 2
   */
  updateScoreByHardDrop() {
    const increment = this.getBottomDistance() * 2
    this.score += increment
  }

  /**
   * 根据T-Spin类型更新得分。
   */
  updateScoreByTSpin() {
    // 定义不同T-Spin类型的得分表。
    const scoreTable = {
      'T-Spin': 400,
      'T-Spin Single': 800,
      'T-Spin Double': 1200,
      'T-Spin Triple': 1600,
    }

    // 设置T-Spin类型。
    this.setTSpinType()

    // 检查得分表是否有T-Spin类型的得分。
    if (scoreTable[this.TSpinType]) {
      // 根据T-Spin类型和当前等级计算得分，并更新得分。
      this.score += scoreTable[this.TSpinType] * this.level
    }
  }

  /**
   * 根据Mini T-Spin类型更新得分。
   */
  updateScoreByMiniTSpin() {
    // 定义不同Mini T-Spin类型的得分表。
    const scoreTable = {
      'Mini T-Spin': 100,
      'Mini T-Spin Single': 200,
      'Mini T-Spin Double': 400,
    }

    // 设置Mini T-Spin类型。
    this.setMiniTSpinType()

    // 检查得分表是否有Mini T-Spin类型的得分。
    if (scoreTable[this.miniTSpinType]) {
      // 根据Mini T-Spin类型和当前等级计算得分, 并更新得分。
      this.score += scoreTable[this.miniTSpinType] * this.level
    }
  }
  /**
   * 根据消除的行数、等级、连击数和连击连击数计算得分。
   *
   * @return {number} 计算得到的得分。
   */
  getScore() {
    let index, score
    // 消除行数对应的得分数组
    const lineScore = [100, 300, 500, 800]

    // 如果没有消除任何行，返回0分
    if (!this.getLines()) {
      score = 0
      return score
    }

    // 根据消除的行数获取得分数组的索引
    index = this.getLines() - 1
    // 计算基础得分，根据消除的行数和等级
    score = lineScore[index] * this.level

    // 添加连击奖励（每个连击增加50分）
    if (this.comboCount > 0) {
      score += 50 * this.level * (this.comboCount - 1)
    }

    // 添加连击连击奖励（得分乘以1.5倍）
    if (this.backToBackCount > 1) {
      score += score * 1.5
    }

    return score
  }

  /**
   * 返回基于行数的等级增量。
   *
   * @return {number} 等级增量。
   */
  getLevelIncrement() {
    // 根据行数计算增量。
    const increment = Math.floor(this.lines / 10)

    // 检查增量是否大于 0 且旧行数与当前行数的绝对差值是否大于或等于 10。
    if (increment > 0 && Math.abs(this.oldLines - this.lines) >= 10) {
      // 更新旧行数，增加 10。
      this.oldLines += 10
      // 返回等级增量。
      return 1
    }

    // 如果增量不大于 0 或绝对差值小于 10，则返回 0。
    return 0
  }

  /**
   * 返回当前分数的总和。
   *
   * @return {number} 总分数。
   */
  sumScore() {
    return (
      this.starCount * this.coinIncrement * this.scoreIncrement +
      this.coinCount * this.scoreIncrement +
      this.score
    )
  }

  /**
   * @override 在游戏循环中更新下落速度
   */
  gameLoop() {
    if (this.checkGameover()) return

    if (!this.activeTetromino) {
      this.addTetromino()
    }

    if (this.gameLoopTimer) {
      clearInterval(this.gameLoopTimer)
      this.gameLoopTimer = null
    }

    this.dropDelay = this.updateDropDelay()

    this.gameLoopTimer = setInterval(() => {
      if (this.checkCanMove(0, 1)) {
        this.setManeuver('drop')
        this.activeTetromino.y += 1
      } else {
        this.lockTetromino()
      }
    }, this.dropDelay)
  }

  /**
   * @override 重置等级和分数
   */
  resetGame() {
    super.resetGame()
    this.level = 1
    this.score = 0
    this.coinCount = 0
    this.starCount = 0
    this.coinIncrement = 99
    this.scoreIncrement = 100000
  }

  /**
   * @override 当软降时，检查是否可以移动到下一行，如果可以，则更新分数并移动方块。
   *
   * @param {boolean} enable 是否启用软降
   */
  softDrop(enable) {
    // 如果没有激活的方块，直接返回
    if (!this.activeTetromino) return

    // 如果启用软降并且可以移动到下一行
    if (enable && this.checkCanMove(0, 1)) {
      // 设置操作类型为软降
      this.setManeuver('softDrop')

      // 移动方块到下一行
      this.activeTetromino.y += 1

      // 增加分数
      this.score += 1
    }
  }

  /**
   * @override
   *
   * 硬降时更新分数
   */
  hardDrop() {
    // 如果没有激活的方块，直接退出函数
    if (!this.activeTetromino) return

    // 设置操作类型为硬降
    this.setManeuver('hardDrop')

    // 根据硬降更新分数
    this.updateScoreByHardDrop()

    // 将方块下落直到触底
    while (this.checkCanMove(0, 1)) {
      this.activeTetromino.y += 1
    }

    // 硬降时直接锁定方块
    this.resetTetrominoLock()

    // 方块落地，更新游戏状态
    this.landTetromino()
  }

  /**
   * @override 方块落地的时候，根据T-Spin和Mini T-Spin类型更新得分。
   */
  landTetromino() {
    // 更新hold锁定状态
    this.updateHoldLock()

    // 合并方块矩阵
    this.mergeMatrix()

    // 检查连击状态
    this.checkCombo()

    // 根据T-Spin类型更新得分
    this.updateScoreByTSpin()

    // 根据Mini T-Spin类型更新得分
    this.updateScoreByMiniTSpin()

    // 清除填满的行
    this.clearFilledLines()

    // 重置方块位置
    this.resetTetrominoLocation()

    // 添加新的方块
    this.addTetromino()

    // 进入游戏循环
    this.gameLoop()
  }

  /**
   * @override 清除满行的时候，更新等级、得分。
   */
  clearFilledLines() {
    // 获取满行的索引
    const filledLines = this.getFilledLines()
    // 获取矩阵的宽度
    const width = this.matrix[0].length

    // 如果没有满行，直接返回
    if (!filledLines.length) return

    // 检查是否出现了Tetris（四连消除）
    this.checkTetris()
    // 更新行数
    this.updateLines()
    // 更新等级
    this.updateLevel()
    // 更新得分
    this.updateScore()
    // 重置背靠背次数
    this.resetBackToBackCount()

    // 删除满行并在顶部插入空行
    for (let i = 0; i < filledLines.length; i++) {
      // 删除满行
      this.matrix.splice(filledLines[i], 1)
      // 在数组顶部插入空行
      this.matrix.unshift(new Array(width).fill(0))
    }
  }
}
