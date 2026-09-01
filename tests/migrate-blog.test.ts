import { afterEach, describe, expect, test } from 'bun:test'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import matter from 'gray-matter'
import { migrateBlog } from '../scripts/migrate-blog'

const temporaryRoots: string[] = []

async function createWorkspace() {
  const root = await mkdtemp(join(tmpdir(), 'toriest-migrate-'))
  temporaryRoots.push(root)
  const source = join(root, 'legacy')
  const output = join(root, 'output')
  await mkdir(source, { recursive: true })
  await mkdir(output, { recursive: true })
  return { root, source, output }
}

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

describe('migrateBlog', () => {
  test('normalizes frontmatter and rewrites article and image links', async () => {
    const { source, output } = await createWorkspace()
    await writeFile(join(source, 'diagram.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>')
    await writeFile(join(source, 'first.md'), `---
title: First article
date: 2025-05-01
summary: A migrated article.
permalink: /posts/first-post/
tags: Vue, Nuxt
image: ./diagram.svg
---

![Diagram](./diagram.svg)

[第二篇](./second.md#details)

[Missing](./missing.md)
`)
    await writeFile(join(source, 'second.md'), `---
title: Second article
publishedAt: 2025-05-02
description: Another migrated article.
published: false
---

## Details

Draft content.
`)

    const report = await migrateBlog(source, { outputRoot: output })
    const firstRaw = await readFile(join(output, 'content/blog/first-post.md'), 'utf8')
    const secondRaw = await readFile(join(output, 'content/blog/second.md'), 'utf8')
    const first = matter(firstRaw)
    const second = matter(secondRaw)

    expect(first.data.title).toBe('First article')
    expect(first.data.tags).toEqual(['Vue', 'Nuxt'])
    expect(first.data.cover.src).toBe('/images/blog/first-post/diagram.svg')
    expect(first.content).toContain('![Diagram](/images/blog/first-post/diagram.svg)')
    expect(first.content).toContain('[第二篇](/blog/second#details)')
    expect(second.data.draft).toBe(true)
    expect(report.redirects).toContainEqual({ from: '/posts/first-post/', to: '/blog/first-post' })
    expect(report.unresolvedLinks).toContainEqual({ source: 'first.md', target: './missing.md' })
    expect(await readFile(join(output, 'public/images/blog/first-post/diagram.svg'), 'utf8')).toContain('<svg')
  })

  test('rejects duplicate slugs before writing output', async () => {
    const { source, output } = await createWorkspace()
    const article = (title: string) => `---
title: ${title}
date: 2025-05-01
description: Valid description.
slug: duplicate
---

Body text long enough to be valid.
`
    await writeFile(join(source, 'one.md'), article('One'))
    await writeFile(join(source, 'two.md'), article('Two'))

    await expect(migrateBlog(source, { outputRoot: output })).rejects.toThrow('slug "duplicate"')
  })

  test('rejects articles without title or publication date', async () => {
    const { source, output } = await createWorkspace()
    await writeFile(join(source, 'invalid.md'), `---
description: Missing required fields.
---

This article cannot be migrated.
`)

    await expect(migrateBlog(source, { outputRoot: output })).rejects.toThrow('缺少 title')
    await expect(migrateBlog(source, { outputRoot: output })).rejects.toThrow('publishedAt/date')
  })

})
