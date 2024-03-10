<script setup>
import { ref, onMounted } from "vue";

const button = ref();

const props = defineProps({
  description: {
    type: String,
    required: true,
  },
});

const direction = ["drop", "right", "down", "left"];

onMounted(() => {
  const btn = button.value;
  addClass(btn)
});

function addClass(btn) {
  if (props.description === 'rotate') {
    btn.classList.add('w-32', 'h-32', 'rounded-full', 'text-4xl')
    return
  }

  if(direction.includes(props.description)) {
    btn.classList.add('w-16', 'h-16', 'rounded-full', 'text-2xl')
    return
  }

  btn.classList.add('ml-2', 'p-1', 'rounded', 'text-sm')
}

function setIcon(description) {
  const icons = {
    drop: 'icon-[material-symbols--arrow-downward-alt-rounded]',
    right: 'icon-[material-symbols--arrow-right-rounded]',
    down: 'icon-[material-symbols--arrow-drop-down-rounded]',
    left: 'icon-[material-symbols--arrow-left-rounded]',
    play: 'icon-[material-symbols--play-arrow-rounded]',
    replay: 'icon-[material-symbols--replay-rounded]',
    volume: 'icon-[material-symbols--volume-up-rounded]',
    rotate: 'icon-[material-symbols--rotate-right-rounded]'
  }

  return icons[description]
}
</script>

<template>
  <button ref="button" class="flex justify-center items-center border-2 border-text">
    <span :class="setIcon(props.description)"></span>
  </button>
</template>
