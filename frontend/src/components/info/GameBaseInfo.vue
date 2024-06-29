<script setup>
import { computed, inject } from "vue";
import { useGameStore } from "@/stores/game";

import InfoBox from "./InfoBox.vue";

const game = useGameStore();
const gameMode = inject("gameMode");
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- lines -->
    <InfoBox title="LINES">
      <p>{{ game.lines }}</p>
    </InfoBox>

    <!-- game level -->
    <InfoBox title="LEVEL">
      <p>{{ game.level }}</p>
    </InfoBox>
  </div>
</template>
