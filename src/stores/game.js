import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { factory } from '@/assets/js/factory'

export const useGameStore = defineStore('game', {
  state: () => ({
    tetris: factory(useRoute().params.mode),
    isDrawGhostPiece: localStorage.getItem('isDrawGhostPiece') || true,
  }),
})
