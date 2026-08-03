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
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t.features.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {t.features.subtitle}
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <div key={item.title} className="glass-card glass-card-hover rounded-2xl p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                  <Icon className="h-[22px] w-[22px]" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
