<script setup>
import { ref, computed, onMounted } from "vue";

import { useShapeStore } from "@/stores/shape";

import { options } from "@/assets/js/options.js";

const props = defineProps({
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
const shape = useShapeStore();

const currentShape = shape.currentShape;
const nextShape = shape.nextShape;
const block = props.block;

function drawShape(shape) {
  if (!shape) return;

  const piece = shape.piece[shape.rotation];

  ctx.value.clearRect(0, 0, props.width, props.height);

  if (props.width === "80") {
    if (shape.type === 0) {
      shape.x = 0;
      shape.y = 0;
    } else if (shape.type === 1) {
      shape.x = 0;
      shape.y = 1 / 2;
    } else {
      shape.x = 1 / 2;
      shape.y = 0;
    }
  } else {
    shape.x = 3
    shape.y = 0;
  }

  for (let i = 0; i < piece.length; i++) {
    const x = piece[i][1] + shape.x;
    const y = piece[i][0] + shape.y;
    ctx.value.fillStyle = options.palette.mocha.shapeColor[shape.type];
    ctx.value.fillRect(x * block, y * block, block, block);
  }
}

defineExpose({
  drawShape,
})

onMounted(() => {
  if (props.width === "80") {
    drawShape(nextShape);
  } else {
    drawShape(currentShape);
  }
});
</script>

<template>
  <canvas ref="canvas" :width="props.width" :height="props.height"></canvas>
</template>
