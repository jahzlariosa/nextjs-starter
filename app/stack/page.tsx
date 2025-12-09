'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CTA } from '@/components/features/home/cta';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { features as starterFeatures } from '@/data/home';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

type ComponentDoc = {
  name: string;
  file: string;
  description: string;
  usage: string;
  notes: string[];
};

const featureExamples: Record<
  string,
  {
    heading: string;
    code: string;
    note?: string;
  }
> = {
  'Lightning Fast': {
    heading: 'Edge-ready performance',
    code: `export const runtime = 'edge';

export async function generateStaticParams() {
  return fetch('https://api.example.com/routes').then((res) => res.json());
}

export default function Page() {
  return <main className="min-h-screen">Ship fast on the edge.</main>;
}`,
    note: 'Next.js 16 + Turbopack tuned for edge.',
  },
  'Smooth Animations': {
    heading: 'Framer Motion reveal',
    code: `import { motion } from 'framer-motion';

export function RevealCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl border p-4"
    >
      {children}
    </motion.div>
  );
}`,
  },
  'Type Safe': {
    heading: 'Typed data fetching',
    code: `type User = { id: string; email: string };

async function getUsers(): Promise<User[]> {
  const res = await fetch('/api/users');
  if (!res.ok) throw new Error('Failed to load users');
  return res.json() as Promise<User[]>;
}`,
    note: 'Strict TypeScript keeps data contracts honest.',
  },
  Responsive: {
    heading: 'Responsive grid utility',
    code: `const grid = 'grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

export function CardGrid({ children }) {
  return <div className={grid}>{children}</div>;
}`,
    note: 'Mobile-first breakpoints baked into Tailwind classes.',
  },
};

