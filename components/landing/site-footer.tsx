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
    {
      title: t.footer.legal,
      links: [{ name: t.footer.license, href: '#' }],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-white/[0.02] py-14">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <Image
                  src="/logo.png"
                  alt="MultiGitGui logo"
                  width={32}
                  height={32}
                  className="h-7 w-7 object-contain"
                />
              </span>
              <span className="text-lg font-semibold tracking-tight">MultiGitGui</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
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

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">{t.footer.copyright.replace('{year}', String(year))}</p>
          <p className="text-xs text-muted-foreground">.NET 10 · Avalonia · Windows / macOS / Linux</p>
        </div>
      </div>
    </footer>
  );
}
