'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { skills } from '@/content/skills'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
})

export default function Hero() {
  const row1 = [...skills, ...skills]

  return (
    <section className="flex flex-col overflow-x-hidden bg-grid px-6 pt-28 pb-20">
      <div className="w-full max-w-3xl mx-auto">
        <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">

          {/* Left — photo + socials */}
          <motion.div
            {...fadeUp(0)}
            className="flex flex-col items-center md:items-start gap-4"
          >
            <div className="relative">
              <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-60 md:h-60 rounded-3xl overflow-hidden shadow-xl border border-border">
                <Image
                  src="/images/pfp.png"
                  alt="Ivan Jade Quilang"
                  width={256}
                  height={256}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-background border border-border rounded-full px-3 py-1 text-xs font-medium shadow-sm whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Available for work
              </span>
            </div>

            {/* Social links */}
            <div className="flex items-center justify-center gap-3 mt-5 w-full">
              <a href="https://github.com/hisuwi" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/quilang-ivan/" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://mail.google.com/mail/?view=cm&to=quilangivanjade3@gmail.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Right — info */}
          <div className="flex flex-col gap-3 text-center md:text-left w-full min-w-0">
            <motion.p {...fadeUp(0.1)} className="text-xs font-mono tracking-wider uppercase text-muted-foreground truncate">
              Full Stack Developer · Philippines
            </motion.p>

            <motion.h1 {...fadeUp(0.15)} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
              Ivan Jade<br />
              <span className="text-foreground/25">Quilang</span>
            </motion.h1>

            <motion.div {...fadeUp(0.2)} className="flex items-center gap-3 justify-center md:justify-start overflow-hidden">
              <div className="h-px w-8 bg-border shrink-0" />
              <span className="text-xs text-muted-foreground/60 tracking-wider font-mono truncate">React · Next.js · Laravel · PHP</span>
            </motion.div>

            <motion.p {...fadeUp(0.25)} className="text-muted-foreground leading-relaxed max-w-lg text-sm mx-auto md:mx-0">
              I build fast, modern web apps across the full stack — from clean, responsive UIs to solid backends.
              Open to freelance projects, collabs, and full-time roles.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex gap-6 justify-center md:justify-start py-3 border-y border-border">
              {[
                { value: '2+', label: 'Yrs. Coding' },
                { value: '2', label: 'Live Projects' },
                { value: '10+', label: 'Technologies' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xl sm:text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Skills carousel */}
            <motion.div {...fadeUp(0.33)} className="overflow-hidden max-w-lg">
              <div className="flex">
                <div className="flex gap-2 animate-marquee whitespace-nowrap">
                  {row1.map((skill, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-secondary text-muted-foreground border border-border shrink-0">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.35)} className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
              <a href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-background bg-foreground hover:opacity-90 transition-all hover:scale-105 text-sm">
                View My Work
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium border border-border hover:border-foreground/40 transition-all hover:scale-105 text-foreground/80 text-sm">
                Get in Touch
              </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
