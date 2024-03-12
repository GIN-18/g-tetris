<script setup>
import { ref, computed, onMounted } from "vue";
import { useShapeStore } from "./stores/shape";

import { getShape } from "@/assets/js/shape.js";

import Logo from "@/components/Logo.vue";
import Info from "@/components/Info.vue";
import Button from "@/components/Button.vue";
import Canvas from "@/components/Canvas.vue";

const mapCanvas = ref(null);
const nextCanvas = ref(null);

const shape = useShapeStore();

const map = new Array(20).fill(0).map(() => new Array(10).fill(0));
const score = ref(0);
const hi_score = ref(0);
const level = ref(1);

let gamePlay = ref(false);

function playGame() {
  gamePlay.value = !gamePlay.value;
  shape.currentShape = shape.nextShape;
  shape.nextShape = getShape();
  mapCanvas.value.drawShape(shape.currentShape);
  nextCanvas.value.drawShape(shape.nextShape);
}

onMounted(() => {
  document.body.classList.add("mocha");
});
</script>

<template>
  <header>
    <Logo />
  </header>

  <main>
    <div class="flex justify-around items-center w-full h-full">
      <Canvas
        ref="mapCanvas"
        class="border-2 border-text rounded bg-mantle"
        width="200"
        height="400"
      />
      <div class="flex flex-col justify-between items-center h-full">
        <Info title="SCORE">
          <span>{{ score }}</span>
        </Info>
        <Info title="HI-SCORE">
          <span>{{ hi_score }}</span>
        </Info>
        <Info title="NEXT">
          <Canvas ref="nextCanvas" class="bg-surface0" width="80" height="40" />
        </Info>
        <Info title="LEVEL">
          <span>{{ level }}</span>
        </Info>
      </div>
    </div>
  </main>

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
      <div class="flex gap-4">
        <Button
          description="box"
          :icon="
            gamePlay
              ? 'icon-[material-symbols--pause-rounded]'
              : 'icon-[material-symbols--play-arrow-rounded]'
          "
          @click="playGame"
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
</template>
