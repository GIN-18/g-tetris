<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game.js";

import { palettes } from "@/assets/js/palettes.js";
import { forEachShape } from "@/assets/js/utils.js";

const game = useGameStore();
const { block, nextShape, palette } = storeToRefs(game);

const canvas = ref(null);
const ctx = computed(() => canvas.value.getContext("2d"));

const BLOCK = 20;
const W = 80;
const H = 40;

function drawShape() {
  const t = nextShape.value.type;

  let xStep = 0;
  let yStep = 0;

  ctx.value.clearRect(0, 0, W, H);
  ctx.value.fillStyle = palettes[palette.value].shapeColor[t];

  if (t === 0) {
    xStep = -1;
    yStep = 0;
  } else if (t === 1) {
    xStep = 0;
    yStep = 1 / 2;
  }

  forEachShape(
    nextShape,
    (ns, x, y) => {
      ctx.value.fillRect(x * BLOCK, y * BLOCK, BLOCK, BLOCK);
    },
    xStep,
    yStep
  );
}

defineExpose({
  drawShape,
});

onMounted(() => {
  drawShape();
});
</script>

<template>
  <canvas ref="canvas" :width="W" :height="H"></canvas>
</template>
