<script setup>
import { computed, ref, watch } from 'vue'
import { Settings, Ruler, Download as DownloadIcon, Tag, RotateCcw } from 'lucide-vue-next'
import Card from './ui/Card.vue'
import CardHeader from './ui/CardHeader.vue'
import CardTitle from './ui/CardTitle.vue'
import CardDescription from './ui/CardDescription.vue'
import CardContent from './ui/CardContent.vue'
import Label from './ui/Label.vue'
import Select from './ui/Select.vue'
import Input from './ui/Input.vue'
import Checkbox from './ui/Checkbox.vue'
import Button from './ui/Button.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// Store original config for undo functionality
const originalConfig = ref(null)
const hasChanges = ref(false)

// Watch for initial load and store original
watch(() => props.modelValue, (newVal) => {
  if (!originalConfig.value && newVal) {
    // Deep clone the original config on first load
    originalConfig.value = JSON.parse(JSON.stringify(newVal))
  }
}, { immediate: true })

const localConfig = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    checkForChanges()
  }
})

// Check if config has changed from original
const checkForChanges = () => {
  if (!originalConfig.value) return
  hasChanges.value = JSON.stringify(localConfig.value) !== JSON.stringify(originalConfig.value)
}

// Reset to original config
const resetToOriginal = () => {
  if (originalConfig.value) {
    emit('update:modelValue', JSON.parse(JSON.stringify(originalConfig.value)))
    hasChanges.value = false
  }
}

// Handle both old structure (dimensions at root) and new structure (dimensions under globalModelOptions)
const dimensions = computed({
  get: () => {
    // Check if dimensions is under globalModelOptions (correct structure)
    if (localConfig.value.globalModelOptions?.dimensions) {
      return localConfig.value.globalModelOptions.dimensions
    }
    // Fallback to root level (old structure)
    return localConfig.value.dimensions
  },
  set: (val) => {
    // Always set it under globalModelOptions (correct structure)
    if (!localConfig.value.globalModelOptions) {
      localConfig.value.globalModelOptions = {}
    }
    localConfig.value.globalModelOptions.dimensions = val
    
    // Remove from root level if it exists there
    if (localConfig.value.dimensions) {
      delete localConfig.value.dimensions
    }
    checkForChanges()
  }
})

// Handle export configuration (supports both simple and complex formats)
const exportFormat = computed({
  get: () => {
    const exp = localConfig.value.exports?.[0]
    if (!exp) return 'png'
    
    // Check for singleFloor format
    if (exp.singleFloor?.format) return exp.singleFloor.format
    // Check for compose format
    if (exp.compose?.format) return exp.compose.format
    // Fallback to direct format
    return exp.format || 'png'
  },
  set: (val) => {
    if (!localConfig.value.exports) {
      localConfig.value.exports = [{}]
    }
    const exp = localConfig.value.exports[0]
    
    // Update format in all possible locations
    if (exp.singleFloor) {
      exp.singleFloor.format = val
    }
    if (exp.compose) {
      exp.compose.format = val
    }
    if (!exp.singleFloor && !exp.compose) {
      // Simple format
      if (!exp.singleFloor) {
        exp.singleFloor = { format: val }
      }
    }
    checkForChanges()
  }
})

const exportDpi = computed({
  get: () => {
    const exp = localConfig.value.exports?.[0]
    if (!exp) return 150
    
    // Check for singleFloor dpi
    if (exp.singleFloor?.dpi) return exp.singleFloor.dpi
    // Check for compose dpi
    if (exp.compose?.dpi) return exp.compose.dpi
    // Fallback to direct dpi
    return exp.dpi || 150
  },
  set: (val) => {
    if (!localConfig.value.exports) {
      localConfig.value.exports = [{}]
    }
    const exp = localConfig.value.exports[0]
    
    // Update dpi in all possible locations
    if (exp.singleFloor) {
      exp.singleFloor.dpi = val
    }
    if (exp.compose) {
      exp.compose.dpi = val
    }
    if (!exp.singleFloor && !exp.compose) {
      // Simple format
      if (!exp.singleFloor) {
        exp.singleFloor = { dpi: val }
      }
    }
    checkForChanges()
  }
})
</script>

