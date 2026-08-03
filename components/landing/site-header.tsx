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
    const onScroll = () => setIsScrolled(window.scrollY > 12);
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
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'border-b border-white/10 bg-[#0a0e14]/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="MultiGitGui">
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
            <Image
              src="/logo.png"
              alt="MultiGitGui logo"
              width={32}
              height={32}
              className="h-7 w-7 object-contain"
              priority
            />
          </span>
          <span className="text-lg font-semibold tracking-tight">MultiGitGui</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href={lang === 'zh' ? '/en' : '/'}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-cyan-400/40 hover:text-foreground"
            aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}
          >
            <Globe className="h-4 w-4" />
            {t.nav.switchLang}
          </Link>
          <a
            href="#download"
            className="hidden items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-cyan-300 md:flex"
          >
            <Download className="h-4 w-4" />
            {t.hero.ctaDownload}
          </a>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-foreground md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0a0e14]/95 backdrop-blur-xl md:hidden">
          <nav className="container flex flex-col gap-1 px-4 py-4">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="#download"
              className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              onClick={() => setMobileOpen(false)}
            >
              <Download className="h-4 w-4" />
              {t.hero.ctaDownload}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
