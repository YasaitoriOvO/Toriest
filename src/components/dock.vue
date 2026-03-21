<script setup lang="ts">
defineProps<{
  currentPage: string
}>()

defineEmits<{
  (e: 'navigate', page: 'home' | 'projects' | 'links'): void
}>()
</script>

<template>
  <div class="dock-root">
    <ul class="menu menu-horizontal bg-base-200 rounded-box shadow-lg flex-nowrap">
      <li>
        <a 
          :class="{ active: currentPage === 'home' }" 
          @click="$emit('navigate', 'home')"
          style="cursor: pointer;"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="hidden sm:inline">Home</span>
        </a>
      </li>
      <li>
        <a 
          :class="{ active: currentPage === 'projects' }" 
          @click="$emit('navigate', 'projects')"
          style="cursor: pointer;"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="hidden sm:inline">Projects</span>
        </a>
      </li>
      <li>
        <a 
          :class="{ active: currentPage === 'links' }" 
          @click="$emit('navigate', 'links')"
          style="cursor: pointer;"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="h-5 w-5"
            viewBox="0 -960 960 960"
          >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z" />
          </svg>
          <span class="hidden sm:inline">Links</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  .dock-root {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem);
    z-index: 30;
    max-width: calc(100vw - 2rem);
  }

  .menu a.active {
    background-color: var(--fallback-p,oklch(var(--p)/1));
    color: var(--fallback-pc,oklch(var(--pc)/1));
    font-weight: 600;
    color: var(--color-info);
  }
</style>