<script setup>
import { inject, ref, onMounted } from 'vue'
import { Check } from '@lucide/vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  class: [String, Object, Array]
})

const select = inject('select')
const itemRef = ref(null)

const selectThis = () => {
  const label = itemRef.value ? itemRef.value.innerText : props.value
  select.selectOption(props.value, label)
}

onMounted(() => {
  // If this item matches initial value, set the label in parent
  if (select.selectedValue.value === props.value && itemRef.value) {
    select.selectedLabel.value = itemRef.value.innerText
  }
})
</script>

<template>
  <div
    ref="itemRef"
    role="option"
    data-slot="select-item"
    :class="cn('hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50', props.class)"
    @click="selectThis"
  >
    <span class="absolute right-2 flex size-3.5 items-center justify-center">
      <Check v-if="select.selectedValue.value === props.value" class="size-4" />
    </span>
    <span><slot /></span>
  </div>
</template>
