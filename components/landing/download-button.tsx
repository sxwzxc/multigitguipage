'use client';

import { useRef, useState } from 'react';
import { Download, Loader2, AlertCircle, ShieldCheck, TriangleAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { windowsInstaller } from '@/lib/installer';
import type { Translation } from '@/lib/locales/zh';

interface Props {
  t: Translation;
}

type Phase = 'idle' | 'downloading' | 'merging' | 'done' | 'error';

const MB = 1024 * 1024;

function formatEta(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function DownloadButton({ t }: Props) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [percent, setPercent] = useState(0);
  const [doneParts, setDoneParts] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [eta, setEta] = useState<number | null>(null);
  const statsRef = useRef({ startedAt: 0, bytes: 0, lastUiAt: 0 });

  const { file, parts, size } = windowsInstaller;
  const canClose = phase === 'idle' || phase === 'done' || phase === 'error';
  const busy = phase === 'downloading' || phase === 'merging';

  /** 基于累计字节/耗时计算速度、剩余时间与进度，300ms 节流刷新 UI */
  function updateStats() {
    const s = statsRef.current;
    const now = Date.now();
    const dt = (now - s.startedAt) / 1000;
    if (dt <= 0 || s.bytes <= 0) return;
    const avg = s.bytes / dt / MB;
    if (now - s.lastUiAt >= 300) {
      s.lastUiAt = now;
      setSpeed(avg);
      setEta(avg > 0 ? (size - s.bytes) / MB / avg : null);
      setPercent(Math.min(99, Math.round((s.bytes / size) * 100)));
    }
  }

  /** 流式下载单个分片，边下载边累计字节数，速度实时更新 */
  async function fetchPart(i: number): Promise<ArrayBuffer> {
    const res = await fetch(`/downloads/${file}.part${i}`);
    if (!res.ok) throw new Error(`part ${i} failed: ${res.status}`);
    const s = statsRef.current;
    if (!res.body) {
      const buf = await res.arrayBuffer();
      s.bytes += buf.byteLength;
      return buf;
    }
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        total += value.byteLength;
        s.bytes += value.byteLength;
        updateStats();
      }
    }
    const merged = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return merged.buffer as ArrayBuffer;
  }

  async function handleDownload() {
    setOpen(true);
    setPhase('downloading');
    setPercent(0);
    setDoneParts(0);
    setSpeed(0);
    setEta(null);
    const s = statsRef.current;
    s.startedAt = Date.now();
    s.bytes = 0;
    s.lastUiAt = 0;
    let completed = 0;
    const markPartDone = () => {
      completed += 1;
      setDoneParts(completed);
    };
    try {
      // 并行下载所有分片，完成后按序号拼接
      const buffers = await Promise.all(
        Array.from({ length: parts }, (_, idx) =>
          fetchPart(idx + 1).then((buf) => {
            markPartDone();
            return buf;
          })
        )
      );
      setPhase('merging');
      setPercent(100);
      setEta(null);
      const blob = new Blob(buffers, { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setPhase('done');
    } catch {
      setPhase('error');
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleDownload}
        disabled={busy}
        className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white/50 px-3 py-2 font-mono text-[11px] font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-800 disabled:cursor-wait disabled:opacity-70"
      >
        {busy ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
            {t.download.assembling} {doneParts}/{parts}
          </>
        ) : (
          <>
            <Download className="h-3 w-3" />
            {t.download.altLabel}
          </>
        )}
      </button>

      <Dialog open={open} onOpenChange={(v) => (v || canClose) && setOpen(v)}>
        <DialogContent
          className="glass-card max-w-md rounded-2xl border-0 p-6"
          hideClose={busy}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.14em] text-slate-900">
              {t.download.dialogTitle}
              <span className="font-mono text-[10px] normal-case tracking-normal text-slate-400">
                {file}
              </span>
            </DialogTitle>
            <DialogDescription className="pt-1 text-xs leading-relaxed text-slate-500">
              {t.download.dialogNotice}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Progress value={percent} className="h-2.5 rounded-full bg-slate-200/80" />

            <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
              <span>
                {t.download.speed}{' '}
                <span className="text-slate-800">{speed.toFixed(1)} MB/s</span>
              </span>
              <span>
                {t.download.eta}{' '}
                <span className="text-slate-800">
                  {eta === null ? '--:--' : formatEta(eta)}
                </span>
              </span>
              <span className="text-slate-400">{percent}%</span>
            </div>

            <div
              role="status"
              className="flex items-center gap-2 rounded-lg border border-slate-200/70 bg-white/50 px-3 py-2 font-mono text-[11px] text-slate-600"
            >
              {phase === 'downloading' && (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  {t.download.assembling} {doneParts}/{parts}
                </>
              )}
              {phase === 'merging' && (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  {t.download.merging}
                </>
              )}
              {phase === 'done' && (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  {t.download.done}
                </>
              )}
              {phase === 'error' && (
                <>
                  <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                  {t.download.failed}
                </>
              )}
            </div>

            {phase === 'downloading' && (
              <p className="flex items-start gap-1.5 font-mono text-[10px] leading-4 text-amber-600">
                <TriangleAlert className="mt-0.5 h-3 w-3 shrink-0" />
                {t.download.dialogNotice}
              </p>
            )}
          </div>

          {(phase === 'done' || phase === 'error') && (
            <DialogFooter>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-full border border-slate-200 bg-white/70 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900 sm:w-auto"
              >
                {t.download.close}
              </button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
