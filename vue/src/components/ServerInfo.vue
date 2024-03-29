<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  status: Boolean,
});

console.log(props.status)

const text = props.status ? "Online" : "Offline";
const showText = ref(false);

console.log(text)

const iconClassList = computed(() => ({
  "text-4xl": true,
  "icon-[pixelarticons--cloud-done] text-nes-deep-green": props.status,
  "icon-[pixelarticons--cloud] text-nes-deep-gray": !props.status,
}));

const textClassList = computed(() => ({
  "fixed top-12 right-2 p-2 border-4 border-black": true,
  "bg-nes-deep-green": props.status,
  "bg-nes-deep-gray": !props.status,
}));

function changeShowText() {
  showText.value = !showText.value
}
</script>

<template>
  <span :class="iconClassList" @mouseover.prevent="changeShowText" @mouseleave.prevent="changeShowText"></span>
  <p :class="textClassList" v-if="showText">{{ text }}</p>
</template>
