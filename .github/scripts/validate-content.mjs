#!/usr/bin/env node
// Zero-dependency content validation: this repo has no package.json/
// node_modules, and shouldn't need one just to check a handful of markdown
// files. Run via `.github/workflows/validate.yml` on every push and PR.

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'

const ROOT = process.cwd()
const POSTS_DIR = join(ROOT, 'posts')
const IMAGES_DIR = join(ROOT, 'images')
const REQUIRED_FIELDS = ['title', 'date', 'author', 'category', 'tags', 'excerpt']
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

const errors = []

// --- Images: must be .webp, matching what `site` optimizes for everywhere else ---
if (existsSync(IMAGES_DIR)) {
  for (const file of readdirSync(IMAGES_DIR)) {
    if (extname(file).toLowerCase() !== '.webp') {
      errors.push(`images/${file}: must be .webp (convert with \`cwebp\` or ImageMagick's \`convert\`)`)
    }
  }
}

// --- Posts: filename shape + required frontmatter fields ---
if (existsSync(POSTS_DIR)) {
  for (const file of readdirSync(POSTS_DIR)) {
    if (!file.endsWith('.md')) continue
    if (file.toLowerCase() === 'readme.md') continue

    const slug = file.replace(/\.md$/, '')
    if (!SLUG_PATTERN.test(slug)) {
      errors.push(`posts/${file}: filename should be lowercase, hyphen-separated (e.g. "my-post-title.md")`)
    }

    const raw = readFileSync(join(POSTS_DIR, file), 'utf-8')
    const match = raw.match(/^---\n([\s\S]*?)\n---/)
    if (!match) {
      errors.push(`posts/${file}: missing frontmatter block`)
      continue
    }

    const frontmatter = match[1]
    for (const field of REQUIRED_FIELDS) {
      if (!new RegExp(`^${field}:`, 'm').test(frontmatter)) {
        errors.push(`posts/${file}: missing required frontmatter field "${field}"`)
      }
    }

    const coAuthorsMatch = frontmatter.match(/^coAuthors:\s*(.*)$/m)
    if (coAuthorsMatch) {
      const list = coAuthorsMatch[1].match(/^\[(.*)\]$/)
      const slugs = list ? list[1].split(',').map((item) => item.trim().replace(/^["']|["']$/g, '')) : null
      if (!slugs || slugs.some((item) => !SLUG_PATTERN.test(item))) {
        errors.push(`posts/${file}: coAuthors must be a list of author slugs, e.g. ["author-one", "author-two"]`)
      } else {
        const author = frontmatter.match(/^author:\s*["']?([^"'\s]+)/m)
        if (author && slugs.includes(author[1])) {
          errors.push(`posts/${file}: coAuthors lists the author "${author[1]}" again`)
        }
      }
    }

    const statusMatch = frontmatter.match(/^status:\s*(\S+)/m)
    if (statusMatch && !['draft', 'published'].includes(statusMatch[1])) {
      errors.push(`posts/${file}: status must be "draft" or "published" (found "${statusMatch[1]}")`)
    }
  }
}

if (errors.length > 0) {
  console.error(`Content validation failed (${errors.length}):\n`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log('Content validation passed.')
