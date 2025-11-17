# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands & workflows

This project is a Next.js App Router site managed with `pnpm`.

### Install & local development

- Install dependencies:
  - `pnpm install`
- Run the development server:
  - `pnpm dev`
- Run the production server (after building):
  - `pnpm start`

### Build & Notion sync

The build pipeline is coupled to a Notion → MDX sync step.

- Build (runs Notion sync via `prebuild`):
  - `pnpm build`
  - This executes `scripts/sync-notion.ts` before `next build`, pulling posts from Notion and writing MDX files under `app/blog/posts`.
- Run Notion sync only (no Next.js build):
  - `pnpm sync-notion`
- Sync from Notion and create a Git commit for changed posts and translation cache:
  - `pnpm sync-and-commit`
    - Equivalent to `pnpm sync-notion && pnpm commit-notion`.

> There is currently no dedicated lint or test script configured in `package.json`.

### Environment configuration

Local development and the Notion/translation/image pipelines depend on `.env.local` in the project root.

Core variables (see `.env.example` for the full list):

- Notion (required for sync):
  - `NOTION_API_KEY`
  - `NOTION_DATABASE_ID`
- Gemini (optional, auto-translation):
  - `GEMINI_API_KEY`
- AWS S3 & optional CloudFront (optional, image hosting):
  - `S3_BUCKET_NAME`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
  - `CLOUDFRONT_DOMAIN` (optional)
- Giscus (GitHub Discussions comments, used in `app/components/comments.tsx`):
  - `NEXT_PUBLIC_GISCUS_REPO`
  - `NEXT_PUBLIC_GISCUS_REPO_ID`
  - `NEXT_PUBLIC_GISCUS_CATEGORY`
  - `NEXT_PUBLIC_GISCUS_CATEGORY_ID`

## High-level architecture

### Overall structure

- Next.js App Router application with root in `app/`.
- Styling is driven by Tailwind CSS v4 and custom global styles in `app/global.css` (including glassmorphism for cards and syntax highlighting styles for MDX content).
- The site is a portfolio + blog:
  - Home page at `app/page.tsx`.
  - Blog index at `app/blog/page.tsx`.
  - Blog detail pages at `app/blog/[slug]/page.tsx`.

#### Layout & shell (`app/layout.tsx`)

- Applies the Geist Sans/Mono fonts and a global Apple-style gradient background.
- Wraps all pages with:
  - `Navbar` (`app/components/nav.tsx`): top navigation + language switcher.
  - `Footer` (`app/components/footer.tsx`): links to RSS, GitHub, and the Vercel template.
  - Vercel Analytics (`@vercel/analytics/react`) and Speed Insights (`@vercel/speed-insights/next`).
- Sets `metadata` for the site using `baseUrl` from `app/sitemap.ts` (Open Graph, robots, etc.).

### Blog content model

#### Storage & loading

- Blog posts are stored as MDX files under `app/blog/posts`.
  - Language-specific folders: `app/blog/posts/ko` and `app/blog/posts/en`.
  - Each file contains YAML frontmatter followed by MDX content.
- `app/blog/utils.ts` is the central blog utility module:
  - Parses frontmatter (`title`, `publishedAt`, `summary`, optional `image`).
  - Reads MDX files from the language-specific directory.
  - `getBlogPosts(lang)` returns an array of `{ metadata, slug, content }` for a given language, falling back to a non-language-specific `posts` directory if needed.
  - `formatDate` formats dates for display and supports an optional relative label ("x d ago" etc.).

#### Pages and components

- `app/page.tsx` (Home):

  - Determines the user language (see **Language detection & switching** below).
  - Uses `next-intl`'s `getTranslations({ locale, namespace: "home" })` for localized heading/description.
  - Renders recent posts via `<BlogPosts lang={lang} />`.

- `app/blog/page.tsx` (Blog index):

  - Determines `lang` the same way and renders `<BlogPosts lang={lang} />`.

- `app/components/posts.tsx` (`BlogPosts`):

  - Fetches posts via `getBlogPosts(lang)` and sorts them by `publishedAt` descending.
  - Renders each as a glassmorphism-style card linking to `/blog/[slug]?lang={lang}`.

