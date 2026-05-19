<script setup lang="ts">
  import { ref } from 'vue'

  const gpgPublicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
mDMEagyaxxYJKwYBBAHaRw8BAQdAYc9EMoXgHFdoGs7ebfw+ouaAn/5FweKm2O/7
w1nKYne0L1lhc2FpdG9yaSAoSnVzdCBmb3IgbWUpIDxjYWlqaWRheW9Ab3V0bG9v
ay5jb20+iK8EExYKAFcWIQQDRIQhgs+gBt0SRlxsMqPONvXydQUCagyaxxsUgAAA
AAAEAA5tYW51MiwyLjUrMS4xMiwyLDECGwMFCwkIBwICIgIGFQoJCAsCBBYCAwEC
HgcCF4AACgkQbDKjzjb18nUBMQD/V+mt6DzvFwrUaopVsQlTwRCt1I/JIetkkbBQ
O5pHUBMBAIhAqv21lGez2cDB0h5Zn/2NrVW5KSwuxbJP7Djcg7MCuDgEagyaxxIK
KwYBBAGXVQEFAQEHQJ8lPimwJxewOiFFGy1RZmqalKjuNmqt2qP7BwuSfq5WAwEI
B4iUBBgWCgA8FiEEA0SEIYLPoAbdEkZcbDKjzjb18nUFAmoMmscbFIAAAAAABAAO
bWFudTIsMi41KzEuMTIsMiwxAhsMAAoJEGwyo8429fJ1uoABAIr/H175BOMHEIs6
NqW/VqegjAkapsPQtFmlN1tOgrNuAQDRUN7gH7nWlnyk0i7LFqJKaS+RcXCO3Va5
2kVC7FZDCQ==
=b/Us
-----END PGP PUBLIC KEY BLOCK-----`

  const copiedGpg = ref(false)

  async function copyGpgPublicKey() {
    await navigator.clipboard.writeText(gpgPublicKey)
    copiedGpg.value = true
    window.setTimeout(() => {
      copiedGpg.value = false
    }, 1200)
  }
</script>

<template>
  <div class="min-h-screen flex flex-col items-center pt-12 pb-32 gap-8 px-4">
    <h1 class="text-3xl font-bold text-center">
      - Q&As -
    </h1>

    <div class="w-full max-w-2xl flex flex-col gap-2">
      <div class="fly-in collapse collapse-arrow bg-base-100 border border-base-300" style="animation-delay: 0.1s;">
        <input type="radio" name="my-accordion-1" checked="true">
        <div class="collapse-title font-bold">
          你是谁？
        </div>
        <div class="collapse-content text-sm">
          很无聊的一个人，所以我写了这个问题。<br>
          我是菜鸡，喜欢摸鱼，擅长睡觉。
        </div>
      </div>

      <div class="fly-in collapse collapse-arrow bg-base-100 border border-base-300" style="animation-delay: 0.1s;">
        <input type="radio" name="my-accordion-1">
        <div class="collapse-title font-bold">
          你的 GPG 公钥在哪？
        </div>
        <div class="collapse-content text-sm">
          <a
            href="https://keys.openpgp.org/vks/v1/by-fingerprint/0344842182CFA006DD12465C6C32A3CE36F5F275"
            class="link link-info"
            target="_blank"
            rel="noopener noreferrer"
          >
            点击这里
          </a>下载我的 GPG 公钥

          <div class="code-card">
            <div class="code-toolbar">
              <span class="code-language">PGP PUBLIC KEY</span>
              <button class="copy-code-button" type="button" @click="copyGpgPublicKey">
                {{ copiedGpg ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <pre><code>{{ gpgPublicKey }}</code></pre>
          </div>
        </div>
      </div>

      <div class="fly-in collapse collapse-arrow bg-base-100 border border-base-300" style="animation-delay: 0.2s;">
        <input type="radio" name="my-accordion-1">
        <div class="collapse-title font-bold">
          这个网站是如何编写的？
        </div>
        <div class="collapse-content text-sm">
          这个网站是用 <a href="https://vuejs.org/" class="link link-info">Vue.js</a> 和 <a href="https://tailwindcss.com/" class="link link-info">Tailwind CSS</a> 编写的。<br>
          使用了 <a href="https://daisyui.com/" class="link link-info">DaisyUI</a> 组件库。
        </div>
      </div>

      <div class="fly-in collapse collapse-arrow bg-base-100 border border-base-300" style="animation-delay: 0.3s;">
        <input type="radio" name="my-accordion-1">
        <div class="collapse-title font-bold">
          如何把我的站点放进友链里？
        </div>
        <div class="collapse-content text-sm">
          给我发邮件！这里是 <a href="mailto:caijidayo@outlook.com" class="link link-info">我的邮箱</a>。
        </div>
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

  .code-card {
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(244, 252, 244, 0.9)),
      var(--color-base-100);
    border: 1px solid rgba(132, 204, 22, 0.22);
    border-radius: 0.85rem;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 14px 34px rgba(22, 101, 52, 0.08);
    margin-top: 0.8rem;
    overflow: hidden;
  }

  .code-toolbar {
    align-items: center;
    border-bottom: 1px solid rgba(132, 204, 22, 0.18);
    display: flex;
    gap: 0.75rem;
    justify-content: space-between;
    padding: 0.55rem 0.7rem;
  }

  .code-language {
    color: rgba(21, 128, 61, 0.76);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.68rem;
    font-weight: 700;
  }

  .copy-code-button {
    background: rgba(255, 255, 255, 0.82);
    border: 1px solid rgba(132, 204, 22, 0.3);
    border-radius: 999px;
    color: rgb(22, 101, 52);
    cursor: pointer;
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 1;
    padding: 0.4rem 0.62rem;
    transition:
      background-color 320ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 420ms cubic-bezier(0.68, -0.28, 0.22, 1.28);
  }

  .copy-code-button:hover {
    background: rgba(236, 252, 203, 0.92);
    transform: translateY(-0.08rem) scale(1.04);
  }

  .copy-code-button:active {
    transform: translateY(0.04rem) scale(0.96);
  }

  .code-card pre {
    margin: 0;
    max-height: 18rem;
    overflow: auto;
    padding: 0.85rem;
  }

  .code-card code {
    color: rgba(17, 24, 39, 0.78);
    display: block;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.75rem;
    line-height: 1.65;
    min-width: max-content;
    white-space: pre;
  }

  @media (max-width: 520px) {
    .code-toolbar {
      padding-inline: 0.6rem;
    }

    .code-card pre {
      max-height: 14rem;
      padding: 0.7rem;
    }

    .code-card code {
      font-size: 0.68rem;
    }
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
