<script setup>
import { useGameStore } from "@/stores/game.js";

import Dialogs from "@/components/Dialogs.vue";
import Button from "@/components/Button.vue";

const game = useGameStore();
</script>

<template>
  <Dialogs title="PREPARE">
    <div>
      <div>
        <span>Room ID: {{ game.room }}</span>
      </div>
    </div>
    <div class="flex gap-12">
      <Button description="success" text="Ready"/>
      <Button description="warning" text="Cancel"/>
    </div>
  </Dialogs>
</template>
