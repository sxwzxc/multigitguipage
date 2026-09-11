import '../globals.css';
import type { ReactNode } from 'react';
import RootHtml from '@/components/root-html';
import { rootMetadata } from '@/lib/seo';

export const metadata = rootMetadata('en');

export default function EnRootLayout({ children }: { children: ReactNode }) {
  return <RootHtml lang="en">{children}</RootHtml>;
}
