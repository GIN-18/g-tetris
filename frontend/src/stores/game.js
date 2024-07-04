import { defineStore } from "pinia";

export const useGameStore = defineStore("game", {
  state: () => ({
    block: 18,
    gamePlay: false,
    gameOver: false,
    level: 1,
    lines: 0,
    score: 0,
    currentBag: null,
    nextBag: null,
    currentTetromino: null,
    holdTetromino: null,
    highScore: localStorage.getItem("highScore") || 0,
    isDrawGhostPiece: localStorage.getItem("isDrawGhostPiece") || true,
  }),
});
