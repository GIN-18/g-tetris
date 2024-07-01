<script setup>
import SelectionBox from "@/components/SelectionBox.vue";
import Footer from "@/components/Footer.vue";
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-24 h-full">
    <h1 class="text-4xl">
      <span class="text-nes-deep-blue">VUE</span>
      <span class="text-nes-deep-red">TR</span>
      <span class="text-nes-deep-yellow">IS</span>
    </h1>

    <div class="flex flex-col gap-10">
      <SelectionBox
        link="/game/1p"
        icon="icon-[pixelarticons--user]"
        text="1 PLAYER"
      />

      <!-- TODO: select not yet -->
      <SelectionBox
        link="#"
        icon="icon-[pixelarticons--users]"
        text="2 PLAYER"
      />
    </div>
  </div>

  <Footer />
</template>
