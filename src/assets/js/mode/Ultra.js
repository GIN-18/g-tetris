import { Marathon } from './Marathon'
import { Timer } from '@/assets/js/Timer'

export class Ultra extends Marathon {
  constructor() {
    super()
    this.timer = new Timer()
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
}
