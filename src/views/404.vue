<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <main class="flex flex-col justify-center items-center gap-8 w-full h-full">
    <div class="text-center">
      <i class="nes-octocat animate"></i>
      <h1 class="!my-4 text-5xl">404</h1>
      <h2 class="text-xl">Page Not Found</h2>
    </div>

    <p class="!mb-8 text-sm text-center">
      Oops! It seems you've ventured into uncharted territory. The page you're
      looking for doesn't exist or may have been moved.
    </p>

    <button
      class="nes-btn is-success text-lg"
      type="button"
      @click="navigateToHome"
    >
      Back to Home
    </button>
  </main>
</template>
