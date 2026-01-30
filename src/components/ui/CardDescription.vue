<script setup>
import { cn } from '@/utils/cn'

defineProps({
  class: String
})
</script>

<template>
  <p :class="cn('text-sm text-muted-foreground', $props.class)">
    <slot />
  </p>
</template>
