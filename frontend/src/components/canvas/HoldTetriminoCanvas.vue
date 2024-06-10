<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useGameStore } from "@/stores/game.js";

// get canvas info
const canvas = ref(null);
const width = computed(() => canvas.value.width);
const height = computed(() => canvas.value.height);
const ctx = computed(() => canvas.value.getContext("2d"));

const game = useGameStore();

onMounted(() => {
  canvas.value.width = game.block * 4;
  canvas.value.height = game.block * 4;

  ctx.value.scale(1, -1);
  ctx.value.translate(0, -canvas.value.height);

  clearCanvas();
  drawHoldTetrimino();
});

function clearCanvas() {
  ctx.value.clearRect(0, 0, width.value, height.value);
}

function drawHoldTetrimino() {}
</script>

<template>
  <canvas class="border-4 border-black bg-black" ref="canvas"></canvas>
</template>
