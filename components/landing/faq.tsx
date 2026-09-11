'use client';

import { ChevronDown } from 'lucide-react';
import type { Translation } from '@/lib/locales/zh';

interface Props {
  t: Translation;
}

export default function Faq({ t }: Props) {
  return (
    <section id="faq" className="section-anchor py-20 md:py-28">
      <div className="container max-w-3xl px-4 md:px-6">
        <div className="text-center">
          <p className="mono-label">04 · support</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {t.faq.title}
          </h2>
        </div>
        <div className="mt-12 space-y-3">
          {t.faq.items.map((item, i) => (
            <details
              key={item.q}
              className="glass-card rounded-xl border-0 px-5 [&[open]_svg]:rotate-180"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 py-4 text-left text-sm font-medium text-slate-800 marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 [&::-webkit-details-marker]:hidden">
                <span className="font-mono text-[10px] text-slate-300">
                  /{String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="flex-1 text-sm font-medium">{item.q}</h3>
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200" />
              </summary>
              <p className="pb-5 pl-9 text-[13px] leading-relaxed text-slate-500">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
