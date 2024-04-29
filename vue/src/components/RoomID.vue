<script setup>
import { onMounted, onUnmounted } from "vue";
import Clipboard from "clipboard";
import { notify } from "@/assets/js/notify.js";

import LabelBox from "@/components/info/LabelBox.vue";

const room = localStorage.getItem("room");
const clipboard = new Clipboard(".room");

onMounted(() => {
  // BUG: call twice when I use this component twice
  clipboard.on("success", (e) => {
    e.clearSelection();
    notify("success", "Room ID copied!");
  });
  clipboard.on("error", (e) => {
    notify("error", "Copy error! Please select the text and copy.");
  });
});

onUnmounted(() => {
  clipboard.destroy();
});
</script>
<template>
  <LabelBox label="Room ID:">
    <p
      class="room mb-0"
      data-clipboard-target=".room"
      data-clipboard-action="copy"
    >
      {{ room }}
    </p>
  </LabelBox>
</template>
