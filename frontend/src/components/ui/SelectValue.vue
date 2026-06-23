<script setup>
import { inject, computed } from 'vue'

const props = defineProps({
  placeholder: String
})

const select = inject('select')
const displayValue = computed(() => select.selectedLabel.value || props.placeholder)
</script>

<template>
  <span data-slot="select-value" class="line-clamp-1 flex items-center gap-2">
    {{ displayValue }}
  </span>
</template>
