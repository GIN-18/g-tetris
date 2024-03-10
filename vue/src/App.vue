<script setup>
import { onMounted } from "vue";
import Logo from "@/components/Logo.vue";
import Map from "@/components/Map.vue";
import Info from "@/components/Info.vue";
import Button from "@/components/Button.vue";

onMounted(() => {
  document.body.classList.add("mocha");
});
</script>

<template>
  <header>
    <Logo />
  </header>

  <main>
    <div class="flex justify-around items-center w-full">
      <Map />
      <div class="flex flex-col justify-between items-center">
        <Info title="SCORE">
          <span>xxx</span>
        </Info>
        <Info title="HI-SCORE">
          <span>xxx</span>
        </Info>
        <Info title="NEXT">
          <span>xxx</span>
        </Info>
        <Info title="LEVEL">
          <span>xxx</span>
        </Info>
      </div>
    </div>

    <hr class="w-full border-t-2 border-dashed border-text" />

    <div class="flex">
      <div class="flex flex-col justify-center items-center w-1/2">
        <Button description="drop" />
        <div class="flex justify-between w-full">
          <Button description="left" />
          <Button description="right" />
        </div>
        <Button description="down" />
      </div>
      <div class="flex flex-col justify-between items-end w-1/2">
        <div class="flex">
          <Button description="play" />
          <Button description="replay" />
          <Button description="volume" />
        </div>
        <Button description="rotate" />
      </div>
    </div>
  </main>
</template>
