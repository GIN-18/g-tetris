<script setup>
const props = defineProps({
  link: {
    type: String,
    default: '#',
  },
  fontSize: {
    type: String,
    default: 'text-2xl',
  },
})
</script>

<template>
  <h1>
    <RouterLink
      class="flex !no-underline"
      :class="props.fontSize"
      :to="props.link"
    >
      <span class="text-nes-deep-blue">VUE</span>
      <span class="text-nes-deep-red">TR</span>
      <span class="text-nes-deep-yellow">IS</span>
    </RouterLink>
  </h1>
</template>
