'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 px-4 py-2">
      <div className="w-7 h-7 rounded-full overflow-hidden border border-border shrink-0">
        <Image src="/images/pfp.png" alt="Ivan" width={28} height={28} className="w-full h-full object-cover" />
      </div>
      <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.span
            key={i}
            className="block w-1.5 h-1.5 rounded-full bg-muted-foreground"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, delay }}
          />
        ))}
      </div>
    </div>
  )
}
