import { Tetris } from '@/assets/js/mode/Tetris.js' // NOTE: 测试使用
import { Marathon } from '@/assets/js/mode/Marathon.js'

export function factory(mode) {
  if (mode === 'marathon') {
    return new Marathon()
  }

  if (mode === 'tetris') {
    return new Tetris()
  }
}
