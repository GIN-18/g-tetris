import { defineStore } from "pinia";
import { createShape } from "@/assets/js/shape.js";

export const useGameStore = defineStore("game", {
  state: () => ({
    block: 20,
    palette: "nes",
    map: new Array(20).fill(0).map(() => new Array(10).fill(0)),
    currentShape: null,
    previewShape: null,
    nextShape: createShape(),
    score: 0,
    level: 1,
    scoreDiff: 0,
    highScore: localStorage.getItem("highScore") || 0,
    isPreview: localStorage.getItem("isPreview") || true,
  }),
});
