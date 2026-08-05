'use client';

import { useEffect, useState } from 'react';
import { ScrollText, Loader2, AlertCircle } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Translation } from '@/lib/locales/zh';

interface Props {
  t: Translation;
}

interface LatestInfo {
  version: string;
  publishedAt: string | null;
  changelogUrl: string;
}

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; html: string; version: string };

/**
 * 更新日志弹窗：打开时请求 /api/latest.json 获取最新版本与 changelogUrl，
 * 再拉取对应 markdown 渲染展示。端点由 scripts/bump-version.mjs 发布时生成。
 */
export default function ChangelogDialog({ t }: Props) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>({ status: 'idle' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setState({ status: 'loading' });
      try {
        const res = await fetch('/api/latest.json');
        if (!res.ok) throw new Error(`latest.json ${res.status}`);
        const latest = (await res.json()) as LatestInfo;
        const mdRes = await fetch(latest.changelogUrl);
        if (!mdRes.ok) throw new Error(`changelog ${mdRes.status}`);
        const html = marked.parse(await mdRes.text(), {
          async: false,
          gfm: true,
          breaks: true,
        }) as string;
        if (!cancelled) {
          setState({ status: 'ready', html: DOMPurify.sanitize(html), version: latest.version });
        }
      } catch {
        if (!cancelled) setState({ status: 'error' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, attempt]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ml-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/60 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-cyan-600/40 hover:text-primary"
      >
        <ScrollText className="h-3.5 w-3.5" />
        {t.download.changelog}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-card max-w-2xl rounded-2xl border-0 p-0">
          <DialogHeader className="border-b border-slate-200/70 px-6 pb-4 pt-5">
            <DialogTitle className="font-mono text-sm uppercase tracking-[0.14em] text-slate-900">
              {state.status === 'ready'
                ? `${t.download.changelog} · v${state.version}`
                : t.download.changelog}
            </DialogTitle>
            <DialogDescription className="pt-1 text-xs text-slate-500">
              {t.download.changelogDesc}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
            {state.status === 'loading' && (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                {t.download.changelogLoading}
              </div>
            )}
            {state.status === 'error' && (
              <div className="flex flex-col items-center gap-3 py-10">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-slate-500">{t.download.changelogFailed}</p>
                <button
                  type="button"
                  onClick={() => setAttempt((n) => n + 1)}
                  className="rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-cyan-600/40 hover:text-primary"
                >
                  {t.download.changelogRetry}
                </button>
              </div>
            )}
            {state.status === 'ready' && (
              <div
                className="changelog-md text-sm leading-relaxed text-slate-700"
                dangerouslySetInnerHTML={{ __html: state.html }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
