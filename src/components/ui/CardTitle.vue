<script setup>
import { cn } from '@/utils/cn'

defineProps({
  class: String
})
</script>

<template>
  <h3 :class="cn('font-semibold leading-none tracking-tight', $props.class)">
    <slot />
  </h3>
</template>
