<script setup>
import { computed } from "vue";
import { useGameStore } from "@/stores/game";
import { checkGameMode } from "@/assets/js/utils.js";

import InfoBox from "./InfoBox.vue";
import NextPieceCanvas from "@/components/canvas/NextPieceCanvas.vue";

const game = useGameStore();

const formatScoreDiff = computed(() =>
  game.scoreDiff >= 0 ? `+${game.scoreDiff}` : game.scoreDiff,
);
const scoreDiffColor = computed(() =>
  game.scoreDiff >= 0 ? "text-nes-deep-green" : "text-nes-deep-red",
);
</script>

<template>
  <div class="flex flex-col justify-between items-center w-max-40 h-full">
    <!-- game score -->
    <InfoBox title="SCORE">
      <p>{{ game.score }}</p>
    </InfoBox>

    <!-- high score -->
    <InfoBox title="HI-SCORE" v-if="checkGameMode('1p')">
      <p>{{ game.highScore }}</p>
    </InfoBox>

    <!-- socre difference -->
    <InfoBox title="DIFF" v-if="checkGameMode('2p')">
      <p :class="scoreDiffColor">
        {{ formatScoreDiff }}
      </p>
    </InfoBox>

    <!-- next shape -->
    <InfoBox title="NEXT">
      <NextPieceCanvas />
    </InfoBox>

    <!-- game level -->
    <InfoBox title="LEVEL">
      <p>{{ game.level }}</p>
    </InfoBox>
  </div>
</template>
