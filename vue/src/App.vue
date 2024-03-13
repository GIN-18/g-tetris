<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "./stores/game.js";

import { getShape } from "@/assets/js/shape.js";

import Logo from "@/components/Logo.vue";
import Info from "@/components/Info.vue";
import Button from "@/components/Button.vue";
import Canvas from "@/components/Canvas.vue";

const game = useGameStore();

const mapCanvas = ref(null);
const nextCanvas = ref(null);

const { map, currentShape, nextShape } = storeToRefs(game);

const score = ref(0);
const hi_score = ref(0);
const level = ref(1);

let gamePlay = ref(false);

let frameId;
let lastTime = ref(0);
const frameInterval = ref(1000 / 10);

function playGame() {
  gamePlay.value = !gamePlay.value;

  addShape();
  // gameLoop();
}

function addShape() {
  currentShape.value = nextShape.value;
  nextShape.value = getShape();

  forEachShape((cs, x, y) => {
    // game over
    if (map.value[y] && map.value[y][x]) {
      cancelAnimationFrame(frameId);
    }
  }, 0, 1);

  mapCanvas.value.drawShape(currentShape);
  nextCanvas.value.drawShape(nextShape);
}

function rotateShape() {
  const currentRotation = currentShape.value.rotation;
  const tempRotation = (currentShape.value.rotation += 1);

  const resultRotation = tempRotation % currentShape.value.pieces.length;

  currentShape.value.rotation = resultRotation;
  mapCanvas.value.drawShape(currentShape);
}

function moveShape(xStep, yStep) {
  const w = map.value[0].length;
  const h = map.value.length;

  currentShape.value.x += xStep;
  currentShape.value.y += yStep;

  forEachShape((cs, x, y) => {
    for (let i = 0; i < cs.length; i++) {
      const x = cs[i][1] + currentShape.value.x;
      const y = cs[i][0] + currentShape.value.y;

      if (xStep && (x < 0 || x >= w || (map.value[y] && map.value[y][x]))) {
        currentShape.value.x -= xStep;
      }

      if (yStep && (y >= h || (map.value[y] && map.value[y][x]))) {
        currentShape.value.y -= yStep;
        mergeShape();
        addShape();
      }
    }
  });

  mapCanvas.value.drawShape(currentShape);
}

function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime.value;

  if (deltaTime > frameInterval.value) {
    // 在这里执行动画逻辑
    moveShape(0, 1);
    lastTime.value = currentTime - (deltaTime % frameInterval.value);
  }

  frameId = requestAnimationFrame(gameLoop);
}

function mergeShape() {
  forEachShape((cs, x, y) => {
    if (y >= 0) map.value[y][x] = currentShape.value.type + 1;
  })
}

function forEachShape(fn, xStep = 0, yStep = 0) {
  const cs = currentShape.value.pieces[currentShape.value.rotation];

  for (let i = 0; i < cs.length; i++) {
    const x = cs[i][1] + currentShape.value.x + xStep;
    const y = cs[i][0] + currentShape.value.y + yStep;

    fn(cs, x, y);
  }
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
        id="map"
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
          <Canvas
            ref="nextCanvas"
            id="next"
            class="bg-surface0"
            width="80"
            height="40"
          />
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
          @click="moveShape(-1, 0, 0)"
        />
        <Button
          description="direction"
          icon="icon-[material-symbols--arrow-right-rounded]"
          @click="moveShape(1, 0, 0)"
        />
      </div>
      <Button
        description="direction"
        icon="icon-[material-symbols--arrow-drop-down-rounded]"
        @click="moveShape(0, 1, 0)"
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
        @click="rotateShape"
      />
    </div>
  </div>
</template>
