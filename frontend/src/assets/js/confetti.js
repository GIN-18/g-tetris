import confetti from "canvas-confetti";
import { palette } from "@/assets/js/palette.js";

export function playConfetti() {
  const colors = palette.tetriminoColor;

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
