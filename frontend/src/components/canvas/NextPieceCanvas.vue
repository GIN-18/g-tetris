<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useGameStore } from "@/stores/game.js";
import { palettes } from "@/assets/js/palettes.js";

// get canvas info
const canvas = ref(null);
const width = computed(() => canvas.value.width);
const height = computed(() => canvas.value.height);
const ctx = computed(() => canvas.value.getContext("2d"));

const game = useGameStore();
const block = 20;

watch(
  () => game.nextShape,
  () => {
    if (!game.nextShape) return;

    clearCanvas();
    drawNextPiece();
  },
  { deep: true },
);

onMounted(() => {
  clearCanvas();
  drawNextPiece();
});

function clearCanvas() {
  ctx.value.clearRect(0, 0, width.value, height.value);
}

function drawNextPiece() {
  const { type, pieces, rotation } = game.nextShape;
  const piece = pieces[rotation];

  let xStep = 0;
  let yStep = 0;

  if (type === 0) {
    xStep = -1;
    yStep = 0;
  } else if (type === 1) {
    xStep = 0;
    yStep = 1 / 2;
  }

  ctx.value.fillStyle = palettes[game.palette].shapeColor[type];
  for (let i = 0; i < piece.length; i++) {
    const tmp_x = piece[i][1] + xStep;
    const tmp_y = piece[i][0] + yStep;
    ctx.value.fillRect(tmp_x * block, tmp_y * block, block, block);
  }
}
</script>

<template>
  <canvas width="80" height="40" ref="canvas"></canvas>
</template>
