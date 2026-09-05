<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const config = useRuntimeConfig()
const { onPointerMove, resetTilt } = usePointerTilt(0)

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

function capturePostPosition(element: Element) {
  const card = element as HTMLElement
  card.style.setProperty('--leave-top', `${card.offsetTop}px`)
}

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
    <header class="motion-reveal mx-auto max-w-3xl text-center">
      <h1 class="text-3xl font-bold text-zinc-900 sm:text-5xl">
        - Blog -
      </h1>
    </header>

    <nav v-if="tags.length" style="--reveal-delay: 70ms" class="motion-reveal mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2" aria-label="按标签筛选文章">
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

    <TransitionGroup
      name="post-list"
      type="transition"
      tag="section"
      class="post-list mx-auto mt-10 grid w-full max-w-4xl gap-5"
      aria-live="polite"
      @before-leave="capturePostPosition"
    >
      <article
        v-for="(post, index) in filteredPosts"
        v-reveal="index"
        :key="post.path"
        class="post-card card pointer-glow motion-lift overflow-hidden border border-white/70 bg-base-100 shadow-sm"
        @pointermove="onPointerMove"
        @pointerleave="resetTilt"
        @pointercancel="resetTilt"
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

      <div v-if="filteredPosts.length === 0" key="empty" class="empty-state card border border-base-300 bg-base-100 p-8 text-center">
        <h2 class="text-xl font-bold text-zinc-800">没有找到文章</h2>
        <p class="mt-2 text-zinc-600">这个标签下暂时还没有内容。</p>
        <NuxtLink to="/blog" class="btn btn-outline btn-sm mx-auto mt-5">查看全部文章</NuxtLink>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.post-list { position: relative; }

.post-list-move,
.post-list-enter-active { transition: transform 420ms var(--ease-out), opacity 260ms ease; }
.post-list-leave-active {
  position: absolute;
  top: var(--leave-top);
  left: 0;
  width: 100%;
  transition: opacity 140ms ease, transform 140ms var(--ease-in);
  pointer-events: none;
}
.post-list-enter-from { opacity: 0; transform: translateY(12px); }
.post-list-leave-to { opacity: 0; transform: scale(0.98); }

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
  transition: background-color var(--motion-fast) ease, border-color var(--motion-fast) ease, color var(--motion-fast) ease, transform var(--motion-normal) var(--ease-spring);
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
  transition: transform var(--motion-normal) var(--ease-spring);
}

.group:hover .read-more {
  transform: translateX(0.35rem);
}

.tag-filter:active { transform: scale(0.95); }
</style>
