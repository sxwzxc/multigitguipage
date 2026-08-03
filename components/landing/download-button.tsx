'use client';

import { useEffect, useRef, useState } from 'react';
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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statsRef = useRef({ startedAt: 0, bytes: 0, avgSpeed: 0 });

  const { file, parts, size } = windowsInstaller;
  const canClose = phase === 'idle' || phase === 'done' || phase === 'error';
  const busy = phase === 'downloading' || phase === 'merging';

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function updateStats() {
    const s = statsRef.current;
    const dt = (Date.now() - s.startedAt) / 1000;
    if (dt < 1) return;
    const instant = s.bytes / dt / MB;
    s.avgSpeed = s.avgSpeed === 0 ? instant : s.avgSpeed * 0.7 + instant * 0.3;
    setSpeed(s.avgSpeed);
    const remain = (size - s.bytes) / MB;
    setEta(s.avgSpeed > 0 ? remain / s.avgSpeed : null);
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
    s.avgSpeed = 0;
    timerRef.current = setInterval(updateStats, 1000);
    const buffers: ArrayBuffer[] = [];
    try {
      for (let i = 1; i <= parts; i++) {
        const res = await fetch(`/downloads/${file}.part${i}`);
        if (!res.ok) throw new Error(`part ${i} failed: ${res.status}`);
        buffers.push(await res.arrayBuffer());
        s.bytes += buffers[buffers.length - 1].byteLength;
        setDoneParts(i);
        setPercent(Math.min(99, Math.round((s.bytes / size) * 100)));
      }
      if (timerRef.current) clearInterval(timerRef.current);
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
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase('error');
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleDownload}
        disabled={busy}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-lg shadow-cyan-600/25 transition-all hover:bg-cyan-700 disabled:cursor-wait disabled:opacity-80"
      >
        {busy ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {t.download.assembling} {doneParts}/{parts}
          </>
        ) : (
          <>
            <Download className="h-3.5 w-3.5" />
            {t.download.downloadNow}
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
                {t.download.speed} <span className="text-slate-800">{speed.toFixed(1)} MB/s</span>
              </span>
              <span>
                {t.download.eta}{' '}
                <span className="text-slate-800">
                  {eta === null ? '--:--' : formatEta(eta)}
                </span>
              </span>
              <span className="text-slate-400">
                {percent}%
              </span>
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
