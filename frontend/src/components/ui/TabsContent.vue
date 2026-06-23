<script setup>
import { inject, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  class: [String, Object, Array]
})

const tabs = inject('tabs')
const isActive = computed(() => tabs.activeTab.value === props.value)
</script>

<template>
  <div
    v-show="isActive"
    role="tabpanel"
    data-slot="tabs-content"
    :class="cn('flex-1 outline-none mt-2', props.class)"
  >
    <slot v-if="isActive" />
  </div>
</template>
