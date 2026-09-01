import tailwindcss from '@tailwindcss/vite'
import { copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-31',
  srcDir: 'src/',

  modules: ['@nuxt/content'],

  css: ['~/styles/global.css'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN',
      },
      titleTemplate: '%s · Toriest',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: 'https://cdn.jsdelivr.net/gh/yasaitoriovo/toriest-img@latest/me/icon.jpeg' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#f6f6f6' },
      ],
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },

  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3,
        },
        highlight: {
          langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'md', 'yaml', 'rust'],
        },
      },
    },
    experimental: {
      sqliteConnector: 'native',
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: ['/404'],
    },
    hooks: {
      async 'prerender:done'() {
        await copyFile(
          resolve('.output/public/404/index.html'),
          resolve('.output/public/404.html'),
        )
      },
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: 'https://yatori.cc',
    },
  },

  typescript: {
    typeCheck: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
