import { onBeforeUnmount, onMounted } from 'vue'

/** A small, pointer-only tilt. No animation loop runs while the pointer is idle. */
export function usePointerTilt(strength = 3) {
  let media: MediaQueryList | undefined
  let target: HTMLElement | undefined
  let bounds: DOMRect | undefined
  let frame = 0

  function resetTilt() {
    cancelAnimationFrame(frame)
    target?.style.removeProperty('--tilt-x')
    target?.style.removeProperty('--tilt-y')
    target?.classList.remove('is-tracking')
    target = undefined
    bounds = undefined
  }

  function onPointerMove(event: PointerEvent) {
    if (!media?.matches || event.pointerType !== 'mouse') return

    const element = event.currentTarget as HTMLElement
    if (element !== target) {
      resetTilt()
      target = element
      bounds = element.getBoundingClientRect()
      element.classList.add('is-tracking')
    }
    if (!bounds) return

    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1))
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1))
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      element.style.setProperty('--tilt-x', `${-y * strength}deg`)
      element.style.setProperty('--tilt-y', `${x * strength}deg`)
      element.style.setProperty('--spot-x', `${(x + 1) / 2 * element.clientWidth}px`)
      element.style.setProperty('--spot-y', `${(y + 1) / 2 * element.clientHeight}px`)
    })
  }

  onMounted(() => {
    media = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    media.addEventListener('change', resetTilt)
    window.addEventListener('blur', resetTilt)
    window.addEventListener('resize', resetTilt)
    window.addEventListener('scroll', resetTilt, { passive: true, capture: true })
  })

  onBeforeUnmount(() => {
    resetTilt()
    media?.removeEventListener('change', resetTilt)
    window.removeEventListener('blur', resetTilt)
    window.removeEventListener('resize', resetTilt)
    window.removeEventListener('scroll', resetTilt, { capture: true })
  })

  return { onPointerMove, resetTilt }
}
