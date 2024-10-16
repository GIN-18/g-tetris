import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Tetris } from '@/assets/js/mode/Tetris.js'

const MATRIX_WIDTH = 10
const MATRIX_HEIGHT = 20

export const useGameStore = defineStore('game', () => {
  const block = ref(16)
  const tetris = ref(new Tetris(MATRIX_WIDTH, MATRIX_HEIGHT))
  const isDrawGhostPiece = ref(localStorage.getItem('isDrawGhostPiece') || true)

  return {
    block,
    tetris,
    isDrawGhostPiece,
  }
})
