<script setup>
import { ref } from 'vue'
import { Box } from 'lucide-vue-next'
import FileUploader from './components/FileUploader.vue'
import ConfigEditor from './components/ConfigEditor.vue'
import DownloadButton from './components/DownloadButton.vue'
import ExportButton from './components/ExportButton.vue'
import ResultViewer from './components/ResultViewer.vue'

const config = ref(null)
const result = ref(null)
const error = ref(null)

const handleFileLoaded = (json) => {
  config.value = json
  result.value = null
  error.value = null
}

const handleExportResult = (res) => {
  result.value = res
  error.value = null
}

const handleError = (err) => {
  error.value = err
  result.value = null
}
</script>

<template>
  <div class="min-h-screen bg-background noise">
    <!-- Header -->
    <header class="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-primary/10">
            <Box class="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 class="text-2xl font-bold tracking-tight">Floor Plan Exporter</h1>
            <p class="text-sm text-muted-foreground">Configure and export floor plans via API</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <!-- Step 1: Upload -->
      <FileUploader @loaded="handleFileLoaded" />

      <!-- Step 2: Edit Configuration -->
      <Transition
        enter-active-class="transition-all duration-500"
        enter-from-class="opacity-0 transform translate-y-4"
        leave-active-class="transition-all duration-300"
        leave-to-class="opacity-0 transform translate-y-4"
      >
        <ConfigEditor v-if="config" v-model="config" />
      </Transition>

      <!-- Step 3: Actions -->
      <Transition
        enter-active-class="transition-all duration-500"
        enter-from-class="opacity-0 transform translate-y-4"
        leave-active-class="transition-all duration-300"
        leave-to-class="opacity-0 transform translate-y-4"
      >
        <div v-if="config" class="flex flex-wrap gap-4 animate-slide-up" style="animation-delay: 0.2s">
          <DownloadButton :config="config" />
          <ExportButton 
            :config="config" 
            @success="handleExportResult"
            @error="handleError"
          />
        </div>
      </Transition>

      <!-- Step 4: Results -->
      <Transition
        enter-active-class="transition-all duration-500"
        enter-from-class="opacity-0 transform translate-y-4"
        leave-active-class="transition-all duration-300"
        leave-to-class="opacity-0 transform translate-y-4"
      >
        <ResultViewer :result="result" :error="error" />
      </Transition>
    </main>

    <!-- Footer -->
    <footer class="border-t mt-12 bg-card/30 backdrop-blur-sm">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>Built with Vue 3, Vite, and Tailwind CSS</p>
          <a 
            href="https://exporter.docs.cubi.casa/floor-plan-19842092e0" 
            target="_blank"
            class="text-primary hover:underline inline-flex items-center gap-1"
          >
            API Documentation
            <ExternalLink class="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ExternalLink } from 'lucide-vue-next'
export default {
  components: {
    ExternalLink
  }
}
</script>
