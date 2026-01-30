<script setup>
import { AlertCircle, CheckCircle2, ExternalLink } from 'lucide-vue-next'
import Alert from './ui/Alert.vue'
import AlertTitle from './ui/AlertTitle.vue'
import AlertDescription from './ui/AlertDescription.vue'
import Card from './ui/Card.vue'
import CardHeader from './ui/CardHeader.vue'
import CardTitle from './ui/CardTitle.vue'
import CardContent from './ui/CardContent.vue'
import Button from './ui/Button.vue'

defineProps({
  result: Object,
  error: String
})
</script>

<template>
  <div class="space-y-4 animate-fade-in">
    <!-- Error State -->
    <Alert v-if="error" variant="destructive">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>Export Failed</AlertTitle>
      <AlertDescription>
        {{ error }}
      </AlertDescription>
    </Alert>

    <!-- Success State -->
    <div v-if="result" class="space-y-4">
      <Alert variant="success">
        <CheckCircle2 class="h-4 w-4" />
        <AlertTitle>Export Successful</AlertTitle>
        <AlertDescription>
          Your floor plan has been generated successfully.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Export Result</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- Download Link -->
          <div v-if="result?.data?.url" class="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
            <div class="space-y-1">
              <p class="text-sm font-medium">Floor Plan Ready</p>
              <p class="text-xs text-muted-foreground">Click the button to view or download your export</p>
            </div>
            <Button 
              :as="'a'" 
              :href="result.data.url" 
              target="_blank"
              class="gap-2"
            >
              <ExternalLink class="h-4 w-4" />
              Open File
            </Button>
          </div>

          <!-- Response Data -->
          <details class="group">
            <summary class="cursor-pointer text-sm font-medium hover:text-primary transition-colors list-none flex items-center gap-2">
              <span class="transform transition-transform group-open:rotate-90">▶</span>
              View Raw Response
            </summary>
            <pre class="mt-3 p-4 bg-muted rounded-md text-xs overflow-auto max-h-96 font-mono border">{{ JSON.stringify(result, null, 2) }}</pre>
          </details>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
