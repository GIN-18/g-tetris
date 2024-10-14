import { emitter } from './emitter.js'

export function notify(type, message) {
  emitter.emit('add', { type, message })
}
