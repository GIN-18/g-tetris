<script setup>
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game.js'

import InfoBox from './InfoBox.vue'
import HoldTetrominoCanvas from '@/components/canvas/HoldTetrominoCanvas.vue'

const { tetris } = storeToRefs(useGameStore())
</script>

<template>
  <div class="flex flex-col justify-between h-full">
    <InfoBox title="HOLD">
      <HoldTetrominoCanvas />
    </InfoBox>

    <div class="flex flex-col gap-6">
      <InfoBox border title="LEVEL">
        <p>{{ tetris.level }}</p>
      </InfoBox>

      <InfoBox border title="LINES">
        <p>{{ tetris.lines }}</p>
      </InfoBox>
    </div>
  </div>
</template>
