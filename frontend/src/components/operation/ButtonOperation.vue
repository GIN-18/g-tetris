<script setup>
import { emitter } from "@/assets/js/emitter.js";

import Button from "@/components/button/Button.vue";
import ArrowButton from "@/components/button/ArrowButton.vue";
</script>

<template>
  <div class="flex w-full">
    <!-- arrow button -->
    <div class="flex flex-col justify-center items-center w-1/2">
      <!-- hard drop button -->
      <ArrowButton
        type="hard-drop"
        @click.prevent="emitter.emit('hardDrop')"
        @touchstart.prevent="emitter.emit('hardDrop')"
      />

      <!-- left and right button -->
      <div class="flex justify-between items-center w-full">
        <ArrowButton
          type="left"
          @click.prevent="emitter.emit('left')"
          @touchstart.prevent="emitter.emit('left')"
        />
        <ArrowButton
          type="right"
          @click.prevent="emitter.emit('right')"
          @touchstart.prevent="emitter.emit('right')"
        />
      </div>

      <!-- soft drop button -->
      <ArrowButton
        type="soft-drop"
        @touchstart.prevent="emitter.emit('softDrop', true)"
        @touchend.prevent="emitter.emit('softDrop', false)"
      />
    </div>

    <div class="flex flex-col justify-between items-end w-1/2">
      <div class="flex gap-10">
        <!-- rotate 180 degrees button -->
        <Button
          type="primary"
          icon="icon-[pixelarticons--repeat]"
          @click.prevent="emitter.emit('rotateReverse')"
          @touchstart.prevent="emitter.emit('rotateReverse')"
        />

        <!-- hold tetrimino button -->
        <Button
          type="primary"
          icon="icon-[pixelarticons--sync]"
          @click.prevent="emitter.emit('hold')"
          @touchstart.prevent="emitter.emit('hold')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <!-- rotate right button -->
        <ArrowButton
          type="rotate-right"
          @click.prevent="emitter.emit('rotateRight')"
          @touchstart.prevent="emitter.emit('rotateRight')"
        />

        <!-- rotate left button -->
        <ArrowButton
          type="rotate-left"
          @click.prevent="emitter.emit('rotateLeft')"
          @touchstart.prevent="emitter.emit('rotateLeft')"
        />
      </div>
    </div>
  </div>
</template>
