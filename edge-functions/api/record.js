// POST /api/record — 访客 / 下载记录上报
// body: { type: 'visit' | 'download', path?, file?, channel? }
// 记录内容:时间、客户端 IP、地理位置（国家/地区）、User-Agent、页面路径 / 下载文件与方式;
// 写入 EdgeOne Makers Blob(store: records),key 形如 <type>/<date>/<ts>-<uuid>。
// 首次调用 getStore 时平台自动创建命名空间,无需控制台操作。
//
// IP / 地理位置获取(EdgeOne 官方文档):
// - 真实 IP:X-Forwarded-For 第一个值(前序代理链路起点)优先,其次 EO-Connecting-IP;
// - 国家/地区:需在 EdgeOne 控制台 站点加速 → 规则引擎 开启"客户端 IP 地理位置"操作
//   (匹配条件选 HOST 指向本站域名,自定义头部默认 EO-Client-IPCountry),未配置时为空。

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

  const ip = clientIp(request);
  const country = clientCountry(request);
  const record = {
    type: type === 'downloads' ? 'download' : 'visit',
    time: now.toISOString(),
    ip,
    country,
    ua: (request.headers.get('User-Agent') ?? '').slice(0, 512),
    path: clip(payload?.path),
    file: clip(payload?.file),
    channel: clip(payload?.channel),
  };

  const store = getStore(STORE);
  await store.setJSON(key, record);
  // 响应回显 IP/国家,便于上报方自检与调试
  return json({ ok: true, ip, country });
}

/** 字符串字段截断,非字符串则置空 */
function clip(v) {
  return typeof v === 'string' ? v.slice(0, MAX_FIELD) : '';
}

/**
 * 真实客户端 IP:EdgeOne 回源默认携带 X-Forwarded-For(取第一个 IP),
 * EO-Connecting-IP 为与 EdgeOne 建连的客户端 IP;其余头部作兼容回退。
 */
function clientIp(request) {
  const fwd = request.headers.get('X-Forwarded-For') ?? '';
  return (
    fwd.split(',')[0].trim() ||
    request.headers.get('EO-Connecting-IP') ||
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('True-Client-IP') ||
    ''
  ).slice(0, 64);
}

/**
 * 客户端地理位置(ISO 3166-1 alpha-2 国家/地区代码)。
 * 依赖规则引擎"客户端 IP 地理位置"操作注入,默认头部名 EO-Client-IPCountry;
 * 同时兼容常见自定义命名。
 */
function clientCountry(request) {
  return (
    request.headers.get('EO-Client-IPCountry') ||
    request.headers.get('EO-Client-IP-Country') ||
    request.headers.get('X-Client-IP-Country') ||
    ''
  ).slice(0, 8);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
