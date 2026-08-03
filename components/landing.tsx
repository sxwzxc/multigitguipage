'use client';

import { zh } from '@/lib/locales/zh';
import { en } from '@/lib/locales/en';
import type { Translation } from '@/lib/locales/zh';
import SiteHeader from '@/components/landing/site-header';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import DownloadSection from '@/components/landing/download-section';
import Faq from '@/components/landing/faq';
import SiteFooter from '@/components/landing/site-footer';

interface Props {
  lang: 'zh' | 'en';
}

const locales: Record<Props['lang'], Translation> = { zh, en };

function CornerMark({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-3 w-3 border-slate-400/40 ${className}`}
    />
  );
}

function WorkspaceFrame({ lang }: Props) {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 hidden xl:block" aria-hidden>
      <span className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-slate-400/20 to-transparent" />
      <span className="absolute right-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-slate-400/20 to-transparent" />

      <CornerMark className="left-8 top-20 border-l border-t" />
      <CornerMark className="right-8 top-20 border-r border-t" />
      <CornerMark className="left-8 bottom-20 border-l border-b" />
      <CornerMark className="right-8 bottom-20 border-r border-b" />

      <span className="absolute left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400/50">
        MultiGitGui · Workspace
      </span>
      <span className="absolute right-8 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl] text-slate-400/50">
        {lang === 'zh' ? '跨平台 · 多仓库' : 'Cross-platform · Multi-repo'}
      </span>
    </div>
  );
}

export default function Landing({ lang }: Props) {
  const t = locales[lang];
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      {/* 极光背景：多层模糊渐变色斑缓慢流动 */}
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-slate-50 to-slate-100" />
        <div className="aurora-sheen absolute -inset-x-1/4 -top-1/3 h-[70vh] rotate-[-6deg] opacity-70" />
        <div className="aurora-blob aurora-blob-a -top-40 left-[-10%] h-[36rem] w-[36rem]" />
        <div className="aurora-blob aurora-blob-b top-1/4 right-[-12%] h-[40rem] w-[40rem]" />
        <div className="aurora-blob aurora-blob-c bottom-[-15%] left-[20%] h-[34rem] w-[34rem]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_20%,#000_55%,transparent_100%)]" />
      </div>

      <WorkspaceFrame lang={lang} />
      <SiteHeader t={t} lang={lang} />
      <main className="relative z-10 flex-1">
        <Hero t={t} />
        <Features t={t} />
        <DownloadSection t={t} />
        <Faq t={t} />
      </main>
      <SiteFooter t={t} />
    </div>
  );
}
