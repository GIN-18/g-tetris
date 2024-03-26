<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game.js";

import { palettes } from "@/assets/js/palettes.js";
import { forEachShape } from "@/assets/js/utils.js";

const game = useGameStore();
const { map, nextShape, currentShape, previewShape, palette, isPreview } =
  storeToRefs(game);

const canvas = ref(null);
const ctx = computed(() => canvas.value.getContext("2d"));

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  width: {
    required: true,
  },
  height: {
    required: true,
  },
});

const { name, width, height } = props;

const BLOCK = 20;
const W = width;
const H = height;

if (name === "next") {
  onMounted(() => {
    drawNextShape();
  });
}

function drawGame() {
  clearMap();
  drawPreviewShape();
  drawCurrentShape();
  drawMap();
}

function clearMap() {
  ctx.value.clearRect(0, 0, W, H);
}

function drawMap() {
  const m = map.value;

  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      if (!m[i][j]) continue;
      ctx.value.fillStyle = palettes[palette.value].shapeColor[m[i][j] - 1];
      ctx.value.fillRect(j * BLOCK, i * BLOCK, BLOCK, BLOCK);
    }
  }
}

function drawPreviewShape() {
  const {
    pieces: previewPieces,
    rotation: previewRotation,
    x: previewX,
    y: previewY,
  } = previewShape.value;

  const previewPiece = previewPieces[previewRotation];
  const previewFinalY = getPreviewYOffset(previewY);

  if (JSON.parse(isPreview.value)) {
    ctx.value.fillStyle = palettes[palette.value].previewShapeColor;
    forEachShape(
      previewShape,
      (shape, x, y) => {
        ctx.value.fillRect(x * BLOCK, y * BLOCK, BLOCK, BLOCK);
      },
      previewX,
      previewFinalY
    );
  }

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
}

function drawCurrentShape() {
  const { type, x: currentX, y: currentY } = currentShape.value;

  ctx.value.fillStyle = palettes[palette.value].shapeColor[type];
  forEachShape(
    currentShape,
    (shape, x, y) => {
      ctx.value.fillRect(x * BLOCK, y * BLOCK, BLOCK, BLOCK);
    },
    currentX,
    currentY
  );
}

function drawNextShape() {
  const type = nextShape.value.type;

  let xStep = 0;
  let yStep = 0;

  ctx.value.clearRect(0, 0, W, H);
  ctx.value.fillStyle = palettes[palette.value].shapeColor[type];

  if (type === 0) {
    xStep = -1;
    yStep = 0;
  } else if (type === 1) {
    xStep = 0;
    yStep = 1 / 2;
  }

  forEachShape(
    nextShape,
    (shape, x, y) => {
      ctx.value.fillRect(x * BLOCK, y * BLOCK, BLOCK, BLOCK);
    },
    xStep,
    yStep
  );
}

defineExpose({
  clearMap,
  drawGame,
  drawNextShape,
});
</script>

<template>
  <div :class="{ 'p-0 border-4 border-black': name === 'map' }">
    <canvas
      ref="canvas"
      :class="{ 'bg-black': name === 'map' }"
      :width="W"
      :height="H"
    ></canvas>
  </div>
</template>
