<script setup>
import Logo from '@/components/Logo.vue'
import Selection from '@/components/Selection.vue'
import Footer from '@/components/Footer.vue'

const selections = [
  {
    text: 'MARATHON',
    link: '/detail/marathon',
  },
  {
    text: 'SPRINT',
    link: '/detail/sprint',
  },
  {
    text: 'ULTRA',
    link: '/detail/ultra',
  },
  {
    text: 'SETTINGS',
    link: '/setting',
  },
]
</script>

<template>
  <Logo class="pt-16 md:pt-32" fontSize="text-5xl md:text-5xl" />

  <main class="flex flex-col gap-8">
    <Selection v-for="item in selections" :text="item.text" :link="item.link" />
  </main>

  <Footer />
</template>
