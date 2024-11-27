<script setup>
const footerList = [
  {
    text: 'GIN',
    icon: 'icon-[pixelarticons--home]',
    url: 'https://gin-18.github.io/',
  },
  {
    text: 'GitHub',
    icon: 'icon-[pixelarticons--github]',
    url: 'https://github.com/gin-18/vuetris',
  },
]
</script>

<template>
  <footer class="flex justify-center items-center gap-8 pt-2">
    <a
      class="flex justify-center items-center gap-3 !no-underline"
      v-for="item in footerList"
      :key="item.text"
      :href="item.url"
    >
      <span class="text-md md:!text-xl" :class="item.icon"></span>
      <p class="pt-1 text-xs md:text-base">{{ item.text }}</p>
    </a>
  </footer>
</template>
