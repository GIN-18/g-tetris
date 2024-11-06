<script setup>
import { useRoute } from 'vue-router'

import Header from '@/components/Header.vue'

const route = useRoute()
const mode = route.params.mode
</script>

<template>
  <Header />
  <main>
    <h2>{{ mode }}</h2>
  </main>
</template>
