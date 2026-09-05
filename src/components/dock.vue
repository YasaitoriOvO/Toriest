<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  visible?: boolean
  animateEntrance?: boolean
}>(), {
  visible: true,
  animateEntrance: false,
})

const navigation = [
  {
    label: 'Home',
    to: '/',
    match: (path: string) => path === '/',
    icon: 'M3 12l2-2m0 0 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11 2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    label: 'Projects',
    to: '/projects',
    match: (path: string) => path.startsWith('/projects'),
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    label: 'Links',
    to: '/links',
    match: (path: string) => path.startsWith('/links'),
    icon: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71m2.25 5.82a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  },
  {
    label: 'Q&As',
    to: '/qna',
    match: (path: string) => path.startsWith('/qna'),
    icon: 'M8.23 9a3.75 3.75 0 117.08 1.75c-.78 1.16-2.06 1.55-2.67 2.45-.31.46-.39.8-.39 1.55M12 18h.01M4 4h16v16H4z',
  },
  {
    label: 'Blog',
    to: '/blog',
    match: (path: string) => path.startsWith('/blog'),
    icon: 'M5 4h10a2 2 0 012 2v14H7a2 2 0 01-2-2V4zm12 3h2v13h-2M8 8h6M8 12h6M8 16h4',
  },
] as const

const route = useRoute()
const activeIndex = computed(() => Math.max(0, navigation.findIndex(item => item.match(route.path))))
const indicator = ref<HTMLElement | null>(null)
let squashAnimation: Animation | undefined
let motionPreference: MediaQueryList | undefined

function stopSquash() {
  squashAnimation?.cancel()
  squashAnimation = undefined
}

watch(activeIndex, (next, previous) => {
  const element = indicator.value
  if (!element || motionPreference?.matches) return

  // Resume from the current shape when another destination is picked mid-flight.
  const currentScale = getComputedStyle(element).scale
  stopSquash()
  const stretch = 1.28 + Math.min(Math.abs(next - previous), 4) * 0.04
  const animation = element.animate([
    { scale: currentScale === 'none' ? '1 1' : currentScale, offset: 0, easing: 'ease-in-out' },
    { scale: `${stretch} 0.78`, offset: 0.22, easing: 'ease-in-out' },
    { scale: '0.9 1.12', offset: 0.64, easing: 'ease-in-out' },
    { scale: '1.045 0.975', offset: 0.82, easing: 'ease-in-out' },
    { scale: '1 1', offset: 1 },
  ], {
    duration: 620,
  })
  squashAnimation = animation
  animation.onfinish = () => {
    if (squashAnimation === animation) squashAnimation = undefined
  }
}, { flush: 'post' })

onMounted(() => {
  motionPreference = matchMedia('(prefers-reduced-motion: reduce)')
  motionPreference.addEventListener('change', stopSquash)
})

onBeforeUnmount(() => {
  stopSquash()
  motionPreference?.removeEventListener('change', stopSquash)
})
</script>

<template>
  <nav
    class="dock-root"
    :class="{
      'is-concealed': !props.visible,
      'is-entering': props.visible && props.animateEntrance,
    }"
    :aria-hidden="!props.visible"
    :inert="!props.visible"
    aria-label="主要导航"
  >
    <div class="dock-menu" :style="{ '--active-index': activeIndex }">
      <span ref="indicator" class="dock-indicator" aria-hidden="true" />
      <ul class="dock-items">
        <li v-for="item in navigation" :key="item.to">
          <NuxtLink
            :to="item.to"
            :class="{ active: item.match(route.path) }"
            :aria-current="item.match(route.path) ? 'page' : undefined"
          >
            <svg
              aria-hidden="true"
              class="h-[18px] w-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.75"
                :d="item.icon"
              />
            </svg>
            <span class="hidden sm:inline">{{ item.label }}</span>
            <span class="sr-only sm:hidden">{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.dock-root {
  position: fixed;
  left: 50%;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem);
  z-index: 30;
  max-width: calc(100vw - 2rem);
  transform: translateX(-50%);
}
.dock-root.is-concealed {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}
.dock-root.is-entering { animation: dock-spring-in 720ms both; }
.dock-menu {
  --dock-inset: 4px;
  --dock-ink: #52685d;
  --dock-green: #176b46;
  position: relative;
  width: min(28rem, calc(100vw - 2rem));
  padding: var(--dock-inset);
  list-style: none;
  isolation: isolate;
  border: 1px solid rgb(255 255 255 / 0.9);
  border-radius: 999px;
  background: linear-gradient(145deg, rgb(255 255 255 / 0.9), rgb(239 250 242 / 0.88));
  backdrop-filter: blur(20px) saturate(125%);
  -webkit-backdrop-filter: blur(20px) saturate(125%);
  box-shadow:
    0 8px 28px rgb(48 88 62 / 0.08),
    0 2px 5px rgb(48 88 62 / 0.03),
    inset 0 1px 0 rgb(255 255 255 / 0.9);
  transition: box-shadow var(--motion-normal) var(--ease-out);
}
.dock-items {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
}
.dock-indicator {
  position: absolute;
  inset-block: var(--dock-inset);
  left: var(--dock-inset);
  width: calc((100% - var(--dock-inset) * 2) / 5);
  z-index: -1;
  pointer-events: none;
  border: 1px solid rgb(144 208 160 / 0.3);
  border-radius: 999px;
  background: linear-gradient(145deg, #ecfaef, #ddf3e5);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.8), 0 2px 5px rgb(48 88 62 / 0.04);
  /* Position stays independent of the animated scale, including on interruption. */
  translate: calc(var(--active-index) * 100%) 0;
  transition: translate 460ms cubic-bezier(0.22, 1.08, 0.36, 1);
}
.dock-menu li { min-width: 0; }
.dock-menu a {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  min-width: 2.75rem;
  min-height: 2.75rem;
  border-radius: 999px;
  color: var(--dock-ink);
  font-size: 0.85rem;
  white-space: nowrap;
  transition: color var(--motion-fast) ease, transform var(--motion-normal) var(--ease-spring);
}
.dock-menu a:active {
  transform: scale(0.95);
  transition-duration: 100ms;
}
.dock-menu a:focus-visible {
  outline: 2px solid var(--dock-green);
  outline-offset: -3px;
}
.dock-menu a svg {
  flex: 0 0 auto;
  transform-origin: center bottom;
  transition: transform 420ms var(--ease-spring);
}
.dock-menu a.active {
  color: var(--dock-green);
  font-weight: 600;
}
.dock-menu a:hover { color: var(--dock-green); }
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .dock-root:hover .dock-menu {
    box-shadow: 0 12px 32px rgb(48 88 62 / 0.12), 0 2px 6px rgb(48 88 62 / 0.04), inset 0 1px 0 white;
  }
  .dock-menu a:hover svg,
  .dock-menu a:focus-visible svg { transform: translateY(-3px) scale(1.14) rotate(-3deg); }
  .dock-menu li:has(+ li:hover) svg,
  .dock-menu li:hover + li svg { transform: translateY(-1px) scale(1.04); }
}
@media (max-width: 639px) {
  .dock-menu { width: 15rem; }
}
@media (prefers-reduced-motion: reduce) {
  .dock-indicator { transition: none; }
}
@keyframes dock-spring-in {
  0% { opacity: 0; transform: translateX(-50%) translateY(80px) scale(0.92); }
  60% { opacity: 1; transform: translateX(-50%) translateY(-7px) scale(1.01); }
  80% { transform: translateX(-50%) translateY(2px) scale(1); }
  100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}
</style>
