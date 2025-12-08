# Next.js Modern Style Guide

## Overview
This style guide establishes best practices for building modern, responsive, and accessible Next.js applications with exceptional UI/UX, dynamic theming, and smooth animations.

---

## Tech Stack

### Core Framework
- **Next.js 16+** with App Router and Turbopack
- **TypeScript** for type safety
- **React 19+** with Server Components and Server Actions

### Styling & UI
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for accessible component primitives
- **CSS Variables** for dynamic theming
- **Framer Motion** for animations

### State & Data
- **React Server Components** by default
- **Server Actions** for mutations
- **Client Components** only when needed (interactivity, hooks, browser APIs)

---

## Design System

### Color Palette

Use HSL color space for dynamic theming with CSS variables. We prioritize cool tones (Blue/Purple/Slate) for a modern, professional look.

```css
:root {
  /* Primary - Blue 600 */
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  
  /* Secondary - Slate 100 */
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  
  /*HV - Slate 100 */
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  
  /* Background - White */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  
  /* Muted */
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  
  /* Card */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  
  /* Borders & Rings */
  --border: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  
  /* Status Colors */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
}

.dark {
  /* Primary - Blue 600 (Accessible on dark) */
  --primary: 217.2 91.2% 59.8%;
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark variants */
}
```

### Typography

```tsx
// Font Setup (app/layout.tsx)
import { Inter, Geist, Space_Grotesk } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-space-grotesk' 
})
```

**Scale:**
- Display: 3.5rem (56px) / 4rem (64px)
- H1: 2.5rem (40px)
- H2: 2rem (32px)
- H3: 1.5rem (24px)
- H4: 1.25rem (20px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)
- XSmall: 0.75rem (12px)

---

## Spacing & Layout

### Grid System
```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Content */}
  </div>
</div>
```

### Spacing Scale (Tailwind)
- xs: 0.5rem (8px)
- sm: 0.75rem (12px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)

---

## Component Patterns

### Server Actions (Next.js 15+)
```tsx
// app/actions/user.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function updateUser(formData: FormData) {
  const name = formData.get('name') as string
  
  // Perform database update
  await db.user.update({ name })
  
  // Revalidate cache
  revalidatePath('/profile')
  
  return { success: true }
}
```

### Server Components (Default)
```tsx
// components/features/products/ProductList.tsx
import { getProducts } from '@/lib/data'

export default async function ProductList() {
  const products = await getProducts()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### Client Components (When Needed)
```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function InteractiveCard() {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-lg border bg-card"
    >
      {/* Interactive content */}
    </motion.div>
  )
}
```

---

## Animation Guidelines

### Framer Motion Patterns

**Page Transitions:**
```tsx
'use client'

import { motion } from 'framer-motion'

export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
```

---

## Testing & Quality

### Type Safety
- Use TypeScript strict mode
- Define interfaces for props and data
- Avoid `any` types

### Linting
```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "react/no-unescaped-entities": "off"
  }
}
```

---

## File Structure

```
app/
├── (auth)/
│   ├── login/
│   └── register/
├── (dashboard)/
│   └── dashboard/
├── api/
├── actions/         # Server Actions
components/
├── ui/              # shadcn components (button, card, etc.)
├── layout/          # Global layout components (navbar, footer)
├── features/        # Feature-specific components (home, dashboard)
│   └── home/
├── providers/       # Context providers
lib/
├── utils.ts         # Utility functions
└── data/            # Static data/constants
styles/
└── globals.css
```

---

## Quick Setup Guide

### 1. Initialize Project
```bash
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
```

### 2. Install Dependencies
```bash
# UI Framework
npx shadcn@latest init

# Animations
npm install framer-motion

# Theme
npm install next-themes
```

### 3. Setup Theme Provider
Create `components/providers/theme-provider.tsx` and wrap your app in `app/layout.tsx`.

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

---

**Version:** 2.1.0  
**Last Updated:** December 2025