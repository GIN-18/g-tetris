import { defineStore } from 'pinia'
import { IndexedDB } from '@/assets/js/IndexedDB'

export const useGameStore = defineStore('game', {
  state: () => ({
    isDrawGhostPiece: localStorage.getItem('isDrawGhostPiece') || true,
    indexedDB: new IndexedDB('vuetris', 1, 'records'),
    DAS: JSON.parse(localStorage.getItem('DAS')) || 100,
    ARR: JSON.parse(localStorage.getItem('ARR')) || 50,
  }),
})
