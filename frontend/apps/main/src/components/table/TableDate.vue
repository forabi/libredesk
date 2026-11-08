<script setup>
import { computed } from 'vue'
import { isValid } from 'date-fns'
import { formatDate } from '@shared-ui/utils/datetime.js'

const props = defineProps({
  value: { type: [String, Number, Date], default: null }
})

const date = computed(() => {
  if (props.value === null || props.value === '') return null
  const parsed = new Date(props.value)
  return isValid(parsed) ? parsed : null
})
const fullTimestamp = computed(() => date.value ? formatDate(date.value, 'd MMM yyyy, h:mm:ss a OOOO', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', timeZoneName: 'short' }) : '')
</script>

<template>
  <time
    v-if="date"
    :datetime="date.toISOString()"
    :title="fullTimestamp"
    :aria-label="fullTimestamp"
    class="whitespace-nowrap"
  >{{ formatDate(date, 'd MMM yyyy, h:mm a', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) }}</time>
</template>
