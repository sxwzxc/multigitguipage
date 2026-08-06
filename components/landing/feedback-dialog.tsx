'use client';

import { useState, type FormEvent } from 'react';
import { MessageSquare, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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

type Status = 'idle' | 'sending' | 'success' | 'error';

/** 从 User-Agent 轻量解析操作系统,用于预填"系统信息"字段 */
function detectOs(): string {
  if (typeof navigator === 'undefined') return '';
  const ua = navigator.userAgent;
  if (/Windows NT 10\.0/.test(ua)) return 'Windows 10/11';
  if (/Windows NT 6\.3/.test(ua)) return 'Windows 8.1';
  if (/Windows/.test(ua)) return 'Windows';
  if (/Mac OS X/.test(ua)) {
    const m = /Mac OS X (\d+[._]\d+)/.exec(ua);
    return m ? `macOS ${m[1].replace('_', '.')}` : 'macOS';
  }
  if (/Android/.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  if (/Linux/.test(ua)) return 'Linux';
  return '';
}

const inputCls =
  'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-600/50 focus:ring-2 focus:ring-cyan-600/20';

const labelCls = 'block text-xs font-medium text-slate-600';

/**
 * 意见反馈入口:Footer 按钮 → Dialog 表单(昵称/联系方式/系统/内容/其他),
 * 提交 POST /api/feedback(IP/位置/时间由服务端注入),成功或失败内联提示。
 */
export default function FeedbackDialog({ t }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [nickname, setNickname] = useState('');
  const [contact, setContact] = useState('');
  const [os, setOs] = useState('');
  const [content, setContent] = useState('');
  const [extra, setExtra] = useState('');

  const openDialog = () => {
    setOpen(true);
    setStatus('idle');
    if (!os) setOs(detectOs());
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, contact, os, content, extra }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('success');
      setNickname('');
      setContact('');
      setContent('');
      setExtra('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 transition-colors hover:text-primary"
      >
        <MessageSquare className="h-3.5 w-3.5" />
        {t.feedback.button}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-card max-w-lg rounded-2xl border-0 p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.14em] text-slate-900">
              <MessageSquare className="h-4 w-4 text-primary" />
              {t.feedback.title}
            </DialogTitle>
            <DialogDescription className="pt-1 text-xs leading-relaxed text-slate-500">
              {t.feedback.desc}
            </DialogDescription>
          </DialogHeader>

          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              <p className="text-sm font-medium text-slate-700">{t.feedback.success}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-full border border-slate-200 bg-white/70 px-5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-cyan-600/40 hover:text-primary"
              >
                OK
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <label className={labelCls}>
                  {t.feedback.nickname}
                  <span className="ml-1 text-slate-300">({t.feedback.optional})</span>
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={64}
                    className={inputCls}
                  />
                </label>
                <label className={labelCls}>
                  {t.feedback.contact}
                  <span className="ml-1 text-slate-300">({t.feedback.optional})</span>
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    maxLength={128}
                    placeholder="email / 微信 / QQ…"
                    className={inputCls}
                  />
                </label>
              </div>

              <label className={labelCls}>
                {t.feedback.os}
                <span className="ml-1 text-slate-300">({t.feedback.optional})</span>
                <input
                  value={os}
                  onChange={(e) => setOs(e.target.value)}
                  maxLength={128}
                  className={inputCls}
                />
              </label>

              <label className={labelCls}>
                {t.feedback.content}
                <span className="text-red-400"> *</span>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={2000}
                  rows={4}
                  placeholder="…"
                  className={`${inputCls} resize-y`}
                />
              </label>

              <label className={labelCls}>
                {t.feedback.extra}
                <span className="ml-1 text-slate-300">({t.feedback.optional})</span>
                <input
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  maxLength={512}
                  className={inputCls}
                />
              </label>

              {status === 'error' && (
                <p className="flex items-center gap-1.5 text-xs text-red-500">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {t.feedback.failed}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending' || !content.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-600/25 transition-all hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> {t.feedback.sending}
                  </>
                ) : (
                  t.feedback.submit
                )}
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
