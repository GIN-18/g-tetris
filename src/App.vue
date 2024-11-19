<script setup>
import { onMounted } from 'vue'
import { preventDoubleTap } from '@/assets/js/utils'

onMounted(() => {
  preventDoubleTap()
})
</script>

<template>
  <RouterView />
</template>
