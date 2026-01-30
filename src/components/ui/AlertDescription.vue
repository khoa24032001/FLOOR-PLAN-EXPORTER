<script setup>
import { cn } from '@/utils/cn'

defineProps({
  class: String
})
</script>

<template>
  <div :class="cn('text-sm [&_p]:leading-relaxed', $props.class)">
    <slot />
  </div>
</template>
