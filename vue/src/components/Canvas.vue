<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game.js";

import { options } from "@/assets/js/options.js";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },
  block: {
    type: Number,
    default: 20,
  },
});

const canvas = ref(null);
const ctx = computed(() => canvas.value.getContext("2d"));
const game = useGameStore();

const { map, currentShape, nextShape } = storeToRefs(game);
const { id, block, width, height } = props;

function drawShape(shape) {
  if (!shape.value) return;

  const piece = shape.value.pieces[shape.value.rotation];
  let xOffset = 0;
  let yOffset = 0;

  ctx.value.clearRect(0, 0, width, height);

  if (id === "next") {
    if (shape.value.type === 0) {
      xOffset = -60;
      yOffset = 40;
    } else if (shape.value.type === 1) {
      xOffset = -60;
      yOffset = 30;
    } else {
      xOffset = -50;
      yOffset = 40;
    }
  }

  for (let i = 0; i < piece.length; i++) {
    const x = piece[i][1] + shape.value.x;
    const y = piece[i][0] + shape.value.y;
    ctx.value.fillStyle = options.palette.mocha.shapeColor[shape.value.type];
    ctx.value.fillRect(x * block + xOffset, y * block + yOffset, block, block);
  }

  if (id === "next") return; // next canvas do not need to draw map

  for (let i = 0; i < map.value.length; i++) {
    for (let j = 0; j < map.value[i].length; j++) {
      if (!map.value[i][j]) continue;

      const x = j * block;
      const y = i * block;

      ctx.value.fillStyle = options.palette.mocha.shapeColor[map.value[i][j] - 1];
      ctx.value.fillRect(x, y, block, block);
    }
  }
}

defineExpose({
  drawShape,
});

onMounted(() => {
  if (id === "next") {
    drawShape(nextShape);
  } else {
    drawShape(currentShape);
  }
});
</script>

<template>
  <canvas ref="canvas" :width="width" :height="height"></canvas>
</template>
