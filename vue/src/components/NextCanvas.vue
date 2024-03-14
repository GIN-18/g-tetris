<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game.js";

import { options } from "@/assets/js/options.js";

const game = useGameStore();

const { block, nextShape } = storeToRefs(game);

const canvas = ref(null);
const ctx = computed(() => canvas.value.getContext("2d"));

const W = 80;
const H = 40;

function drawShape() {
  const ns = nextShape.value.pieces[nextShape.value.rotation];
  const b = block.value;
  const t = nextShape.value.type;

  let xStep = 0;
  let yStep = 0;

  ctx.value.clearRect(0, 0, W, H);
  ctx.value.fillStyle = options.palette.mocha.shapeColor[t - 1];

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

  for (let i = 0; i < ns.length; i++) {
    const x = ns[i][1] + xStep;
    const y = ns[i][0] + yStep;
    ctx.value.fillRect(x * b, y * b, b, b);
  }
}

defineExpose({
  drawShape,
});

onMounted(() => {
  drawShape()
});
</script>

<template>
  <canvas ref="canvas" class="bg-crust" :width="W" :height="H"></canvas>
</template>
