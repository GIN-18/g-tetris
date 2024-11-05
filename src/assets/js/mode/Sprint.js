import { Tetris } from './Tetris'

export class Sprint extends Tetris {
  constructor() {
    super()
    this.lines = 40
  }

  updateLines() {
    this.lines -= this.getLines()
  }
}
