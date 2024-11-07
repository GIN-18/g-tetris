<script setup>
const props = defineProps({
  link: String,
  text: String,
})
</script>

<template>
  <RouterLink class="nes-badge" :to="props.link">
    <span class="is-warning">{{ props.text }}</span>
  </RouterLink>
</template>
