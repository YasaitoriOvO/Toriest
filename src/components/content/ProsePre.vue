<script setup lang="ts">
const props = withDefaults(defineProps<{
  code?: string
  language?: string | null
  filename?: string | null
  highlights?: number[]
  meta?: string | null
  class?: string | null
}>(), {
  code: '',
  language: null,
  filename: null,
  highlights: () => [],
  meta: null,
  class: null,
})

const isHighlighted = computed(() => props.class?.split(/\s+/).includes('shiki') ?? false)
const lines = computed(() => {
  const source = props.code.endsWith('\n') ? props.code.slice(0, -1) : props.code
  return source.split('\n')
})
</script>

<template>
  <pre v-if="isHighlighted" :class="props.class"><slot /></pre>
  <pre v-else :class="props.class"><code><span
      v-for="(line, index) in lines"
      :key="index"
      class="line"
      :line="String(index + 1)"
    >{{ line }}</span></code></pre>
</template>
