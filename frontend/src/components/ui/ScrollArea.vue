<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object, Array] })
</script>
<template>
  <div :class="cn('relative overflow-auto', props.class)">
    <slot />
  </div>
</template>
