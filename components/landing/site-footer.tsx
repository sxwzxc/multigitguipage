'use client';

import Image from 'next/image';
import { Monitor, Laptop, Terminal } from 'lucide-react';
import type { Translation } from '@/lib/locales/zh';

interface Props {
  t: Translation;
}

export default function SiteFooter({ t }: Props) {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t.footer.product,
      links: [
        { name: t.footer.featuresLink, href: '#features' },
        { name: t.footer.downloadLink, href: '#download' },
        { name: t.footer.faqLink, href: '#faq' },
      ],
    },
    {
      title: t.footer.platforms,
      links: [
        { name: t.footer.win, href: '#download', icon: Monitor },
        { name: t.footer.mac, href: '#download', icon: Laptop },
        { name: t.footer.linux, href: '#download', icon: Terminal },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-white/60 bg-white/30 py-14 backdrop-blur-xl">
      <div className="container max-w-6xl px-4 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-white/70 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="MultiGitGui logo"
                  width={28}
                  height={28}
                  className="h-6 w-6 object-contain"
                />
              </span>
              <span className="font-mono text-sm font-semibold tracking-tight text-slate-900">
                MultiGit<span className="text-primary">Gui</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-slate-500">
              {t.footer.tagline}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mono-label text-[10px]">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="flex items-center gap-2 text-[13px] text-slate-500 transition-colors hover:text-slate-900"
                    >
                      {'icon' in link && link.icon ? <link.icon className="h-3.5 w-3.5" /> : null}
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200/60 pt-6 sm:flex-row">
          <p className="font-mono text-[11px] text-slate-400">
            {t.footer.copyright.replace('{year}', String(year))}
          </p>
          <p className="font-mono text-[11px] text-slate-400">.NET 10 · Avalonia · Win / macOS / Linux</p>
        </div>
      </div>
    </footer>
  );
}
