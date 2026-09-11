import JsonLd from '@/components/json-ld';
import Landing from '@/components/landing';
import { landingJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('en');

export default function Page() {
  return (
    <>
      <JsonLd data={landingJsonLd('en')} />
      <Landing lang="en" />
    </>
  );
}
