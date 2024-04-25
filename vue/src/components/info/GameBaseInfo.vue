<script setup>
import { useGameStore } from "@/stores/game";
import InfoBox from "./InfoBox.vue";
import NextPieceCanvas from "@/components/canvas/NextPieceCanvas.vue";

const game = useGameStore();
</script>

<template>
  <div class="flex flex-col justify-between items-center w-max-40 h-full">
    <!-- game score -->
    <InfoBox title="SCORE">
      <span>{{ game.score }}</span>
    </InfoBox>

    <!-- high score -->
    <InfoBox title="HI-SCORE">
      <span>{{ game.highScore }}</span>
    </InfoBox>

    <!-- socre difference -->
    <!-- <InfoBox title="DIFF" v-if="checkGameMode('2p')"> -->
    <!--   <span :class="scoreDiffColor"> -->
    <!--     {{ formatScoreDiff }} -->
    <!--   </span> -->
    <!-- </InfoBox> -->

    <!-- next shape -->
    <InfoBox title="NEXT">
      <NextPieceCanvas />
    </InfoBox>

    <!-- game level -->
    <InfoBox title="LEVEL">
      <span>{{ game.level }}</span>
    </InfoBox>
  </div>
</template>
