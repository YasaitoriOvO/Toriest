<template>
  <div class="min-h-screen flex flex-col items-center pt-12 pb-32 gap-8 px-4">
    <h1 class="text-3xl font-bold text-center">
      - Q&As -
    </h1>
    <div class="w-full max-w-2xl flex flex-col gap-2">
      <div class="fly-in collapse collapse-arrow bg-base-100 border border-base-300" style="animation-delay: 0.1s;">
        <input type="radio" name="my-accordion-1" checked="true" />
        <div class="collapse-title font-bold">你是谁？</div>
        <div class="collapse-content text-sm">很无聊的一个人，所以我写了这个问题。<br />我是菜鸡，喜欢摸鱼，擅长睡觉。</div>
      </div>
      <div class="fly-in collapse collapse-arrow bg-base-100 border border-base-300" style="animation-delay: 0.2s;">
        <input type="radio" name="my-accordion-1" />
        <div class="collapse-title font-bold">这个网站是如何编写的？</div>
        <div class="collapse-content text-sm">这个网站是用<a href="https://vuejs.org/" class="link link-info">Vue.js</a>和<a href="https://tailwindcss.com/" class="link link-info">Tailwind CSS</a>编写的。<br />使用了<a href="https://daisyui.com/" class="link link-info">DaisyUI</a>组件库。</div>
      </div>
      <div class="fly-in collapse collapse-arrow bg-base-100 border border-base-300" style="animation-delay: 0.3s;">
        <input type="radio" name="my-accordion-1" />
        <div class="collapse-title font-bold">如何把我的站点放进友链里？</div>
        <div class="collapse-content text-sm">给我发邮件！这里是<a href="mailto:caijidayo@outlook.com" class="link link-info">我的邮箱</a>。</div>
      </div>
    </div>
    <p class="fly-in text-gray-600 text-center" style="animation-delay: 0.4s;">
      ···
    </p>
  </div>
</template>
<style scoped>
  .fly-in {
    opacity: 0;
    animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes slideUpFade {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>