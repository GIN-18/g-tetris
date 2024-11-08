import { Tetris } from './Tetris'
import { Timer } from '@/assets/js/Timer'

export class Sprint extends Tetris {
  constructor() {
    super()
    this.mode = 'sprint'
    this.targetLines = 40
    this.timer = new Timer()
    this.gameOverTitle = 'GAME OVER'
  }

  /**
   * @override 开始游戏时，启动计时器
   */
  playGame() {
    if (!this.activeTetromino) {
      this.addTetromino()
    }

    this.timer.startSequential()
    this.gameLoop()
  }

  /**
   * @override 游戏结束时，停止计时器
   */
  handleGameOver() {
    this.stopGameLoop()
    this.gameOver = true
    this.timer.stopTimer()
  }

  /**
   * @override 重置行数
   */
  resetGame() {
    super.resetGame()
    this.mode = 'sprint'
    this.targetLines = 40
    this.timer = new Timer()
    this.gameOverTitle = 'GAME OVER'
  }

  /**
   * @override 更新行数，减少目标行数
   */
  updateLines() {
    this.lines += this.getLines()
    this.targetLines -= this.getLines()

    if (this.targetLines <= 0) {
      this.targetLines = 0
    }
  }

  /**
   * @override 消除满40行游戏结束
   */
  checkGameOver() {
    if (this.targetLines <= 0) {
      this.gameOverTitle = 'FINISHED'
      return true
    }

    return super.checkGameOver()
  }
}
