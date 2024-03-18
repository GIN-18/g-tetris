<script setup>
import { storeToRefs } from "pinia"
import { useGameStore } from "@/stores/game.js"

const game = useGameStore()

const { showSparator } = storeToRefs(game)
</script>
<template>
  <div
    class="absolute top-0 left-0 w-full h-full bg-nes-gray bg-opacity-95"
    v-if="showSparator"
  ></div>
</template>
