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
    btn.classList.add('w-32', 'h-32', 'rounded-full', 'text-4xl')
    return
  }

  if(props.description === 'direction') {
    btn.classList.add('w-16', 'h-16', 'rounded-full', 'text-2xl')
    return
  }

  btn.classList.add('p-2', 'rounded', 'text-sm')
}
</script>

<template>
  <button ref="button" class="flex justify-center items-center border-2 border-text">
    <span>{{ props.text }}</span>
    <span :class="props.icon"></span>
  </button>
</template>
