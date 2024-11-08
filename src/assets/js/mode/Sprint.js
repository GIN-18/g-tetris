import { Tetris } from './Tetris'
import { Timer } from '@/assets/js/Timer'

export class Sprint extends Tetris {
  constructor() {
    super()
    this.lines = 40
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
    this.lines = 40
    this.timer = new Timer()
    this.gameOverTitle = 'GAME OVER'
  }

  /**
   * @override 减少行数
   */
  updateLines() {
    this.lines -= this.getLines()

    if (this.lines <= 0) {
      this.lines = 0
    }
  }

  /**
   * @override 消除满40行游戏结束
   */
  checkGameOver() {
    if (this.lines <= 0) {
      this.gameOverTitle = 'FINISHED'
      return true
    }

    return super.checkGameOver()
  }
}
