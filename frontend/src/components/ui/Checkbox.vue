<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  checked: Boolean,
  class: [String, Object, Array],
  id: String
})
const emit = defineEmits(['update:checked', 'checkedChange'])

const handleChange = (e) => {
  emit('update:checked', e.target.checked)
  emit('checkedChange', e.target.checked)
}
</script>
<template>
  <input 
    type="checkbox" 
    :id="id"
    :checked="checked" 
    @change="handleChange"
    :class="cn('peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:text-primary-foreground', props.class)" 
  />
</template>
