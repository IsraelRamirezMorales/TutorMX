<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: {
    type: [String, Object, Array],
    default: '',
  },
})

const computedClass = computed(() => cn('text-muted-foreground text-sm', props.class))
</script>

<template>
  <div data-slot="card-description" :class="computedClass">
    <slot />
  </div>
</template>
