<script setup>
import { onMounted } from 'vue'
import { preventDoubleTap } from '@/assets/js/utils'
import { SpeedInsights } from '@vercel/speed-insights/vue'

onMounted(() => {
  preventDoubleTap()
})
</script>

<template>
  <RouterView />
  <SpeedInsights />
</template>
