import './globals.css';
import type { Metadata } from 'next';
import { zh } from '@/lib/locales/zh';

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
  themeColor: '#0a0e14',
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
      <body>{children}</body>
    </html>
  );
}
