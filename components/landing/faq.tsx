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
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
            {t.faq.title}
          </h2>
          <Accordion type="single" collapsible className="mt-12 space-y-3">
            {t.faq.items.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                className="glass-card rounded-xl border px-5"
              >
                <AccordionTrigger className="py-4 text-left text-base font-medium hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
