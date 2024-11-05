import { Tetris } from './Tetris'

export class Sprint extends Tetris {
  constructor() {
    super()
    this.lines = 40
  }

  /**
   * @override 减少行数
   */
  updateLines() {
    this.lines -= this.getLines()
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
