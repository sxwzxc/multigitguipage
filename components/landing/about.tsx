'use client';

import type { Translation } from '@/lib/locales/zh';

interface Props {
  t: Translation;
}

export default function About({ t }: Props) {
  return (
    <section id="about" className="section-anchor relative py-20 md:py-28">
      <div className="container max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mono-label">{t.about.label}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {t.about.title}
          </h2>
        </div>

        <div className="glass-card mx-auto mt-12 max-w-4xl p-6 md:p-10">
          <p className="text-base leading-relaxed text-slate-700 md:text-lg">{t.about.lead}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-500">{t.about.body}</p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {t.about.facts.map((fact) => (
              <div
                key={fact.title}
                className="rounded-xl border border-slate-200/70 bg-white/50 px-4 py-4"
              >
                <dt className="mono-label text-[10px] text-slate-400">{fact.title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-700">{fact.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
