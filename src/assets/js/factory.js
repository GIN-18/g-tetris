import { Tetris } from '@/assets/js/mode/Tetris.js' // NOTE: 测试使用
import { Marathon } from '@/assets/js/mode/Marathon.js'
import { Sprint } from '@/assets/js/mode/Sprint.js'

export function factory(mode) {
  if (mode === 'marathon') {
    return new Marathon()
  }

  if (mode === 'sprint') {
    return new Sprint()
  }

  if (mode === 'tetris') {
    return new Tetris()
  }
}
