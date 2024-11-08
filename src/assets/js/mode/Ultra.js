import { Marathon } from './Marathon'
import { Timer } from '@/assets/js/Timer'

export class Ultra extends Marathon {
  constructor() {
    super()
    this.mode = 'ultra'
    this.timer = new Timer()
    this.gameOverTitle = 'GAME OVER'
  }

  /**
   * @override 开始游戏时，启动倒计时
   */
  playGame() {
    if (!this.activeTetromino) {
      this.addTetromino()
    }
    this.timer.startCountdown()
    this.gameLoop()
  }

  /**
   * @override 重置计时器
   */
  resetGame() {
    super.resetGame()
    this.mode = 'ultra'
    this.timer = new Timer()
    this.gameOverTitle = 'GAME OVER'
  }

  /**
   * @override 游戏结束时，停止倒计时
   */
  checkGameOver() {
    if (this.timer.countdownTime <= 0) {
      this.gameOverTitle = 'FINISHED'
      return true
    }

    return super.checkGameOver()
  }
}
