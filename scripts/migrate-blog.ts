import { createHash } from 'node:crypto'
import { access, copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import matter from 'gray-matter'

type Frontmatter = Record<string, unknown>

interface AssetCopy {
  source: string
  destination: string
  publicPath: string
}

interface ParsedPost {
  sourcePath: string
  relativePath: string
  body: string
  data: Frontmatter
  title: string
  description: string
  publishedAt: Date
  updatedAt?: Date
  tags: string[]
  cover?: {
    src: string
    alt: string
  }
  draft: boolean
  lang: string
  slug: string
  oldPath: string
  outputPath: string
}

export interface MigrationReport {
  sourceRoot: string
  outputRoot: string
  generatedAt: string
  migrated: Array<{
    source: string
    output: string
    slug: string
    draft: boolean
  }>
  redirects: Array<{
    from: string
    to: string
  }>
  copiedAssets: Array<{
    source: string
    destination: string
  }>
  warnings: string[]
  unresolvedLinks: Array<{
    source: string
    target: string
  }>
}

export interface MigrationOptions {
  outputRoot?: string
  reportPath?: string
}

async function exists(path: string) {
  try {
    await access(path)
    return true
  }
  catch {
    return false
  }
}

async function collectMarkdownFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') {
      continue
    }

    const path = join(root, entry.name)
    if (entry.isDirectory()) {
      files.push(...await collectMarkdownFiles(path))
    }
    else if (/\.(md|markdown)$/i.test(entry.name)) {
      files.push(path)
    }
  }

  return files.sort()
}

function firstValue(data: Frontmatter, keys: string[]) {
  for (const key of keys) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
      return data[key]
    }
  }
  return undefined
}

function firstString(data: Frontmatter, keys: string[]) {
  const value = firstValue(data, keys)
  return typeof value === 'string' ? value.trim() : undefined
}

function parseDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }

  if (typeof value !== 'string' && typeof value !== 'number') {
    return undefined
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function normalizeTags(value: unknown) {
  const tags = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(/[,，]/)
      : []

  return [...new Set(
    tags
      .map(tag => String(tag).trim())
      .filter(Boolean),
  )]
}

function normalizeBoolean(value: unknown, fallback: boolean) {
  if (typeof value === 'boolean') {
    return value
  }
  if (typeof value === 'string') {
    if (['true', 'yes', '1'].includes(value.toLowerCase())) return true
    if (['false', 'no', '0'].includes(value.toLowerCase())) return false
  }
  return fallback
}

function stripMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/[*_~]/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractDescription(body: string) {
  const paragraphs = body
    .replace(/```[\s\S]*?```/g, '')
    .split(/\n\s*\n/)
    .map(stripMarkdown)
    .filter(paragraph => paragraph.length >= 12 && !paragraph.startsWith('|'))

  const description = paragraphs[0]
  if (!description) {
    return undefined
  }

  return description.length > 180 ? `${description.slice(0, 177).trimEnd()}…` : description
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value)
  }
  catch {
    return value
  }
}

