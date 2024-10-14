<script setup>
import { ref, computed, onMounted } from 'vue'
import { emitter } from '@/assets/js/emitter.js'

const messages = ref([])
const messageType = ref(null)

const messageClassList = computed(() => ({
  'p-3 border-4 border-black': true,
  'text-nes-white bg-nes-red': messageType.value === 'error',
  'bg-nes-yellow': messageType.value === 'warning',
  'text-nes-white bg-nes-green': messageType.value === 'success',
}))

onMounted(() => {
  emitter.on('add', addMessage)
})

// FIXME: have to clear setTimerout or clear messages
function addMessage({ type, message }) {
  messageType.value = type
  messages.value.push(message)

  setTimeout(() => {
    messages.value.shift()
  }, 3000)
}
</script>

<template>
  <ul class="z-20 fixed top-2 right-2">
    <TransitionGroup
      class="flex flex-col gap-2 text-sm"
      name="list"
      tag="ul"
      enter-active-class="animate-[slide-in-right_0.4s_ease_both]"
      leave-active-class="animate-[slide-out-right_0.4s_ease_both]"
    >
      <li
        :class="messageClassList"
        v-for="(message, index) in messages"
        :key="index"
      >
        {{ message }}
      </li>
    </TransitionGroup>
  </ul>
</template>
