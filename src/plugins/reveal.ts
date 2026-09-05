import type { ObjectDirective } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  const entries = new Map<HTMLElement, { index: number, animation?: Animation, onFocus: () => void }>()
  let observer: IntersectionObserver | undefined
  let preference: MediaQueryList | undefined

  function reveal(element: HTMLElement, immediate = false) {
    const entry = entries.get(element)
    if (!entry) return
    observer?.unobserve(element)
    delete element.dataset.revealPending
    entry.animation?.cancel()
    entry.animation = undefined
    if (immediate || preference?.matches) return

    const animation = element.animate([
      { opacity: 0, translate: '0 24px' },
      { opacity: 1, translate: '0 0' },
    ], {
      duration: 680,
      delay: Math.min(entry.index, 4) * 55,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'backwards',
    })
    entry.animation = animation
    animation.onfinish = () => {
      if (entry.animation === animation) entry.animation = undefined
    }
  }

  function handlePreference() {
    if (preference?.matches) {
      for (const element of entries.keys()) reveal(element, true)
    }
  }

  const directive: ObjectDirective<HTMLElement, number | undefined> = {
    getSSRProps: () => ({}),
    mounted(element, binding) {
      // The server and no-JS version stay readable; only mounted, observed items wait.
      if (!('IntersectionObserver' in window)) return
      if (!preference) {
        preference = matchMedia('(prefers-reduced-motion: reduce)')
        preference.addEventListener('change', handlePreference)
        observer = new IntersectionObserver((changes) => {
          for (const change of changes) {
            if (change.isIntersecting) reveal(change.target as HTMLElement)
          }
        }, { rootMargin: '0px 0px -24px 0px', threshold: 0 })
      }
      const onFocus = () => reveal(element, true)
      entries.set(element, { index: Math.max(0, binding.value ?? 0), onFocus })
      element.addEventListener('focusin', onFocus)
      if (preference.matches) return
      element.dataset.revealPending = ''
      observer?.observe(element)
    },
    beforeUnmount(element) {
      observer?.unobserve(element)
      const entry = entries.get(element)
      entry?.animation?.cancel()
      if (entry) element.removeEventListener('focusin', entry.onFocus)
      delete element.dataset.revealPending
      entries.delete(element)
    },
  }

  nuxtApp.vueApp.directive('reveal', directive)
  nuxtApp.vueApp.onUnmount(() => {
    observer?.disconnect()
    preference?.removeEventListener('change', handlePreference)
    for (const [element, entry] of entries) {
      entry.animation?.cancel()
      element.removeEventListener('focusin', entry.onFocus)
      delete element.dataset.revealPending
    }
    entries.clear()
  })
})
