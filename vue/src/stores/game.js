import { defineStore } from "pinia";
import { getShape } from "@/assets/js/shape.js";

export const useGameStore = defineStore("game", {
  state: () => ({
    map: new Array(20).fill(0).map(() => new Array(10).fill(0)),
    currentShape: null,
    previewShape: null,
    nextShape: getShape(),
    palette: 'nes',
    showSparator: false,
    highScore: localStorage.getItem('highScore') || 0,
    isPreview: false
  }),
});
