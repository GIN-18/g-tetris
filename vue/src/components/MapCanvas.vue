<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game.js";

import { options } from "@/assets/js/options.js";

const game = useGameStore();

const { block, currentShape } = storeToRefs(game);

const canvas = ref(null);
const ctx = computed(() => canvas.value.getContext("2d"));

const W = 200;
const H = 400;

function drawShape() {
  const cs = currentShape.value.pieces[currentShape.value.rotation];
  const b = block.value;
  const t = currentShape.value.type;
  const xStep = currentShape.value.x;
  const yStep = currentShape.value.y;

  ctx.value.clearRect(0, 0, W, H);
  ctx.value.fillStyle = options.palette.mocha.shapeColor[t - 1];

  for (let i = 0; i < cs.length; i++) {
    const x = cs[i][1] + xStep;
    const y = cs[i][0] + yStep;
    ctx.value.fillRect(x * b, y * b, b, b);
  }
}

defineExpose({
  drawShape,
});

onMounted(() => {
  // drawShape()
});
</script>

<template>
  <canvas ref="canvas" class="border-2 border-text rounded bg-crust" :width="W" :height="H"></canvas>
</template>
