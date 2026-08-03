import type { Metadata } from 'next';
import Landing from '@/components/landing';
import { en } from '@/lib/locales/en';

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
};

export default function Page() {
  return <Landing lang="en" />;
}
