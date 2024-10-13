<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  link: String,
  text: String,
});

function jumpToLink() {
  router.push({
    path: props.link,
  });
}
</script>

<template>
  <button @click.prevent="jumpToLink" @touchstart.prevent="jumpToLink">
    {{ props.text }}
  </button>
</template>
