// POST /api/record — 访客 / 下载记录上报
// body: { type: 'visit' | 'download', path?, file?, channel? }
// 记录内容:时间、客户端 IP、地理位置（国家/地区/省份/城市）、User-Agent、页面路径 / 下载文件与方式;
// 写入 EdgeOne Makers Blob(store: records),key 形如 <type>/<date>/<ts>-<uuid>。
// 首次调用 getStore 时平台自动创建命名空间,无需控制台操作。
//
// IP / 地理位置获取:
// - 优先 Edge Functions 内置 request.eo:eo.clientIp 为真实客户端 IP,
//   eo.geo 含 countryCodeAlpha2(国家代码)/countryName/regionName/cityName 等,无需控制台配置;
// - 回退请求头:X-Forwarded-For 第一个值 / EO-Connecting-IP(回源场景),
//   国家代码回退 EO-Client-IPCountry(规则引擎"客户端 IP 地理位置"操作注入)。

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
  const geo = clientGeo(request);
  const record = {
    type: type === 'downloads' ? 'download' : 'visit',
    time: now.toISOString(),
    ip,
    country: geo.country,
    location: geo.location,
    ua: (request.headers.get('User-Agent') ?? '').slice(0, 512),
    path: clip(payload?.path),
    file: clip(payload?.file),
    channel: clip(payload?.channel),
  };

  const store = getStore(STORE);
  await store.setJSON(key, record);
  // 响应回显 IP/位置,便于上报方自检与调试
  return json({ ok: true, ip, country: geo.country, location: geo.location });
}

/** 字符串字段截断,非字符串则置空 */
function clip(v) {
  return typeof v === 'string' ? v.slice(0, MAX_FIELD) : '';
}

/**
 * 客户端真实 IP:仅信任 Edge Functions 内置 request.eo.clientIp(平台注入,不可伪造);
 * 不使用 X-Forwarded-For 等客户端可控请求头,避免 IP/位置被伪造污染后台数据。
 */
function clientIp(request) {
  const eoIp = request.eo?.clientIp;
  return typeof eoIp === 'string' ? eoIp.slice(0, 64) : '';
}

/**
 * 客户端地理位置:仅信任 request.eo.geo(平台注入,不可伪造)。
 * 含国家代码/国家名/省份/城市,无需规则引擎配置。
 */
function clientGeo(request) {
  const g = request.eo?.geo;
  if (!g) return { country: '', location: '' };
  const country = typeof g.countryCodeAlpha2 === 'string' ? g.countryCodeAlpha2 : '';
  const parts = [g.countryName, g.regionName, g.cityName].filter(
    (v) => typeof v === 'string' && v
  );
  return {
    country: country.slice(0, 8),
    location: parts.join(' · ').slice(0, 128),
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
