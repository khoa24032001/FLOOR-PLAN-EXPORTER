<script setup>
import { cn } from '@/utils/cn'

defineProps({
  class: String
})
</script>

<template>
  <div :class="cn('p-6 pt-0', $props.class)">
    <slot />
  </div>
</template>
