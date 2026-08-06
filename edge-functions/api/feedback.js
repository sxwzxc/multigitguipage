// POST /api/feedback — 意见反馈提交
// body: { nickname?, contact?, os?, content(必填), extra? }
// 服务端自动注入:time(ISO 时间)、ip、country、location、完整 ua;
// 写入 EdgeOne Makers Blob(store: records),key 形如 feedbacks/<date>/<ts>-<uuid>。
//
// 说明:单文件自包含(util 与 record.js 内联同款),避免跨文件 import 的平台兼容性风险。

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

  const content = typeof payload?.content === 'string' ? payload.content.trim() : '';
  if (!content) {
    return json({ ok: false, error: 'content required' }, 400);
  }

  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const key = `feedbacks/${date}/${now.getTime()}-${crypto.randomUUID()}`;

  const ip = clientIp(request);
  const geo = clientGeo(request);
  const record = {
    type: 'feedback',
    time: now.toISOString(),
    ip,
    country: geo.country,
    location: geo.location,
    ua: (request.headers.get('User-Agent') ?? '').slice(0, 512),
    nickname: clip(payload?.nickname, 64),
    contact: clip(payload?.contact, 128),
    os: clip(payload?.os, 128),
    content: content.slice(0, 2000),
    extra: clip(payload?.extra, 512),
  };

  const store = getStore(STORE);
  await store.setJSON(key, record);
  // 回显服务端注入字段,便于上报方自检
  return json({
    ok: true,
    time: record.time,
    ip,
    country: geo.country,
    location: geo.location,
  });
}

/** 字符串字段截断,非字符串则置空 */
function clip(v, max) {
  return typeof v === 'string' ? v.slice(0, max) : '';
}

/**
 * 客户端真实 IP:优先 request.eo.clientIp(Edge Functions 内置),
 * 回退 X-Forwarded-For 第一个值 / EO-Connecting-IP 等请求头。
 */
function clientIp(request) {
  const eoIp = request.eo?.clientIp;
  if (typeof eoIp === 'string' && eoIp) return eoIp.slice(0, 64);
  const fwd = request.headers.get('X-Forwarded-For') ?? '';
  return (
    fwd.split(',')[0].trim() ||
    request.headers.get('EO-Connecting-IP') ||
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('True-Client-IP') ||
    ''
  ).slice(0, 64);
}

/** 客户端地理位置:优先 request.eo.geo,回退规则引擎注入的 EO-Client-IPCountry */
function clientGeo(request) {
  const g = request.eo?.geo;
  if (g) {
    const country = typeof g.countryCodeAlpha2 === 'string' ? g.countryCodeAlpha2 : '';
    const parts = [g.countryName, g.regionName, g.cityName].filter(
      (v) => typeof v === 'string' && v
    );
    return {
      country: country.slice(0, 8),
      location: parts.join(' · ').slice(0, 128),
    };
  }
  const headerCountry =
    request.headers.get('EO-Client-IPCountry') ||
    request.headers.get('EO-Client-IP-Country') ||
    request.headers.get('X-Client-IP-Country') ||
    '';
  return { country: headerCountry.slice(0, 8), location: '' };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
