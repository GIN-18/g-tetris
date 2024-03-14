<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game.js";

import { options } from "@/assets/js/options.js";
import { forEachShape } from "@/assets/js/utils.js";

const game = useGameStore();
const { block, map, currentShape } = storeToRefs(game);

const canvas = ref(null);
const ctx = computed(() => canvas.value.getContext("2d"));

const BLOCK = 20;
const W = 200;
const H = 400;

function drawShape() {
  const t = currentShape.value.type;
  const xStep = currentShape.value.x;
  const yStep = currentShape.value.y;

  ctx.value.clearRect(0, 0, W, H);
  ctx.value.fillStyle = options.palette.mocha.shapeColor[t];

  forEachShape(
    currentShape,
    (shape, x, y) => {
      ctx.value.fillRect(x * BLOCK, y * BLOCK, BLOCK, BLOCK);
    },
    xStep,
    yStep
  );

  drawMap();
}

function drawMap() {
  const m = map.value;

  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      if (!m[i][j]) continue;
      ctx.value.fillStyle = options.palette.mocha.shapeColor[m[i][j] - 1];
      ctx.value.fillRect(j * BLOCK, i * BLOCK, BLOCK, BLOCK);
    }
  }
}

defineExpose({
  drawShape,
});
</script>

<template>
  <canvas
    ref="canvas"
    class="border-2 border-text rounded bg-crust"
    :width="W"
    :height="H"
  ></canvas>
</template>
