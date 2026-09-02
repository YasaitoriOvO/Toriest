<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const config = useRuntimeConfig()

const { data: posts } = await useAsyncData('blog-posts', () => (
  queryCollection('blog')
    .where('draft', '=', false)
    .order('publishedAt', 'DESC')
    .all()
))

const selectedTag = computed(() => (
  typeof route.query.tag === 'string' ? route.query.tag : ''
))

const tags = computed(() => (
  [...new Set((posts.value ?? []).flatMap(post => post.tags))]
    .sort((left, right) => left.localeCompare(right, 'zh-CN'))
))

const filteredPosts = computed(() => {
  if (!selectedTag.value) {
    return posts.value ?? []
  }

  return (posts.value ?? []).filter(post => post.tags.includes(selectedTag.value))
})

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))
}

const canonicalUrl = `${config.public.siteUrl}/blog`

useSeoMeta({
  title: 'Blog',
  description: 'Yasaitori 的开发笔记、技术探索与日常记录。',
  ogTitle: 'Blog · Toriest',
  ogDescription: 'Yasaitori 的开发笔记、技术探索与日常记录。',
  ogType: 'website',
  ogUrl: canonicalUrl,
  twitterCard: 'summary',
})

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl },
  ],
})
</script>

<template>
  <div class="blog-index min-h-screen px-4 pb-32 pt-12 sm:px-6">
    <header class="mx-auto max-w-3xl text-center">
      <h1 class="text-3xl font-bold text-zinc-900 sm:text-5xl">
        - Blog -
      </h1>
    </header>

    <nav v-if="tags.length" class="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2" aria-label="按标签筛选文章">
      <NuxtLink
        to="/blog"
        class="tag-filter"
        :class="{ 'is-active': !selectedTag }"
        :aria-current="!selectedTag ? 'page' : undefined"
      >
        全部
      </NuxtLink>
      <NuxtLink
        v-for="tag in tags"
        :key="tag"
        :to="{ path: '/blog', query: { tag } }"
        class="tag-filter"
        :class="{ 'is-active': selectedTag === tag }"
        :aria-current="selectedTag === tag ? 'page' : undefined"
      >
        {{ tag }}
      </NuxtLink>
    </nav>

    <section class="mx-auto mt-10 grid w-full max-w-4xl gap-5" aria-live="polite">
      <article
        v-for="(post, index) in filteredPosts"
        :key="post.path"
        class="post-card card fly-in overflow-hidden border border-white/70 bg-base-100 shadow-sm"
        :style="{ animationDelay: `${Math.min(index, 6) * 70}ms` }"
      >
        <NuxtLink :to="post.path" class="post-link group">
          <img
            v-if="post.cover"
            :src="post.cover.src"
            :alt="post.cover.alt"
            width="960"
            height="480"
            loading="lazy"
            class="post-cover"
          >

          <div class="card-body gap-3 p-6 sm:p-7">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-zinc-500">
              <time :datetime="new Date(post.publishedAt).toISOString()">
                {{ formatDate(post.publishedAt) }}
              </time>
              <span v-if="post.updatedAt" aria-label="文章已更新">· 更新于 {{ formatDate(post.updatedAt) }}</span>
            </div>

            <h2 class="text-2xl font-bold leading-tight text-zinc-900 transition-colors group-hover:text-green-700 sm:text-3xl">
              {{ post.title }}
            </h2>
            <p class="text-base leading-7 text-zinc-600">
              {{ post.description }}
            </p>

            <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
              <ul class="flex flex-wrap gap-2" aria-label="文章标签">
                <li v-for="tag in post.tags" :key="tag" class="badge badge-outline border-lime-300 text-green-800">
                  {{ tag }}
                </li>
              </ul>
              <span class="read-more" aria-hidden="true">阅读全文 →</span>
            </div>
          </div>
        </NuxtLink>
      </article>

      <div v-if="filteredPosts.length === 0" class="empty-state card border border-base-300 bg-base-100 p-8 text-center">
        <h2 class="text-xl font-bold text-zinc-800">没有找到文章</h2>
        <p class="mt-2 text-zinc-600">这个标签下暂时还没有内容。</p>
        <NuxtLink to="/blog" class="btn btn-outline btn-sm mx-auto mt-5">查看全部文章</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.post-card {
  transition: box-shadow 240ms ease, transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.post-card:hover {
  box-shadow: 0 20px 44px rgb(24 24 27 / 0.12);
  transform: translateY(-0.2rem);
}

.post-link {
  color: inherit;
  display: grid;
  text-decoration: none;
}

.post-link:focus-visible {
  border-radius: inherit;
  outline: 4px solid rgb(132 204 22 / 0.55);
  outline-offset: -4px;
}

.post-cover {
  aspect-ratio: 2 / 1;
  object-fit: cover;
  width: 100%;
}

.tag-filter {
  align-items: center;
  background: rgb(255 255 255 / 0.68);
  border: 1px solid rgb(161 161 170 / 0.35);
  border-radius: 999px;
  color: #3f3f46;
  display: inline-flex;
  font-size: 0.9rem;
  font-weight: 700;
  min-height: 2.75rem;
  padding: 0.5rem 0.9rem;
  transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease;
}

.tag-filter:hover {
  border-color: rgb(132 204 22 / 0.7);
  color: #166534;
  transform: translateY(-0.08rem);
}

.tag-filter:focus-visible {
  outline: 3px solid rgb(132 204 22 / 0.5);
  outline-offset: 2px;
}

.tag-filter.is-active {
  background: #18181b;
  border-color: #18181b;
  color: white;
}

.read-more {
  color: #166534;
  font-weight: 700;
  transition: transform 180ms ease;
}

.group:hover .read-more {
  transform: translateX(0.2rem);
}

.fly-in {
  animation: slide-up-fade 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

@keyframes slide-up-fade {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .post-card,
  .tag-filter,
  .read-more {
    transition-duration: 1ms;
  }

  .fly-in {
    animation-duration: 1ms;
    animation-delay: 0ms !important;
  }
}
</style>
