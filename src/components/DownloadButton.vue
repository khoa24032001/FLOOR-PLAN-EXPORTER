<script setup>
import { Download } from 'lucide-vue-next'
import { downloadJson } from '../utils/downloadFile'
import Button from './ui/Button.vue'

const props = defineProps({ 
  config: Object 
})

const download = () => {
  downloadJson('exporter-config.json', props.config)
}
</script>

<template>
  <Button
    @click="download"
    variant="secondary"
    size="lg"
    class="gap-2"
  >
    <Download class="h-4 w-4" />
    Download Configuration
  </Button>
</template>
