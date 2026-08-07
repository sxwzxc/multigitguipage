'use client';

import { Monitor, Laptop, Terminal, Download, Github } from 'lucide-react';
import DownloadButton from '@/components/landing/download-button';
import ChangelogDialog from '@/components/landing/changelog-dialog';
import { windowsInstaller } from '@/lib/installer';
import { reportRecord } from '@/lib/record';
import type { Translation } from '@/lib/locales/zh';

interface Props {
  t: Translation;
}

const GITHUB_RELEASES = 'https://github.com/sxwzxc/multigitguipage/releases';

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
        <div className="absolute left-1/2 top-6 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-cyan-400/20 blur-[110px]" />
      </div>

      <div className="container relative max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mono-label">02 · release</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {t.download.title}
          </h2>
          <p className="mt-4 text-base text-slate-600 md:text-lg">{t.download.subtitle}</p>
          <p className="mono-label mt-5 inline-flex items-center gap-2.5">
            {t.download.version}
            <span className="rounded-lg border border-cyan-600/30 bg-cyan-500/10 px-2.5 py-1 text-sm font-bold text-primary shadow-sm">
              v1.5.0
            </span>
            <ChangelogDialog t={t} />
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {platforms.map(({ key, icon: Icon }) => {
            const isWindows = key === 'windows';
            return (
              <div
                key={key}
                className={`glass-card flex flex-col p-6 ${
                  isWindows ? 'ring-1 ring-cyan-500/25' : ''
                }`}
              >
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
                      {t.download.goToGithub}
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
                    href={windowsInstaller.directUrl}
                    onClick={() =>
                      reportRecord({ type: 'download', file: windowsInstaller.file, channel: 'direct' })
                    }
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-600/30 transition-all hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-cyan-600/40"
                  >
                    <Download className="h-4 w-4" />
                    {t.download.downloadNow}
                  </a>
                ) : (
                  <a
                    href={GITHUB_RELEASES}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/70 px-5 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-cyan-600/40 hover:text-primary"
                  >
                    <Github className="h-4 w-4" />
                    {t.download.goToGithub}
                  </a>
                )}

                {isWindows ? (
                  <DownloadButton t={t} />
                ) : (
                  <p className="mt-2.5 text-center font-mono text-[11px] leading-4 text-slate-400">
                    {t.download.githubNote}
                    <a
                      href={GITHUB_RELEASES}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-primary underline underline-offset-2 hover:text-cyan-700"
                    >
                      github.com/sxwzxc/multigitguipage/releases
                    </a>
                  </p>
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
