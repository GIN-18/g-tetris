import confetti from "canvas-confetti";
import { palettes } from "./palettes.js";

export function playConfetti(palette) {
  const colors = palettes[palette].shapeColor;

  confetti({
    particleCount: 60,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: colors,
  });
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: colors,
  });
}
