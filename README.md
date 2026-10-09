# Systems Research @ IBA: Blog

Source for the Systems Research @ IBA blog. There's no CMS: you write a Markdown file, open a pull request, and once it's reviewed and merged, it gets published.

See [CONTRIBUTING.md](CONTRIBUTING.md) for writing style and review expectations.

## Writing a post

1. Add a file at `posts/your-post-slug.md`. The filename becomes the post's URL, so keep it lowercase and hyphen-separated (e.g. `posts/optimizing-cache-coherency.md`).
2. Start the file with frontmatter, then the post body in plain Markdown:

```yaml
---
title: "Your Post Title"
date: "2026-01-01"
author: your-author-slug
category: "Operating Systems"
tags: ["Linux", "Scheduling"]
excerpt: "One or two sentences, ~160 characters. Shown on the blog index."
status: published
---

Your post body goes here, in Markdown. Raw HTML is also allowed and
rendered as-is.
```

| Field | Notes |
|---|---|
| `title` | Post title |
| `date` | `YYYY-MM-DD` |
| `author` | Your author slug. Ask a maintainer if you don't have one yet |
| `coAuthors` | Optional. A list of the slugs of further authors, e.g. `["author-one", "author-two"]` |
| `category` | One of the site's existing categories (check the blog for current ones) |
| `tags` | A short list, however many are actually relevant |
| `excerpt` | ~160 characters, shown on the blog index and used as the meta description |
| `status` | `published` or `draft`. Drafts don't appear on the live site, so you can merge a draft and finish it later |

### Adding an image

Put it in `images/`, as `.webp` (CI will reject anything else). Reference it from your post as `/content-images/your-image.webp`:

```markdown
![Alt text describing the image](/content-images/your-image.webp)
```

## Submitting

1. Fork this repository.
2. Clone your fork:
   ```bash
   git clone git@github.com:your-username/blog.git
   cd blog
   ```
3. Write your post (and any images), then commit and push to your fork:
   ```bash
   git add posts/your-post-slug.md images/your-image.webp
   git commit -m "Add post: Your Post Title"
   git push
   ```
4. Open a pull request from your fork into this repo's `main`.

CI checks your frontmatter and image formats automatically; a maintainer reviews the content itself. Once it's approved and merged, it's published to the live site.
