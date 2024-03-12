import { defineStore } from "pinia";
import { getShape } from "@/assets/js/shape.js";

export const useShapeStore = defineStore("shape", {
  state: () => ({
    currentShape: null,
    nextShape: getShape(),
  }),
});
