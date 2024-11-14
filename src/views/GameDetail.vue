<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { useRoute, useRouter } from 'vue-router'

import Header from '@/components/Header.vue'
import Button from '@/components/button/Button.vue'
import Tabs from '@/components/common/Tabs.vue'
import Tab from '@/components/common/Tab.vue'
import Timeline from '@/components/common/Timeline.vue'

const { indexedDB } = storeToRefs(useGameStore())
const router = useRouter()
const route = useRoute()
const mode = route.params.mode

const records = ref(null) // TODO: 获取历史记录
const title = computed(() => `${mode.toUpperCase()}`)
const description = computed(() => {
  const descriptions = {
    marathon: `Marathon is a game mode where the player plays the game either until completing a fixed level, or endlessly.
      Here, players clear as many lines and get the highest score possible.
      If the player stacks pieces to the top, the game ends. `,
    sprint: `Sprint (also called 40 lines) is a game mode where you play the game until you clear 40 or more lines.
      Score does not have any effect on this mode's ranking.
      Instead, time is most important element in this mode. `,
    ultra: `Ultra (also called Time Trial, Ultra2min, etc) is a game mode where one plays the game until the given time limit.
      The objective of this mode is simple: Score as many points as possible.
      If the player blocks out before the time limit, the game ends instantly.`,
  }

  return descriptions[mode]
})

onMounted(() => {
  indexedDB.value.open().then(() => {
    indexedDB.value.getDataByMode(mode).then((res) => {
      records.value = res
    })
  })
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

  <main class="grow flex flex-col justify-between items-center w-full">
    <h2 class="self-start py-6 text-lg text-nes-deep-yellow">
      {{ title }}
    </h2>

    <div class="grow basis-0 shrink-0 w-full overflow-y-scroll hide-scrollbar">
      <Tabs active="records">
        <Tab name="records" label="Records">
          <div>
            <p class="text-base text-nes-gray" v-if="!records">No Records</p>
            <Timeline :data="records" v-else />
          </div>
        </Tab>
        <Tab name="rule" label="Rule">
          <p>{{ description }}</p>
        </Tab>
      </Tabs>
    </div>

    <div class="flex justify-around w-full pt-4">
      <Button
        color="green"
        text="PLAY"
        @click="goToGame"
        @touchstart="goToGame"
      />
      <Button
        color="yellow"
        text="BACK"
        @click="goToHome"
        @touchstart="goToHome"
      />
    </div>
  </main>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
