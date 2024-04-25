<script setup>
import { ref, computed, watch } from "vue";
import { useGameStore } from "@/stores/game.js";
import { palettes } from "@/assets/js/palettes.js";

// get canvas info
const canvas = ref(null);
const width = computed(() => canvas.value.width);
const height = computed(() => canvas.value.height);
const ctx = computed(() => canvas.value.getContext("2d"));

const game = useGameStore();

watch(
  [
    () => game.map,
    () => game.currentShape,
    () => game.previewShape,
    () => game.isPreview,
  ],
  () => {
    if (!game.previewShape) return;

    clearCanvas();
    drawMap();
    drawPreviewPiece();
    drawCurrentPiece();
  },
  { deep: true },
);

function clearCanvas() {
  ctx.value.clearRect(0, 0, width.value, height.value);
}

function drawMap() {
  for (let y = 0; y < game.map.length; y++) {
    for (let x = 0; x < game.map[y].length; x++) {
      if (!game.map[y][x]) continue;

      ctx.value.fillStyle =
        palettes[game.palette].shapeColor[game.map[y][x] - 1];
      ctx.value.fillRect(
        x * game.block,
        y * game.block,
        game.block,
        game.block,
      );
    }
  }
}

function drawCurrentPiece() {
  const { x, y, type, pieces, rotation } = game.currentShape;
  const piece = pieces[rotation];

  ctx.value.fillStyle = palettes[game.palette].shapeColor[type];
  for (let i = 0; i < piece.length; i++) {
    const tmp_x = piece[i][1] + x;
    const tmp_y = piece[i][0] + y;
    ctx.value.fillRect(
      tmp_x * game.block,
      tmp_y * game.block,
      game.block,
      game.block,
    );
  }
}

function drawPreviewPiece() {
  if (!JSON.parse(game.isPreview)) return;

  const { x, y, pieces, rotation } = game.previewShape;
  const piece = pieces[rotation];
  const previewPieceFinalY = getPreviewPieceYOffset(y);

  ctx.value.fillStyle = palettes[game.palette].previewShapeColor;

  for (let i = 0; i < piece.length; i++) {
    const tmp_x = piece[i][1] + x;
    const tmp_y = piece[i][0] + previewPieceFinalY;
    ctx.value.fillRect(
      tmp_x * game.block,
      tmp_y * game.block,
      game.block,
      game.block,
    );
  }

  function getPreviewPieceYOffset(offset) {
    for (let i = 0; i < piece.length; i++) {
      const tmp_x = piece[i][1] + x;
      const tmp_y = piece[i][0] + offset;

      if (
        offset >= game.currentShape.y &&
        (tmp_y > game.map.length - 2 ||
          (game.map[tmp_y] && game.map[tmp_y + 1][tmp_x]))
      ) {
        return offset;
      }
    }

    return getPreviewPieceYOffset(offset + 1);
  }
}
</script>

<template>
  <canvas
    class="border-4 border-black bg-black"
    width="200"
    height="400"
    ref="canvas"
  ></canvas>
</template>
