<script setup>
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { remapKeys } from '@/assets/js/utils'

const { keys } = storeToRefs(useGameStore())
</script>

<template>
  <div class="flex flex-col justify-center">
    <h2 class="pb-6 text-2xl">CONTROLS</h2>
    <ul class="flex flex-col gap-2">
      <li
        class="flex justify-between gap-36"
        v-for="(value, key) in keys"
        :key="key"
      >
        <p>{{ key.toUpperCase().replace('_', ' ') }}:</p>
        <p>{{ remapKeys(value) }}</p>
      </li>
    </ul>
  </div>
</template>
