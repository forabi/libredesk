<template>
  <div class="text-center">
    <div class="text-muted-foreground text-sm">
      {{ message.content }}
      <Tooltip>
        <TooltipTrigger>
          <span class="text-xs ms-1">{{ formatDate(message.updated_at, 'h:mm a', { hour: 'numeric', minute: '2-digit' }) }}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {{ formatDate(message.updated_at, "MMMM dd, yyyy 'at' HH:mm", { dateStyle: 'long', timeStyle: 'short' }) }}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '@shared-ui/utils/datetime.js'
import { Tooltip, TooltipContent, TooltipTrigger } from '@shared-ui/components/ui/tooltip'

defineProps({
  message: Object
})
</script>
