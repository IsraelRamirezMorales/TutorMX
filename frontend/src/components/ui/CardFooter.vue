<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: {
    type: [String, Object, Array],
    default: '',
  },
})

const computedClass = computed(() => cn('flex items-center px-6 [.border-t]:pt-6', props.class))
</script>

<template>
  <div data-slot="card-footer" :class="computedClass">
    <slot />
  </div>
</template>
