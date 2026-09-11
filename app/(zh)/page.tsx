import JsonLd from '@/components/json-ld';
import Landing from '@/components/landing';
import { landingJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('zh');

export default function Page() {
  return (
    <>
      <JsonLd data={landingJsonLd('zh')} />
      <Landing lang="zh" />
    </>
  );
}
