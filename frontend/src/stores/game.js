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
    highScore: localStorage.getItem("highScore") || 0,
    isPreview: localStorage.getItem("isPreview") || true,
    holdShape: null,
    currentBags: getBags(),
    nextBags: getBags(),

    // NOTE: need or not
    players: 0,
    volumeUp: true,
  }),
});