const componentDocs: ComponentDoc[] = [
  {
    name: 'Button',
    file: 'components/ui/button.tsx',
    description: 'Variants powered by class-variance-authority with focus-visible ring.',
    usage: `import { Button } from '@/components/ui/button';

<Button variant="default">Primary</Button>
<Button variant="outline" size="sm">Secondary</Button>`,
    notes: [
      'Includes icon sizing helpers via CSS for consistent spacing.',
      'Data-slot attributes keep components easy to target in tests or themes.',
    ],
  },
  {
    name: 'Card',
    file: 'components/ui/card.tsx',
    description: 'Composable card sections with header/content/footer slots.',
    usage: `import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Stats</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>`,
    notes: ['Uses rounded-xl and subtle shadow for the starter aesthetic.'],
  },
  {
    name: 'Dialog',
    file: 'components/ui/dialog.tsx',
    description: 'Radix Dialog with themed overlay and optional close button.',
    usage: `import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>Modal body</DialogContent>
</Dialog>`,
    notes: [
      'Overlay + content use data attributes for state styling.',
      'Close button can be disabled via showCloseButton prop.',
    ],
  },
  {
    name: 'Sheet',
    file: 'components/ui/sheet.tsx',
    description: 'Radix-based slide-out with custom CSS keyframes for smooth entry/exit.',
    usage: `import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

<Sheet>
  <SheetTrigger asChild><Button>Open</Button></SheetTrigger>
  <SheetContent side="right">Drawer content</SheetContent>
</Sheet>`,
    notes: [
      'Custom keyframes live in styles/globals.css to force a real slide animation.',
      'Data-side attributes control direction (top/right/bottom/left).',
    ],
  },
  {
    name: 'Tabs',
    file: 'components/ui/tabs.tsx',
    description: 'Radix Tabs styled with muted backgrounds and focus-visible rings.',
    usage: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

<Tabs defaultValue="a">
  <TabsList>
    <TabsTrigger value="a">A</TabsTrigger>
    <TabsTrigger value="b">B</TabsTrigger>
  </TabsList>
  <TabsContent value="a">Tab A</TabsContent>
  <TabsContent value="b">Tab B</TabsContent>
</Tabs>`,
    notes: ['Triggers keep icon sizing consistent via shared utility classes.'],
  },
];

export default function StackPage() {
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
              Stack Overview
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold">Features + Components</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Explore the starter's capabilities and the UI library powering it—all in one place.
              Built on shadcn/ui, Framer Motion, and Tailwind v4.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/docs">Get Started</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <a
                  href="https://ui.shadcn.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:no-underline"
                >
                  shadcn/ui Docs
                </a>
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto mt-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Starter Features</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Production-ready pieces bundled into this template with modern tooling.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {starterFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className="group p-6 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-xl backdrop-blur"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Included
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                {featureExamples[feature.title] && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="mt-4 inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        View code example
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                      <DialogHeader>
                        <DialogTitle>{featureExamples[feature.title].heading}</DialogTitle>
                        <DialogDescription>
                          {featureExamples[feature.title].note ?? feature.description}
                        </DialogDescription>
                      </DialogHeader>
                      <pre className="mt-4 rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto">
                        <code>{featureExamples[feature.title].code}</code>
                      </pre>
                    </DialogContent>
                  </Dialog>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container mx-auto mt-16 grid gap-6 lg:grid-cols-[2fr,1fr] items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-zinc-900/80 shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-300 uppercase tracking-wide">
                  Interactive patterns
                </p>
                <h2 className="text-2xl font-bold mt-1">Drawer + dialog in one place</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Preview the core shadcn primitives we tuned: sheet slide-out and modal with theme-aware styling.
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-semibold">
                UI
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="lg" className="w-full">
                    Open drawer
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Responsive layout preview</SheetTitle>
                    <SheetDescription>
                      Uses custom keyframes in <code>styles/globals.css</code> for a true slide.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-4 space-y-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="h-20 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-slate-200 dark:border-slate-800" />
                      <div className="h-20 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-slate-200 dark:border-slate-800" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                      <div className="h-16 rounded-lg bg-slate-100 dark:bg-slate-800" />
                      <div className="h-16 rounded-lg bg-slate-100 dark:bg-slate-800" />
                      <div className="h-16 rounded-lg bg-slate-100 dark:bg-slate-800" />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="w-full">
                    Open dialog
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Theme toggle hook-up</DialogTitle>
                    <DialogDescription>Wrap the app and drop the toggle anywhere.</DialogDescription>
                  </DialogHeader>
                  <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto">
                    <code>{`// app/layout.tsx
<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>

// anywhere in UI
import { ThemeToggle } from '@/components/theme-toggle';

export function Actions() {
  return <ThemeToggle />;
}`}</code>
                  </pre>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Code sample</p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-xs p-4 overflow-x-auto">
                <code>{`import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';

export function InteractivePatterns() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="lg" className="w-full">Open drawer</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Responsive layout preview</SheetTitle>
            <SheetDescription>Custom keyframes in styles/globals.css drive the slide.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg" className="w-full">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Themed modal</DialogTitle>
            <DialogDescription>Uses Radix + our theme tokens.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}`}</code>
              </pre>
            </div>
          </motion.div>

          <Card className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Starter tweaks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <div>
                <p className="font-semibold">Data slots everywhere</p>
                <p>Each component has <code>data-slot</code> for testing, theming, and selectors.</p>
              </div>
              <div>
                <p className="font-semibold">Focus + accessibility</p>
                <p>Buttons, tabs, and inputs share focus-visible rings tied to theme tokens.</p>
              </div>
              <div>
                <p className="font-semibold">Sheet animation</p>
                <p>Custom keyframes + data-side transforms ensure a real slide instead of a pop.</p>
              </div>
              <div>
                <p className="font-semibold">Consistent sizing</p>
                <p>SVG helpers keep icons aligned across buttons, tabs, and other controls.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto mt-12">
          <Card className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Component demos</CardTitle>
              <CardDescription>Quick previews using the shadcn/ui set shipped here.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                <Tabs defaultValue="design">
                  <TabsList>
                    <TabsTrigger value="design">Design</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                  </TabsList>
                  <TabsContent value="design" className="pt-3 text-sm text-slate-600 dark:text-slate-400">
                    Uses muted backgrounds, rounded tabs, and focus-visible rings for accessibility.
                  </TabsContent>
                  <TabsContent value="code" className="pt-3">
                    <pre className="rounded-lg bg-slate-900 text-slate-100 text-xs p-3 overflow-x-auto">
                      <code>{`<Tabs defaultValue="design">
  <TabsList>
    <TabsTrigger value="design">Design</TabsTrigger>
    <TabsTrigger value="code">Code</TabsTrigger>
  </TabsList>
  <TabsContent value="design">...</TabsContent>
  <TabsContent value="code">...</TabsContent>
</Tabs>`}</code>
                    </pre>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto mt-12">
          <Card className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <CardHeader>
              <CardTitle className="text-2xl">Framer Motion usage</CardTitle>
              <CardDescription>Reveal on scroll, hover lift, and gentle durations baked in.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm text-slate-700 dark:text-slate-300">
              <ul className="list-disc pl-5 space-y-1">
                <li>Use <code>whileInView</code> for scroll reveals with <code>{'viewport={{ once: true }}'}</code>.</li>
                <li>Keep transitions short (0.3-0.6s) and use slight <code>y</code> offsets (8-20px).</li>
                <li>Hover states: <code>{'whileHover={{ y: -5 }}'}</code> or <code>scale: 1.02</code> for cards/buttons.</li>
              </ul>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-xs p-4 overflow-x-auto">
                <code>{`import { motion } from 'framer-motion';

export function MotionCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="rounded-xl border p-6 shadow-sm"
    >
      {children}
    </motion.div>
  );
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto mt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Component reference</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Usage snippets with file paths so you can jump straight to source.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {componentDocs.map((item) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {item.file}
                  </Badge>
                </div>
                <div className="mt-4 space-y-2">
                  {item.notes.map((note) => (
                    <p key={note} className="text-sm text-slate-600 dark:text-slate-400">
                      - {note}
                    </p>
                  ))}
                </div>
                <pre className="mt-4 rounded-lg bg-slate-900 text-slate-100 text-xs p-4 overflow-x-auto">
                  <code>{item.usage}</code>
                </pre>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <CTA />
      <Footer />
    </div>
  );
}
