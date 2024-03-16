<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game.js";

import { palettes } from "@/assets/js/palettes.js";
import { forEachShape } from "@/assets/js/utils.js";

const game = useGameStore();
const { block, map, currentShape, previewShape } = storeToRefs(game);

const canvas = ref(null);
const ctx = computed(() => canvas.value.getContext("2d"));

const BLOCK = 20;
const W = 200;
const H = 400;

function drawShape() {
  const { type, x: currentX, y: currentY } = currentShape.value;
  const {
    pieces: previewPieces,
    rotation: previewRotation,
    x: previewX,
    y: previewY,
  } = previewShape.value;

  const previewPiece = previewPieces[previewRotation];
  const previewFinalY = getPreviewYOffset(previewY);

  clearMap();

  // draw preview shape
  ctx.value.fillStyle = palettes.mocha.previewShapeColor;
  forEachShape(
    previewShape,
    (shape, x, y) => {
      ctx.value.fillRect(x * BLOCK, y * BLOCK, BLOCK, BLOCK);
    },
    previewX,
    previewFinalY
  );

  // draw current shape
  ctx.value.fillStyle = palettes.mocha.shapeColor[type];
  forEachShape(
    currentShape,
    (shape, x, y) => {
      ctx.value.fillRect(x * BLOCK, y * BLOCK, BLOCK, BLOCK);
    },
    currentX,
    currentY
  );

  // get preview y offset
  function getPreviewYOffset(offset) {
    for (let i = 0; i < previewPiece.length; i++) {
      const x = previewPiece[i][1] + previewShape.value.x;
      const y = previewPiece[i][0] + offset;

      if (
        offset >= currentShape.value.y &&
        (y > map.value.length - 2 || (map.value[y] && map.value[y + 1][x]))
      ) {
        return offset;
      }
    }

    return getPreviewYOffset(offset + 1);
  }

  drawMap();
}

function drawMap() {
  const m = map.value;

  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      if (!m[i][j]) continue;
      ctx.value.fillStyle = palettes.mocha.shapeColor[m[i][j] - 1];
      ctx.value.fillRect(j * BLOCK, i * BLOCK, BLOCK, BLOCK);
    }
  }
}

function clearMap() {
  ctx.value.clearRect(0, 0, W, H);
}

defineExpose({
  drawShape,
  clearMap,
});
</script>

<template>
  <div class="nes-container !p-0 border-2 !border-black">
    <canvas ref="canvas" class="bg-white" :width="W" :height="H"></canvas>
  </div>
</template>