- `app/blog/[slug]/page.tsx` (Blog detail):

  - `generateStaticParams()` builds static paths by reading posts from both `ko` and `en` folders and deduplicating by `slug`.
  - `generateMetadata()`:
    - Uses `getUserLanguage` to pick the language-specific version of the post, with fallback to the other language if missing.
    - Builds Open Graph and Twitter metadata, including dynamic OG image URLs derived from `baseUrl`.
    - Sets language-specific `alternates.languages` URLs.
  - The page component:
    - Determines the user language again and resolves the appropriate post, with language fallback.
    - Injects structured data (`BlogPosting` JSON-LD) via an inline `<script type="application/ld+json">`.
    - Renders content via `<CustomMDX source={post.content} />`.
    - Appends a `<Comments lang={lang} />` section using Giscus.

- `app/components/mdx.tsx` (`CustomMDX`):
  - Wraps `next-mdx-remote/rsc` and wires up custom components:
    - Heading components that auto-generate slugs and anchor links.
    - Link handling that distinguishes internal routes (`<Link>`), hash links, and external links (open in new tab).
    - `Image` component with rounded, shadowed images.
    - Code highlighting using `sugar-high` with HTML injected via `dangerouslySetInnerHTML` into `<code>`.
    - A simple `Table` component for structured data.
  - Global typography, code, and layout for MDX content are refined in `app/global.css`.

### Internationalization & language handling

The project has two layers of i18n: UI text via `next-intl` and content-language routing/cookies.

- `app/lib/language.ts` (`getUserLanguage`):

  - Priority order for determining language:
    1. `NEXT_LOCALE` cookie.
    2. `lang` query parameter (e.g. `/blog/slug?lang=ko`).
    3. `Accept-Language` header (with q-factors considered; Korean if the primary language starts with `ko`).
    4. Fallback to `"en"`.
  - Used in the home page, blog index, blog detail, and navbar to keep language consistent.

- `app/actions/language.ts` (`setLanguageCookie`):

  - Server action that sets the `NEXT_LOCALE` cookie with a 1-year lifetime.

- `app/components/language-switcher.tsx` (`LanguageSwitcher`):

  - Client component ("use client") rendered in the navbar.
  - When the select value changes, calls `setLanguageCookie` and then triggers `router.refresh()` via `useTransition`.
  - Expects a `lang` prop (`"ko" | "en"`) as the current language.

- `app/components/nav.tsx` (`Navbar`):
  - Server component that calls `getUserLanguage()` (no explicit `searchParams`) to derive the current language for `LanguageSwitcher`.
  - Defines a small set of nav links (`/`, `/blog`, and an external "deploy" link).

### Notion → MDX content pipeline

The Notion sync and translation pipeline is implemented in `scripts/` and is tightly integrated with the build.

#### `scripts/sync-notion.ts`

- Entrypoint for syncing a Notion database to local MDX files.
- Reads `.env.local` (if present) via `dotenv`.
- Validates that `NOTION_API_KEY` and `NOTION_DATABASE_ID` are set; exits with an error if missing.
- Warns (but does not fail) if `GEMINI_API_KEY` is missing, in which case only Korean content is generated.
- Initializes the Notion client and queries the target database, with a fallback sort strategy if the configured `createDate` sort fails.
- For each page returned:
  - Extracts metadata and slug via `extractMetadata` from `scripts/notion-to-markdown.ts`.
  - Converts the page to Markdown via `convertPageToMarkdown`, which also runs image URL replacement (see below).
  - Ensures `app/blog/posts/ko` and `app/blog/posts/en` directories exist.
  - Writes a Korean MDX file (`ko/{slug}.mdx`) with frontmatter generated by `generateFrontmatter`.
  - If `GEMINI_API_KEY` is set, calls `getTranslation` (from `scripts/translate.ts`) to produce an English MDX variant (`en/{slug}.mdx`).
- On errors while fetching or converting, logs details but attempts to continue for other pages.
- On a fatal error, logs details, prints some hints, and explicitly exits with `0` so the Next.js build can continue using existing local files.

#### `scripts/notion-to-markdown.ts`

- Wraps the `notion-to-md` library to convert Notion pages into Markdown while applying project-specific transformations:
  - Custom transformers for `callout` and `toggle` blocks to output Markdown/HTML friendly to the blog.
  - `extractMetadata(page)` builds `PageMetadata` with:
    - `title` from several possible title properties.
    - `publishedAt` from several possible date properties, falling back to `created_time`.
    - `tags` from various multi-select/select fields.
    - `language` defaulting to `"ko"`.
    - `slug` derived from the Notion page ID (UUID without hyphens).
  - `generateFrontmatter(metadata)` produces the YAML frontmatter used by the blog.
  - `convertPageToMarkdown`:
    - Converts blocks to Markdown using `NotionToMarkdown`.
    - Normalizes the returned structure into a string.
    - Calls `replaceImageUrls(markdown, slug)` from `scripts/upload-images.ts` to replace Notion image URLs with S3 URLs when configured.

