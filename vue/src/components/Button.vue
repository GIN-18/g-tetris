<script setup>
import { ref, onMounted } from "vue";

const button = ref();

const props = defineProps({
  description: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
  icon: {
    type: String,
  }
});

onMounted(() => {
  const btn = button.value;
  addClass(btn)
});

function addClass(btn) {
  if (props.description === 'rotate') {
    btn.classList.add('w-28', 'h-28', 'text-4xl')
    return
  }

  if(props.description === 'direction') {
    btn.classList.add('w-14', 'h-14', 'text-2xl')
    return
  }
}
</script>

<template>
  <button ref="button" class="nes-btn !flex justify-center items-center" type="button">
    <span :class="props.icon"></span>
    <span>{{ props.text }}</span>
  </button>
</template>
