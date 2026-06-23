<script setup>
import { ref, provide, watch } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  defaultValue: String,
  modelValue: String,
  class: [String, Object, Array]
})

const emit = defineEmits(['update:modelValue'])

const activeTab = ref(props.modelValue || props.defaultValue)

watch(() => props.modelValue, (newVal) => {
  if (newVal !== undefined) {
    activeTab.value = newVal
  }
})

const setActiveTab = (val) => {
  activeTab.value = val
  emit('update:modelValue', val)
}

provide('tabs', {
  activeTab,
  setActiveTab
})
</script>

<template>
  <div data-slot="tabs" :class="cn('flex flex-col gap-2', props.class)">
    <slot />
  </div>
</template>
