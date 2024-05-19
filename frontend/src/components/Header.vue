<script setup>
import Logo from "@/components/Logo.vue";
</script>

<template>
  <header class="flex justify-between items-center w-full">
    <Logo />
    <slot></slot>
  </header>
</template>
