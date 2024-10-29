import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Tetris } from '@/assets/js/mode/Tetris.js'
import { Marathon } from '@/assets/js/mode/Marathon.js'

export const useGameStore = defineStore('game', () => {
  const block = ref(16)
  // const tetris = ref(new Tetris()) // TODO: 切换游戏模式
  const tetris = ref(new Marathon())
  const isDrawGhostPiece = ref(localStorage.getItem('isDrawGhostPiece') || true)

  return {
    block,
    tetris,
    isDrawGhostPiece,
  }
})
