'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Loader2, Lock, Users, Download, KeyRound } from 'lucide-react';

interface RecordItem {
  key: string;
  type: 'visit' | 'download';
  time: string;
  ip: string;
  ua: string;
  path?: string;
  file?: string;
  channel?: string;
}

interface RecordsResponse {
  items: RecordItem[];
  cursor: string | null;
  total: number;
}

const LIMIT = 50;
const STORAGE_KEY = 'mgg-admin-key';

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString('zh-CN', { hour12: false });
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [key, setKey] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [tab, setTab] = useState<'visit' | 'download'>('visit');
  const [items, setItems] = useState<RecordItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  // 恢复本会话已登录状态(密码仅存 sessionStorage)
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setKey(saved);
      setAuthed(true);
    }
  }, []);

  async function fetchRecords(
    type: 'visit' | 'download',
    c: string | null,
    k: string
  ): Promise<RecordsResponse | null> {
    const params = new URLSearchParams({ type, limit: String(LIMIT) });
    if (c) params.set('cursor', c);
    const res = await fetch(`/api/records?${params}`, {
      headers: { 'X-Admin-Key': k },
    });
    if (res.status === 401) {
      setAuthed(false);
      setAuthError('密码错误,请重新登录');
      return null;
    }
    if (!res.ok) {
      setLoadError(`加载失败 (HTTP ${res.status})`);
      return null;
    }
    return (await res.json()) as RecordsResponse;
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (!password) return;
    setAuthError('');
    setLoading(true);
    try {
      const data = await fetchRecords('visit', null, password);
      if (data) {
        setKey(password);
        sessionStorage.setItem(STORAGE_KEY, password);
        setAuthed(true);
        setTab('visit');
        setItems(data.items);
        setCursor(data.cursor);
        setTotal(data.total);
      }
    } catch {
      setAuthError('网络错误,请重试');
    } finally {
      setLoading(false);
    }
  }

  async function switchTab(type: 'visit' | 'download') {
    if (!key) return;
    setTab(type);
    setItems([]);
    setCursor(null);
    setTotal(0);
    setLoadError('');
    setLoading(true);
    try {
      const data = await fetchRecords(type, null, key);
      if (data) {
        setItems(data.items);
        setCursor(data.cursor);
        setTotal(data.total);
      }
    } catch {
      setLoadError('网络错误,请重试');
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (!key || !cursor || loading) return;
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchRecords(tab, cursor, key);
      if (data) {
        setItems((prev) => [...prev, ...data.items]);
        setCursor(data.cursor);
        setTotal(data.total);
      }
    } catch {
      setLoadError('网络错误,请重试');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        {!authed ? (
          /* ---- 登录 ---- */
          <form
            onSubmit={handleLogin}
            className="glass-card mx-auto mt-16 max-w-sm rounded-2xl p-8"
          >
            <div className="flex items-center justify-center gap-2 text-slate-900">
              <Lock className="h-5 w-5 text-primary" />
              <h1 className="font-mono text-sm font-semibold uppercase tracking-[0.14em]">
                MultiGitGui Admin
              </h1>
            </div>
            <p className="mt-2 text-center text-xs text-slate-500">
              访客与下载记录管理
            </p>
            <label className="mt-6 block text-xs font-medium text-slate-600">
              访问密码
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入 ADMIN_KEY"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-600/50 focus:ring-2 focus:ring-cyan-600/20"
              />
            </label>
            {authError && <p className="mt-3 text-xs text-red-500">{authError}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-600/25 transition-all hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> 验证中…
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" /> 登录
                </>
              )}
            </button>
          </form>
        ) : (
          /* ---- 管理视图 ---- */
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="font-mono text-base font-semibold uppercase tracking-[0.14em] text-slate-900">
                记录管理
              </h1>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem(STORAGE_KEY);
                  setAuthed(false);
                  setKey(null);
                  setPassword('');
                }}
                className="rounded-full border border-slate-300 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-red-400/60 hover:text-red-500"
              >
                退出登录
              </button>
            </div>

            {/* Tab 切换 */}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => switchTab('visit')}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === 'visit'
                    ? 'bg-primary text-white shadow-lg shadow-cyan-600/25'
                    : 'border border-slate-300 bg-white/70 text-slate-600 hover:text-primary'
                }`}
              >
                <Users className="h-4 w-4" /> 访客记录
                <span className="text-xs opacity-80">{tab === 'visit' ? total : ''}</span>
              </button>
              <button
                type="button"
                onClick={() => switchTab('download')}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === 'download'
                    ? 'bg-primary text-white shadow-lg shadow-cyan-600/25'
                    : 'border border-slate-300 bg-white/70 text-slate-600 hover:text-primary'
                }`}
              >
                <Download className="h-4 w-4" /> 下载记录
                <span className="text-xs opacity-80">{tab === 'download' ? total : ''}</span>
              </button>
            </div>

            {/* 记录表格 */}
            <div className="glass-card mt-4 overflow-hidden rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200/70 bg-white/40 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">
                      <th className="px-4 py-3">时间</th>
                      <th className="px-4 py-3">IP</th>
                      <th className="px-4 py-3">浏览器 / UA</th>
                      {tab === 'visit' ? (
                        <th className="px-4 py-3">页面</th>
                      ) : (
                        <th className="px-4 py-3">文件</th>
                      )}
                      {tab === 'download' && <th className="px-4 py-3">方式</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it) => (
                      <tr
                        key={it.key}
                        className="border-b border-slate-100 transition-colors last:border-0 hover:bg-cyan-500/5"
                      >
                        <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-600">
                          {fmtTime(it.time)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-800">
                          {it.ip || '—'}
                        </td>
                        <td
                          className="max-w-[260px] truncate px-4 py-2.5 font-mono text-[11px] text-slate-500"
                          title={it.ua}
                        >
                          {truncate(it.ua || '—', 56)}
                        </td>
                        {tab === 'visit' ? (
                          <td className="px-4 py-2.5 font-mono text-xs text-slate-600">
                            {it.path || '—'}
                          </td>
                        ) : (
                          <td className="px-4 py-2.5 font-mono text-xs text-slate-600">
                            {it.file || '—'}
                          </td>
                        )}
                        {tab === 'download' && (
                          <td className="px-4 py-2.5">
                            <span
                              className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide ${
                                it.channel === 'direct'
                                  ? 'bg-cyan-500/10 text-cyan-700'
                                  : 'bg-violet-500/10 text-violet-700'
                              }`}
                            >
                              {it.channel === 'direct' ? '直链' : '分片'}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                    {!loading && items.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-400">
                          暂无记录
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {loadError && (
                <p className="border-t border-slate-200/70 px-4 py-2.5 text-xs text-red-500">
                  {loadError}
                </p>
              )}

              <div className="flex items-center justify-between border-t border-slate-200/70 bg-white/40 px-4 py-3">
                <span className="font-mono text-[11px] text-slate-500">
                  共 {total} 条 · 每页 {LIMIT} 条
                </span>
                {cursor ? (
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loading}
                    className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-white/70 px-4 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-cyan-600/40 hover:text-primary disabled:cursor-wait disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> 加载中…
                      </>
                    ) : (
                      '加载更多'
                    )}
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">已全部加载</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
