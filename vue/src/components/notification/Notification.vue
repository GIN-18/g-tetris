<script setup>
import { ref } from "vue";

const messages = ref(["message 1"]);
</script>

<template>
  <ul class="fixed top-2 right-2">
    <li class="p-2 border-4 border-black" v-for="message in messages">
      {{ message }}
    </li>
  </ul>
</template>
