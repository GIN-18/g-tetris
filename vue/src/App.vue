<script setup>
import { ref, onMounted } from "vue";

import Logo from "@/components/Logo.vue";
import Info from "@/components/Info.vue";
import Button from "@/components/Button.vue";

import { Shape } from "@/assets/js/Shape.js";

const map_canvas = ref();
const next_canvas = ref();
const shape = new Shape();

const BLOCK = 20;
const currentPiece = null;
const nextPiece = shape.getPiece();
const score = 0;
const hi_score = 0;
const level = 1;

onMounted(() => {
  document.body.classList.add("mocha");
  const map_ctx = map_canvas.value.getContext("2d");
  const next_ctx = next_canvas.value.getContext("2d");
  drawPiece(map_ctx, nextPiece);
  drawPiece(next_ctx, nextPiece);
});

function drawPiece(ctx, piece) {
  shape.yOffset = 0;

  if (ctx.canvas.width === 80) {
    if (shape.type === 0) {
      shape.xOffset = 0;
      shape.yOffset = 0;
    } else if (shape.type === 1) {
      shape.xOffset = 0;
      shape.yOffset = 1 / 2;
    } else {
      shape.xOffset = 1 / 2;
    }
  }

  for (let i = 0; i < piece.length; i++) {
    const x = piece[i][1] + shape.xOffset;
    const y = piece[i][0] + shape.yOffset;
    ctx.fillStyle = "#cdd6f4";
    ctx.fillRect(x * BLOCK, y * BLOCK, BLOCK, BLOCK);
  }
}
</script>

<template>
  <header>
    <Logo />
  </header>

  <main>
    <div class="flex justify-around items-center w-full">
      <canvas
        ref="map_canvas"
        class="border-2 border-text rounded bg-mantle"
        width="200"
        height="400"
      ></canvas>
      <div class="flex flex-col justify-between items-center">
        <Info title="SCORE">
          <span>{{ score }}</span>
        </Info>
        <Info title="HI-SCORE">
          <span>{{ hi_score }}</span>
        </Info>
        <Info title="NEXT">
          <canvas
            ref="next_canvas"
            class="bg-surface0"
            width="80"
            height="40"
          ></canvas>
        </Info>
        <Info title="LEVEL">
          <span>{{ level }}</span>
        </Info>
      </div>
    </div>

    <hr class="w-full border-t-2 border-dashed border-text" />

    <div class="flex">
      <div class="flex flex-col justify-center items-center w-1/2">
        <Button
          description="direction"
          icon="icon-[material-symbols--arrow-downward-alt-rounded]"
        />
        <div class="flex justify-between w-full">
          <Button
            description="direction"
            icon="icon-[material-symbols--arrow-left-rounded]"
          />
          <Button
            description="direction"
            icon="icon-[material-symbols--arrow-right-rounded]"
          />
        </div>
        <Button
          description="direction"
          icon="icon-[material-symbols--arrow-drop-down-rounded]"
        />
      </div>
      <div class="flex flex-col justify-between items-end w-1/2">
        <div class="flex">
          <Button
            description="box"
            icon="icon-[material-symbols--play-arrow-rounded]"
          />
          <Button
            description="box"
            icon="icon-[material-symbols--replay-rounded]"
          />
          <Button
            description="box"
            icon="icon-[material-symbols--volume-up-rounded]"
          />
        </div>
        <Button
          description="rotate"
          icon="icon-[material-symbols--rotate-right-rounded]"
        />
      </div>
    </div>
  </main>
</template>
