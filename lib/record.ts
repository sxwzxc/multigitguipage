/**
 * 访客 / 下载记录上报工具。
 * POST 到 Edge Function /api/record,由服务端补充时间、IP、User-Agent 并写入 Blob。
 * 上报为静默 fire-and-forget:失败不影响用户操作(keepalive 保证跳转/关页时送达)。
 */

interface RecordPayload {
  type: 'visit' | 'download';
  path?: string;
  file?: string;
  channel?: string;
}

export function reportRecord(payload: RecordPayload) {
  try {
    fetch('/api/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      /* 静默失败 */
    });
  } catch {
    /* 静默失败 */
  }
}
