import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod/v4'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        publishedAt: z.date(),
        updatedAt: z.date().optional(),
        tags: z.array(z.string()).default([]),
        cover: z.object({
          src: z.string().min(1),
          alt: z.string().min(1),
        }).optional(),
        draft: z.boolean().default(false),
        lang: z.string().default('zh-CN'),
      }),
    }),
  },
})