function normalizeSlug(value: string) {
  const candidate = safeDecode(value)
    .replace(/[?#].*$/, '')
    .replace(/\.(md|markdown|html?)$/i, '')
    .split('/')
    .filter(Boolean)
    .at(-1) ?? ''

  return candidate
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]+/gu, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
}

function pathFromUrl(value: string) {
  try {
    return new URL(value, 'https://blog.yatori.cc').pathname
  }
  catch {
    return value
  }
}

function normalizeOldPath(data: Frontmatter, relativePath: string) {
  const configured = firstString(data, ['permalink', 'url', 'path'])
  const fallback = `/${relativePath.replace(/\\/g, '/').replace(/\.(md|markdown)$/i, '')}`
  const path = pathFromUrl(configured ?? fallback)
    .replace(/\.(html?)$/i, '')
    .replace(/\/index$/i, '')

  return path.startsWith('/') ? path || '/' : `/${path}`
}

function readCover(data: Frontmatter, title: string) {
  const value = firstValue(data, ['cover', 'image'])
  if (typeof value === 'string' && value.trim()) {
    return {
      src: value.trim(),
      alt: firstString(data, ['coverAlt', 'imageAlt']) ?? title,
    }
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const record = value as Frontmatter
    const src = firstString(record, ['src', 'url', 'path'])
    if (src) {
      return {
        src,
        alt: firstString(record, ['alt', 'caption']) ?? title,
      }
    }
  }

  return undefined
}

function splitTarget(target: string) {
  const unwrapped = target.startsWith('<') && target.endsWith('>')
    ? target.slice(1, -1)
    : target
  const match = unwrapped.match(/^([^?#]*)([?#].*)?$/)
  return {
    path: match?.[1] ?? unwrapped,
    suffix: match?.[2] ?? '',
    wrapped: target.startsWith('<') && target.endsWith('>'),
  }
}

function isExternalTarget(target: string) {
  return /^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(target)
}

function safeAssetName(sourcePath: string) {
  const original = basename(sourcePath)
  const extension = extname(original)
  const stem = original.slice(0, Math.max(0, original.length - extension.length))
    .normalize('NFKC')
    .replace(/[^\p{Letter}\p{Number}._-]+/gu, '-')
    .replace(/^-|-$/g, '') || 'asset'
  return `${stem}${extension.toLowerCase()}`
}

async function replaceAsync(
  input: string,
  pattern: RegExp,
  replacer: (match: RegExpExecArray) => Promise<string>,
) {
  let result = ''
  let cursor = 0
  pattern.lastIndex = 0

  for (let match = pattern.exec(input); match; match = pattern.exec(input)) {
    result += input.slice(cursor, match.index)
    result += await replacer(match)
    cursor = match.index + match[0].length
  }

  return result + input.slice(cursor)
}

export async function migrateBlog(sourceDirectory: string, options: MigrationOptions = {}) {
  const sourceRoot = resolve(sourceDirectory)
  const outputRoot = resolve(options.outputRoot ?? process.cwd())
  const contentRoot = join(outputRoot, 'content', 'blog')
  const assetRoot = join(outputRoot, 'public', 'images', 'blog')
  const reportPath = resolve(options.reportPath ?? join(outputRoot, 'migration-report.json'))

  if (!await exists(sourceRoot)) {
    throw new Error(`源目录不存在：${sourceRoot}`)
  }

  if (sourceRoot === outputRoot || outputRoot.startsWith(`${sourceRoot}${sep}`)) {
    throw new Error('输出目录不能位于旧博客源目录内部。')
  }

  const sourceFiles = await collectMarkdownFiles(sourceRoot)
  if (sourceFiles.length === 0) {
    throw new Error(`源目录中没有找到 Markdown 文件：${sourceRoot}`)
  }

  const errors: string[] = []
  const warnings: string[] = []
  const parsedPosts: ParsedPost[] = []
  const slugOwners = new Map<string, string>()

  for (const sourcePath of sourceFiles) {
    const relativePath = relative(sourceRoot, sourcePath)
    const raw = await readFile(sourcePath, 'utf8')
    const parsed = matter(raw)
    const data = parsed.data as Frontmatter
    const title = firstString(data, ['title', 'name'])
    const publishedAt = parseDate(firstValue(data, ['publishedAt', 'date', 'createdAt', 'created', 'publishDate']))
    const permalink = firstString(data, ['slug', 'permalink', 'url'])
    const slug = normalizeSlug(permalink ?? basename(relativePath))

    if (!title) errors.push(`${relativePath}: 缺少 title`)
    if (!publishedAt) errors.push(`${relativePath}: 缺少有效的 publishedAt/date`)
    if (!slug) errors.push(`${relativePath}: 无法生成 slug`)

    const previousOwner = slugOwners.get(slug)
    if (slug && previousOwner) {
      errors.push(`${relativePath}: slug "${slug}" 与 ${previousOwner} 重复`)
    }
    else if (slug) {
      slugOwners.set(slug, relativePath)
    }

    const explicitDescription = firstString(data, ['description', 'summary', 'excerpt'])
    const description = explicitDescription ?? extractDescription(parsed.content)
    if (!description) {
      errors.push(`${relativePath}: 缺少 description，且无法从正文生成摘要`)
    }
    else if (!explicitDescription) {
      warnings.push(`${relativePath}: description 已从正文首段生成`)
    }

    if (!title || !publishedAt || !slug || !description) {
      continue
    }

    const updatedAtValue = firstValue(data, ['updatedAt', 'updated', 'modifiedAt', 'lastmod'])
    const updatedAt = updatedAtValue === undefined ? undefined : parseDate(updatedAtValue)
    if (updatedAtValue !== undefined && !updatedAt) {
      errors.push(`${relativePath}: updatedAt/updated 不是有效日期`)
      continue
    }

    const published = firstValue(data, ['published'])
    const draft = normalizeBoolean(data.draft, published === undefined ? false : !normalizeBoolean(published, true))

    parsedPosts.push({
      sourcePath,
      relativePath,
      body: parsed.content.trimStart(),
      data,
      title,
      description,
      publishedAt,
      updatedAt,
      tags: normalizeTags(data.tags),
      cover: readCover(data, title),
      draft,
      lang: firstString(data, ['lang', 'language']) ?? 'zh-CN',
      slug,
      oldPath: normalizeOldPath(data, relativePath),
      outputPath: join(contentRoot, `${slug}.md`),
    })
  }

  if (errors.length) {
    throw new Error(`迁移校验失败：\n- ${errors.join('\n- ')}`)
  }

  const sourceToSlug = new Map(parsedPosts.map(post => [resolve(post.sourcePath), post.slug]))
  const assetCopies: AssetCopy[] = []
  const assetDestinations = new Map<string, string>()
  const unresolvedLinks: MigrationReport['unresolvedLinks'] = []
  const renderedPosts: Array<{ post: ParsedPost, content: string }> = []

  async function registerAsset(post: ParsedPost, target: string) {
    const { path: targetPath, suffix, wrapped } = splitTarget(target)
    if (!targetPath || isExternalTarget(targetPath)) {
      return target
    }

    const sourceAsset = resolve(dirname(post.sourcePath), safeDecode(targetPath))
    if (!await exists(sourceAsset)) {
      unresolvedLinks.push({ source: post.relativePath, target })
      return target
    }

    const baseName = safeAssetName(sourceAsset)
    let destination = join(assetRoot, post.slug, baseName)
    const existingSource = assetDestinations.get(destination)
    if (existingSource && existingSource !== sourceAsset) {
      const digest = createHash('sha1').update(sourceAsset).digest('hex').slice(0, 8)
      const extension = extname(baseName)
      const stem = baseName.slice(0, baseName.length - extension.length)
      destination = join(assetRoot, post.slug, `${stem}-${digest}${extension}`)
    }

    assetDestinations.set(destination, sourceAsset)
    const publicPath = `/${relative(join(outputRoot, 'public'), destination).split(sep).join('/')}`
    if (!assetCopies.some(asset => asset.source === sourceAsset && asset.destination === destination)) {
      assetCopies.push({ source: sourceAsset, destination, publicPath })
    }

    const rewritten = `${publicPath}${suffix}`
    return wrapped ? `<${rewritten}>` : rewritten
  }

  function rewriteArticleLink(post: ParsedPost, target: string) {
    const { path: targetPath, suffix, wrapped } = splitTarget(target)
    if (!targetPath || isExternalTarget(targetPath) || !/\.(md|markdown)$/i.test(targetPath)) {
      return target
    }

    const linkedSource = resolve(dirname(post.sourcePath), safeDecode(targetPath))
    const linkedSlug = sourceToSlug.get(linkedSource)
    if (!linkedSlug) {
      unresolvedLinks.push({ source: post.relativePath, target })
      return target
    }

    const rewritten = `/blog/${linkedSlug}${suffix}`
    return wrapped ? `<${rewritten}>` : rewritten
  }

  for (const post of parsedPosts) {
    let body = await replaceAsync(
      post.body,
      /(!?\[[^\]]*]\()(<[^>]+>|[^)\s]+)([^)]*\))/g,
      async (match) => {
        const prefix = match[1] ?? ''
        const target = match[2] ?? ''
        const suffix = match[3] ?? ''
        const rewritten = prefix.startsWith('!')
          ? await registerAsset(post, target)
          : rewriteArticleLink(post, target)
        return `${prefix}${rewritten}${suffix}`
      },
    )

    body = await replaceAsync(
      body,
      /(<img\b[^>]*\bsrc=["'])([^"']+)(["'][^>]*>)/gi,
      async match => `${match[1] ?? ''}${await registerAsset(post, match[2] ?? '')}${match[3] ?? ''}`,
    )

    body = await replaceAsync(
      body,
      /(<a\b[^>]*\bhref=["'])([^"']+)(["'][^>]*>)/gi,
      async match => `${match[1] ?? ''}${rewriteArticleLink(post, match[2] ?? '')}${match[3] ?? ''}`,
    )

    let cover = post.cover
    if (cover && !isExternalTarget(cover.src)) {
      cover = {
        ...cover,
        src: await registerAsset(post, cover.src),
      }
    }

    const normalizedFrontmatter: Frontmatter = {
      title: post.title,
      description: post.description,
      publishedAt: post.publishedAt,
      ...(post.updatedAt ? { updatedAt: post.updatedAt } : {}),
      tags: post.tags,
      ...(cover ? { cover } : {}),
      draft: post.draft,
      lang: post.lang,
    }

    renderedPosts.push({
      post,
      content: matter.stringify(body.trimEnd() + '\n', normalizedFrontmatter),
    })
  }

  for (const { post } of renderedPosts) {
    if (await exists(post.outputPath)) {
      errors.push(`${post.relativePath}: 目标文章已存在 ${relative(outputRoot, post.outputPath)}`)
    }
  }
  for (const asset of assetCopies) {
    if (await exists(asset.destination)) {
      errors.push(`目标资源已存在 ${relative(outputRoot, asset.destination)}`)
    }
  }

  if (errors.length) {
    throw new Error(`迁移不会覆盖现有文件：\n- ${errors.join('\n- ')}`)
  }

  await mkdir(contentRoot, { recursive: true })
  for (const { post, content } of renderedPosts) {
    await writeFile(post.outputPath, content, 'utf8')
  }

  for (const asset of assetCopies) {
    await mkdir(dirname(asset.destination), { recursive: true })
    await copyFile(asset.source, asset.destination)
  }

  const report: MigrationReport = {
    sourceRoot,
    outputRoot,
    generatedAt: new Date().toISOString(),
    migrated: renderedPosts.map(({ post }) => ({
      source: post.relativePath,
      output: relative(outputRoot, post.outputPath),
      slug: post.slug,
      draft: post.draft,
    })),
    redirects: renderedPosts.map(({ post }) => ({
      from: post.oldPath,
      to: `/blog/${post.slug}`,
    })),
    copiedAssets: assetCopies.map(asset => ({
      source: relative(sourceRoot, asset.source),
      destination: relative(outputRoot, asset.destination),
    })),
    warnings,
    unresolvedLinks,
  }

  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  return report
}

function parseArguments(args: string[]) {
  const values = args.filter(arg => arg !== '--')
  let sourceDirectory: string | undefined
  let outputRoot: string | undefined

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value === '--output-root') {
      outputRoot = values[index + 1]
      index += 1
    }
    else if (!sourceDirectory && value) {
      sourceDirectory = value
    }
  }

  return { sourceDirectory, outputRoot }
}

if (import.meta.main) {
  const { sourceDirectory, outputRoot } = parseArguments(process.argv.slice(2))

  if (!sourceDirectory || !isAbsolute(sourceDirectory)) {
    console.error('用法：bun run migrate:blog -- /absolute/path/to/legacy-blog [--output-root /absolute/output]')
    process.exitCode = 1
  }
  else {
    try {
      const report = await migrateBlog(sourceDirectory, { outputRoot })
      console.log(`迁移完成：${report.migrated.length} 篇文章，${report.copiedAssets.length} 个资源。`)
      console.log(`报告：${join(report.outputRoot, 'migration-report.json')}`)
      if (report.unresolvedLinks.length) {
        console.warn(`有 ${report.unresolvedLinks.length} 个链接未解析，请查看迁移报告。`)
      }
    }
    catch (error) {
      console.error(error instanceof Error ? error.message : error)
      process.exitCode = 1
    }
  }
}
