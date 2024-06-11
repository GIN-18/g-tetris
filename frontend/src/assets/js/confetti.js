import confetti from "canvas-confetti";

export function playConfetti() {
  const colors = [
    "#f8b800",
    "#3cbcfc",
    "#9878f8",
    "#58d854",
    "#f85898",
    "#6888fc",
    "#f87858",
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
