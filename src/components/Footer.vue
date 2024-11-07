<script setup>
const author = {
  name: 'GIN',
  blog: 'https://gin-18.github.io/',
  github: 'https://github.com/gin-18/catppuccin-tetris',
}
</script>

<template>
  <footer class="flex justify-center items-center gap-8 pt-2">
    <a class="flex items-center gap-2" :href="author.blog">
      <span class="icon-[pixelarticons--home] text-lg"></span>
      <p class="!mb-0 text-xs">{{ author.name }}</p>
    </a>
    <a class="flex items-center gap-2" :href="author.github">
      <span class="icon-[pixelarticons--github] text-lg"></span>
      <p class="!mb-0 text-xs">GitHub</p>
    </a>
  </footer>
</template>
