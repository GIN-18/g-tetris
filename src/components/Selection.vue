<script setup>
import Button from '@/components/button/Button.vue'
const props = defineProps({
  link: String,
  text: String,
})
</script>

<template>
  <RouterLink class="nes-badge !no-underline md:!hidden" :to="props.link">
    <span class="is-primary">{{ props.text }}</span>
  </RouterLink>

  <RouterLink class="!hidden !no-underline md:!block" :to="props.link">
    <Button class="w-full" color="blue" :text="text" />
  </RouterLink>
</template>