<template>
  <Card class="animate-slide-up" style="animation-delay: 0.1s">
    <CardHeader>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Settings class="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Configuration Editor</CardTitle>
            <CardDescription>
              Customize your floor plan export settings
            </CardDescription>
          </div>
        </div>
        
        <!-- Reset Button -->
        <Button 
          v-if="hasChanges"
          @click="resetToOriginal"
          variant="outline"
          size="sm"
          class="gap-2"
          title="Reset to original uploaded configuration"
        >
          <RotateCcw class="h-4 w-4" />
          Reset
        </Button>
      </div>
    </CardHeader>
    <CardContent class="space-y-8">
      <!-- GLOBAL OPTIONS -->
      <section v-if="localConfig.globalModelOptions" class="space-y-4">
        <div class="flex items-center gap-2 pb-2 border-b">
          <Tag class="h-4 w-4 text-muted-foreground" />
          <h3 class="font-semibold text-sm">Global Model Options</h3>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Unit Selection -->
          <div class="space-y-2">
            <Label for="unit">Measurement Unit</Label>
            <Select
              id="unit"
              v-model="localConfig.globalModelOptions.unit"
              @change="checkForChanges"
            >
              <option value="m">Meters (m)</option>
              <option value="ft">Feet (ft)</option>
              <option value="ft,m">Feet & Meters</option>
            </Select>
          </div>

          <!-- Checkboxes in grid -->
          <div class="space-y-3 flex flex-col justify-end">
            <div class="flex items-center gap-2">
              <Checkbox
                id="spaceLabels"
                :checked="localConfig.globalModelOptions.showSpaceLabels"
                @update:checked="localConfig.globalModelOptions.showSpaceLabels = $event; checkForChanges()"
              />
              <Label for="spaceLabels" class="cursor-pointer font-normal">
                Show space labels
              </Label>
            </div>

            <div v-if="localConfig.globalModelOptions.outerMeasurements !== undefined" class="flex items-center gap-2">
              <Checkbox
                id="outerMeasurements"
                :checked="localConfig.globalModelOptions.outerMeasurements"
                @update:checked="localConfig.globalModelOptions.outerMeasurements = $event; checkForChanges()"
              />
              <Label for="outerMeasurements" class="cursor-pointer font-normal">
                Show outer measurements
              </Label>
            </div>
          </div>
        </div>
      </section>

      <!-- DIMENSIONS -->
      <section v-if="dimensions" class="space-y-4">
        <div class="flex items-center gap-2 pb-2 border-b">
          <Ruler class="h-4 w-4 text-muted-foreground" />
          <h3 class="font-semibold text-sm">Dimensions</h3>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <Checkbox
                id="dimensionText"
                :checked="dimensions.text"
                @update:checked="dimensions.text = $event"
              />
              <Label for="dimensionText" class="cursor-pointer font-normal">
                Show dimension text
              </Label>
            </div>

            <div class="flex items-center gap-2">
              <Checkbox
                id="dimensionMarkers"
                :checked="dimensions.markers"
                @update:checked="dimensions.markers = $event"
              />
              <Label for="dimensionMarkers" class="cursor-pointer font-normal">
                Show dimension markers
              </Label>
            </div>
          </div>

          <div v-if="dimensions.metersDecimals !== undefined" class="space-y-2">
            <Label for="metersDecimals">Meters Decimals (0-2)</Label>
            <Input
              id="metersDecimals"
              type="number"
              min="0"
              max="2"
              v-model.number="dimensions.metersDecimals"
              @input="checkForChanges"
            />
            <p class="text-xs text-muted-foreground">
              Number of decimal places (0, 1, or 2)
            </p>
          </div>
        </div>
      </section>

      <!-- EXPORT -->
      <section v-if="localConfig.exports?.length" class="space-y-4">
        <div class="flex items-center gap-2 pb-2 border-b">
          <DownloadIcon class="h-4 w-4 text-muted-foreground" />
          <h3 class="font-semibold text-sm">Export Settings</h3>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="format">Output Format</Label>
            <Select
              id="format"
              v-model="exportFormat"
            >
              <option value="png">PNG (Raster)</option>
              <option value="jpeg">JPEG (Raster)</option>
              <option value="svg">SVG (Vector)</option>
              <option value="pdf">PDF (Document)</option>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="dpi">DPI (Dots Per Inch)</Label>
            <Input
              id="dpi"
              type="number"
              min="72"
              max="300"
              step="1"
              v-model.number="exportDpi"
            />
            <p class="text-xs text-muted-foreground">
              Higher DPI = better quality, larger file
            </p>
          </div>
        </div>
      </section>

      <div class="pt-4 border-t space-y-3">       
        <p class="text-xs text-muted-foreground leading-relaxed">
          <strong>Note:</strong> This editor demonstrates key configuration options. 
          Not all available options are displayed. Refer to the 
          <a href="https://exporter.docs.cubi.casa/floor-plan-19842092e0" target="_blank" class="text-primary hover:underline">
            API documentation
          </a> for complete details.
        </p>
      </div>
    </CardContent>
  </Card>
</template>