'use client';

import {
  FolderTree,
  GitBranch,
  GitPullRequest,
  LayoutGrid,
  FileDiff,
  Search,
  Workflow,
  HardDrive,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';
import type { Translation } from '@/lib/locales/zh';

interface Props {
  t: Translation;
}

const icons: LucideIcon[] = [
  FolderTree,
  GitBranch,
  GitPullRequest,
  LayoutGrid,
  FileDiff,
  Search,
  Workflow,
  HardDrive,
  ScrollText,
];

export default function Features({ t }: Props) {
  return (
    <section id="features" className="section-anchor relative py-20 md:py-28">
      <div className="container max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mono-label">01 · capabilities</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {t.features.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
            {t.features.subtitle}
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <div
                key={item.title}
                className="glass-card group p-6 transition-all duration-300 hover:bg-white/80"
              >
                <div className="flex items-start justify-between">
                  <Icon className="h-5 w-5 text-slate-500 transition-colors duration-300 group-hover:text-primary" />
                  <span className="mono-label text-[9px] text-slate-300 group-hover:text-slate-400">
                    /{String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-medium text-slate-900">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
