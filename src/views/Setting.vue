<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import InfoBox from '@/components/info/InfoBox.vue'
import Button from '@/components/button/Button.vue'
import ToggleButton from '@/components/button/ToggleButton.vue'

const router = useRouter()
const title = ref('SETTINGS')

function goToHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <Header />

  <main class="grow flex flex-col justify-between items-center w-full">
    <h2 class="self-start pt-16 pb-8 text-lg text-nes-deep-yellow">
      {{ title }}
    </h2>

    <ul class="grow flex flex-col justify-start items-center gap-4 w-full">
      <InfoBox label="Show Ghost Piece" type="horizontal">
        <ToggleButton option="isDrawGhostPiece" />
      </InfoBox>
    </ul>

    <Button
      color="yellow"
      text="BACK TO HOME"
      @click="goToHome"
      @touchstart="goToHome"
    />
  </main>
</template>
