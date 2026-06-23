<script setup>
import { ref, provide, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: String,
  required: Boolean
})
const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectedValue = ref(props.modelValue)
const selectedLabel = ref('')

const toggle = () => isOpen.value = !isOpen.value
const close = () => isOpen.value = false

const selectOption = (val, label) => {
  selectedValue.value = val
  selectedLabel.value = label
  emit('update:modelValue', val)
  close()
}

watch(() => props.modelValue, (newVal) => {
  selectedValue.value = newVal
})

const selectRef = ref(null)

const handleClickOutside = (e) => {
  if (selectRef.value && !selectRef.value.contains(e.target)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

provide('select', { isOpen, selectedValue, selectedLabel, toggle, close, selectOption })
</script>

<template>
  <div ref="selectRef" class="relative w-full">
    <slot />
    <select v-if="required" :value="selectedValue" class="sr-only" required>
      <option value=""></option>
      <option v-if="selectedValue" :value="selectedValue" selected></option>
    </select>
  </div>
</template>
