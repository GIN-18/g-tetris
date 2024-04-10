<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  link: String,
  icon: String,
  text: String,
});

function jumpToLink() {
  if (props.link === "#") return;

  router.push({
    path: props.link,
  });
}
</script>

<template>
  <button
    class="flex justify-between items-center w-52"
    @click.prevent="jumpToLink"
  >
    <span :class="[props.icon, 'text-xl']"></span>
    <span class="text-sm">{{ props.text }}</span>
  </button>
</template>
