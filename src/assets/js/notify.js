import { emitter } from './emitter'

export function notify(type, message) {
  emitter.emit('add', { type, message })
}
