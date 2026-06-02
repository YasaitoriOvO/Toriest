<template>
  <Transition name="alert-toast">
    <div v-if="isVisible" class="toast toast-top toast-end z-100">
      <div
        role="alert"
        class="alert alert-panel shadow-lg flex gap-4 pr-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current h-6 w-6 shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 class="font-bold text-sm">Cookie Policy</h3>
          <div class="text-xs opacity-90">We will not use cookies for no reason.</div>
        </div>
        <button class="btn btn-sm btn-ghost absolute top-2 right-2" @click="handleClose">✕</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  const isVisible = ref(true)

  function handleClose() {
    isVisible.value = false
  }
</script>

<style scoped>
  .alert-toast-enter-active,
  .alert-toast-leave-active {
    will-change: opacity, transform, filter;
  }

  .alert-toast-enter-active {
    transition:
      opacity 360ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 520ms cubic-bezier(0.22, 1, 0.36, 1),
      filter 420ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .alert-toast-leave-active {
    transition-duration: 1ms;
  }

  .alert-toast-enter-from,
  .alert-toast-leave-to {
    opacity: 0;
    filter: blur(3px);
    transform: translate3d(0.75rem, -0.35rem, 0) rotate(1.6deg) scale(0.96);
  }

  .alert-toast-enter-to,
  .alert-toast-leave-from {
    opacity: 1;
    filter: blur(0);
    transform: translate3d(0, 0, 0) rotate(0) scale(1);
  }

  .alert-panel {
    transform: translateY(0) rotate(0) scale(1);
    transition:
      box-shadow 420ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 420ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 420ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 560ms cubic-bezier(0.34, 1.4, 0.64, 1);
    will-change: transform;
  }

  .alert-panel:hover {
    filter: drop-shadow(0 14px 22px rgba(0, 0, 0, 0.1));
    transform: translateY(-0.12rem) rotate(-0.55deg) scale(1.018);
  }

  .alert-panel:active {
    transform: translateY(0.03rem) rotate(0.45deg) scale(0.99);
    transition-duration: 180ms;
  }

  @media (prefers-reduced-motion: reduce) {
    .alert-toast-enter-active,
    .alert-toast-leave-active,
    .alert-panel {
      transition-duration: 1ms;
    }
  }
</style>
