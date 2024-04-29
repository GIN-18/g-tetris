import { defineStore } from "pinia";
import { createShape } from "@/assets/js/shape.js";

export const useGameStore = defineStore("game", {
  state: () => ({
    palette: "nes",
    gamePlay: false,
    gameOver: false,
    level: 1,
    volumeUp: true,
    score: 0,
    scoreDiff: 0,
    highScore: localStorage.getItem("highScore") || 0,
    isPreview: localStorage.getItem("isPreview") || true,
    nextShape: createShape(),
  }),
});
