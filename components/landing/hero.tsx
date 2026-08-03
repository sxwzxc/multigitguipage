'use client';

import { Download, ChevronRight } from 'lucide-react';
import type { Translation } from '@/lib/locales/zh';

interface Props {
  t: Translation;
}

function OverviewMockup({ t }: Props) {
  const rows = [
    { repo: 'web-app', branch: 'main', ahead: 2, behind: 1, status: t.mockup.synced, color: 'bg-emerald-400', text: 'text-emerald-400' },
    { repo: 'mobile-api', branch: 'feature/payments', ahead: 5, behind: 0, status: t.mockup.modified, color: 'bg-amber-400', text: 'text-amber-400' },
    { repo: 'infra', branch: 'master', ahead: 0, behind: 3, status: t.mockup.synced, color: 'bg-emerald-400', text: 'text-emerald-400' },
    { repo: 'docs', branch: 'main', ahead: 1, behind: 4, status: t.mockup.conflict, color: 'bg-red-400', text: 'text-red-400' },
  ];

  return (
    <div className="relative w-full max-w-2xl">
      <div className="absolute -inset-8 rounded-[2rem] bg-cyan-400/20 blur-3xl" aria-hidden />
      <div className="glass-card relative overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          <span className="ml-3 text-xs text-muted-foreground">{t.mockup.windowTitle}</span>
        </div>

        <div className="flex">
          <aside className="hidden w-36 shrink-0 flex-col gap-0.5 border-r border-white/10 bg-white/[0.02] p-2.5 sm:flex">
            {t.mockup.sidebar.map((item, i) => (
              <span
                key={item}
                className={`rounded-md px-2.5 py-1.5 text-xs ${
                  i === 0
                    ? 'bg-cyan-400/15 font-medium text-cyan-300'
                    : 'text-muted-foreground'
                }`}
              >
                {item}
              </span>
            ))}
          </aside>

          <div className="min-w-0 flex-1 p-4">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 gap-y-1.5 text-xs">
              <span className="text-muted-foreground">{t.mockup.repo}</span>
              <span className="w-16 text-muted-foreground">{t.mockup.branch}</span>
              <span className="w-10 text-muted-foreground">{t.mockup.ahead}</span>
              <span className="w-10 text-muted-foreground">{t.mockup.behind}</span>

              {rows.map((row) => (
                <div key={row.repo} className="contents">
                  <span className="truncate font-mono text-[11px] text-foreground/90">{row.repo}</span>
                  <span className="truncate font-mono text-[11px] text-muted-foreground">{row.branch}</span>
                  <span className="text-right font-mono text-[11px] text-foreground/80">{row.ahead}</span>
                  <span className="text-right font-mono text-[11px] text-foreground/80">{row.behind}</span>
                </div>
              ))}

              <div className="col-span-4 mt-1 flex flex-wrap items-center gap-3 border-t border-white/10 pt-2.5">
                {rows.map((row) => (
                  <span key={row.repo} className={`flex items-center gap-1.5 text-[11px] ${row.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${row.color}`} />
                    <span className="font-mono">{row.repo}</span>
                    <span className="text-muted-foreground">{row.status}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-white/10 bg-white/[0.02] px-4 py-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-[11px] text-muted-foreground">Auto-refresh</span>
          <span className="ml-auto rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            Ctrl+1
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ t }: Props) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute -top-40 left-1/2 h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute top-40 right-0 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="container relative px-4 md:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1.5 text-xs font-medium text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              {t.hero.badge}
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight md:text-5xl lg:text-6xl">
              {t.hero.title1}
              <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
                {t.hero.title2}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t.hero.subtitle}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#download"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-cyan-500/25 transition-all hover:bg-cyan-300 hover:shadow-cyan-400/30"
              >
                <Download className="h-5 w-5" />
                {t.hero.ctaDownload}
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-base font-semibold text-foreground backdrop-blur transition-colors hover:border-cyan-400/40 hover:bg-white/10"
              >
                {t.hero.ctaFeatures}
                <ChevronRight className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">{t.hero.platformNote}</p>
          </div>

          <OverviewMockup t={t} />
        </div>
      </div>
    </section>
  );
}
