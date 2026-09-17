import type { Metadata } from 'next';
import { en } from '@/lib/locales/en';
import { zh, type Lang } from '@/lib/locales/zh';
import { windowsInstaller } from '@/lib/installer';
import {
  LANGUAGE_ALTERNATES,
  OG_IMAGE,
  SITE_ALTERNATE_NAMES,
  SITE_NAME,
  SITE_ORIGIN,
} from '@/lib/site';

const INDEX_ROBOTS: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

function localeOf(lang: Lang) {
  return lang === 'zh' ? zh : en;
}

function pathOf(lang: Lang) {
  return lang === 'zh' ? '/' : '/en';
}

function ogLocaleOf(lang: Lang) {
  return lang === 'zh' ? 'zh_CN' : 'en_US';
}

function htmlLangOf(lang: Lang) {
  return lang === 'zh' ? 'zh-CN' : 'en';
}

function softwareVersion(): string {
  const match = windowsInstaller.file.match(/MultiGitGui-Setup-(.+)\.exe$/i);
  return match?.[1] ?? windowsInstaller.file;
}

export function rootMetadata(lang: Lang): Metadata {
  const t = localeOf(lang);
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: {
      default: SITE_NAME,
      template: '%s',
    },
    description: t.meta.description,
    keywords: [...t.meta.keywords],
    category: 'software',
    icons: {
      icon: '/favicon.ico',
      apple: '/logo.png',
    },
    themeColor: '#f4f7fc',
    robots: INDEX_ROBOTS,
    other: {
      'tdm-reservation': '0',
      bingbot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    },
    openGraph: {
      siteName: SITE_NAME,
      type: 'website',
      locale: ogLocaleOf(lang),
      alternateLocale: lang === 'zh' ? ['en_US'] : ['zh_CN'],
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      images: [OG_IMAGE.url],
    },
  };
}

export function pageMetadata(lang: Lang): Metadata {
  const t = localeOf(lang);
  const path = pathOf(lang);
  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: [...t.meta.keywords],
    alternates: {
      canonical: path,
      languages: { ...LANGUAGE_ALTERNATES },
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      type: 'website',
      locale: ogLocaleOf(lang),
      alternateLocale: lang === 'zh' ? ['en_US'] : ['zh_CN'],
      url: path,
      siteName: SITE_NAME,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.title,
      description: t.meta.description,
      images: [OG_IMAGE.url],
    },
  };
}

export function landingJsonLd(lang: Lang) {
  const t = localeOf(lang);
  const path = pathOf(lang);
  const pageUrl = `${SITE_ORIGIN}${path === '/' ? '/' : path}`;
  const logoUrl = `${SITE_ORIGIN}${OG_IMAGE.url}`;
  const version = softwareVersion();

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        name: SITE_NAME,
        alternateName: [...SITE_ALTERNATE_NAMES],
        url: SITE_ORIGIN,
        inLanguage: htmlLangOf(lang),
        description: t.meta.description,
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_ORIGIN}/#app`,
        name: SITE_NAME,
        alternateName: [...SITE_ALTERNATE_NAMES],
        url: pageUrl,
        image: logoUrl,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Windows, macOS, Linux',
        softwareVersion: version,
        downloadUrl: windowsInstaller.directUrl,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'CNY',
        },
        inLanguage: htmlLangOf(lang),
        description: t.meta.description,
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        inLanguage: htmlLangOf(lang),
        mainEntity: t.faq.items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };
}
