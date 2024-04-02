<script setup>
import { ref, computed } from "vue";
import { useGameStore } from "@/stores/game.js";

const game = useGameStore();

const props = defineProps({
  status: Boolean,
});

const iconClassList = computed(() => ({
  "text-5xl": true,
  "icon-[pixelarticons--cloud-done] text-nes-deep-green": props.status,
  "icon-[pixelarticons--cloud] text-nes-deep-gray": !props.status,
}));
</script>

<template>
  <span :class="iconClassList"></span>
</template>
