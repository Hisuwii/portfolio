'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import HireMeModal from './HireMeModal'

const links = [
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-16 h-8" />

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="flex items-center gap-1.5 px-3 h-8 rounded-full border border-border bg-secondary hover:bg-accent transition-all text-xs font-medium text-foreground"
    >
      {isDark ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
          Light
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          Dark
        </>
      )}
    </button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hireOpen, setHireOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`w-full max-w-2xl flex items-center justify-between px-5 h-12 rounded-2xl transition-all duration-300 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-md border border-border shadow-lg shadow-black/5'
            : 'bg-background/60 backdrop-blur-sm border border-border/60'
        }`}
      >
        {/* Logo */}
        <a href="#" className="font-bold text-sm tracking-tight shrink-0">
          IJ
          <span className="text-muted-foreground font-normal ml-1.5 hidden sm:inline">/ ivan.jade</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setHireOpen(true)}
            className="hidden md:inline-flex items-center gap-2 bg-foreground text-background text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-85 transition-opacity shrink-0 tracking-wide"
          >
            Hire Me ✦
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px bg-foreground transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
            <span className={`block w-5 h-px bg-foreground transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-foreground transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[68px] left-4 right-4 max-w-2xl mx-auto bg-background/95 backdrop-blur-md border border-border rounded-2xl shadow-lg overflow-hidden"
          >
            <ul className="px-5 py-4 flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-1 border-t border-border">
                <button
                  className="text-sm font-medium"
                  onClick={() => { setMenuOpen(false); setHireOpen(true) }}
                >
                  Hire me
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <HireMeModal open={hireOpen} onClose={() => setHireOpen(false)} />
    </header>
  )
}
