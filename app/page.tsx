'use client';

import { Navbar } from '@/components/layout/navbar';
import { Hero } from '@/components/features/home/hero';
import { Features } from '@/components/features/home/features';
import { TechStack } from '@/components/features/home/tech-stack';
import { CTA } from '@/components/features/home/cta';
import { Footer } from '@/components/layout/footer';

export default function PantheonHomepage() {
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-500">
        <Navbar />
        <Hero />
        <Features />
        <TechStack />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}