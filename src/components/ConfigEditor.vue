<script setup>
import { computed } from 'vue'
import { Settings, Ruler, Download as DownloadIcon, Tag } from 'lucide-vue-next'
import Card from './ui/Card.vue'
import CardHeader from './ui/CardHeader.vue'
import CardTitle from './ui/CardTitle.vue'
import CardDescription from './ui/CardDescription.vue'
import CardContent from './ui/CardContent.vue'
import Label from './ui/Label.vue'
import Select from './ui/Select.vue'
import Input from './ui/Input.vue'
import Checkbox from './ui/Checkbox.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const localConfig = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <Card class="animate-slide-up" style="animation-delay: 0.1s">
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Settings class="h-5 w-5 text-primary" />
        Configuration Editor
      </CardTitle>
      <CardDescription>
        Customize your floor plan export settings
      </CardDescription>
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
            >
              <option value="m">Meters (m)</option>
              <option value="ft">Feet (ft)</option>
              <option value="ft,m">Feet & Meters</option>
            </Select>
          </div>

          <!-- Checkboxes in grid -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <Checkbox
                id="spaceLabels"
                :checked="localConfig.globalModelOptions.showSpaceLabels"
                @update:checked="localConfig.globalModelOptions.showSpaceLabels = $event"
              />
              <Label for="spaceLabels" class="cursor-pointer font-normal">
                Show space labels
              </Label>
            </div>

            <div class="flex items-center gap-2">
              <Checkbox
                id="scaleIndicator"
                :checked="localConfig.globalModelOptions.showScaleIndicator"
                @update:checked="localConfig.globalModelOptions.showScaleIndicator = $event"
              />
              <Label for="scaleIndicator" class="cursor-pointer font-normal">
                Show scale indicator
              </Label>
            </div>

            <div class="flex items-center gap-2">
              <Checkbox
                id="outerMeasurements"
                :checked="localConfig.globalModelOptions.outerMeasurements"
                @update:checked="localConfig.globalModelOptions.outerMeasurements = $event"
              />
              <Label for="outerMeasurements" class="cursor-pointer font-normal">
                Show outer measurements
              </Label>
            </div>
          </div>
        </div>
      </section>

      <!-- DIMENSIONS -->
      <section v-if="localConfig.dimensions" class="space-y-4">
        <div class="flex items-center gap-2 pb-2 border-b">
          <Ruler class="h-4 w-4 text-muted-foreground" />
          <h3 class="font-semibold text-sm">Dimensions</h3>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <Checkbox
                id="dimensionText"
                :checked="localConfig.dimensions.text"
                @update:checked="localConfig.dimensions.text = $event"
              />
              <Label for="dimensionText" class="cursor-pointer font-normal">
                Show dimension text
              </Label>
            </div>

            <div class="flex items-center gap-2">
              <Checkbox
                id="dimensionMarkers"
                :checked="localConfig.dimensions.markers"
                @update:checked="localConfig.dimensions.markers = $event"
              />
              <Label for="dimensionMarkers" class="cursor-pointer font-normal">
                Show dimension markers
              </Label>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="metersDecimals">Meters Decimals</Label>
            <Input
              id="metersDecimals"
              type="number"
              min="0"
              max="2"
              v-model.number="localConfig.dimensions.metersDecimals"
            />
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
              v-model="localConfig.exports[0].format"
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
              v-model.number="localConfig.exports[0].dpi"
            />
            <p class="text-xs text-muted-foreground">
              Higher DPI = better quality, larger file
            </p>
          </div>
        </div>
      </section>

      <div class="pt-4 border-t">
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
