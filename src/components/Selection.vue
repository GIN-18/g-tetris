<script setup>
import Button from '@/components/button/Button.vue'
const props = defineProps({
  link: String,
  text: String,
})
</script>

<template>
  <RouterLink class="!no-underline" :to="props.link">
    <Button class="w-full" color="blue" :text="text" />
  </RouterLink>
</template>
