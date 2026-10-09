---
title: "Writing for the Blog"
date: "2026-07-25"
author: syed-taha
category: "Announcements"
tags: ["Announcements"]
excerpt: "How to fork, write, and submit a post, and a full reference for the Markdown this blog renders, including math."
status: published
---

If you've got something worth writing about, here's the whole path: how the post you're reading right now got published, how to write your own, and a reference for everything you can put in it.

## How posts get here

There's no login, no dashboard, no "new post" button on this site. Every post you read here is a Markdown file that lived in a pull request first. The source lives at [github.com/systems-resarch-at-iba/blog](https://github.com/systems-resarch-at-iba/blog), a separate repository from the website itself, and that's the only way anything gets published.

### 1. Fork the repository

Go to [github.com/systems-resarch-at-iba/blog](https://github.com/systems-resarch-at-iba/blog) and fork this repository. Writers don't get push access to the main repo directly; working from a fork is what lets anyone contribute without needing that access, and keeps the main repo's branch list free of one branch per post.

```bash
git clone git@github.com:your-username/blog.git
cd blog
```

### 2. Add your post

Create a new file at `posts/your-post-slug.md`. The filename becomes the post's URL, so keep it lowercase and hyphen separated, for example `posts/optimizing-cache-coherency.md` will publish at `/blog/optimizing-cache-coherency`.

Every post starts with a frontmatter block: a fenced section of `key: value` pairs between two `---` lines, before anything else in the file. Here's a complete one:

```yaml
---
title: "Your Post Title"
date: "2026-01-01"
author: your-author-slug
category: "Operating Systems"
tags: ["Linux", "Scheduling"]
excerpt: "One or two sentences, around 160 characters. Shown on the blog index and as the page's meta description."
status: published
---
```

What each field actually does:

- **title**: the post's headline, shown at the top of the page and in the browser tab.
- **date**: `YYYY-MM-DD`. Used for sorting the blog index newest first.
- **author**: your author slug, not your display name. If you don't have one yet, ask a maintainer to add you before opening your PR; don't invent one or use someone else's.
- **coAuthors**: optional. A list of the author slugs of everyone else who wrote the post, for example `["author-one", "author-two"]`. Each name appears in the byline and in the author box at the bottom of the post.
- **category**: the single primary topic, shown on the post and used to group posts on the blog index. Use one of the categories already in use rather than inventing a new one for a single post; skim a couple of existing posts to see what's there.
- **tags**: a short list of more specific keywords. There's no fixed list; use however many are actually relevant.
- **excerpt**: the one- or two-sentence summary shown on the blog index card and used as the page's meta description. This is often the first thing someone reads before deciding to click in, so write it as an actual summary, not a placeholder.
- **status**: `published` or `draft`. A draft is invisible on the live site (not listed, and not reachable by its URL either) but can still be merged, so you can land a work in progress and finish the writing later without anyone seeing it early.

After the closing `---`, write your post body in plain Markdown. Raw HTML is also allowed and rendered as is, but Markdown should be your default; save HTML for the rare case Markdown genuinely can't express.

> Make sure you read README.md and CONTRIBUTING.md before writing.

### 3. Commit and push to your fork

```bash
git add posts/your-post-slug.md
git commit -m "Add post: Your Post Title"
git push
```

If your post includes an image, add it in the same commit:

```bash
git add posts/your-post-slug.md images/your-image.webp
git commit -m "Add post: Your Post Title"
git push
```

### 4. Open a pull request

Create a pull request from your fork, targeting this repo's `main` branch. Once it's open, two things happen: CI automatically checks your frontmatter fields and image formats, and a maintainer reviews the actual writing. Small wording fixes can happen right on the PR; anything about scope or accuracy is worth discussing before it's approved. Once it's approved and merged, it's live.

## Style reference

Everything below is real Markdown, rendered exactly as it will look in your own post once you write it the same way.

### Headings

Use `##` and `###` for section headers. For example: 

## This is a level 2 heading.

### This is a level 3 heading.

Every one of them shows up automatically in the "On this page" sidebar next to the article, in order, so structure your headings the way you'd want that outline to read. Don't use a single `#` anywhere in your body: that's reserved for the post title itself, which is rendered separately above your content, not something you write inline.

### Text formatting

**You can make your text bold**. *You can also make it italic*. `Inline code` and [links](https://github.com/systems-resarch-at-iba) work too.

### Code blocks

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

> The language tag (`cpp` above) drives syntax highlighting, so always include it. Keep examples short and representative of the point you're making rather than pasting an entire file; a reader should be able to see what matters at a glance.

You can also add quotes, as shown above using `>`.

### Images

Put the image in `images/` as `.webp`, then reference it from your post like this:

```markdown
![A short, real description of the image](/content-images/your-image.webp)
```

![A sample image that reads Hello, World](/content-images/hello-world.webp)

Write actual alt text describing what's in the image. "Diagram" or the filename isn't a description, and it's the only version of the image some readers get.

### Lists

Unordered:

- First point
- Second point

Ordered:

1. First step
2. Second step

### Tables

Separate the columns with pipes and put a row of dashes under the header. A colon in the dashes sets the alignment of a column:

```markdown
| Left aligned | Centred      | Right aligned |
|:-------------|:------------:|--------------:|
| First cell   | Second cell  | 1             |
| Another cell | Another cell | 20            |
```

That renders as:

| Left aligned | Centred | Right aligned |
|:---|:---:|---:|
| First cell | Second cell | 1 |
| Another cell | Another cell | 20 |

Right-align numeric columns so the digits line up, and keep the header cells short.

### Math

Rendered with KaTeX. Inline, using single dollar signs: the quadratic formula, $x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$, solves $ax^2 + bx + c = 0$ for $x$.

Block level, using double dollar signs on their own lines:

$$
a^2 + b^2 = c^2
$$

Matrices work too:

$$
\begin{bmatrix} a & b \\ c & d \end{bmatrix}
\begin{bmatrix} x \\ y \end{bmatrix}
=
\begin{bmatrix} ax + by \\ cx + dy \end{bmatrix}
$$

Fractions, Greek letters, sums, and matrices all work, the same as any LaTeX document.
