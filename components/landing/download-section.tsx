'use client';

import { Monitor, Laptop, Terminal, Clock3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[110px]" />
      </div>

      <div className="container relative px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t.download.title}</h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">{t.download.subtitle}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {t.download.version}:{' '}
            <Badge variant="secondary" className="ml-1 font-mono">
              v1.0.4
            </Badge>
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {platforms.map(({ key, icon: Icon }) => (
            <div key={key} className="glass-card flex flex-col rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="flex items-center gap-1.5 text-xs font-medium text-amber-300/90">
                  <Clock3 className="h-3.5 w-3.5" />
                  {t.download.comingSoon}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold">{t.download[key].name}</h3>
              <p className="mt-1 font-mono text-xs text-cyan-300/90">{t.download[key].file}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {t.download[key].desc}
              </p>
              <button
                type="button"
                disabled
                className="mt-6 w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-muted-foreground/70"
              >
                {t.download.comingSoon}
              </button>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center text-sm text-muted-foreground">
          {t.download.gitReq}
        </div>
      </div>
    </section>
  );
}
