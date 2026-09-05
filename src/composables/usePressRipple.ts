import { onBeforeUnmount, onMounted } from 'vue'

export function usePressRipple() {
  let preference: MediaQueryList | undefined
  const ripples = new Map<HTMLElement, Animation>()

  function clearRipples() {
    for (const animation of ripples.values()) animation.cancel()
    ripples.clear()
  }

  function onPress(event: MouseEvent) {
    if (preference?.matches || !(event.target instanceof Element)) return
    const target = event.target.closest<HTMLElement>('a.btn, button.btn, .tag-filter, .copy-button, .copy-code-button')
    if (!target || target.matches(':disabled, [aria-disabled="true"]')) return

    ripples.get(target)?.cancel()
    const rect = target.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const size = Math.hypot(target.clientWidth, target.clientHeight) * 2
    const x = event.detail ? (event.clientX - rect.left) / rect.width * target.clientWidth : target.clientWidth / 2
    const y = event.detail ? (event.clientY - rect.top) / rect.height * target.clientHeight : target.clientHeight / 2
    const ripple = document.createElement('span')
    ripple.className = 'press-ripple'
    ripple.setAttribute('aria-hidden', 'true')
    Object.assign(ripple.style, {
      width: `${size}px`, height: `${size}px`,
      left: `${x - size / 2}px`, top: `${y - size / 2}px`,
    })
    target.classList.add('press-feedback')
    if (getComputedStyle(target).position === 'static') target.classList.add('press-feedback-positioned')
    target.append(ripple)
    const animation = ripple.animate([
      { transform: 'scale(0)', opacity: 0.24 },
      { transform: 'scale(1)', opacity: 0 },
    ], { duration: 540, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' })
    ripples.set(target, animation)
    const cleanup = () => {
      ripple.remove()
      if (ripples.get(target) === animation) ripples.delete(target)
    }
    animation.onfinish = cleanup
    animation.oncancel = cleanup
  }

  onMounted(() => {
    preference = matchMedia('(prefers-reduced-motion: reduce)')
    preference.addEventListener('change', clearRipples)
  })

  onBeforeUnmount(() => {
    clearRipples()
    preference?.removeEventListener('change', clearRipples)
  })

  return { onPress }
}
