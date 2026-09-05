<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from 'vue'
import type { TocLink } from './BlogToc.vue'

defineProps<{ links: TocLink[] }>()

const details = ref<HTMLDetailsElement>()
const panel = ref<HTMLDivElement>()
const expanded = ref(false)
const enhanced = ref(false)
const panelId = useId()
let animation: Animation | undefined
let reducedMotion: MediaQueryList | undefined

function settle() {
  animation?.cancel()
  animation = undefined
  if (details.value) details.value.open = expanded.value
}

function toggle(event: MouseEvent) {
  const root = details.value
  const body = panel.value
  if (!root || !body) return

  event.preventDefault()
  // Read the current frame before cancelling so rapid clicks reverse smoothly.
  const height = root.open ? body.getBoundingClientRect().height : 0
  const opacity = root.open ? getComputedStyle(body).opacity : '0'
  expanded.value = !expanded.value
  animation?.cancel()
  animation = undefined

  if (reducedMotion?.matches || !body.animate) {
    settle()
    return
  }

  // Keep native details open until the closing animation has finished.
  root.open = true
  animation = body.animate([
    { height: `${height}px`, opacity },
    { height: `${expanded.value ? body.scrollHeight : 0}px`, opacity: expanded.value ? 1 : 0 },
  ], {
    duration: expanded.value ? 380 : 260,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    fill: 'both',
  })
  animation.onfinish = settle
}

function syncNativeState() {
  if (!animation && details.value) expanded.value = details.value.open
}

function onMotionChange() {
  if (reducedMotion?.matches) settle()
}

onMounted(() => {
  syncNativeState()
  enhanced.value = true
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.addEventListener('change', onMotionChange)
  window.addEventListener('resize', settle)
})

onBeforeUnmount(() => {
  animation?.cancel()
  reducedMotion?.removeEventListener('change', onMotionChange)
  window.removeEventListener('resize', settle)
})
</script>

<template>
  <details ref="details" class="toc-dropdown" :data-expanded="enhanced ? expanded : undefined" @toggle="syncNativeState">
    <summary :aria-controls="panelId" :aria-expanded="enhanced ? expanded : undefined" @click="toggle">
      <span>文章目录</span>
      <span class="toc-chevron" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="m7 10 5 5 5-5" />
        </svg>
      </span>
    </summary>
    <div :id="panelId" ref="panel" class="toc-panel" :inert="enhanced && !expanded">
      <div class="toc-content">
        <BlogToc :links="links" />
      </div>
    </div>
  </details>
</template>

<style scoped>
.toc-dropdown {
  transition: border-color var(--motion-normal) ease, background-color var(--motion-normal) ease;
}

summary {
  align-items: center;
  border-radius: 0.5rem;
  color: #166534;
  cursor: pointer;
  display: flex;
  font-weight: 700;
  justify-content: space-between;
  list-style: none;
  min-height: 2.75rem;
}

summary::-webkit-details-marker {
  display: none;
}

summary:focus-visible {
  outline: 3px solid rgb(132 204 22 / 0.5);
  outline-offset: 4px;
}

.toc-chevron {
  align-items: center;
  background: rgb(236 252 203 / 0.65);
  border-radius: 50%;
  display: flex;
  height: 1.75rem;
  justify-content: center;
  transition: transform 440ms var(--ease-spring), background-color var(--motion-normal) ease;
  width: 1.75rem;
}

.toc-chevron svg {
  height: 1.1rem;
  width: 1.1rem;
}

.toc-dropdown[data-expanded='true'],
.toc-dropdown[open]:not([data-expanded]) {
  background-color: rgb(255 255 255 / 0.85);
  border-color: rgb(163 230 53 / 0.55);
}

.toc-dropdown[data-expanded='true'] .toc-chevron,
.toc-dropdown[open]:not([data-expanded]) .toc-chevron {
  background: rgb(209 250 229 / 0.85);
  transform: rotate(180deg);
}

.toc-panel {
  overflow: clip;
}

.toc-content {
  padding: 0.75rem 0.25rem 0.25rem;
}

@media (prefers-reduced-motion: reduce) {
  .toc-dropdown,
  .toc-chevron {
    transition: none;
  }
}
</style>
