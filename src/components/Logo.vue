<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <h1
    class="text-2xl"
    @click.prevent="navigateToHome"
    @touchstart.prevent="navigateToHome"
  >
    VUETRIS
  </h1>
</template>
