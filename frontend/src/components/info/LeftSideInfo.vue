<script setup>
import { useGameStore } from "@/stores/game.js";

import InfoBox from "./InfoBox.vue";
import HoldTetriminoInfo from "./HoldTetriminoInfo.vue";

const game = useGameStore();
</script>

<template>
  <div class="flex flex-col justify-between h-full">
    <HoldTetriminoInfo />

    <div class="flex flex-col gap-6">
      <InfoBox title="LINES">
        <p>{{ game.lines }}</p>
      </InfoBox>

      <InfoBox title="LEVEL">
        <p>{{ game.level }}</p>
      </InfoBox>
    </div>
  </div>
</template>
