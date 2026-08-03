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

export default function Landing({ lang }: Props) {
  const t = locales[lang];
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <SiteHeader t={t} lang={lang} />
      <main className="flex-1">
        <Hero t={t} />
        <Features t={t} />
        <DownloadSection t={t} />
        <Faq t={t} />
      </main>
      <SiteFooter t={t} />
    </div>
  );
}
