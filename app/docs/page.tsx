'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CTA } from '@/components/features/home/cta';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const installSteps = [
  {
    title: 'Create from repo (recommended)',
    commands: [
      'npx create-next-app -e https://github.com/jahzlariosa/nextjs-starter my-app',
      'cd my-app',
      'npm install',
    ],
  },
  {
    title: 'Clone directly',
    commands: [
      'git clone https://github.com/jahzlariosa/nextjs-starter.git my-app',
      'cd my-app',
      'npm install',
    ],
  },
];

const scripts = [
  { name: 'npm run dev', info: 'Start dev server (Turbopack) on http://localhost:3000' },
  { name: 'npm run build', info: 'Create production build' },
  { name: 'npm run start', info: 'Serve production build' },
  { name: 'npm run lint', info: 'Run ESLint with the project rules' },
];

const stackItems = [
  'Next.js 16 (App Router)',
  'TypeScript + strict types',
  'Tailwind CSS v4',
  'shadcn/ui (Radix + Tailwind)',
  'Framer Motion',
  'Theme toggle (next-themes)',
];

const pantheonDeployScripts = [
  {
    command: 'npm run deploy:main',
    info: 'Build + push HEAD to main (override with DEPLOY_BRANCH).',
  },
  {
    command: 'npm run deploy:pantheon:test',
    info: 'Build, tag pantheon_test_<timestamp>, push tag.',
  },
  {
    command: 'npm run deploy:pantheon:live',
    info: 'Build, tag pantheon_live_<timestamp>, push tag.',
  },
];

const wordpressCodeSnippets = [
  {
    title: "Shared GraphQL helper",
    description: "Central fetch utility with timeout + error normalization.",
    code: `const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    ...(token ? { Authorization: \`Bearer \${token}\` } : {}),
  },
  body: JSON.stringify({ query, variables }),
  cache: "no-store",
  signal: controller.signal,
});
return { data: json?.data, errors: json?.errors, status: response.status };`,
  },
  {
    title: "List API route",
    description: "Supports search + pagination and maps posts to a trimmed payload.",
    code: `const { data, errors } = await requestGraphQL({
  endpoint: WORDPRESS_GRAPHQL_URL ?? DEMO_URL,
  query: POSTS_QUERY,
  variables: { first, after, search },
});
return NextResponse.json({
  posts: data.posts.nodes.map(mapWordPressNode),
  pageInfo: data.posts.pageInfo,
});`,
  },
  {
    title: "Client list page hooks",
    description: "Re-usable fetch logic powering search + load more.",
    code: `const fetchPosts = useCallback(async ({ search, after, append }) => {
  const res = await fetch(\`/api/wordpress/posts?\${params}\`);
  const json = await res.json();
  setPosts((prev) => (append ? [...prev, ...json.posts] : json.posts));
}, []);`,
  },
];

