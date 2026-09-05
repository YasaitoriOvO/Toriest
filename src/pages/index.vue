<template>
  <div class="hero-bg min-h-screen flex flex-col items-center justify-center py-8">
    <div
      class="profile-card pointer-tilt motion-reveal w-full max-w-md"
      role="button"
      tabindex="0"
      :class="{ 'is-open': isIntroOpen }"
      :aria-expanded="isIntroOpen"
      aria-label="展开或收起个人介绍"
      aria-controls="intro-drawer"
      @pointermove="!isIntroOpen && onPointerMove($event)"
      @pointerleave="resetTilt"
      @pointercancel="resetTilt"
      @click="isIntroOpen = !isIntroOpen"
      @keydown.enter.self.prevent="isIntroOpen = !isIntroOpen"
      @keydown.space.self.prevent="isIntroOpen = !isIntroOpen"
    >
      <div id="intro-drawer" class="intro-drawer" :inert="!isIntroOpen" @click.stop>
        <div class="drawer-content">
          <div class="drawer-block">
            <div class="drawer-label">
              GPG:
            </div>
            <div class="drawer-row">
              <code class="gpg-hidden">0344 84..</code>
              <button class="copy-button" type="button" @click.stop="copyGpg">
                {{ copiedGpg ? 'Copied' : 'Copy' }}
              </button>
            </div>
          </div>

          <div class="drawer-block">
            <div class="drawer-label">
              Pronouns:
            </div>
            <code class="identity-text">
              They / Them
            </code>
          </div>
        </div>
      </div>

      <span class="profile-main pointer-glow bg-white rounded-3xl shadow-2xl card p-8 flex flex-col items-center">
        <span class="corner-mark" aria-hidden="true">
          <span class="mark mark-forward">&gt;</span>
          <span class="mark mark-peek">|</span>
          <span class="mark mark-open">&lt;</span>
        </span>

        <span class="avatar-orbit motion-reveal mb-4" style="--reveal-delay: 80ms">
          <span class="avatar-ring" aria-hidden="true" />
          <span class="avatar-sparkles" aria-hidden="true">
            <span
              v-for="(spark, index) in sparks"
              :key="index"
              class="avatar-spark"
              :style="{ '--spark-x': `${spark[0]}px`, '--spark-y': `${spark[1]}px`, '--spark-delay': `${index * 25}ms` }"
            />
          </span>
          <img
            class="avatar w-28 h-28 rounded-full border-4 border-lime-200 shadow-lg"
            src="../assets/images/me/me.jpeg"
            alt="Profile"
          >
        </span>
        <h1 class="profile-name motion-reveal text-3xl font-bold text-green-500 mb-2" style="--reveal-delay: 140ms">
          Yasaitori
        </h1>
        <p class="motion-reveal text-gray-600 mb-6 text-center" style="--reveal-delay: 200ms">
          Always be brave to <del>sleep</del> <span class="font-bold">Dream.</span>
          <br>
          Full-stack developer
        </p>

        <!-- Social Media Buttons -->
        <span class="social-links motion-reveal flex space-x-4" style="--reveal-delay: 260ms">
          <a
            class="btn bg-black text-white btn-square"
            href="https://github.com/yasaitoriovo"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
          >
            <svg
              aria-label="GitHub logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            ><path
              fill="white"
              d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
            /></svg>
          </a>
          
          <NuxtLink
            class="btn text-black bg-white btn-square"
            to="/blog"
            aria-label="阅读博客"
            @click.stop
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              viewBox="0 -960 960 960"
              width="16"
              fill="black"
            >
              <path
                d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h440l200 200v440q0 33-23.5 56.5T760-120H200Zm0-80h560v-400H600v-160H200v560Zm80-80h400v-80H280v80Zm0-320h200v-80H280v80Zm0 160h400v-80H280v80Zm-80-320v160-160 560-560Z"
              />
            </svg>
          </NuxtLink>

          <a
            class="btn bg-white text-black btn-square"
            href="mailto:me@yatori.cc"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
          >
            <svg
              aria-label="Email icon"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            ><g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2"
              fill="none"
              stroke="black"
            ><rect
              width="20"
              height="16"
              x="2"
              y="4"
              rx="2"
            /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></g></svg>
          </a>

          <a
            class="btn text-white bg-black btn-square"
            href="https://x.com/yasaitoriovo"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
          >
            <svg
              aria-label="X logo"
              width="16"
              height="12"
              viewBox="0 0 300 271"
              xmlns="http://www.w3.org/2000/svg"
            ><path
              fill="currentColor"
              d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z"
            /></svg>
          </a>
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  useHead({
    title: 'Toriest',
    titleTemplate: '%s',
    link: [
      { rel: 'canonical', href: 'https://yatori.cc/' },
    ],
  })

  useSeoMeta({
    description: 'Yasaitori 的个人主页、项目与开发笔记。',
    ogTitle: 'Toriest',
    ogDescription: 'Yasaitori 的个人主页、项目与开发笔记。',
    ogUrl: 'https://yatori.cc/',
    ogType: 'website',
    twitterCard: 'summary',
  })

  const { onPointerMove, resetTilt } = usePointerTilt()
  const sparks = [[-78, -45], [-28, -76], [45, -68], [84, -18], [72, 48], [23, 75], [-48, 64], [-87, 12]]
  const isIntroOpen = ref(false)
  watch(isIntroOpen, resetTilt)
  const copiedGpg = ref(false)
  const gpgKey = '0344 8421 82CF A006 DD12 465C 6C32 A3C 36F5 F275'

  async function copyGpg() {
    await navigator.clipboard.writeText(gpgKey)
    copiedGpg.value = true
    window.setTimeout(() => {
      copiedGpg.value = false
    }, 1200)
  }
