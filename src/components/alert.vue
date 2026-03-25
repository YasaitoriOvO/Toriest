<template>
  <div v-if="isVisible" class="toast toast-top toast-end z-100">
    <div role="alert" class="alert shadow-lg flex gap-4 pr-8">
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
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  const isVisible = ref(true)
  function handleClose() {
    isVisible.value = false
  }
</script>