export default function DocsPage() {
  const [copied, setCopied] = useState('');

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(''), 1200);
    } catch (err) {
      setCopied('error');
      setTimeout(() => setCopied(''), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-500">
      <Navbar />

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <section className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <Badge className="bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-200/70 dark:border-blue-800/70">
              Documentation
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold">Starter Guide</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Everything you need to install, run, and deploy this Next.js starter, plus links to the
              UI library tweaks we made.
            </p>
            <div className="flex justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/stack">See the Stack</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/stack">UI Components</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto mt-12 grid gap-6 lg:grid-cols-[2fr,1fr] items-start">
          <Card className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Install the starter</CardTitle>
              <CardDescription>
                Choose the path that fits your workflowâ€”`create-next-app` with this repo as the
                template, or a direct clone.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                {installSteps.map((step) => (
                  <div
                    key={step.title}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50"
                  >
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {step.title}
                    </p>
                    <pre className="mt-3 rounded-lg bg-slate-900 text-slate-100 text-xs p-3 overflow-x-auto">
                      <code>{step.commands.join('\n')}</code>
                    </pre>
                  </div>
                ))}
              </div>

              <div>
                <p className="font-semibold mb-2">Scripts</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {scripts.map((script) => (
                    <div
                      key={script.name}
                      className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-zinc-900 shadow-xs"
                    >
                      <p className="font-mono text-sm text-blue-700 dark:text-blue-200">
                        {script.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{script.info}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Stack + conventions</CardTitle>
              <CardDescription>What ships in this starter and how we style it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <ul className="space-y-2">
                {stackItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 space-y-1">
                <p className="font-semibold">UI library tweaks</p>
                <p>
                  Based on shadcn/ui, with data-slot attributes, focus-visible rings, and custom sheet
                  animations in <code>styles/globals.css</code>.
                </p>
                <Link
                  href="/stack"
                  className="text-blue-600 dark:text-blue-300 hover:underline font-semibold"
                >
                  View component reference &rarr;
                </Link>
              </div>
              <div className="pt-2 space-y-1">
                <p className="font-semibold">Deployment</p>
                <p>
                  Optimized for Pantheon (recommended), but works on Vercel, Netlify, or any platform
                  that runs Next.js 16.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto mt-12">
          <Card className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Pantheon deployment</CardTitle>
              <CardDescription>Scripts included for branch and tag-based deploys.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <p className="font-semibold">Use the built-in npm scripts (wraps <code>scripts/deploy.js</code>):</p>
              <div className="space-y-3">
                {pantheonDeployScripts.map((item) => (
                  <div
                    key={item.command}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <code className="bg-slate-900 text-slate-100 text-xs rounded-md px-3 py-2 w-full sm:w-auto">
                        {item.command}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.command)}
                        className="inline-flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {copied === item.command ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">{item.info}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <p>Notes:</p>
                <p>- Aborts on dirty working tree or existing tag.</p>
                <p>- Override tag via <code>TAG_NAME</code>, message via <code>TAG_MESSAGE</code>.</p>
                <p>- Requires git remote + creds configured.</p>
              </div>
              <Link
                href="https://docs.pantheon.io/nextjs"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-300 hover:underline font-semibold"
              >
                Pantheon Next.js docs &rarr;
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto mt-12">
          <Card className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">WordPress GraphQL demo</CardTitle>
              <CardDescription>
                Explore the built-in CMS integration: search, paginate, and open posts fetched via WordPress GraphQL.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <p>
                The `/wordpress` route showcases a complete headless workflow: our `/api/wordpress/posts`
                endpoint powers a modern card grid with search, load-more pagination, and deep linking
                to `/wordpress/[slug]`. Everything falls back to the Pantheon demo endpoint, or you can
                set <code>WORDPRESS_GRAPHQL_URL</code> in <code>.env.local</code> to point at your site.
              </p>
              <p>
                See <code>docs/wordpress-api.md</code> for request parameters, response shapes, and how to
                reuse the React components or GraphQL helpers inside your own routes.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {wordpressCodeSnippets.map((snippet) => (
                  <div
                    key={snippet.title}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 shadow-xs"
                  >
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{snippet.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{snippet.description}</p>
                    <pre className="mt-3 rounded-lg bg-slate-900 text-slate-100 text-[0.65rem] leading-relaxed p-3 overflow-x-auto">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/wordpress">View demo</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/api/wordpress/posts">List API</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/api/wordpress/posts/hello-world">Single API</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto mt-12 grid gap-6 md:grid-cols-2">
          <Card className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Project structure</CardTitle>
              <CardDescription>Key folders you will work with.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p><code>/app</code> — routes (App Router) and pages like home, stack, docs.</p>
              <p><code>/components</code> — shared layout + shadcn/ui components.</p>
              <p><code>/data</code> — static content used by sections.</p>
              <p><code>/styles/globals.css</code> — Tailwind config, CSS variables, sheet animations.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Next steps</CardTitle>
              <CardDescription>Where to go from here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <p>1) Start the dev server and customize content in <code>/data</code> and UI in <code>/components</code>.</p>
              <p>2) Add your branding (logo, colors) in <code>styles/globals.css</code> and layout components.</p>
              <p>3) Deploy to Pantheon or your preferred host after running <code>npm run build</code>.</p>
            </CardContent>
          </Card>
        </section>
      </main>

      <CTA />
      <Footer />
    </div>
  );
}
