'use client'

import { motion } from 'framer-motion'

interface SectionHeadingProps {
  eyebrow: string
  title: string
}

export function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-sm font-mono mb-2 text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
      <div className="mt-4 w-12 h-1 rounded-full bg-foreground/20" />
    </motion.div>
  )
}
