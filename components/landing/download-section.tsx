'use client';

import { Monitor, Laptop, Terminal, Download } from 'lucide-react';
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
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {t.download.title}
          </h2>
          <p className="mt-4 text-base text-slate-600 md:text-lg">{t.download.subtitle}</p>
          <p className="mono-label mt-4 inline-flex items-center gap-2">
            {t.download.version}
            <span className="rounded border border-cyan-600/30 bg-cyan-500/10 px-1.5 py-0.5 font-semibold text-primary">
              v1.1.5
            </span>
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {platforms.map(({ key, icon: Icon }) => {
            const isWindows = key === 'windows';
            return (
              <div key={key} className="glass-card flex flex-col p-6">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-slate-500" />
                  {isWindows ? (
                    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-600">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      {t.download.downloadNow}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-600">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                      {t.download.comingSoon}
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-lg font-medium text-slate-900">{t.download[key].name}</h3>
                <p className="mt-1.5 font-mono text-[11px] text-primary">{t.download[key].file}</p>
                <p className="mt-3 flex-1 text-[13px] leading-relaxed text-slate-500">
                  {t.download[key].desc}
                </p>
                {isWindows ? (
                  <a
                    href="/downloads/MultiGitGui-Setup-1.1.5.exe"
                    download
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-lg shadow-cyan-600/25 transition-all hover:bg-cyan-700"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {t.download.downloadNow}
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-6 w-full cursor-not-allowed rounded-full border border-slate-200 bg-white/60 px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-slate-400"
                  >
                    {t.download.comingSoon}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="glass-card mx-auto mt-8 max-w-3xl overflow-hidden rounded-xl">
          <div className="flex items-center gap-2 border-b border-slate-200/70 bg-white/40 px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-rose-300" />
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            <span className="mono-label ml-2 text-[10px]">mgg · prerequisites</span>
          </div>
          <div className="space-y-1.5 px-4 py-3.5 font-mono text-[11px] leading-5">
            <p>
              <span className="text-emerald-600">$</span>{' '}
              <span className="text-slate-800">git --version</span>
              <span className="ml-2 text-slate-500">git version 2.30+ required</span>
            </p>
            <p className="text-slate-500">{t.download.gitReq}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
