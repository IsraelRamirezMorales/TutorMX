<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: {
    type: [String, Object, Array],
    default: '',
  },
})

const computedClass = computed(() => cn('px-6', props.class))
</script>

<template>
  <div data-slot="card-content" :class="computedClass">
    <slot />
  </div>
</template>
