<script setup>
import { computed, ref, watch } from 'vue'
import { AlertCircle, CheckCircle2, Download, Eye, X, Loader2 } from 'lucide-vue-next'
import Alert from './ui/Alert.vue'
import AlertTitle from './ui/AlertTitle.vue'
import AlertDescription from './ui/AlertDescription.vue'
import Card from './ui/Card.vue'
import CardHeader from './ui/CardHeader.vue'
import CardTitle from './ui/CardTitle.vue'
import CardContent from './ui/CardContent.vue'
import Button from './ui/Button.vue'

const props = defineProps({
  result: Object,
  error: String,
  loading: Boolean
})

// Preview modal state
const previewUrl = ref(null)
const isPreviewOpen = ref(false)
const imageLoading = ref(true)

// Parse the API response to extract all file URLs
const exportedFiles = computed(() => {
  if (!props.result) return []
  
  const files = []
  
  Object.keys(props.result).forEach(prefix => {
    const formats = props.result[prefix]
    
    Object.keys(formats).forEach(format => {
      const urls = formats[format]
      
      if (Array.isArray(urls)) {
        urls.forEach((url, index) => {
          files.push({
            prefix,
            format,
            url,
            index,
            filename: extractFilename(url),
            canPreview: canPreviewFormat(format)
          })
        })
      }
    })
  })
  
  return files
})

// Extract filename from URL
const extractFilename = (url) => {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1)
    return decodeURIComponent(filename)
  } catch {
    return 'download'
  }
}

// Check if format can be previewed (only PNG and JPEG)
const canPreviewFormat = (format) => {
  const fmt = format.toLowerCase()
  return fmt === 'png' || fmt === 'jpeg' || fmt === 'jpg'
}

// Download file function
const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Download failed:', error)
    alert('Failed to download file. Please try again.')
  }
}

// Open preview modal
const openPreview = (url) => {
  previewUrl.value = url
  isPreviewOpen.value = true
  imageLoading.value = true
}

// Close preview modal
const closePreview = () => {
  isPreviewOpen.value = false
  previewUrl.value = null
  imageLoading.value = true
}

// Handle image load complete
const handleImageLoad = () => {
  imageLoading.value = false
}

// Handle image load error
const handleImageError = () => {
  imageLoading.value = false
  alert('Failed to load image preview.')
}

// Handle escape key to close modal
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    closePreview()
  }
}

// Watch for modal state changes
watch(isPreviewOpen, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div class="space-y-4 animate-fade-in">
    <!-- Loading State -->
    <Card v-if="loading" class="relative overflow-hidden">
      <div class="absolute inset-0 bg-muted/50 backdrop-blur-sm z-10 flex items-center justify-center">
        <div class="text-center space-y-4">
          <Loader2 class="h-12 w-12 animate-spin text-primary mx-auto" />
          <div class="space-y-2">
            <p class="text-sm font-medium">Generating floor plan...</p>
            <p class="text-xs text-muted-foreground">Please wait, this may take a moment</p>
          </div>
        </div>
      </div>
      <CardContent class="py-24">
        <div class="text-center text-muted-foreground">
          <p class="text-sm">Your export is being processed</p>
        </div>
      </CardContent>
    </Card>

    <!-- Error State -->
    <Alert v-if="!loading && error" variant="destructive">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>Export Failed</AlertTitle>
      <AlertDescription>
        {{ error }}
      </AlertDescription>
    </Alert>

    <!-- Success State -->
    <div v-if="!loading && result && exportedFiles.length > 0" class="space-y-4">
      <Alert variant="success">
        <CheckCircle2 class="h-4 w-4" />
        <AlertTitle>Export Successful</AlertTitle>
        <AlertDescription>
          {{ exportedFiles.length }} file{{ exportedFiles.length > 1 ? 's' : '' }} generated successfully.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Exported Files</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <!-- File List -->
          <div class="space-y-2">
            <div 
              v-for="file in exportedFiles" 
              :key="file.url"
              class="flex items-center justify-between p-3 bg-muted/50 rounded-lg border hover:bg-muted/70 transition-colors"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">
                  {{ file.filename }}
                </p>
                <p class="text-xs text-muted-foreground mt-0.5">
                  {{ file.format.toUpperCase() }} • Floor {{ file.index }}
                  <span v-if="!file.canPreview" class="ml-2 text-amber-600">• Preview not available</span>
                </p>
              </div>
              
              <div class="flex items-center gap-2 ml-4">
                <!-- Preview Button (only for PNG/JPEG) -->
                <Button 
                  v-if="file.canPreview"
                  @click="openPreview(file.url)"
                  variant="outline"
                  size="sm"
                  class="gap-2"
                  title="Preview image"
                >
                  <Eye class="h-4 w-4" />
                  Preview
                </Button>
                
                <!-- Download -->
                <Button 
                  @click="downloadFile(file.url, file.filename)"
                  variant="default"
                  size="sm"
                  class="gap-2"
                  :title="file.canPreview ? 'Download file' : 'Download file (preview not available)'"
                >
                  <Download class="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          <!-- Info message for non-previewable formats -->
          <div v-if="exportedFiles.some(f => !f.canPreview)" class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p class="text-xs text-amber-800">
              <strong>Note:</strong> PDF and SVG files cannot be previewed. Please download them to view.
            </p>
          </div>

          <!-- Response Data -->
          <details class="group mt-4">
            <summary class="cursor-pointer text-sm font-medium hover:text-primary transition-colors list-none flex items-center gap-2">
              <span class="transform transition-transform group-open:rotate-90">▶</span>
              View Raw Response
            </summary>
            <pre class="mt-3 p-4 bg-muted rounded-md text-xs overflow-auto max-h-96 font-mono border">{{ JSON.stringify(result, null, 2) }}</pre>
          </details>
        </CardContent>
      </Card>
    </div>

    <!-- Preview Modal (only for images) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-200"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isPreviewOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          @click="closePreview"
        >
          <!-- Modal Content -->
          <div 
            class="relative max-w-7xl max-h-[90vh] w-full bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b bg-white shrink-0">
              <h3 class="font-semibold text-lg">Image Preview</h3>
              <Button
                @click="closePreview"
                variant="ghost"
                size="sm"
                class="gap-2"
              >
                <X class="h-4 w-4" />
                Close
              </Button>
            </div>

            <!-- Preview Content -->
            <div class="flex-1 overflow-auto bg-gray-50 relative min-h-[500px]">
              <!-- Loading Indicator -->
              <div 
                v-if="imageLoading" 
                class="absolute inset-0 flex items-center justify-center bg-gray-50 z-10"
              >
                <div class="text-center space-y-3">
                  <Loader2 class="h-10 w-10 animate-spin text-primary mx-auto" />
                  <p class="text-sm text-muted-foreground">Loading image...</p>
                </div>
              </div>

              <!-- Image Preview -->
              <div class="flex items-center justify-center p-8">
                <img 
                  :src="previewUrl" 
                  alt="Floor plan preview"
                  class="max-w-full h-auto rounded shadow-lg bg-white"
                  :class="{ 'opacity-0': imageLoading }"
                  style="max-height: calc(90vh - 120px)"
                  @load="handleImageLoad"
                  @error="handleImageError"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.z-50 {
  z-index: 9999;
}
</style>