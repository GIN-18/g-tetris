<script setup>
import { emitter } from '@/assets/js/emitter'

import Button from '@/components/button/Button.vue'
import ArrowButton from '@/components/button/ArrowButton.vue'
</script>

<template>
  <div class="flex justify-between w-full md:hidden">
    <div class="flex flex-col justify-between items-center w-1/2">
      <!-- 硬降按钮 -->
      <ArrowButton
        type="hard-drop"
        @touchstart.prevent="emitter.emit('hardDrop')"
      />

      <div class="flex justify-between items-center w-full">
        <!-- 左移按钮 -->
        <ArrowButton
          type="left"
          @touchstart.prevent="emitter.emit('left', true)"
          @touchend.prevent="emitter.emit('left', false)"
        />
        <!-- 右移按钮 -->
        <ArrowButton
          type="right"
          @touchstart.prevent="emitter.emit('right', true)"
          @touchend.prevent="emitter.emit('right', false)"
        />
      </div>

      <!-- 软降按钮 -->
      <ArrowButton
        type="soft-drop"
        @touchstart.prevent="emitter.emit('softDrop', true)"
        @touchend.prevent="emitter.emit('softDrop', false)"
      />
    </div>

    <div class="flex flex-col items-end gap-2 w-1/2">
      <div class="flex gap-10">
        <!-- 旋转180按钮 -->
        <Button
          color="blue"
          icon="icon-[pixelarticons--repeat]"
          @touchstart.prevent="emitter.emit('rotateReverse')"
        />

        <!-- 暂存按钮 -->
        <Button
          color="blue"
          icon="icon-[pixelarticons--sync]"
          @touchstart.prevent="emitter.emit('hold')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <!-- 右旋按钮 -->
        <ArrowButton
          type="rotate-right"
          @touchstart.prevent="emitter.emit('rotateRight')"
        />

        <!-- 左旋按钮 -->
        <ArrowButton
          type="rotate-left"
          @touchstart.prevent="emitter.emit('rotateLeft')"
        />
      </div>
    </div>
  </div>
</template>
