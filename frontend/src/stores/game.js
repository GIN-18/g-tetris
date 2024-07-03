import { defineStore } from "pinia";
import { getBags } from "@/assets/js/tetromino.js";

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
    holdShape: null,
    highScore: localStorage.getItem("highScore") || 0,
    isDrawGhostPiece: localStorage.getItem("isDrawGhostPiece") || true,
  }),
});
