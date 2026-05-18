'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
const links = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#roles', label: 'Who it\'s for' },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" className="font-display text-lg font-bold tracking-tight sm:text-xl">
          CollabNet
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild className="rounded-full">
            <Link href="/register">Get started</Link>
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="rounded-full md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open && (
        <div className="border-t bg-white px-4 py-4 md:hidden animate-fade-up">
          <nav className="flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t pt-4">
              <Button variant="outline" asChild className="w-full rounded-full">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="w-full rounded-full">
                <Link href="/register">Get started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
