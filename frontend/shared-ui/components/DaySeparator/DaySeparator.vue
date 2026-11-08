<template>
  <div class="flex items-center gap-3">
    <div class="h-px flex-1 bg-border"></div>
    <span class="text-xs text-muted-foreground">{{ label }}</span>
    <div class="h-px flex-1 bg-border"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { isToday, isYesterday } from 'date-fns'
import { formatDate } from '../../utils/datetime.js'

const props = defineProps({
  date: {
    type: [String, Date],
    required: true
  }
})

const { t } = useI18n()

const label = computed(() => {
  const date = new Date(props.date)
  if (isToday(date)) return t('globals.terms.today')
  if (isYesterday(date)) return t('globals.terms.yesterday')
  return formatDate(date, 'd MMM yyyy', { day: 'numeric', month: 'short', year: 'numeric' })
})
</script>
