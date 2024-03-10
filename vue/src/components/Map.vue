<script setup>
import { ref, onMounted } from "vue";
import { Shape } from "@/assets/js/Shape.js";

const canvas = ref();
const block = 20
const shape = new Shape();

const currentPiece = null
const nextPiece = shape.getPiece();

onMounted(() => {
  const ctx = canvas.value.getContext("2d");
  drawPiece(ctx, nextPiece);
});

function drawPiece(ctx, piece) {
  for (let i = 0; i < piece.length; i++) {
    const x = piece[i][1] + shape.XOffset;
    const y = piece[i][0];
    ctx.fillStyle = "#cdd6f4";
    ctx.fillRect(x * block, y * block, block, block);
  }
}
</script>

<template>
  <canvas
    ref="canvas"
    class="border-2 border-text rounded bg-base"
    width="200"
    height="400"
  ></canvas>
</template>
