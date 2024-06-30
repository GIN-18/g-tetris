<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useGameStore } from "@/stores/game.js";
import { palette } from "@/assets/js/palette.js";

// get canvas info
const canvas = ref(null);
const width = computed(() => canvas.value.width);
const height = computed(() => canvas.value.height);
const ctx = computed(() => canvas.value.getContext("2d"));

const game = useGameStore();

watch(
  () => game.holdShape,
  () => {
    clearCanvas();
    drawHoldTetromino();
  },
  {
    deep: true,
  },
);

onMounted(() => {
  canvas.value.width = game.block * 4;
  canvas.value.height = game.block * 4;
});

function clearCanvas() {
  ctx.value.clearRect(0, 0, width.value, height.value);
}

function drawHoldTetromino() {
  const shape = game.holdShape;
  const color = shape.tetromino.color;
  const tetromino = shape.tetromino.pieces[shape.rotation];
  const name = shape.tetromino.name;

  if (game.holdShape.holdLock) {
    ctx.value.fillStyle = palette.previewColor;
  } else {
    ctx.value.fillStyle = color;
  }

  for (let i = 0; i < tetromino.length; i++) {
    const x = tetromino[i][0] + setXOffset(name);
    const y = tetromino[i][1] + setYOffset(name);

    ctx.value.fillRect(x * game.block, y * game.block, game.block, game.block);
  }
}

function setXOffset(name) {
  const arr = ["T", "S", "Z", "J", "L"];

  if (arr.includes(name)) {
    return 1.5;
  }

  return 1;
}

function setYOffset(name) {
  if (name === "I") {
    return 1.5;
  }

  return 2;
}
</script>

<template>
  <canvas class="border-4 border-black bg-black" ref="canvas"></canvas>
</template>
