import { defineStore } from 'pinia'
import { Tetris } from '@/assets/js/mode/Tetris.js'

const MATRIX_WIDTH = 10
const MATRIX_HEIGHT = 20

const tetris = new Tetris(MATRIX_WIDTH, MATRIX_HEIGHT)

export const useGameStore = defineStore('game', {
  state: () => ({
    block: 16,
    tetris: tetris,
    gamePlay: false,
    gameOver: false,
    isDrawGhostPiece: localStorage.getItem('isDrawGhostPiece') || true,
  }),
})
