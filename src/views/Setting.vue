<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { remapKeys } from '@/assets/js/utils'
import { Tetris } from '@/assets/js/mode/Tetris'
import Header from '@/components/Header.vue'
import InfoBox from '@/components/info/InfoBox.vue'
import Button from '@/components/button/Button.vue'
import ToggleButton from '@/components/button/ToggleButton.vue'

const router = useRouter()
const { DAS, ARR, keys } = storeToRefs(useGameStore())
const title = ref('SETTINGS')

watch([() => DAS.value, () => ARR.value], ([newDAS, newARR]) => {
  localStorage.setItem('DAS', JSON.stringify(newDAS))
  localStorage.setItem('ARR', JSON.stringify(newARR))
})

function focus(e) {
  e.target.select()
}

function keydown(e) {
  if (!checkKey(e.key)) return

  e.target.value = remapKeys(e.key)

  const key = e.target.previousElementSibling.htmlFor

  keys.value[key] = e.key

  localStorage.setItem('keys', JSON.stringify(keys.value))
}

function keyup(e) {
  e.target.blur()
}

function goToHome() {
  router.push({ name: 'home' })
}

function checkKey(key) {
  if (Object.values(keys.value).includes(key)) {
    return false
  }
  return true
}
</script>

<template>
  <Header />

  <main class="grow flex flex-col items-center w-full md:w-2/3">
    <h2 class="self-start py-6 text-nes-deep-blue text-lg md:text-2xl">
      {{ title }}
    </h2>

    <div class="grow flex flex-col justify-start items-center gap-8 w-full">
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

      <InfoBox label="KEY MAPPINGS:" title="left" class="hidden gap-8 md:flex">
        <div
          class="nes-field flex justify-between items-center w-full"
          v-for="(value, key) in keys"
          :key="key"
        >
          <label :for="key">{{ key.toUpperCase().replace('_', ' ') }}</label>
          <input
            type="text"
            :id="key"
            class="nes-input !w-1/2 !py-1 outline-none"
            :value="remapKeys(value)"
            @focus.prevent="focus"
            @keydown.prevent="keydown"
            @keyup.prevent="keyup"
          />
        </div>
      </InfoBox>
    </div>

    <div class="pt-4 md:self-end md:pt-16 md:pb-8">
      <Button
        color="green"
        text="BACK TO HOME"
        @click="goToHome"
        @touchstart="goToHome"
      />
    </div>
  </main>
</template>
