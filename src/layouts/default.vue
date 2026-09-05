<script setup lang="ts">
import { ref } from 'vue'
import Alert from '~/components/alert.vue'
import Dock from '~/components/dock.vue'
import InitOverlay from '~/components/init.vue'

const route = useRoute()
const showInit = ref(route.path === '/')
const isInitExiting = ref(false)
const showDock = ref(!showInit.value)
const animateDockEntrance = showInit.value
const { onPress } = usePressRipple()

function handleInitExitStart() {
  isInitExiting.value = true
  showDock.value = true
}

function handleInitFinished() {
  showInit.value = false
  showDock.value = true
}
</script>

<template>
  <div class="app-shell stripe-bg" @click.capture="onPress">
    <a class="skip-link" href="#main-content">跳到正文</a>
    <div
      class="app-content flex min-h-dvh flex-col"
      :class="{ 'is-blurred': showInit && !isInitExiting }"
      :style="{ '--reveal-play-state': showInit && !isInitExiting ? 'paused' : 'running' }"
      :inert="showInit && !isInitExiting"
    >
      <Alert v-if="!showInit" />

      <main id="main-content" class="z-10 w-full grow">
        <slot />
      </main>

      <footer class="footer footer-center bg-base-300 p-4 pb-24 text-base-content sm:footer-horizontal">
        <aside>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            class="transition-opacity hover:opacity-100"
          >
            沪ICP备2025151889号-13
          </a>
          <p>Copyright © 2026 - All right reserved by <span class="font-bold">YasaitoriOvO</span></p>
        </aside>
      </footer>

      <Dock
        :visible="showDock"
        :animate-entrance="animateDockEntrance"
      />
    </div>

    <InitOverlay
      v-if="showInit"
      @start-exit="handleInitExitStart"
      @finished="handleInitFinished"
    />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.app-content {
  transition: opacity 420ms var(--ease-out);
}

.app-content.is-blurred {
  opacity: 0.4;
}

@media (prefers-reduced-motion: reduce) {
  .app-content {
    transition-duration: 1ms;
  }
}
</style>
