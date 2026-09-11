/** Canonical origin of the public website. No trailing slash. */
export const SITE_ORIGIN = 'https://multigit.sxwzxc.cn';

export const SITE_NAME = 'MultiGitGui';

export const SITE_ALTERNATE_NAMES = ['MultiGit', 'multigitgui', 'multigit'] as const;

export const OG_IMAGE = {
  url: '/logo.png',
  width: 512,
  height: 512,
  alt: 'MultiGitGui',
} as const;

export const LANGUAGE_ALTERNATES = {
  'zh-CN': '/',
  en: '/en',
  'x-default': '/',
} as const;
