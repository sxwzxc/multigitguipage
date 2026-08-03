'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Translation } from '@/lib/locales/zh';

interface Props {
  t: Translation;
}

export default function Faq({ t }: Props) {
  return (
    <section id="faq" className="section-anchor py-20 md:py-28">
      <div className="container max-w-3xl px-4 md:px-6">
        <div className="text-center">
          <p className="mono-label">03 · support</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {t.faq.title}
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {t.faq.items.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`} className="glass-card rounded-xl border-0 px-5">
              <AccordionTrigger className="gap-3 py-4 text-left text-sm font-medium text-slate-800 hover:no-underline [&[data-state=open]>svg]:rotate-180 [&>svg]:text-slate-400">
                <span className="font-mono text-[10px] text-slate-300">/{String(i + 1).padStart(2, '0')}</span>
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 pl-9 text-[13px] leading-relaxed text-slate-500">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
