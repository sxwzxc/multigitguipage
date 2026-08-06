// POST /api/record — 访客 / 下载记录上报
// body: { type: 'visit' | 'download', path?, file?, channel? }
// 记录内容:时间、客户端 IP、User-Agent、页面路径 / 下载文件与方式;
// 写入 EdgeOne Makers Blob(store: records),key 形如 <type>/<date>/<ts>-<rand>。
// 首次调用 getStore 时平台自动创建命名空间,无需控制台操作。

import { getStore } from '@edgeone/pages-blob';

const STORE = 'records';

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
  const rand = Math.random().toString(36).slice(2, 8);
  const key = `${type}/${date}/${now.getTime()}-${rand}`;

  const record = {
    type: type === 'downloads' ? 'download' : 'visit',
    time: now.toISOString(),
    ip: clientIp(request),
    ua: request.headers.get('User-Agent') ?? '',
    path: payload?.path ?? '',
    file: payload?.file ?? '',
    channel: payload?.channel ?? '',
  };

  const store = getStore(STORE);
  await store.setJSON(key, record);
  return json({ ok: true });
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
  );
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
