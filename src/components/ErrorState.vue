<script setup lang="ts">
defineProps<{
  statusCode: number
  title: string
  description: string
}>()
</script>

<template>
  <section
    class="flex min-h-[72vh] items-center justify-center px-4 py-16 pb-32 text-center"
    aria-labelledby="error-page-title"
  >
    <div class="card w-full max-w-lg border border-base-300 bg-base-100 p-8 shadow-xl sm:p-10">
      <p class="text-sm font-bold uppercase tracking-[0.24em] text-green-700">
        Error {{ statusCode }}
      </p>
      <h1 id="error-page-title" class="mt-3 text-4xl font-bold text-zinc-900">
        {{ title }}
      </h1>
      <p class="mt-4 leading-7 text-zinc-600">
        {{ description }}
      </p>
      <slot />
    </div>
  </section>
</template>
