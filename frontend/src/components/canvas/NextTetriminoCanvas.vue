<script setup>
import { ref, computed, onMounted } from "vue";
import { useGameStore } from "@/stores/game.js";

// get canvas info
const canvas = ref(null);
const width = computed(() => canvas.value.width);
const height = computed(() => canvas.value.height);
const ctx = computed(() => canvas.value.getContext("2d"));

const game = useGameStore();

onMounted(() => {
  canvas.value.width = game.block * 4;
  canvas.value.height = game.block * 2 * 7 + 80;

  clearCanvas();
  drawBags();
});

function clearCanvas() {
  ctx.value.clearRect(0, 0, width.value, height.value);
}

function drawBags() {
  const arr = game.currentBags;

  for (let i = 0; i < arr.length; i++) {
    const color = arr[i].color;
    const tetrimino = arr[i].tetriminoes[0];

    ctx.value.fillStyle = color;
    for (let j = 0; j < tetrimino.length; j++) {
      const x = tetrimino[j][0] + 1;
      const y = tetrimino[j][1] + 1 + i * 2;

      ctx.value.fillRect(
        x * game.block,
        y * game.block,
        game.block,
        game.block,
      );
    }
  }
}
</script>

<template>
  <canvas class="border-4 border-black bg-black" ref="canvas"></canvas>
</template>
