<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { Tetris } from '@/assets/js/mode/Tetris'
import Header from '@/components/Header.vue'
import InfoBox from '@/components/info/InfoBox.vue'
import Button from '@/components/button/Button.vue'
import ToggleButton from '@/components/button/ToggleButton.vue'

const router = useRouter()
const { DAS, ARR } = storeToRefs(useGameStore())
const title = ref('SETTINGS')

watch([() => DAS.value, () => ARR.value], ([newDAS, newARR]) => {
  localStorage.setItem('DAS', JSON.stringify(newDAS))
  localStorage.setItem('ARR', JSON.stringify(newARR))
})

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

    <ul class="grow flex flex-col justify-start items-center gap-8 w-full">
      <InfoBox label="Show Ghost Piece" type="horizontal">
        <ToggleButton option="isDrawGhostPiece" />
      </InfoBox>

      <InfoBox label="DAS(ms):" type="horizontal">
        <div class="nes-select pl-8">
          <select class="!py-1 bg-nes-white" v-model="DAS">
            <option
              v-for="value in Tetris.DAS_List"
              :key="value"
              :value="value"
            >
              {{ value }}
            </option>
          </select>
        </div>
      </InfoBox>

      <InfoBox label="ARR(ms):" type="horizontal">
        <div class="nes-select pl-8">
          <select class="!py-1 bg-nes-white" v-model="ARR">
            <option
              v-for="value in Tetris.ARR_List"
              :key="value"
              :value="value"
            >
              {{ value }}
            </option>
          </select>
        </div>
      </InfoBox>
    </ul>

    <Button
      color="green"
      text="BACK TO HOME"
      @click="goToHome"
      @touchstart="goToHome"
    />
  </main>
</template>
