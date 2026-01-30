<script setup>
import { ref } from 'vue'
import { Loader2, Send } from 'lucide-vue-next'
import { exportFloorPlan } from '../composables/useExporterApi'
import Button from './ui/Button.vue'

const props = defineProps({ 
  config: Object 
})

const emit = defineEmits(['success', 'error'])
const isLoading = ref(false)

const handleExport = async () => {
  try {
    isLoading.value = true
    const API_KEY = '6731c959-9947-4f20-a458-dda6bb96dd46'
    const MODEL_ID = '2710a01d-4e2e-4d97-9f1b-a5918fc35736'

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
