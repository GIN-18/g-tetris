import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    isDrawGhostPiece: localStorage.getItem('isDrawGhostPiece') || true,
  }),
})
