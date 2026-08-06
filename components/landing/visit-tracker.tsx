'use client';

import { useEffect } from 'react';
import { reportRecord } from '@/lib/record';

/**
 * 页面加载时静默上报一次访客记录(路径由前端提供,时间/IP/UA 由服务端函数补充)。
 * 挂载在根布局,`/` 与 `/en` 均生效;渲染为空,不影响页面。
 */
export default function VisitTracker() {
  useEffect(() => {
    // /admin 管理页自身的访问不计入访客记录
    if (window.location.pathname.startsWith('/admin')) return;
    reportRecord({ type: 'visit', path: window.location.pathname });
  }, []);
  return null;
}
