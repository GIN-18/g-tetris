<script setup>
import { useGameStore } from "@/stores/game.js";

import InfoBox from "./InfoBox.vue";
import NextTetriminoInfo from "./NextTetriminoInfo.vue";

const game = useGameStore();
</script>

<template>
  <div class="flex flex-col justify-between h-full">
    <NextTetriminoInfo />

    <!-- game score -->
    <InfoBox title="SCORE">
      <p>{{ game.score }}</p>
    </InfoBox>
  </div>
</template>
