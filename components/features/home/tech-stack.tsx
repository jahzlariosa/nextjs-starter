'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { techStack } from '@/data/home';

export function TechStack() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Modern Tech Stack
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Powered by the latest and greatest technologies
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {techStack.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 rounded-full bg-primary/5 border border-primary/20 backdrop-blur-sm"
            >
              <span className="font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>{tech}</span>
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}