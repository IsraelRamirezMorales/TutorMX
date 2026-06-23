<script setup>
import { inject } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: [String, Object, Array]
})

const select = inject('select')
</script>

<template>
  <div
    v-if="select.isOpen.value"
    data-slot="select-content"
    :class="cn('absolute mt-1 top-full left-0 w-full bg-popover text-popover-foreground z-50 max-h-60 overflow-x-hidden overflow-y-auto rounded-md border shadow-md', props.class)"
  >
    <div class="p-1">
      <slot />
    </div>
  </div>
</template>
