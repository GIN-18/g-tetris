import { defineStore } from "pinia";
import { getBags } from "@/assets/js/tetrimino.js";

export const useGameStore = defineStore("game", {
  state: () => ({
    block: 18,
    gamePlay: false,
    gameOver: false,
    level: 1,
    lines: 0,
    volumeUp: true,
    score: 0,
    scoreDiff: 0,
    highScore: localStorage.getItem("highScore") || 0,
    isPreview: localStorage.getItem("isPreview") || true,
    currentBags: getBags(),
    nextBags: getBags(),
    players: 0,
  }),
});
