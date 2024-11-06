import { Tetris } from '@/assets/js/mode/Tetris' // NOTE: 测试使用
import { Marathon } from '@/assets/js/mode/Marathon'
import { Sprint } from '@/assets/js/mode/Sprint'
import { Ultra } from '@/assets/js/mode/Ultra'

export function factory(mode) {
  if (mode === 'marathon') {
    return new Marathon()
  }

  if (mode === 'sprint') {
    return new Sprint()
  }

  if (mode === 'ultra') {
    return new Ultra()
  }

  if (mode === 'tetris') {
    return new Tetris()
  }
}
