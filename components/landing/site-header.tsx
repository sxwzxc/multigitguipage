'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Download, Globe, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Translation } from '@/lib/locales/zh';

interface Props {
  t: Translation;
  lang: 'zh' | 'en';
}

export default function SiteHeader({ t, lang }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = [
    { name: t.nav.features, href: '#features' },
    { name: t.nav.download, href: '#download' },
    { name: t.nav.faq, href: '#faq' },
  ];

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4">
      <div
        className={cn(
          'glass-shell mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-3 pl-4 transition-all duration-300 sm:px-4',
          isScrolled && 'shadow-[0_16px_48px_-16px_rgba(0,0,0,0.8)]'
        )}
      >
        <Link href="/" className="flex items-center gap-2.5" aria-label="MultiGitGui">
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-white/5">
            <Image
              src="/logo.png"
              alt="MultiGitGui logo"
              width={28}
              height={28}
              className="h-6 w-6 object-contain"
              priority
            />
          </span>
          <span className="font-mono text-sm font-semibold tracking-tight">
            MultiGit<span className="text-cyan-300">Gui</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={lang === 'zh' ? '/en' : '/'}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-white/25 hover:text-foreground"
            aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}
          >
            <Globe className="h-3.5 w-3.5" />
            {t.nav.switchLang}
          </Link>
          <a
            href="#download"
            className="hidden items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300 transition-all hover:bg-cyan-400/20 md:flex"
          >
            <Download className="h-3.5 w-3.5" />
            {t.hero.ctaDownload}
          </a>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="glass-shell mx-auto mt-2 max-w-6xl rounded-2xl px-3 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-2.5 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="#download"
              className="mt-1 flex items-center justify-center gap-1.5 rounded-full bg-cyan-400/15 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300"
              onClick={() => setMobileOpen(false)}
            >
              <Download className="h-3.5 w-3.5" />
              {t.hero.ctaDownload}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
