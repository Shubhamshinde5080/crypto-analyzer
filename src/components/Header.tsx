'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/60 dark:bg-gray-900/60 shadow-sm">
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-16">
        <Link href="/" className="text-lg font-semibold" aria-label="Crypto Analyzer home">
          Crypto Analyzer
        </Link>
        <nav className="hidden md:flex space-x-6" aria-label="Main navigation">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm hover:text-primaryFrom"
              aria-label={l.label}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button className="md:hidden p-2" aria-label="Toggle menu" onClick={() => setOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      {open && (
        <div

          className="fixed inset-0 bg-gradient-to-br from-primaryFrom via-primaryFrom/60 to-primaryTo/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-6 md:hidden"

          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center space-y-6 md:hidden"

          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-4 right-4 p-2"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}

              className="text-white text-2xl font-semibold tracking-wide"

              className="text-white text-xl"

              aria-label={l.label}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
