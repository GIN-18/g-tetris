<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})

function formatTime(timestamp) {
  const date = new Date(Number(timestamp))
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${hours}:${minutes}`
}

function formatDate(timestamp) {
  const date = new Date(Number(timestamp))
  const year = date.getFullYear()
  const month = remapMonth(date.getMonth())
  const day = date.getDate().toString().padStart(2, '0')

  return `${month} ${day}, ${year}`
}

function remapMonth(month) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  return months[month]
}
</script>

<template>
  <ol class="relative flex flex-col gap-4 border-l-4 ml-1 border-nes-blue">
    <li
      class="flex flex-col gap-2 ml-4"
      v-for="(value, key) in props.data"
      :key="key"
    >
      <div class="absolute -left-2 w-3 h-3 rounded-full bg-nes-blue"></div>
      <time class="text-sm">{{ formatDate(key) }}</time>
      <ol class="p-4 rounded-md text-xs leading-6 bg-nes-gray">
        <li class="flex justify-between items-center" v-for="(v, k) in value">
          <p>{{ v.record }}</p>
          <p>{{ formatTime(v.timestamp) }}</p>
        </li>
      </ol>
    </li>
  </ol>
</template>
