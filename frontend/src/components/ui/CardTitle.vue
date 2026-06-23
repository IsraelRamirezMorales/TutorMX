<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: {
    type: [String, Object, Array],
    default: '',
  },
})

const computedClass = computed(() => cn('leading-none font-semibold', props.class))
</script>

<template>
  <div data-slot="card-title" :class="computedClass">
    <slot />
  </div>
</template>
