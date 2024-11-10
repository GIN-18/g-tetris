<script setup>
import Logo from '@/components/Logo.vue'
import Selection from '@/components/Selection.vue'
import Footer from '@/components/Footer.vue'

const selection = [
  {
    text: 'Marathon',
    link: '/detail/marathon',
  },
  {
    text: 'Sprint',
    link: '/detail/sprint',
  },
  {
    text: 'Ultra',
    link: '/detail/ultra',
  },
  {
    text: 'Setting',
    link: '/setting',
  },
]
</script>

<template>
  <main class="flex flex-col justify-center items-center gap-36 h-full">
    <Logo fontSize="text-4xl" />

    <div class="flex flex-col gap-8">
      <Selection
        v-for="item in selection"
        :text="item.text"
        :link="item.link"
      />
    </div>
  </main>

  <Footer />
</template>
