<script setup>
import Logo from '@/components/Logo.vue'
</script>

<template>
  <header class="flex justify-between items-center w-full p-4">
    <Logo link="/" fontSize="text-2xl md:text-3xl" />
    <slot></slot>
  </header>
</template>
