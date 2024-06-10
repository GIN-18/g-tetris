import confetti from "canvas-confetti";

export function playConfetti() {
  const colors = [
    "#f85898",
    "#f878f8",
    "#f87858",
    "#f8b800",
    "#58d854",
    "#3cbcfc",
    "#9878f8",
  ];

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
