<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game.js";

import { options } from "@/assets/js/options.js";
import { forEachShape } from "@/assets/js/utils.js";

const game = useGameStore();
const { block, nextShape } = storeToRefs(game);

const canvas = ref(null);
const ctx = computed(() => canvas.value.getContext("2d"));

const W = 80;
const H = 40;

function drawShape() {
  const b = block.value;
  const t = nextShape.value.type;

  let xStep = 0;
  let yStep = 0;

  ctx.value.clearRect(0, 0, W, H);
  ctx.value.fillStyle = options.palette.mocha.shapeColor[t];

  if (t === 0) {
    xStep = 0;
    yStep = 0;
  } else if (t === 1) {
    xStep = 0;
    yStep = 1 / 2;
  } else {
    xStep = 1 / 2;
    yStep = 0;
  }

  forEachShape(
    nextShape,
    (ns, x, y) => {
      ctx.value.fillRect(x * b, y * b, b, b);
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
  <canvas
    ref="canvas"
    class="bg-surface0"
    :width="W"
    :height="H"
  ></canvas>
</template>
