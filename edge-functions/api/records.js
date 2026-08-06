// GET /api/records?type=visit|download|feedback&cursor=&limit= — 管理端查询访客/下载/反馈记录
// 鉴权:请求头 X-Admin-Key 必须与环境变量 ADMIN_KEY 一致,否则 401。
// 从 Blob(store: records)按前缀列出,key 倒序(最新在前),游标分页。

import { getStore } from '@edgeone/pages-blob';

const STORE = 'records';
const TYPE_PREFIX = {
  visit: 'visits',
  download: 'downloads',
  feedback: 'feedbacks',
};

export async function onRequestGet(context) {
  const { request, env } = context;

  const adminKey = env.ADMIN_KEY;
  if (!adminKey) {
    return json({ error: 'ADMIN_KEY not configured' }, 500);
  }
  const url = new URL(request.url);
  // 仅接受请求头传递密钥,避免密钥进入 URL(访问日志/浏览器历史/Referer 泄露面)
  const provided = request.headers.get('X-Admin-Key') ?? '';
  if (provided !== adminKey) {
    return json({ error: 'unauthorized' }, 401);
  }

  const type = TYPE_PREFIX[url.searchParams.get('type')] ?? 'visits';
  const limit = Math.max(1, Math.min(Number(url.searchParams.get('limit')) || 50, 200));
  const cursor = url.searchParams.get('cursor');

  const store = getStore(STORE);
  const { blobs } = await store.list({ prefix: `${type}/`, consistency: 'strong' });

  // key 形如 <type>/<date>/<ts>-<rand>,字典序倒排 = 时间最新在前
  blobs.sort((a, b) => (a.key < b.key ? 1 : a.key > b.key ? -1 : 0));

  let start = 0;
  if (cursor) {
    const idx = blobs.findIndex((b) => b.key === cursor);
    start = idx >= 0 ? idx + 1 : blobs.length;
  }

  const page = blobs.slice(start, start + limit);
  const items = [];
  for (const b of page) {
    const rec = await store.get(b.key, { type: 'json', consistency: 'strong' });
    if (rec) items.push({ key: b.key, ...rec });
  }

  return json({
    items,
    cursor: page.length ? page[page.length - 1].key : null,
    total: blobs.length,
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
