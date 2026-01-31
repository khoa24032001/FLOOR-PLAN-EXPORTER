<script setup>
import { ref } from 'vue'
import { Upload, FileJson, AlertCircle } from 'lucide-vue-next'
import Card from './ui/Card.vue'
import CardHeader from './ui/CardHeader.vue'
import CardTitle from './ui/CardTitle.vue'
import CardDescription from './ui/CardDescription.vue'
import CardContent from './ui/CardContent.vue'
import Button from './ui/Button.vue'
import Alert from './ui/Alert.vue'
import AlertTitle from './ui/AlertTitle.vue'
import AlertDescription from './ui/AlertDescription.vue'

const emit = defineEmits(['loaded', 'error'])

const isDragging = ref(false)
const fileInputRef = ref(null)
const uploadedFileName = ref(null)
const uploadError = ref(null)

const handleUpload = async (file) => {
  if (!file) return
  
  // Clear previous error
  uploadError.value = null
  
  // Validate file extension
  const fileName = file.name.toLowerCase()
  if (!fileName.endsWith('.json')) {
    uploadError.value = 'Invalid file type. Please upload a .json file.'
    uploadedFileName.value = null
    emit('error') // Tell parent to reset state
    return
  }
  
  try {
    const text = await file.text()
    const json = JSON.parse(text)
    uploadedFileName.value = file.name
    uploadError.value = null
    emit('loaded', json)
  } catch (error) {
    uploadError.value = 'Invalid JSON file. Please upload a valid configuration file.'
    uploadedFileName.value = null
    emit('error') // Tell parent to reset state
  }
}

const handleFileInput = async (e) => {
  const file = e.target.files[0]
  await handleUpload(file)
  // Clear input so same file can be selected again
  e.target.value = ''
}

const handleDrop = async (e) => {
  e.preventDefault()
  isDragging.value = false
  
  const file = e.dataTransfer.files[0]
  await handleUpload(file)
}

const handleDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}
</script>

<template>
  <div class="space-y-4">
    <!-- Error Alert -->
    <Alert v-if="uploadError" variant="destructive" class="animate-slide-up">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>Upload Error</AlertTitle>
      <AlertDescription>
        {{ uploadError }}
      </AlertDescription>
    </Alert>

    <!-- Upload Card -->
    <Card class="animate-slide-up">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <FileJson class="h-5 w-5 text-primary" />
          Configuration File
        </CardTitle>
        <CardDescription>
          Upload your floor plan exporter configuration JSON file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          @drop="handleDrop"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          :class="[
            'relative rounded-lg border-2 border-dashed p-8 text-center transition-all cursor-pointer',
            isDragging 
              ? 'border-primary bg-primary/5 scale-[1.02]' 
              : uploadError
              ? 'border-destructive/50 hover:border-destructive'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          ]"
          @click="triggerFileInput"
        >
          <input
            ref="fileInputRef"
            type="file"
            accept=".json,application/json"
            @change="handleFileInput"
            class="hidden"
          />
          
          <div class="flex flex-col items-center gap-3">
            <div :class="[
              'rounded-full p-4',
              uploadError ? 'bg-destructive/10' : 'bg-primary/10'
            ]">
              <Upload :class="[
                'h-8 w-8 transition-transform',
                isDragging && 'scale-110',
                uploadError ? 'text-destructive' : ''
              ]" />
            </div>
            
            <div class="space-y-1">
              <p class="text-sm font-medium">
                {{ isDragging ? 'Drop your file here' : 'Click to upload or drag and drop' }}
              </p>
              <p class="text-xs text-muted-foreground">
                JSON configuration file only (.json)
              </p>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              @click.stop="triggerFileInput"
              class="mt-2"
            >
              Browse Files
            </Button>
          </div>

          <div v-if="uploadedFileName && !uploadError" class="mt-4 pt-4 border-t">
            <div class="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-md text-sm">
              <FileJson class="h-4 w-4 text-primary" />
              <span class="font-medium">{{ uploadedFileName }}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>