<script setup>
import Clipboard from "clipboard";
import { notify } from "@/assets/js/notify.js";

import LabelBox from "@/components/info/LabelBox.vue";

const room = localStorage.getItem("room");
const clipboard = new Clipboard(".room");

clipboard.on("success", (e) => {
  e.clearSelection();
  notify("success", "Room ID Copied!");
});
clipboard.on("error", (e) => {
  notify("error", "copy error");
});
</script>
<template>
  <LabelBox label="Room ID:">
    <span
      class="room"
      data-clipboard-target=".room"
      data-clipboard-action="copy"
      >{{ room }}</span
    >
  </LabelBox>
</template>
