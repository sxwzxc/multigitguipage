'use client';

import { Download, ArrowRight } from 'lucide-react';
import type { Translation } from '@/lib/locales/zh';

interface Props {
  t: Translation;
}

function OverviewMockup({ t }: Props) {
  const rows = [
    { repo: 'web-app', branch: 'main', ahead: 2, behind: 1, status: t.mockup.synced, dot: 'bg-emerald-400', text: 'text-emerald-300/90' },
    { repo: 'mobile-api', branch: 'feature/payments', ahead: 5, behind: 0, status: t.mockup.modified, dot: 'bg-amber-400', text: 'text-amber-300/90' },
    { repo: 'infra', branch: 'master', ahead: 0, behind: 3, status: t.mockup.synced, dot: 'bg-emerald-400', text: 'text-emerald-300/90' },
    { repo: 'docs', branch: 'main', ahead: 1, behind: 4, status: t.mockup.conflict, dot: 'bg-red-400', text: 'text-red-300/90' },
  ];

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="mono-label ml-2 text-[10px]">{t.mockup.windowTitle}</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="mono-label text-[10px]">auto-refresh</span>
        </span>
      </div>

      <div className="flex">
        <aside className="hidden w-32 shrink-0 flex-col gap-0.5 border-r border-white/[0.06] bg-white/[0.015] p-2 sm:flex">
          {t.mockup.sidebar.map((item, i) => (
            <span
              key={item}
              className={`rounded-md px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                i === 0
                  ? 'bg-cyan-400/10 text-cyan-300'
                  : 'text-zinc-500'
              }`}
            >
              {item}
            </span>
          ))}
        </aside>

        <div className="min-w-0 flex-1 p-4">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 gap-y-2 text-[11px]">
            <span className="mono-label text-[10px]">{t.mockup.repo}</span>
            <span className="mono-label w-20 text-[10px]">{t.mockup.branch}</span>
            <span className="mono-label w-10 text-right text-[10px]">{t.mockup.ahead}</span>
            <span className="mono-label w-10 text-right text-[10px]">{t.mockup.behind}</span>

            {rows.map((row) => (
              <div key={row.repo} className="contents">
                <span className="truncate font-mono text-[11px] text-zinc-200">{row.repo}</span>
                <span className="truncate font-mono text-[11px] text-zinc-500">{row.branch}</span>
                <span className="text-right font-mono text-[11px] text-zinc-400">{row.ahead}</span>
                <span className="text-right font-mono text-[11px] text-zinc-400">{row.behind}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-white/[0.06] pt-3">
            {rows.map((row) => (
              <span key={row.repo} className={`flex items-center gap-1.5 font-mono text-[10px] ${row.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${row.dot}`} />
                <span>{row.repo}</span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-500">{row.status}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-white/[0.06] bg-white/[0.015] px-4 py-2">
        <span className="mono-label text-[10px]">12 repos</span>
        <span className="mono-label text-[10px]">3 ahead</span>
        <span className="mono-label text-[10px]">1 conflict</span>
        <span className="ml-auto rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
          ctrl+1
        </span>
      </div>
    </div>
  );
}

function TelemetryCard() {
  const rows = [
    { label: 'repos', value: '12', dot: 'bg-emerald-400' },
    { label: 'changes', value: '3', dot: 'bg-amber-400' },
    { label: 'conflicts', value: '1', dot: 'bg-red-400' },
  ];
  return (
    <div className="glass-card w-44 rounded-xl p-3.5">
      <p className="mono-label text-[9px]">Workspace status</p>
      <div className="mt-2.5 space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2 font-mono text-[10px]">
            <span className={`h-1.5 w-1.5 rounded-full ${row.dot}`} />
            <span className="text-zinc-500">{row.label}</span>
            <span className="ml-auto text-zinc-200">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogCard() {
  const lines = [
    { tag: 'ok', text: 'fetch web-app (1.2s)', color: 'text-emerald-300/80' },
    { tag: 'ok', text: 'pull mobile-api (2.4s)', color: 'text-emerald-300/80' },
    { tag: 'err', text: 'push docs — rejected', color: 'text-red-300/80' },
  ];
  return (
    <div className="glass-card w-52 rounded-xl p-3.5">
      <p className="mono-label text-[9px]">Recent activity</p>
      <div className="mt-2.5 space-y-1.5">
        {lines.map((line, i) => (
          <p key={i} className="truncate font-mono text-[10px] leading-4">
            <span className={line.color}>[{line.tag}]</span>{' '}
            <span className="text-zinc-400">{line.text}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export default function Hero({ t }: Props) {
  return (
    <section className="relative pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="container max-w-6xl px-4 md:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <div className="text-center lg:text-left">
            <p className="mono-label inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              {t.hero.badge}
            </p>
            <h1 className="mt-7 text-4xl font-semibold leading-[1.12] tracking-tight md:text-5xl xl:text-[3.4rem]">
              {t.hero.title1}
              <span className="text-cyan-300">{t.hero.title2}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 lg:mx-0 md:text-lg">
              {t.hero.subtitle}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <a
                href="#download"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-all hover:bg-zinc-200 hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.35)] sm:w-auto"
              >
                <Download className="h-4 w-4" />
                {t.hero.ctaDownload}
              </a>
              <a
                href="#features"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/25 hover:text-foreground sm:w-auto"
              >
                {t.hero.ctaFeatures}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <p className="mono-label mt-6 text-[10px]">{t.hero.platformNote}</p>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div
              className="pointer-events-none absolute -inset-10 rounded-full bg-cyan-400/[0.06] blur-[90px]"
              aria-hidden
            />
            <OverviewMockup t={t} />

            <div className="absolute -left-6 top-8 hidden animate-[float_7s_ease-in-out_infinite] md:block lg:-left-10">
              <TelemetryCard />
            </div>
            <div className="absolute -bottom-8 -right-4 hidden animate-[float_9s_ease-in-out_infinite] md:block lg:-right-8">
              <LogCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
