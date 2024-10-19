import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Tetris } from '@/assets/js/mode/Tetris.js'

export const useGameStore = defineStore('game', () => {
  const block = ref(16)
  const tetris = ref(new Tetris())
  const isDrawGhostPiece = ref(localStorage.getItem('isDrawGhostPiece') || true)

  return {
    block,
    tetris,
    isDrawGhostPiece,
  }
})
