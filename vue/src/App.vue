<script setup>
import { onMounted } from "vue";
import Logo from "@/components/Logo.vue";

onMounted(() => {
  document.body.classList.add("mocha");
});
</script>

<template>
  <header>
    <Logo />
  </header>
</template>
