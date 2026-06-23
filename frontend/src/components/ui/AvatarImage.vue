<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({ 
  src: String,
  alt: String,
  class: [String, Object, Array] 
})
</script>
<template>
  <img v-if="src" :src="src" :alt="alt" :class="cn('aspect-square h-full w-full object-cover', props.class)" />
</template>