</script>

<style scoped>
  .social-links a {
    transition: transform var(--motion-normal) var(--ease-spring), box-shadow var(--motion-normal) var(--ease-out);
  }

  @media (hover: hover) and (pointer: fine) {
    .social-links a:hover {
      transform: translateY(-4px) rotate(-4deg) scale(1.06);
      box-shadow: 0 8px 16px rgb(24 24 27 / 0.12);
    }
  }

  .social-links a:active {
    transform: translateY(1px) scale(0.93);
    transition-duration: 100ms;
  }

  .profile-card {
    appearance: none;
    color: inherit;
    cursor: pointer;
    outline: none;
    position: relative;
    text-align: inherit;
    width: min(calc(100vw - 2rem), 28rem);
  }

  .profile-card:focus-visible .profile-main {
    box-shadow:
      0 0 0 4px rgba(190, 242, 100, 0.72),
      0 20px 40px rgba(0,0,0,0.15);
  }

  .profile-card:hover .profile-main {
    box-shadow: 0 24px 48px rgba(0,0,0,0.17);
  }

  .profile-main {
    display: flex;
    width: 100%;
    min-width: 0;
    position: relative;
    transform: translate(0, 0);
    transition:
      transform 640ms var(--ease-spring),
      box-shadow 0.55s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 3;
  }

  .intro-drawer {
    background:
      linear-gradient(135deg, rgba(236, 252, 203, 0.85), rgba(255, 255, 255, 0.72)),
      repeating-linear-gradient(
        135deg,
        rgba(132, 204, 22, 0.14) 0,
        rgba(132, 204, 22, 0.14) 1px,
        transparent 1px,
        transparent 14px
      );
    border-left: 1px solid rgba(132, 204, 22, 0.2);
    border-radius: 1.5rem;
    box-shadow:
      inset 18px 0 28px rgba(22, 101, 52, 0.12),
      inset -10px 0 18px rgba(255, 255, 255, 0.48),
      0 18px 40px rgba(21, 128, 61, 0.14);
    bottom: 0;
    position: absolute;
    right: 0.35rem;
    top: 0;
    width: 52%;
    min-height: 100%;
    opacity: 0;
    transform: translate(-0.15rem, 0.12rem) scaleX(0.68);
    transform-origin: right center;
    transition:
      transform 640ms var(--ease-spring),
      opacity 0.48s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1;
  }

  .intro-drawer::before {
    background: linear-gradient(90deg, rgba(22, 101, 52, 0.18), transparent 55%);
    border-radius: inherit;
    content: "";
    inset: 0;
    position: absolute;
  }

  .intro-drawer::after {
    background: rgba(132, 204, 22, 0.34);
    border-radius: 999px;
    bottom: 1.15rem;
    content: "";
    position: absolute;
    right: 0.7rem;
    top: 1.15rem;
    width: 0.22rem;
  }

  .drawer-content {
    display: flex;
    flex-direction: column;
    gap: 1.35rem;
    height: 100%;
    justify-content: center;
    opacity: 0;
    padding: 2.25rem 1.15rem 2rem 2rem;
    position: relative;
    transition:
      opacity 240ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
    transform: translateX(0.6rem);
    z-index: 2;
  }

  .drawer-block {
    display: grid;
    gap: 0.45rem;
  }

  .drawer-label {
    color: rgb(21, 128, 61);
    font-size: 0.82rem;
    font-weight: 700;
  }

  .drawer-row {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    justify-content: flex-start;
    padding-left: 0.35rem;
  }

  .gpg-hidden {
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(132, 204, 22, 0.26);
    border-radius: 0.38rem;
    box-shadow: inset 0 -1px 0 rgba(22, 101, 52, 0.08);
    color: rgba(17, 24, 39, 0.76);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.78rem;
    line-height: 1;
    padding: 0.34rem 0.46rem;
  }

  .copy-button {
    background: rgba(255, 255, 255, 0.76);
    border: 1px solid rgba(132, 204, 22, 0.34);
    border-radius: 999px;
    color: rgb(22, 101, 52);
    cursor: pointer;
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 1;
    padding: 0.42rem 0.62rem;
    transition:
      background-color 320ms cubic-bezier(0.16, 1, 0.3, 1),
      color 320ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 420ms cubic-bezier(0.68, -0.28, 0.22, 1.28);
  }

  .copy-button:hover {
    background: rgba(236, 252, 203, 0.92);
    transform: translateY(-0.08rem) scale(1.04);
  }

  .copy-button:active {
    transform: translateY(0.04rem) scale(0.96);
  }

  .identity-text {
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(244, 114, 182, 0.26);
    border-radius: 0.38rem;
    box-shadow: inset 0 -1px 0 rgba(244, 114, 182, 0.08);
    color: rgb(244, 114, 182);
    display: inline-flex;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.9rem;
    font-weight: 700;
    line-height: 1;
    margin-left: 0.35rem;
    padding: 0.34rem 0.46rem;
    text-align: left;
    width: fit-content;
  }

  .profile-card:hover:not(.is-open) .intro-drawer {
    opacity: 0.82;
    transform: translate(0.85rem, 0.45rem) scaleX(0.82);
  }

  .profile-card:hover:not(.is-open) .profile-main {
    transform: translate(0, 0);
  }

  .profile-card.is-open .profile-main {
    transform: translate(-44%, -0.18rem) scale(1.012);
  }

  .profile-card.is-open .intro-drawer {
    opacity: 1;
    transform: translate(0.85rem, 0.55rem) scaleX(1);
  }

  .profile-card.is-open .drawer-content {
    opacity: 1;
    transform: translateX(0);
    transition-delay: 160ms;
  }

  .corner-mark {
    align-items: center;
    background: rgba(255, 255, 255, 0.62);
    border: 1px solid rgba(132, 204, 22, 0.2);
    border-radius: 999px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    color: rgb(34, 197, 94);
    display: inline-flex;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 1.15rem;
    font-weight: 700;
    height: 2rem;
    justify-content: center;
    line-height: 1;
    overflow: hidden;
    position: absolute;
    right: 1rem;
    top: 1rem;
    transition:
      border-radius 0.5s cubic-bezier(0.68, -0.35, 0.22, 1.35),
      transform 0.55s cubic-bezier(0.68, -0.35, 0.22, 1.35),
      background-color var(--motion-normal) ease;
    width: 2rem;
    z-index: 4;
  }

  .mark {
    position: absolute;
    transform: translateY(160%) rotate(18deg) scale(0.78);
    transition:
      opacity 0.34s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.5s cubic-bezier(0.68, -0.35, 0.22, 1.35);
  }

  .mark-forward {
    opacity: 1;
    transform: translateY(0) rotate(0) scale(1);
  }

  .mark-peek,
  .mark-open {
    opacity: 0;
  }

  .profile-card:hover:not(.is-open) .corner-mark {
    border-radius: 0.35rem;
    transform: rotate(90deg) scaleX(0.82);
  }

  .profile-card:hover:not(.is-open) .mark-forward {
    opacity: 0;
    transform: translateY(-160%) rotate(-18deg) scale(0.78);
  }

  .profile-card:hover:not(.is-open) .mark-peek {
    opacity: 1;
    transform: translateY(0) rotate(-90deg) scale(1.1);
  }

  .profile-card.is-open .corner-mark {
    border-radius: 999px 0.45rem 0.45rem 999px;
    transform: translateX(-0.3rem) rotate(0) scale(1.05);
  }

  .profile-card.is-open .mark-forward,
  .profile-card.is-open .mark-peek {
    opacity: 0;
    transform: translateY(-160%) rotate(-18deg) scale(0.78);
  }

  .profile-card.is-open .mark-open {
    opacity: 1;
    transform: translateY(0) rotate(0) scale(1);
  }

  .avatar-orbit {
    position: relative;
    display: block;
    isolation: isolate;
  }

  .avatar-orbit::before {
    content: "";
    position: absolute;
    inset: -12px;
    z-index: -1;
    border-radius: 50%;
    background: radial-gradient(circle, rgb(163 230 53 / 0.3), transparent 70%);
    opacity: 0.65;
    animation: halo-breathe 4s ease-in-out 2;
    animation-play-state: var(--reveal-play-state, running);
  }

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    transition: transform var(--motion-spring) var(--ease-spring);
  }

  .avatar-ring {
    position: absolute;
    inset: -7px;
    border: 1px solid rgb(34 197 94 / 0.15);
    border-top-color: rgb(6 182 212 / 0.7);
    border-right-color: rgb(132 204 22 / 0.65);
    border-radius: 50%;
    pointer-events: none;
    rotate: -25deg;
    transition: rotate 900ms var(--ease-out), scale 560ms var(--ease-spring);
  }

  .avatar-sparkles {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }

  .avatar-spark {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 12px;
    height: 12px;
    opacity: 0;
    background: #22c58b;
    clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);
  }

  .avatar-spark:nth-child(3n) { background: #06b6d4; width: 8px; height: 8px; }
  .avatar-spark:nth-child(3n + 1) { background: #84cc16; }

  .profile-card.is-open .avatar-spark {
    animation: spark-out 850ms var(--ease-out) var(--spark-delay) backwards;
  }

  @supports (background-clip: text) {
    .profile-name {
      background: linear-gradient(110deg, #16a34a 25%, #0891b2 42%, #65a30d 53%, #16a34a 70%);
      background-size: 260% 100%;
      background-position: 100% 50%;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      transition: background-position 1000ms var(--ease-out);
    }

    .profile-card:hover .profile-name,
    .profile-card.is-open .profile-name { background-position: 0% 50%; }
  }

  .profile-card:hover .avatar-ring,
  .profile-card.is-open .avatar-ring { rotate: 65deg; scale: 1.04; }

  @keyframes spark-out {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.25); }
    18% {
      opacity: 1;
      transform: translate(calc(var(--spark-x) * 0.45 - 50%), calc(var(--spark-y) * 0.45 - 50%)) rotate(20deg) scale(1);
    }
    65% {
      opacity: 0.8;
      transform: translate(calc(var(--spark-x) * 0.85 - 50%), calc(var(--spark-y) * 0.85 - 50%)) rotate(65deg) scale(0.65);
    }
    100% {
      opacity: 0;
      transform: translate(calc(var(--spark-x) - 50%), calc(var(--spark-y) - 50%)) rotate(90deg) scale(0.2);
    }
  }

  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    .avatar-orbit:hover .avatar { transform: rotate(-7deg) scale(1.06); }
  }

  /* On narrow screens the drawer opens below, keeping the whole card in view. */
  @media (max-width: 850px) {
    .hero-bg { padding-block: 6rem 9rem; }
    .profile-card { width: min(calc(100vw - 2.5rem), 28rem); }
    .intro-drawer {
      inset: auto 0 0;
      width: 100%;
      height: 10rem;
      min-height: 0;
      transform: translateY(0) scale(0.96);
      transform-origin: center top;
    }
    .drawer-content {
      flex-direction: row;
      align-items: center;
      justify-content: space-evenly;
      gap: 1rem;
      padding: 1.25rem;
      transform: translateY(-8px);
    }
    .drawer-row { padding-left: 0; }
    .drawer-label { font-size: 0.76rem; }
    .gpg-hidden, .identity-text { font-size: 0.74rem; }
    .identity-text { margin-left: 0; }
    .profile-card:hover:not(.is-open) .intro-drawer {
      transform: translateY(0.4rem) scale(0.98);
    }
    .profile-card.is-open .profile-main { transform: translateY(-3rem); }
    .profile-card.is-open .intro-drawer { transform: translateY(6rem) scale(1); }
    .profile-card.is-open .drawer-content { transform: translateY(0); }
  }

  @media (hover: none) {
    .profile-card:hover:not(.is-open) .intro-drawer { opacity: 0; }
  }

  @keyframes halo-breathe {
    0%, 100% { opacity: 0.65; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.12); }
  }
</style>
