<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits<{ startExit: [], finished: [] }>()
const commandText = ref('')
const resultText = ref('')
const commandDone = ref(false)
const resultDone = ref(false)
const isExiting = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
let motionPreference: MediaQueryList | undefined
let finished = false

function finish() {
  if (finished) return
  finished = true
  clearTimeout(timer)
  emit('finished')
}

function startExit(immediate = false) {
  clearTimeout(timer)
  if (!isExiting.value) {
    isExiting.value = true
    emit('startExit')
  }
  if (immediate) finish()
  else timer = setTimeout(finish, 640)
}

function typeLine(target: typeof commandText, text: string, speed: number, done: () => void) {
  if (isExiting.value || finished) return
  target.value = text.slice(0, target.value.length + 1)
  timer = setTimeout(() => {
    if (target.value.length < text.length) typeLine(target, text, speed, done)
    else done()
  }, speed)
}

function skip() {
  startExit(motionPreference?.matches)
}

function handleKey(event: KeyboardEvent) {
  if (event.key === 'Escape') skip()
}

function handleMotionChange() {
  if (motionPreference?.matches) startExit(true)
}

onMounted(() => {
  motionPreference = matchMedia('(prefers-reduced-motion: reduce)')
  motionPreference.addEventListener('change', handleMotionChange)
  window.addEventListener('keydown', handleKey)
  if (motionPreference.matches) {
    startExit(true)
    return
  }
  timer = setTimeout(() => typeLine(commandText, 'whoami', 55, () => {
    commandDone.value = true
    timer = setTimeout(() => typeLine(resultText, 'Yasaitori', 60, () => {
      resultDone.value = true
      timer = setTimeout(() => startExit(), 260)
    }), 180)
  }), 160)
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  motionPreference?.removeEventListener('change', handleMotionChange)
  window.removeEventListener('keydown', handleKey)
})
</script>

<template>
  <div class="init-overlay" :class="{ 'is-exiting': isExiting }" :inert="isExiting">
    <div class="init-panel init-panel-left" aria-hidden="true" />
    <div class="init-panel init-panel-right" aria-hidden="true" />
    <div class="init-content flex items-center justify-center min-h-dvh">
      <div class="init-code mockup-code shadow-xl shadow-blue-300" aria-label="whoami: Yasaitori">
        <div aria-hidden="true">
          <pre data-prefix="$"><code>{{ commandText }}<span v-if="!commandDone" class="typing-cursor">|</span></code></pre>
          <pre data-prefix=">" class="text-info"><code>{{ resultText }}<span v-if="commandDone && !resultDone" class="typing-cursor">|</span></code></pre>
        </div>
      </div>
    </div>
    <button class="init-skip" type="button" @click="skip">跳过开场 <span aria-hidden="true">↗</span></button>
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
  inset-block: 0;
  width: 50%;
  background: color-mix(in oklab, var(--color-base-100) 88%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: transform 620ms var(--ease-out), opacity 480ms ease;
}
.init-panel-left { left: 0; }
.init-panel-right { right: 0; }
.init-content {
  padding: 1.25rem;
  position: relative;
  z-index: 2;
  transition: opacity 220ms ease, transform 400ms var(--ease-in);
}
.init-code {
  width: min(calc(100vw - 2.5rem), 36rem);
  animation: terminal-in 520ms var(--ease-spring) backwards;
}
.typing-cursor {
  margin-left: 2px;
  animation: blink 800ms steps(1, end) infinite;
}
.mockup-code pre code {
  display: inline-flex;
  align-items: center;
  min-height: 1.2em;
}
.mockup-code pre { overflow: hidden; }
.init-skip {
  position: absolute;
  bottom: calc(2rem + env(safe-area-inset-bottom, 0px));
  left: 50%;
  translate: -50% 0;
  z-index: 3;
  min-height: 44px;
  padding: 0.5rem 1rem;
  border: 1px solid rgb(24 24 27 / 0.15);
  border-radius: 999px;
  background: rgb(255 255 255 / 0.6);
  color: #52525b;
  cursor: pointer;
  font-size: 0.85rem;
  transition: opacity 180ms ease, transform 280ms var(--ease-spring);
}
.init-skip:hover { transform: translateY(-2px); }
.init-skip:active { transform: scale(0.96); }
.init-skip:focus-visible { outline: 3px solid #84cc16; outline-offset: 3px; }
.is-exiting { pointer-events: none; }
.is-exiting .init-content { opacity: 0; transform: translateY(-12px) scale(0.96); }
.is-exiting .init-skip { opacity: 0; }
.is-exiting .init-panel-left { transform: translateX(-102%); opacity: 0; }
.is-exiting .init-panel-right { transform: translateX(102%); opacity: 0; }
@keyframes terminal-in {
  from { opacity: 0; transform: translateY(18px) scale(0.96) rotate(-1deg); }
  to { opacity: 1; transform: none; }
}
@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .init-overlay { display: none; }
}
</style>
