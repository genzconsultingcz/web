# Tina Starter 🦙

![tina-nextjs-starter-demo](https://user-images.githubusercontent.com/103008/130587027-995ccc45-a852-4f90-b658-13e8e0517339.gif)

This Next.js starter is powered by [TinaCMS](https://app.tina.io) for you and your team to visually live edit the structured content of your website. ✨

The content is managed through Markdown and JSON files stored in your GitHub repository, and queried through Tina GraphQL API.

### Features

- [Tina Headless CMS](https://app.tina.io) for authentication, content modeling, visual editing and team management.
- [Vercel](https://vercel.com) deployment to visually edit your site from the `/admin` route.
- Local development workflow from the filesystem with a local GraqhQL server.

## Requirements

- Git, [Node.js Active LTS](https://nodejs.org/en/about/releases/), pnpm installed for local development.
- A [TinaCMS](https://app.tina.io) account for live editing.

## Local Development

Install the project's dependencies:

> [!NOTE]  
> [Do you know the best package manager for Node.js?](https://www.ssw.com.au/rules/best-package-manager-for-node/) Using the right package manager can greatly enhance your development workflow. We recommend using pnpm for its speed and efficient handling of dependencies. Learn more about why pnpm might be the best choice for your projects by checking out this rule from SSW.


```
pnpm install
```

Run the project locally:

```
pnpm dev
```

### Local URLs

- http://localhost:3000 : browse the website
- http://localhost:3000/admin : connect to Tina Cloud and go in edit mode
- http://localhost:3000/exit-admin : log out of Tina Cloud
- http://localhost:4001/altair/ : GraphQL playground to test queries and browse the API documentation

## Deployment

### Cloudflare Pages (OpenNext)

This project deploys to Cloudflare using the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare) (`@opennextjs/cloudflare`) + Wrangler. This keeps the full Next.js runtime (middleware, API route, server components, rewrites) intact — so TinaCMS content queried by server components and the `/admin` route continue to work.

Configuration files:
- `wrangler.jsonc` — Worker config (`nodejs_compat` + assets binding are required).
- `open-next.config.ts` — OpenNext Cloudflare adapter config.

#### Local preview (production-accurate on the Workers runtime)

```
npm run preview
```

Builds the app via OpenNext and serves it locally with `wrangler dev`. Secrets go in `.dev.vars` (gitignored).

#### Deploy via CLI

```
npm run deploy
```

#### Deploy from the Cloudflare dashboard (connected Git repo)

1. Create a **Workers** project connected to this repo.
2. Set the build command to: `pnpm opennextjs-cloudflare build`
3. Add environment variables from your [Tina Cloud](https://app.tina.io) project and Cloudflare dashboard:
   - `NEXT_PUBLIC_TINA_CLIENT_ID`
   - `TINA_TOKEN`
   - `NEXT_PUBLIC_TINA_BRANCH` (e.g. `main`)
   - `RESEND_API_KEY`
4. The `build` script runs `tinacms build && next build`; OpenNext then compiles `.open-next/` output that Wrangler deploys.

> [!NOTE]
> `@opennextjs/cloudflare` requires `next >= 15.5.21`. Image optimization is set to `unoptimized: true` so it works on the free plan without the paid `IMAGES` binding.

> [!IMPORTANT]
> GitHub Pages cannot run server-side code and is not the target for this repository — the GitHub Actions `build-and-deploy.yml` workflow will not work. Remove `.github/workflows/` if you don't need it.

### Building the Starter Locally (Using the hosted content API)

Replace the `.env.example`, with `.env`

```
NEXT_PUBLIC_TINA_CLIENT_ID=<get this from the project you create at app.tina.io>
TINA_TOKEN=<get this from the project you create at app.tina.io>
NEXT_PUBLIC_TINA_BRANCH=<Specify the branch with Tina configured>
```

Build the project:

```bash
pnpm build
```

## Getting Help

To get help with any TinaCMS challenges you may have:

- Visit the [documentation](https://tina.io/docs/) to learn about Tina.
- [Join our Discord](https://discord.gg/zumN63Ybpf) to share feedback.
- Visit the [community forum](https://community.tinacms.org/) to ask questions.
- Get support through the chat widget on the TinaCMS Dashboard
- [Email us](mailto:support@tina.io) to schedule a call with our team and share more about your context and what you're trying to achieve.
- [Search or open an issue](https://github.com/tinacms/tinacms/issues) if something is not working.
- Reach out on Twitter at [@tina_cms](https://twitter.com/tina_cms).

## Development tips

### Visual Studio Code GraphQL extension

[Install the GraphQL extension](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) to benefit from type auto-completion.

### Typescript

A good way to ensure your components match the shape of your data is to leverage the auto-generated TypeScript types.
These are rebuilt when your `tina` config changes.

## LICENSE

Licensed under the [Apache 2.0 license](./LICENSE).


# Repository cleaned of LFS content
# Repository cleaned of LFS content - Wed Sep 17 15:00:42 AEST 2025

