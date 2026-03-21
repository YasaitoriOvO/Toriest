<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits<{
  startExit: []
  finished: []
}>()

const commandFull = 'whoami'
const resultFull = 'Yasaitori'

const commandText = ref('')
const resultText = ref('')
const isExiting = ref(false)
const commandDone = ref(false)
const resultDone = ref(false)

const timers: number[] = []

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    const id = window.setTimeout(() => resolve(), ms)
    timers.push(id)
  })
}

async function typewriter(target: typeof commandText, fullText: string, speed: number) {
  for (let i = 1; i <= fullText.length; i += 1) {
    target.value = fullText.slice(0, i)
    await wait(speed)
  }
}

const showCommandCursor = computed(() => !commandDone.value)
const showResultCursor = computed(() => commandDone.value && !resultDone.value)

onMounted(async () => {
  await wait(260)
  await typewriter(commandText, commandFull, 95)
  commandDone.value = true

  await wait(320)
  await typewriter(resultText, resultFull, 110)
  resultDone.value = true

  await wait(560)
  isExiting.value = true
  emit('startExit')

  await wait(980)
  emit('finished')
})

onBeforeUnmount(() => {
  timers.forEach((id) => window.clearTimeout(id))
})
</script>

<template>
  <div class="init-overlay" :class="{ 'is-exiting': isExiting }" aria-live="polite">
    <div class="init-panel init-panel-left" />
    <div class="init-panel init-panel-right" />

    <div class="init-content flex justify-center-safe items-center min-h-screen">
      <div class="mockup-code w-xl shadow-xl shadow-blue-300">
        <pre data-prefix="$"><code>{{ commandText }}<span v-if="showCommandCursor" class="typing-cursor">|</span></code></pre>
        <pre data-prefix=">" class="text-info"><code>{{ resultText }}<span v-if="showResultCursor" class="typing-cursor">|</span></code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.init-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow: hidden;
}

.init-panel {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  background: color-mix(in oklab, var(--color-base-100) 82%, transparent);
  backdrop-filter: blur(16px) saturate(120%);
  -webkit-backdrop-filter: blur(16px) saturate(120%);
  transition: transform 900ms cubic-bezier(0.2, 0.9, 0.25, 1), opacity 900ms ease;
}

.init-panel-left {
  left: 0;
}

.init-panel-right {
  right: 0;
}

.init-content {
  position: relative;
  z-index: 2;
  opacity: 1;
  transform: scale(1);
  transition: opacity 420ms ease, transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
}

.typing-cursor {
  margin-left: 2px;
  animation: blink 900ms steps(1, end) infinite;
}

.mockup-code :deep(pre code) {
  display: inline-flex;
  align-items: center;
  min-height: 1.2em;
}

.init-overlay.is-exiting .init-content {
  opacity: 0;
  transform: scale(0.92);
}

.init-overlay.is-exiting .init-panel-left {
  transform: translateX(-104%);
  opacity: 0;
}

.init-overlay.is-exiting .init-panel-right {
  transform: translateX(104%);
  opacity: 0;
}

@keyframes blink {
  0%,
  45% {
    opacity: 1;
  }

  46%,
  100% {
    opacity: 0;
  }
}
</style>