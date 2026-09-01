# Toriest

Tori + Nest = Toriest

[Site](https://yatori.cc)

## Development

Use Node.js 24 and Bun 1.3.14. The repository includes a `.node-version` file for version managers that support it.

```bash
bun install
bun run dev
```

The site uses Nuxt 4 and Nuxt Content. Blog posts live in `content/blog` and are statically generated for deployment.

```bash
bun run typecheck
bun run test
bun run generate
```

To migrate an existing Markdown blog, pass its local directory to the migration command:

```bash
bun run migrate:blog -- /absolute/path/to/legacy-blog
```

The command writes normalized posts to `content/blog`, copies relative images to `public/images/blog`, and creates `migration-report.json` with redirect mappings and unresolved links. It stops before writing when required metadata is missing or slugs collide.

## EdgeOne Pages

- Node.js version: `24`
- Build command: `bun run generate`
- Output directory: `.output/public`

After the new site is verified, configure permanent redirects from the matching `blog.yatori.cc` paths to the `/blog/<slug>` targets listed in `migration-report.json`.
