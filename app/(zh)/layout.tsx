import '../globals.css';
import type { ReactNode } from 'react';
import RootHtml from '@/components/root-html';
import { rootMetadata } from '@/lib/seo';

export const metadata = rootMetadata('zh');

export default function ZhRootLayout({ children }: { children: ReactNode }) {
  return <RootHtml lang="zh-CN">{children}</RootHtml>;
}
