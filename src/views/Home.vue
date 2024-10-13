<script setup>
import Selection from "@/components/Selection.vue";
import Footer from "@/components/Footer.vue";

const selection = [
  {
    text: 'Marathon',
    link: '/game/marathon'
  }
]
</script>

<template>
  <main class="flex flex-col justify-center items-center gap-24 h-full">
    <h1 class="flex text-4xl">
      <p class="text-nes-deep-blue">VUE</p>
      <p class="text-nes-deep-red">TR</p>
      <p class="text-nes-deep-yellow">IS</p>
    </h1>

    <div class="flex flex-col gap-10">
      <Selection v-for="item in selection" :text="item.text" :link="item.link" />
    </div>
  </main>

  <Footer />
</template>
