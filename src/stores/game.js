import { defineStore } from 'pinia'
import { IndexedDB } from '@/assets/js/IndexedDB'

export const useGameStore = defineStore('game', {
  state: () => ({
    isDrawGhostPiece: localStorage.getItem('isDrawGhostPiece') || true,
    indexedDB: new IndexedDB('vuetris', 1, 'records'),
  }),
})
