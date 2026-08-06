// POST /api/record — 访客 / 下载记录上报
// body: { type: 'visit' | 'download', path?, file?, channel? }
// 记录内容:时间、客户端 IP、User-Agent、页面路径 / 下载文件与方式;
// 写入 EdgeOne Makers Blob(store: records),key 形如 <type>/<date>/<ts>-<uuid>。
// 首次调用 getStore 时平台自动创建命名空间,无需控制台操作。

import { getStore } from '@edgeone/pages-blob';

const STORE = 'records';
const MAX_FIELD = 256; // path/file/channel 字段长度上限,防恶意膨胀

export async function onRequestPost(context) {
  const { request } = context;
  let payload = {};
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid json' }, 400);
  }

  const type = payload?.type === 'download' ? 'downloads' : 'visits';
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const key = `${type}/${date}/${now.getTime()}-${crypto.randomUUID()}`;

  const record = {
    type: type === 'downloads' ? 'download' : 'visit',
    time: now.toISOString(),
    ip: clientIp(request),
    ua: (request.headers.get('User-Agent') ?? '').slice(0, 512),
    path: clip(payload?.path),
    file: clip(payload?.file),
    channel: clip(payload?.channel),
  };

  const store = getStore(STORE);
  await store.setJSON(key, record);
  return json({ ok: true });
}

/** 字符串字段截断,非字符串则置空 */
function clip(v) {
  return typeof v === 'string' ? v.slice(0, MAX_FIELD) : '';
}

/** 从常见边缘请求头探测真实客户端 IP */
function clientIp(request) {
  const fwd = request.headers.get('X-Forwarded-For') ?? '';
  return (
    request.headers.get('EO-Client-IP') ||
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('True-Client-IP') ||
    fwd.split(',')[0].trim() ||
    ''
  ).slice(0, 64);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
