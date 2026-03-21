<script setup lang="ts">
import { ref } from 'vue'
import Project from './pages/project.vue'
import LinkPage from './pages/link.vue'
import IndexPage from './pages/index.vue'
import InitOverlay from './pages/init.vue'
import Dock from './components/dock.vue'

const showInit = ref(true)
const isInitExiting = ref(false)
const currentPage = ref<'home' | 'projects' | 'links'>('home')

function handleInitExitStart() {
  isInitExiting.value = true
}

function handleInitFinished() {
  showInit.value = false
}

function handleNavigate(page: 'home' | 'projects' | 'links') {
  currentPage.value = page
}
</script>

<template>
  <div class="app-shell stripe-bg">
    <div class="app-content flex flex-col min-h-dvh" :class="{ 'is-blurred': showInit && !isInitExiting }">
      <main class="grow w-full z-10">
        <Transition name="fade" mode="out-in">
          <IndexPage v-if="currentPage === 'home'" key="home" />
          <Project v-else-if="currentPage === 'projects'" key="projects" />
          <LinkPage v-else-if="currentPage === 'links'" key="links" />
        </Transition>
      </main>

      <footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 pb-24 mt-auto">
        <aside>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" class="hover:opacity-100 transition-opacity">
            备案号预留位置
          </a>
          <p>Copyright © 2026 - All right reserved by <span class="font-bold">YasaitoriOvO</span></p>
        </aside>
      </footer>

      <Dock :currentPage="currentPage" @navigate="handleNavigate" />
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
  transition: filter 420ms ease, transform 420ms ease;
}

.app-content.is-blurred {
  filter: blur(3px);
  transform: scale(1.01);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
