'use client';

import { motion } from 'framer-motion';

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-zinc-900 dark:bg-zinc-800 p-12 text-center text-white"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to Build?
            </h2>
            <p className="text-xl mb-8 opacity-90 text-zinc-300">
              Compatible with Pantheon, Vercel, and other modern hosting platforms.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg bg-white text-zinc-900 font-bold shadow-xl hover:shadow-2xl transition-shadow"
            >
              Start Building
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}