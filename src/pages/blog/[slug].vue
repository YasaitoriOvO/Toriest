<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const config = useRuntimeConfig()

const { data: post } = await useAsyncData(`blog:${route.path}`, () => (
  queryCollection('blog').path(route.path).first()
))

if (!post.value || post.value.draft) {
  throw createError({
    statusCode: 404,
    message: '文章不存在',
    fatal: true,
  })
}

const article = computed(() => post.value!)
const canonicalUrl = `${config.public.siteUrl}${route.path}`
const coverUrl = computed(() => {
  const source = post.value?.cover?.src ?? '/images/me/me.jpeg'
  return new URL(source, config.public.siteUrl).toString()
})
const tocLinks = computed(() => post.value?.body.toc?.links ?? [])

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))
}

useSeoMeta({
  title: () => post.value?.title,
  description: () => post.value?.description,
  ogTitle: () => post.value?.title,
  ogDescription: () => post.value?.description,
  ogType: 'article',
  ogUrl: canonicalUrl,
  ogImage: () => coverUrl.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => post.value?.title,
  twitterDescription: () => post.value?.description,
  twitterImage: () => coverUrl.value,
  articlePublishedTime: () => post.value ? new Date(post.value.publishedAt).toISOString() : undefined,
  articleModifiedTime: () => post.value?.updatedAt ? new Date(post.value.updatedAt).toISOString() : undefined,
  articleTag: () => post.value?.tags,
})

useHead(() => {
  const currentPost = post.value

  return {
    htmlAttrs: {
      lang: currentPost?.lang ?? 'zh-CN',
    },
    link: [
      { rel: 'canonical', href: canonicalUrl },
    ],
    script: currentPost
      ? [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: currentPost.title,
              description: currentPost.description,
              image: coverUrl.value,
              datePublished: new Date(currentPost.publishedAt).toISOString(),
              dateModified: new Date(currentPost.updatedAt ?? currentPost.publishedAt).toISOString(),
              author: {
                '@type': 'Person',
                name: 'Yasaitori',
                url: config.public.siteUrl,
              },
              mainEntityOfPage: canonicalUrl,
            }).replace(/</g, '\\u003c'),
          },
        ]
      : [],
  }
})
</script>

<template>
  <article :lang="article.lang" class="min-h-screen px-4 pb-32 pt-8 sm:px-6 sm:pt-12">
    <div class="mx-auto max-w-6xl">
      <NuxtLink to="/blog" class="back-link">
        <span aria-hidden="true">←</span>
        返回博客
      </NuxtLink>

      <header class="article-header mx-auto mt-6 max-w-3xl text-center">
        <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-zinc-500">
          <time :datetime="new Date(article.publishedAt).toISOString()">
            {{ formatDate(article.publishedAt) }}
          </time>
          <span v-if="article.updatedAt">· 更新于 {{ formatDate(article.updatedAt) }}</span>
        </div>

        <h1 class="mt-4 text-balance text-4xl font-bold leading-tight text-zinc-950 sm:text-5xl">
          {{ article.title }}
        </h1>
        <p class="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
          {{ article.description }}
        </p>
        <ul v-if="article.tags.length" class="mt-5 flex flex-wrap justify-center gap-2" aria-label="文章标签">
          <li v-for="tag in article.tags" :key="tag">
            <NuxtLink :to="{ path: '/blog', query: { tag } }" class="badge badge-outline min-h-8 border-lime-300 px-3 text-green-800">
              {{ tag }}
            </NuxtLink>
          </li>
        </ul>

        <img
          v-if="article.cover"
          :src="article.cover.src"
          :alt="article.cover.alt"
          width="1200"
          height="630"
          class="mt-8 aspect-[1.9/1] w-full rounded-2xl object-cover shadow-xl"
        >
      </header>

      <BlogTocDropdown
        v-if="tocLinks.length"
        :links="tocLinks"
        class="toc-mobile mx-auto mt-9 max-w-3xl rounded-xl border border-lime-200 bg-white/70 p-4 lg:hidden"
      />

      <div class="article-grid mt-10">
        <div aria-hidden="true" class="hidden lg:block" />

        <div class="article-panel min-w-0 rounded-2xl border border-white/75 bg-white/75 px-5 py-8 shadow-sm backdrop-blur-xl sm:px-10 sm:py-11">
          <ContentRenderer :value="article" class="blog-prose" />
        </div>

        <aside v-if="tocLinks.length" class="hidden lg:block" aria-label="文章目录">
          <nav class="toc-desktop sticky top-6 rounded-xl border border-lime-200/80 bg-white/72 p-4 shadow-sm backdrop-blur-xl">
            <p class="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-green-800">目录</p>
            <BlogToc :links="tocLinks" />
          </nav>
        </aside>
      </div>
    </div>
  </article>
</template>

<style scoped>
.back-link {
  align-items: center;
  border-radius: 999px;
  color: #166534;
  display: inline-flex;
  font-weight: 700;
  gap: 0.45rem;
  min-height: 2.75rem;
  padding: 0.5rem 0.75rem;
  transition: background-color 180ms ease, transform 180ms ease;
}

.back-link:hover {
  background: rgb(236 252 203 / 0.72);
  transform: translateX(-0.12rem);
}

.back-link:focus-visible {
  outline: 3px solid rgb(132 204 22 / 0.55);
  outline-offset: 2px;
}

.article-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: minmax(0, 1fr);
}

.article-panel {
  width: 100%;
}

@media (min-width: 1024px) {
  .article-grid {
    grid-template-columns: minmax(0, 11rem) minmax(0, 46rem) minmax(0, 14rem);
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-link {
    transition-duration: 1ms;
  }
}
</style>
