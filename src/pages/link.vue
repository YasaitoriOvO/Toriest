<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-8 -translate-y-12">
    <h1 class="text-3xl font-bold text-center">
      - Links -
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="link in links" :key="link.name" class="card card-dash bg-base-100">
      <div class="card-body">
        <div class="flex items-center gap-2">
        <img :src="link.icon" :alt="link.name" class="w-10 h-10 rounded-full border-2 border-primary shadow-lg" />
        <h2 class="card-title">{{ link.name }}</h2>
        </div>
        <p>{{ link.desc }}</p>
        <div class="card-actions w-full">
        <a :href="link.links" target="_blank" class="btn btn-primary w-full">GO
        </a>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const links = [
  { icon: 'https://avatars.githubusercontent.com/u/33394391?v=4', name: 'Hakadao', desc: 'Now I am become a loser, the destroyer of myself', links: 'https://hakadao.cc' },
  { icon: 'https://avatars.githubusercontent.com/u/45261195?v=4', name: 'Aira', desc: 'Kind and Kawaii, Forever!~', links: 'https://aira.cafe' },
  { icon: 'https://avatars.githubusercontent.com/u/42381419?v=4', name: 'Akuta Zehy', desc: 'https://akutazehy.xyz/', links: 'https://akutazehy.xyz/'},
  { icon: 'https://avatars.githubusercontent.com/u/62592731?v=4', name: 'CuteLittleSky', desc: 'https://cutelittlesky.cn/', links: 'https://cutelittlesky.cn/' },
  { icon: 'https://avatars.githubusercontent.com/u/87231632?v=4', name: '朝仓 彩玲', desc: '火星上面有什么？', links: 'https://mygo.plus' },
]
</script>