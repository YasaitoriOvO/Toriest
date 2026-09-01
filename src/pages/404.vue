<script setup lang="ts">
useSeoMeta({
  title: '页面不存在',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <ErrorState
    :status-code="404"
    title="NOT FOUND"
    description="链接可能已经移动，或者文章尚未发布。"
  >
    <NuxtLink to="/" class="btn btn-primary mt-7 min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2">
      返回主页
    </NuxtLink>
  </ErrorState>
</template>
