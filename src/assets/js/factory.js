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
}
