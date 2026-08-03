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
      className={`pointer-events-none absolute h-3 w-3 border-white/20 ${className}`}
    />
  );
}

function WorkspaceFrame({ lang }: Props) {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 hidden xl:block" aria-hidden>
      <span className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <span className="absolute right-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

      <CornerMark className="left-8 top-20 border-l border-t" />
      <CornerMark className="right-8 top-20 border-r border-t" />
      <CornerMark className="left-8 bottom-20 border-l border-b" />
      <CornerMark className="right-8 bottom-20 border-r border-b" />

      <span className="absolute left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[10px] uppercase tracking-[0.3em] text-white/15">
        MultiGitGui · Workspace
      </span>
      <span className="absolute right-8 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl] text-white/15">
        {lang === 'zh' ? '跨平台 · 多仓库' : 'Cross-platform · Multi-repo'}
      </span>
    </div>
  );
}

export default function Landing({ lang }: Props) {
  const t = locales[lang];
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_-5%,rgba(34,211,238,0.07),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
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
