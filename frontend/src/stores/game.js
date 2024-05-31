import { defineStore } from "pinia";
import { tetriminoTable } from "@/assets/js/tetrimino.js";

export const useGameStore = defineStore("game", {
  state: () => ({
    block: 18,
    palette: "nes",
    gamePlay: false,
    gameOver: false,
    level: 1,
    lines: 0,
    volumeUp: true,
    score: 999999,
    scoreDiff: 0,
    highScore: localStorage.getItem("highScore") || 0,
    isPreview: localStorage.getItem("isPreview") || true,
    // nextShape: createTetrimino(),
    nextShape: null,
    players: 0,
  }),
});
