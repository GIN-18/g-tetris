<script setup>
import { onMounted } from 'vue'
import { preventDoubleTap } from '@/assets/js/utils'
import { Analytics } from '@vercel/analytics/vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'

onMounted(() => {
  preventDoubleTap()
})
</script>

<template>
  <Analytics />
  <SpeedInsights />
  <RouterView />
</template>
