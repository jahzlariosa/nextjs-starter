# Next.js Starter

Modern, production-ready Next.js 16 starter with **shadcn/ui**, **Tailwind CSS v4**, **Framer Motion**, and a Pantheon-friendly deployment workflow.

## Features

- **Next.js 16 / App Router** with Turbopack dev server.
- **TypeScript** + strict configs, eslint + prettier.
- **Tailwind CSS v4** theme tokens plus `styles/globals.css` for custom sheet animations.
- **shadcn/ui** components with data-slot attributes, focus-visible rings, and interaction demos.
- **Framer Motion** for reveals/hover animations; guidance lives on the `/stack` page.
- **Dark mode** via `next-themes` and shared ThemeToggle component.
- **Docs & Stack pages** explaining features, components, and Pantheon workflows.

## App Pages

| Route      | Description                                                                 |
| ---------- | ---------------------------------------------------------------------------- |
| `/`        | Marketing hero, feature tiles, CTA, and footer.                              |
| `/stack`   | Unified feature + component catalogue with live demos and motion notes.      |
| `/docs`    | Starter guide, Pantheon deployment instructions, and project structure.      |

## Getting Started

```bash
git clone https://github.com/jahzlariosa/nextjs-starter.git
cd nextjs-starter
npm install
npm run dev
# open http://localhost:3000
```

## Pantheon Deployment (recommended)

`package.json` includes scripts that wrap `scripts/deploy.js` to ensure clean builds and consistent naming. Each script runs `npm run build` before pushing.

| Command                      | Description                                                          |
| ---------------------------- | -------------------------------------------------------------------- |
| `npm run deploy:main`        | Build then push `HEAD` to `main` (override branch via `DEPLOY_BRANCH`). |
| `npm run deploy:pantheon:test` | Build, create `pantheon_test_<timestamp>` tag, push tag to origin.    |
| `npm run deploy:pantheon:live` | Build, create `pantheon_live_<timestamp>` tag, push tag to origin.    |

Notes:

- Script aborts if the working tree is dirty or the tag already exists.
- Override tag/message with `TAG_NAME` / `TAG_MESSAGE`.
- Requires git remote + credentials configured.
- Official Pantheon docs: https://docs.pantheon.io/nextjs

## Other Deployment Targets

- **Vercel** – native Next.js support, zero-config.
- **Netlify** – use Next runtime or edge functions.
- **Docker/Anywhere** – `npm run build && npm run start` inside your container/image.

## Documentation & Resources

- Next.js docs: https://nextjs.org/docs
- shadcn/ui: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com/docs
- Pantheon Next.js guide: https://docs.pantheon.io/nextjs

## Author

**Jahz** – [@jahzlariosa](https://github.com/jahzlariosa)

## License

MIT – see [LICENSE](LICENSE).
