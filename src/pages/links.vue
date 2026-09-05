<template>
  <div class="min-h-screen flex flex-col items-center pt-12 pb-32 gap-8 px-4" aria-labelledby="links-title">
    <h1 id="links-title" class="motion-reveal text-3xl font-bold text-center">
      - Links -
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(link, index) in links"
        v-reveal="index"
        :key="link.name"
        class="card card-dash pointer-glow bg-base-100 motion-lift"
        @pointermove="onPointerMove"
        @pointerleave="resetTilt"
        @pointercancel="resetTilt"
      >
        <div class="card-body">
          <div class="flex items-center gap-2">
            <img
              :src="link.icon"
              :alt="link.name"
              class="w-10 h-10 rounded-full border-2 border-primary shadow-lg"
            >
            <h2 class="card-title">
              {{ link.name }}
            </h2>
          </div>
          <p>{{ link.desc }}</p>
          <div class="card-actions w-full">
            <a
              :href="link.links"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary w-full"
            >GO
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const { onPointerMove, resetTilt } = usePointerTilt(0)
  const links = [
    { icon: '/images/friends/hakadao.jpeg', name: 'Hakadao', desc: 'Now I am become a loser, the destroyer of myself', links: 'https://hakadao.cc' },
    { icon: '/images/friends/aira.png', name: 'Aira', desc: 'Kind and Kawaii, Forever!~', links: 'https://aira.cafe' },
    { icon: '/images/friends/akutazehy.jpeg', name: 'Akuta Zehy', desc: 'https://akutazehy.xyz/', links: 'https://akutazehy.xyz/'},
    { icon: '/images/friends/peter.jpeg', name: '朝仓 彩玲', desc: '火星上面有什么？', links: 'https://mygo.plus' }, 
    { icon: 'https://carolyn.sh/img/avatar.png', name: 'Carolyn Sun', desc: 'Where Carolyn Lives', links: 'https://carolyn.sh'},
    { icon: '/images/friends/nekro.jpeg', name:'Nekro’s SEKAI', desc:'自留地、日常记录、经验分享。', links:'https://www.nekro.top/'},
    { icon: '/images/friends/mengdu.png', name:'奶酪糖·梦都', desc:'一只即将步入社会的笨蛋小猫。', links:'https://www.kwymengdu.online/'},
    { icon: 'https://avatars.githubusercontent.com/u/135337676?v=4', name: 'Ventus Uta', desc: '8点、Classroom见', links: 'https://ventusuta.com/' },
  ]
</script>

<style scoped>
.card img { transition: transform var(--motion-spring) var(--ease-spring); }
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .card:hover img { transform: rotate(-6deg) scale(1.08); }
}
</style>
