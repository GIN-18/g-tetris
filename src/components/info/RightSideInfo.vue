<script setup>
import { inject } from 'vue'
import InfoBox from './InfoBox.vue'
import NextTetrominoCanvas from '@/components/canvas/NextTetrominoCanvas.vue'

const tetris = inject('tetris')
</script>

<template>
  <div class="flex flex-col justify-between h-full">
    <InfoBox label="NEXT">
      <NextTetrominoCanvas />
    </InfoBox>

    <InfoBox label="LINES">
      <p v-if="tetris.mode === 'sprint'">{{ tetris.targetLines }}</p>
      <p v-else>{{ tetris.lines }}</p>
    </InfoBox>
  </div>
</template>
