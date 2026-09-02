<script setup lang="ts">
const props = withDefaults(defineProps<{
  visible?: boolean
  animateEntrance?: boolean
}>(), {
  visible: true,
  animateEntrance: false,
})

const route = useRoute()

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
</script>

<template>
  <nav
    class="dock-root"
    :class="{
      'is-concealed': !props.visible,
      'is-entering': props.visible && props.animateEntrance,
    }"
    :aria-hidden="!props.visible"
    aria-label="主要导航"
  >
    <ul class="dock-menu menu menu-horizontal flex-nowrap rounded-box bg-base-200 shadow-lg">
      <li v-for="item in navigation" :key="item.to">
        <NuxtLink
          :to="item.to"
          :class="{ active: item.match(route.path) }"
          :aria-current="item.match(route.path) ? 'page' : undefined"
        >
          <svg
            aria-hidden="true"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="item.icon"
            />
          </svg>
          <span class="hidden sm:inline">{{ item.label }}</span>
          <span class="sr-only sm:hidden">{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
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
  transition: filter 520ms cubic-bezier(0.16, 1, 0.3, 1);
}

.dock-root.is-concealed {
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%) translateY(calc(100% + env(safe-area-inset-bottom, 0px) + 2rem));
  visibility: hidden;
}

.dock-root.is-entering {
  animation: dock-spring-in 900ms both;
}

.dock-root:hover {
  filter: drop-shadow(0 16px 24px rgb(0 0 0 / 0.12));
}

.dock-menu {
  gap: 0.1rem;
  overflow: hidden;
  padding-block: 0.125rem;
  transition:
    box-shadow 520ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
}

.dock-menu li {
  position: relative;
}

.dock-menu a {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 2.75rem;
  min-height: 2.75rem;
  text-align: center;
  white-space: nowrap;
  transform: translateY(0) scale(1);
  transition:
    background-color 240ms cubic-bezier(0.16, 1, 0.3, 1),
    color 240ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 360ms cubic-bezier(0.68, -0.28, 0.22, 1.28);
  will-change: transform;
}

.dock-menu a:not(.active):hover {
  transform: translateY(-0.18rem) scale(1.06);
}

.dock-menu a:not(.active):active {
  transform: translateY(0.06rem) scale(0.96);
  transition-duration: 160ms;
}

.dock-menu a:focus-visible {
  outline: 3px solid color-mix(in oklab, var(--color-info) 60%, white);
  outline-offset: -3px;
}

.dock-menu a svg,
.dock-menu a span {
  transition:
    transform 360ms cubic-bezier(0.68, -0.28, 0.22, 1.28),
    opacity 240ms cubic-bezier(0.16, 1, 0.3, 1);
}

.dock-menu a svg {
  flex: 0 0 auto;
}

.dock-menu a:not(.active):hover svg {
  transform: translateY(-0.05rem) rotate(-5deg) scale(1.08);
}

.dock-menu a.active {
  color: var(--color-info);
  font-weight: 600;
}

@keyframes dock-spring-in {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(calc(100% + env(safe-area-inset-bottom, 0px) + 2rem));
  }

  48% {
    opacity: 1;
    transform: translateX(-50%) translateY(-0.65rem);
  }

  66% {
    transform: translateX(-50%) translateY(0.28rem);
  }

  80% {
    transform: translateX(-50%) translateY(-0.14rem);
  }

  91% {
    transform: translateX(-50%) translateY(0.06rem);
  }

  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dock-root.is-entering {
    animation: none;
  }

  .dock-root,
  .dock-menu,
  .dock-menu a,
  .dock-menu a svg,
  .dock-menu a span {
    transition-duration: 1ms;
  }
}
</style>
