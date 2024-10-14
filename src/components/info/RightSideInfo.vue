<script setup>
import { useGameStore } from '@/stores/game.js'

import InfoBox from './InfoBox.vue'
import NextTetrominoCanvas from '@/components/canvas/NextTetrominoCanvas.vue'

const game = useGameStore()
</script>

<template>
  <div class="flex flex-col justify-between h-full">
    <InfoBox title="NEXT">
      <NextTetrominoCanvas :block="game.block" />
    </InfoBox>

    <!-- game score -->
    <InfoBox border title="SCORE">
      <p>{{ game.score }}</p>
    </InfoBox>
  </div>
</template>
