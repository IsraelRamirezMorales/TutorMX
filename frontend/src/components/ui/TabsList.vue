<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  class: [String, Object, Array]
})
</script>

<template>
  <div data-slot="tabs-list" :class="cn('bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-0.75', props.class)">
    <slot />
  </div>
</template>
