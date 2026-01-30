<script setup>
import { Check } from 'lucide-vue-next'
import { cn } from '@/utils/cn'

const props = defineProps({
  class: String,
  checked: Boolean,
  disabled: Boolean,
  id: String
})

const emit = defineEmits(['update:checked'])

const handleChange = (event) => {
  emit('update:checked', event.target.checked)
}
</script>

<template>
  <div class="relative inline-flex items-center">
    <input
      :id="id"
      type="checkbox"
      :checked="checked"
      @change="handleChange"
      :disabled="disabled"
      :class="cn(
        'peer h-5 w-5 shrink-0 rounded border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer appearance-none bg-background transition-colors',
        'checked:bg-primary checked:border-primary',
        $props.class
      )"
    />
    <Check
      :class="cn(
        'pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-primary-foreground opacity-0 transition-opacity',
        checked && 'opacity-100'
      )"
    />
  </div>
</template>
