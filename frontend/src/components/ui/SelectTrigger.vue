<script setup>
import { inject } from 'vue'
import { ChevronDown } from '@lucide/vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: [String, Object, Array]
})

const select = inject('select')
</script>

<template>
  <button
    type="button"
    @click="select.toggle"
    data-slot="select-trigger"
    :class="cn('border-input data-placeholder:text-muted-foreground [&_svg:not([class*=\'text-\'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4', props.class)"
  >
    <slot />
    <ChevronDown class="size-4 opacity-50" />
  </button>
</template>
