import type { ReactNode } from 'react';
import VisitTracker from '@/components/landing/visit-tracker';

export default function RootHtml({
  lang,
  children,
}: {
  lang: 'zh-CN' | 'en';
  children: ReactNode;
}) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <body>
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
