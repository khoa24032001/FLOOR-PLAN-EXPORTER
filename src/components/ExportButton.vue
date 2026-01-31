<script setup>
import { ref } from 'vue'
import { Loader2, Send } from 'lucide-vue-next'
import { exportFloorPlan } from '../composables/useExporterApi'
import Button from './ui/Button.vue'

const props = defineProps({ 
  config: Object 
})

const emit = defineEmits(['start', 'success', 'error'])
const isLoading = ref(false)

const handleExport = async () => {
  try {
    isLoading.value = true
    emit('start')  // Emit start event for loading state
    
    // Get credentials from environment variables
    const API_KEY = import.meta.env.VITE_API_KEY
    const MODEL_ID = import.meta.env.VITE_MODEL_ID

    // Validate credentials exist
    if (!API_KEY || !MODEL_ID) {
      throw new Error('API credentials not configured. Please check your .env file.')
    }

    const res = await exportFloorPlan(MODEL_ID, API_KEY, props.config)
    emit('success', res)
  } catch (e) {
    emit('error', e.message || 'Export failed')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Button
    @click="handleExport"
    :disabled="isLoading"
    variant="default"
    size="lg"
    class="gap-2"
  >
    <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
    <Send v-else class="h-4 w-4" />
    {{ isLoading ? 'Exporting...' : 'Export Floor Plan' }}
  </Button>
</template>