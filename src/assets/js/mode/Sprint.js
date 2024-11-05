import { Tetris } from './Tetris'

export class Sprint extends Tetris {
  constructor() {
    super()
    this.lines = 40
  }

  /**
   * @override 重置行数
   */
  resetGame() {
    super.resetGame()
    this.lines = 40
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
    if (this.matrix[1].some((item) => item > 0) || this.lines <= 0) {
      return true
    }
  }
}
