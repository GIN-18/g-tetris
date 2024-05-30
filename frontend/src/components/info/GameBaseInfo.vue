<script setup>
import { computed, inject } from "vue";
import { useGameStore } from "@/stores/game";

import InfoBox from "./InfoBox.vue";

const game = useGameStore();
const gameMode = inject("gameMode");

const formatScoreDiff = computed(() =>
  game.scoreDiff >= 0 ? `+${game.scoreDiff}` : game.scoreDiff,
);
const scoreDiffColor = computed(() =>
  game.scoreDiff >= 0 ? "text-nes-deep-green" : "text-nes-deep-red",
);
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- game score -->
    <InfoBox title="SCORE">
      <p>{{ game.score }}</p>
    </InfoBox>

    <!-- socre difference -->
    <InfoBox title="DIFF" v-if="gameMode.checkGameMode('2p')">
      <p :class="scoreDiffColor">
        {{ formatScoreDiff }}
      </p>
    </InfoBox>

    <!-- lines -->
    <InfoBox title="LINES" v-if="gameMode.checkGameMode('1p')">
      <p>{{ game.lines }}</p>
    </InfoBox>

    <!-- game level -->
    <InfoBox title="LEVEL">
      <p>{{ game.level }}</p>
    </InfoBox>
  </div>
</template>
