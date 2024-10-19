<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function jumpToHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <h1
    class="text-2xl"
    @click.prevent="jumpToHome"
    @touchstart.prevent="jumpToHome"
  >
    VUETRIS
  </h1>
</template>
