<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error.statusCode ?? 500)
const isNotFound = computed(() => statusCode.value === 404)
const description = computed(() => isNotFound.value
  ? '链接可能已经移动，或者文章尚未发布。'
  : props.error.statusMessage ?? '请稍后重试。')

useSeoMeta({
  title: () => isNotFound.value ? '页面不存在' : '页面出错了',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <NuxtLayout>
    <ErrorState
      :status-code="statusCode"
      :title="isNotFound ? '这里没有找到你要的页面' : '页面暂时出了点问题'"
      :description="description"
    >
      <button
        type="button"
        class="btn btn-primary mt-7 min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2"
        @click="clearError({ redirect: '/' })"
      >
        返回主页
      </button>
    </ErrorState>
  </NuxtLayout>
</template>
