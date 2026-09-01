<script setup lang="ts">
export interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

defineProps<{
  links: TocLink[]
}>()
</script>

<template>
  <ul class="toc-list">
    <li v-for="link in links" :key="link.id">
      <a :href="`#${link.id}`">{{ link.text }}</a>
      <BlogToc v-if="link.children?.length" :links="link.children" />
    </li>
  </ul>
</template>

<style scoped>
.toc-list {
  display: grid;
  gap: 0.28rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-list .toc-list {
  border-left: 1px solid rgb(132 204 22 / 0.3);
  margin: 0.2rem 0 0.25rem 0.45rem;
  padding-left: 0.75rem;
}

a {
  border-radius: 0.4rem;
  color: #52525b;
  display: block;
  line-height: 1.35;
  padding: 0.3rem 0.4rem;
  text-decoration: none;
  transition: background-color 180ms ease, color 180ms ease;
}

a:hover {
  background: rgb(236 252 203 / 0.7);
  color: #166534;
}

a:focus-visible {
  outline: 3px solid rgb(132 204 22 / 0.5);
  outline-offset: 2px;
}
</style>
