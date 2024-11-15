<script setup>
import { ref } from 'vue'

const scoreTable = ref({
  Single: '100 * level',
  Double: '300 * level',
  Triple: '500 * level',
  Tetris: '800 * level',
  'Mini T-Spin\nno line(s)': '100 * level',
  'T-Spin\nno line(s)': '400 * level',
  'Mini T-Spin\nSingle': '200 * level',
  'T-Spin Single': '800 * level',
  'Mini T-Spin\nDouble': '400 * level',
  'T-Spin Double': '1200 * level',
  'T-Spin Triple': '1600 * level',
  B2B: 'action score\n* 1.5',
  Combo: '50\n* combo count\n* level',
  'Soft drop': '1 per cell',
  'Hard drop': '2 per cell',
})
</script>

<template>
  <table class="nes-table is-bordered w-full text-xs leading-6">
    <thead>
      <tr>
        <th>Action</th>
        <th>Points</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(value, key, index) in scoreTable" :key="index">
        <td>{{ key }}</td>
        <td>{{ value }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
td {
  white-space: pre;
}
</style>
