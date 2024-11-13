<script setup>
import { ref, h, useSlots } from 'vue'

const props = defineProps({
  active: String,
})

const slots = useSlots()
const activeTab = ref(props.active || '')

function renderTab(name, label, index) {
  return h(
    'label',
    {
      class: {
        'text-sm': true,
        'border-b-4 border-nes-green text-nes-deep-green':
          activeTab.value === name || (index === 0 && !activeTab.value),
      },
    },
    h('input', {
      class: 'hidden',
      type: 'radio',
      name: 'tabs',
      checked: activeTab.value === name,
      onClick: () => {
        activeTab.value = name
      },
    }),
    label,
  )
}

function renderTabs() {
  return h(
    'div',
    {
      class: 'sticky top-0 flex gap-3 bg-nes-white overflow-x-scroll',
    },
    slots.default &&
      slots
        .default()
        .map((item, index) =>
          renderTab(item.props.name, item.props.label, index),
        ),
  )
}

// 渲染tab的内容
// TODO: 添加动画
function renderContent() {
  return (
    slots.default &&
    slots
      .default()
      .find((item) =>
        activeTab.value ? item.props.name === activeTab.value : true,
      )
  )
}
</script>

<template>
  <render-tabs />
  <render-content />
</template>
