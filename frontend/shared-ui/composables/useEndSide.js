import { computed } from 'vue'
import { useDirection } from 'reka-ui'

/**
 * Popper `side` values are physical. For content that should open towards the
 * inline end (e.g. tooltips beside the nav rail) use this instead of 'right'.
 */
export function useEndSide () {
  const dir = useDirection()
  return computed(() => (dir.value === 'rtl' ? 'left' : 'right'))
}
