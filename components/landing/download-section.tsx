'use client';

import { Monitor, Laptop, Terminal } from 'lucide-react';
import type { Translation } from '@/lib/locales/zh';

interface Props {
  t: Translation;
}

const icons = {
  windows: Monitor,
  macos: Laptop,
  linux: Terminal,
} as const;

export default function DownloadSection({ t }: Props) {
  const platforms = [
    { key: 'windows', icon: icons.windows },
    { key: 'macos', icon: icons.macos },
    { key: 'linux', icon: icons.linux },
  ] as const;

  return (
    <section id="download" className="section-anchor relative py-20 md:py-28">
      <div className="container max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mono-label">02 · release</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            {t.download.title}
          </h2>
          <p className="mt-4 text-base text-zinc-400 md:text-lg">{t.download.subtitle}</p>
          <p className="mono-label mt-4 inline-flex items-center gap-2">
            {t.download.version}
            <span className="rounded border border-cyan-400/30 bg-cyan-400/10 px-1.5 py-0.5 text-cyan-300">
              v1.0.4
            </span>
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {platforms.map(({ key, icon: Icon }) => (
            <div key={key} className="glass-card flex flex-col p-6">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-zinc-400" />
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-300/80">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                  {t.download.comingSoon}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-medium text-zinc-100">{t.download[key].name}</h3>
              <p className="mt-1.5 font-mono text-[11px] text-cyan-300/80">{t.download[key].file}</p>
              <p className="mt-3 flex-1 text-[13px] leading-relaxed text-zinc-500">
                {t.download[key].desc}
              </p>
              <button
                type="button"
                disabled
                className="mt-6 w-full cursor-not-allowed rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-zinc-600"
              >
                {t.download.comingSoon}
              </button>
            </div>
          ))}
        </div>

        <div className="glass-card mx-auto mt-8 max-w-3xl overflow-hidden rounded-xl">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="mono-label ml-2 text-[10px]">mgg · prerequisites</span>
          </div>
          <div className="space-y-1.5 px-4 py-3.5 font-mono text-[11px] leading-5">
            <p>
              <span className="text-emerald-300/80">$</span>{' '}
              <span className="text-zinc-300">git --version</span>
              <span className="ml-2 text-zinc-500">git version 2.30+ required</span>
            </p>
            <p className="text-zinc-500">{t.download.gitReq}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
