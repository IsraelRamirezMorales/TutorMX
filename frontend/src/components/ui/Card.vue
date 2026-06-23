<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: {
    type: [String, Object, Array],
    default: '',
  },
})

const computedClass = computed(() => cn('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', props.class))
</script>

<template>
  <div data-slot="card" :class="computedClass">
    <slot />
  </div>
</template>
