import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { factory } from '@/assets/js/factory.js'

export const useGameStore = defineStore('game', {
  state: () => ({
    block: 16,
    tetris: factory(useRoute().params.mode),
    isDrawGhostPiece: localStorage.getItem('isDrawGhostPiece') || true,
  }),
})
