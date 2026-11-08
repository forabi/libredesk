<template>
  <!-- Both primitive libraries are in use; each reads direction from its own provider. -->
  <RekaConfigProvider :dir="dir">
    <RadixConfigProvider :dir="dir">
      <TooltipProvider :delay-duration="150">
        <Toaster
          class="pointer-events-auto"
          position="top-center"
          close-button
          :dir="dir"
          :theme="mode === 'auto' ? 'system' : mode"
        />
        <RouterView />
      </TooltipProvider>
    </RadixConfigProvider>
  </RekaConfigProvider>
</template>

<script setup>
import { useColorMode } from '@vueuse/core'
import { RouterView } from 'vue-router'
import { Toaster } from '@shared-ui/components/ui/sonner'
import { TooltipProvider } from '@shared-ui/components/ui/tooltip'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ConfigProvider as RekaConfigProvider } from 'reka-ui'
import { ConfigProvider as RadixConfigProvider } from 'radix-vue'
import { localeDir } from '@shared-ui/utils/direction.js'

const mode = useColorMode()
const { locale } = useI18n()
const dir = computed(() => localeDir(locale.value))
</script>
