import './globals.css';
import type { Metadata } from 'next';
import { zh } from '@/lib/locales/zh';
import VisitTracker from '@/components/landing/visit-tracker';

export const metadata: Metadata = {
  title: {
    default: 'MultiGitGui',
    template: '%s',
  },
  description: zh.meta.description,
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
  themeColor: '#f4f7fc',
  openGraph: {
    title: 'MultiGitGui',
    description: zh.meta.description,
    type: 'website',
    locale: 'zh_CN',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
