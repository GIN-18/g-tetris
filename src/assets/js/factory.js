import { Marathon } from '@/assets/js/mode/Marathon'
import { Sprint } from '@/assets/js/mode/Sprint'
import { Ultra } from '@/assets/js/mode/Ultra'

export function factory(mode, DAS, ARR) {
  if (mode === 'marathon') {
    return new Marathon(DAS, ARR)
  }

  if (mode === 'sprint') {
    return new Sprint(DAS, ARR)
  }

  if (mode === 'ultra') {
    return new Ultra(DAS, ARR)
  }
}