#### `scripts/upload-images.ts`

- Handles downloading Notion-hosted images, optimizing them, storing them in S3, and caching mappings.
- Key responsibilities:
  - Initializes an `S3Client` based on `AWS_REGION` (default `ap-northeast-2`).
  - Maintains a persistent cache in `.upload-cache.json` mapping a `slug:hash` key to an S3 URL.
  - `optimizeImage` uses `sharp` to resize and convert to WebP.
  - `uploadToS3` uploads with a retry/exponential-backoff strategy and constructs either a CloudFront URL (if `CLOUDFRONT_DOMAIN` is set) or a direct S3 URL.
  - `uploadImageToS3` downloads the original Notion image, computes a hash, checks the cache, optimizes, uploads, and updates the cache.
  - `replaceImageUrls(markdown, slug)` scans Markdown for image URLs that look like Notion/S3 temporary URLs and replaces them with the S3/CloudFront URLs.
    - If `S3_BUCKET_NAME` or `AWS_ACCESS_KEY_ID` are not set, it logs and returns the original Markdown without modification.

#### `scripts/translate.ts`

- Implements Gemini-powered translation and a translation cache.
- Loads `.env.local` and reads `GEMINI_API_KEY`.
- If the key is missing, logs a warning and effectively disables translation.
- Uses `@google/generative-ai` to call the `gemini-2.5-flash` model with a detailed prompt that:
  - Preserves Markdown structure and code blocks.
  - Translates frontmatter `title` and `summary` while switching `language` to `"en"`.
- Stores translation cache in `.translation-cache.json` keyed by slug, with a hash of the source content.
  - Before translating, `needsTranslation` compares the current content hash to decide if retranslation is necessary.

#### `scripts/git-commit.ts`

- Automates committing Notion-synced content.
- Stages `app/blog/posts/ko`, `app/blog/posts/en`, and `.translation-cache.json` (if present).
- If there are staged changes, creates a commit with a timestamped message (`chore: sync blog posts from Notion [...]`).
- Optionally pushes to the remote if `GIT_PUSH=true` or `CI=true` is set; otherwise logs a hint to run `git push` manually.

## SEO, feeds, and metadata

- `app/sitemap.ts`:
  - Exports `baseUrl` (currently pointing to the template domain; update this when deploying under a different domain).
  - Builds the sitemap entries from static routes (`/`, `/blog`) and all blog posts via `getBlogPosts()`.
- `app/robots.ts`:
  - Uses `baseUrl` to expose the sitemap at `${baseUrl}/sitemap.xml`.
- `app/rss/route.ts`:
  - Generates an RSS feed using `getBlogPosts()` and `baseUrl`.
  - Sorts posts by `publishedAt` and emits standard RSS `<item>` elements.
- `app/og/route.tsx`:
  - Dynamic OG image endpoint based on a `title` query parameter, used by blog metadata as a fallback when no explicit `image` is provided.
- `app/not-found.tsx`:
  - Custom 404 page with the same glassmorphism styling as the rest of the site.

## Comments system

- `app/components/comments.tsx` integrates Giscus as a client component.
- The component:
  - Accepts `lang` (`"ko" | "en"`) and passes the appropriate locale to Giscus (`ko` or `en`).
  - Uses environment variables `NEXT_PUBLIC_GISCUS_*` to configure the GitHub repository, category, and IDs.
- Blog detail pages append this component under the article content so that each post has its own GitHub Discussions thread mapped by pathname.

## Notes for future Warp agents

- When making changes that affect content generation (any `scripts/*.ts` file, or `app/blog/utils.ts`), it is often useful to:
  - Run `pnpm sync-notion` to regenerate MDX from Notion.
  - Inspect the generated files under `app/blog/posts/{ko,en}` to verify frontmatter and MDX output.
- If the build fails due to Notion or translation issues, check:
  - `.env.local` for required keys.
  - `.upload-cache.json` and `.translation-cache.json` for unexpected contents.
- When changing the deployment domain, update `baseUrl` in `app/sitemap.ts` so that metadata, sitemap, RSS, and OG URLs are consistent.
