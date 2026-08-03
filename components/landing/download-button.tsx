'use client';

import { useState } from 'react';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { windowsInstaller } from '@/lib/installer';
import type { Translation } from '@/lib/locales/zh';

interface Props {
  t: Translation;
}

type State = 'idle' | 'downloading' | 'error';

export default function DownloadButton({ t }: Props) {
  const [state, setState] = useState<State>('idle');
  const [done, setDone] = useState(0);
  const { file, parts } = windowsInstaller;

  async function handleDownload() {
    try {
      setState('downloading');
      setDone(0);
      const buffers: ArrayBuffer[] = [];
      for (let i = 1; i <= parts; i++) {
        const res = await fetch(`/downloads/${file}.part${i}`);
        if (!res.ok) throw new Error(`part ${i} failed: ${res.status}`);
        buffers.push(await res.arrayBuffer());
        setDone(i);
      }
      const blob = new Blob(buffers, { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setState('idle');
    } catch {
      setState('error');
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleDownload}
        disabled={state === 'downloading'}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-lg shadow-cyan-600/25 transition-all hover:bg-cyan-700 disabled:cursor-wait disabled:opacity-80"
      >
        {state === 'downloading' ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {t.download.assembling} {done}/{parts}
          </>
        ) : (
          <>
            <Download className="h-3.5 w-3.5" />
            {t.download.downloadNow}
          </>
        )}
      </button>
      {state === 'error' && (
        <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] text-red-500">
          <AlertCircle className="h-3.5 w-3.5" />
          {t.download.failed}
        </p>
      )}
    </div>
  );
}
