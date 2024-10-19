<script setup>
import { onMounted } from 'vue'
import { preventDoubleTap } from '@/assets/js/utils.js'
import Notification from '@/components/Notification.vue'

onMounted(() => {
  preventDoubleTap()
})
</script>

<template>
  <RouterView />
  <Notification />
</template>
