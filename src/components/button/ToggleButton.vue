<script setup>
import { computed, watch } from 'vue'
import { useGameStore } from '@/stores/game'

const game = useGameStore()

const props = defineProps({
  option: String,
})

const classList = computed(() => ({
  'text-4xl': true,
  'icon-[pixelarticons--toggle-right] text-nes-deep-green': JSON.parse(
    game[props.option],
  ),
  'icon-[pixelarticons--toggle-left] text-nes-deep-gray': !JSON.parse(
    game[props.option],
  ),
}))

watch(
  () => game[props.option],
  (newValue, oldValue) => {
    classList.value
    localStorage.setItem(props.option, JSON.stringify(newValue))
  },
)

function toggleOption() {
  game[props.option] = !JSON.parse(game[props.option])
}
</script>

<template>
  <button
    :class="classList"
    @click.prevent="toggleOption"
    @touchstart.prevent="toggleOption"
  ></button>
</template>
