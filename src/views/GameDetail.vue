<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Header from '@/components/Header.vue'
import Button from '@/components/button/Button.vue'

const router = useRouter()
const route = useRoute()
const mode = route.params.mode

const title = computed(() => `${mode.toUpperCase()}`)
const description = computed(() => {
  const descriptions = {
    marathon: `Marathon is a game mode where the player plays the game either until completing a fixed level, or endlessly.
      Here, players clear as many lines and get the highest score possible.
      If the player stacks pieces to the top, the game ends. `,
    sprint: `Sprint (also called 40 lines) is a game mode where you play the game until you clear 40 or more lines.
      On this mode,score does not have any effect on this mode's ranking.
      Instead, time is most important element in this mode. `,
    ultra: `Ultra (also called Time Trial, Ultra2min, etc) is a game mode where one plays the game until the given time limit (usually 3 or 2 minutes).
      The objective of this mode is simple: Score as many points as possible.
      If the player blocks out before the time limit, the game ends instantly.`,
  }

  return descriptions[mode]
})

function goToGame() {
  router.push({ name: 'game', params: { mode } })
}

function goToHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <Header />

  <main class="flex flex-col justify-around items-center h-full">
    <h2 class="text-xl">{{ title }}</h2>

    <p class="text-sm leading-8">{{ description }}</p>

    <div class="flex justify-around w-full">
      <Button
        color="green"
        text="START"
        @click="goToGame"
        @touchstart="goToGame"
      />
      <Button
        color="yellow"
        text="QUIT"
        @click="goToHome"
        @touchstart="goToHome"
      />
    </div>
  </main>
</template>
