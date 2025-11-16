# Portfolio Blog Starter

This is a porfolio site template complete with a blog. Includes:

- MDX and Markdown support
- Optimized for SEO (sitemap, robots, JSON-LD schema)
- RSS Feed
- Dynamic OG images
- Syntax highlighting
- Tailwind v4
- Vercel Speed Insights / Web Analytics
- Geist font
- Notion integration with auto-sync
- Multi-language support (Korean/English)
- Gemini AI translation
- S3 image hosting with automatic optimization
- GitHub Discussions comments (Giscus)

## Demo

https://portfolio-blog-starter.vercel.app

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Notion API (Required)
NOTION_API_KEY=secret_xxx
NOTION_DATABASE_ID=xxx

# Gemini API (Optional - for auto-translation)
GEMINI_API_KEY=xxx

# AWS S3 (Optional - for image hosting)
S3_BUCKET_NAME=your-blog-images
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
CLOUDFRONT_DOMAIN=xxx.cloudfront.net  # Optional - for CDN

# Giscus Comments (Optional - for blog comments)
NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=R_xxx
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxx
```

See `.env.example` for a complete list of environment variables.

### AWS S3 Setup (Optional)

If you want to host images on S3:

1. Create an S3 bucket in AWS
2. Set up IAM credentials with S3 write permissions
3. (Optional) Set up CloudFront CDN for faster image delivery
4. Add AWS credentials to `.env.local`

Without S3 configuration, images will use Notion's URLs (which expire after 1 hour).

### Giscus Comments Setup (Optional)

To enable GitHub Discussions-based comments:

1. Enable **Discussions** in your GitHub repository (Settings → Features)
2. Install [Giscus App](https://github.com/apps/giscus) to your repository
3. Go to [giscus.app](https://giscus.app) and configure your settings
4. Add the generated values to `.env.local`

See [GISCUS_SETUP.md](./GISCUS_SETUP.md) for detailed instructions.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/blog&project-name=blog&repository-name=blog)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/blog blog
```

Then, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/templates) ([Documentation](https://nextjs.org/docs/app/building-your-application/deploying)).
# jindol-blog
