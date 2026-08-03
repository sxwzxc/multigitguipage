import type { Translation } from './zh';

export const en: Translation = {
  lang: 'en',
  meta: {
    title: 'MultiGitGui — One project, every repository',
    description:
      'A cross-platform Git desktop GUI built for multi-repository workflows. Powered by .NET 10 and Avalonia, for Windows, macOS and Linux.',
  },
  nav: {
    features: 'Features',
    download: 'Download',
    faq: 'FAQ',
    switchLang: '中',
  },
  hero: {
    badge: 'v1.1.5 · Cross-platform · Free & open source',
    title1: 'One project, ',
    title2: 'every repository',
    subtitle:
      'MultiGitGui is a cross-platform Git desktop client built for multi-repository workflows. Group every repository involved in one piece of work into a project, then fetch, pull, push, checkout, reset and stash run across the whole project — while each repository keeps its own branch, upstream and state.',
    ctaDownload: 'Download MultiGitGui',
    ctaFeatures: 'Explore features',
    platformNote: 'Windows 10+ · macOS 12+ · Linux x64 / arm64',
  },
  mockup: {
    windowTitle: 'MultiGitGui — Overview',
    sidebar: ['Projects', 'Changes', 'History', 'Refs', 'Files', 'Blame', 'Search'],
    repo: 'Repository',
    branch: 'Branch',
    ahead: 'Ahead',
    behind: 'Behind',
    status: 'Status',
    synced: 'Synced',
    modified: 'Modified',
    conflict: 'Conflict',
  },
  features: {
    title: 'Designed for real multi-repo workflows',
    subtitle:
      'Most Git GUIs are designed around a single repository. MultiGitGui is designed around work that spans several repositories — operations run project-wide while every repository stays independent.',
    items: [
      {
        title: 'Projects → repositories',
        desc: 'Add repositories one by one, scan a folder tree, or clone several at once. Repositories can be excluded from batch operations individually.',
      },
      {
        title: 'Batch ops that respect each repo',
        desc: 'A push uses each repository’s own branch and upstream; a checkout inspects every repository first and tells you which will switch, which will track, and which are skipped.',
      },
      {
        title: 'Gerrit code review push',
        desc: 'refs/for/<branch> is derived per repository or pinned project-wide. Topic, reviewers, WIP, private and more are passed as separate -o options.',
      },
      {
        title: 'Aggregated views',
        desc: 'An Overview grid shows branch and ahead/behind per repository; a Changes tab merges all working trees; a History tab interleaves commits from every repository by time.',
      },
      {
        title: 'Full single-repository workflow',
        desc: 'File-, hunk- and line-level staging, commit, amend, conflict resolution, branches, tags, remotes, stashes, submodules, side-by-side diff and blame that walks history.',
      },
      {
        title: 'Cross-repo search & command palette',
        desc: 'Search commit messages, authors, SHAs, file contents and names. The command palette and Ctrl+1…Ctrl+7 keep common actions keyboard-accessible.',
      },
      {
        title: 'Previewed history operations',
        desc: 'Merge and rebase dialogs preview the per-repository plan before running; interactive rebase supports reordering and pick/reword/edit/squash/fixup/drop.',
      },
      {
        title: 'Portable data & Git',
        desc: 'Settings, workspace, logs, cache and backups each have their own relocatable path with migration previews. The Git executable and environment are fully configurable.',
      },
      {
        title: 'Auditable output panel',
        desc: 'Every Git invocation is logged with a redacted command line, exit code and output. URL credentials, tokens and auth headers never reach the log or the screen.',
      },
    ],
  },
  download: {
    title: 'Download',
    subtitle: 'The Windows installer is ready; macOS and Linux builds are coming soon.',
    version: 'Current version',
    comingSoon: 'Coming soon',
    downloadNow: 'Download now',
    assembling: 'Downloading & assembling installer',
    failed: 'Download failed, please retry',
    shaLabel: 'SHA-256 checksum',
    dialogTitle: 'Download MultiGitGui',
    dialogNotice:
      'Installer parts are downloaded and assembled in your browser. Keep this page open — closing or refreshing will interrupt the download.',
    merging: 'Assembling installer…',
    done: 'Download complete',
    close: 'Close',
    speed: 'Speed',
    eta: 'ETA',
    gitReq: 'Requires Git 2.30 or newer. MultiGitGui does not bundle Git — it drives the Git you choose, so your credential helpers, hooks and SSH setup keep working.',
    windows: {
      name: 'Windows',
      file: 'MultiGitGui-Setup-1.1.5.exe',
      desc: 'Single-file installer (NativeAOT, no .NET runtime required) with custom install path, Start Menu and desktop shortcuts.',
    },
    macos: {
      name: 'macOS',
      file: 'MultiGitGui-1.0.4.app',
      desc: 'For macOS 12 and newer. Downloads open once the app bundle is signed and notarized.',
    },
    linux: {
      name: 'Linux',
      file: 'MultiGitGui-linux-x64.tar.gz',
      desc: 'Self-contained x64 / arm64 archives, extract and run. Requires X11, libICE, libSM and fontconfig.',
    },
  },
  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'Do I need to install Git myself?',
        a: 'Yes. MultiGitGui does not bundle Git — it drives the Git you choose (2.30 or newer), so your credential helpers, hooks and SSH setup keep working. You can also point the app at a specific Git executable in Settings.',
      },
      {
        q: 'Which platforms are supported?',
        a: 'Windows 10 1809 and newer, macOS 12 and newer, and modern x64 or arm64 Linux desktops.',
      },
      {
        q: 'Is it free?',
        a: 'Completely free and open source under the MIT license. Use, modify and redistribute it freely.',
      },
      {
        q: 'Does it have a Chinese interface?',
        a: 'Yes. English and Simplified Chinese are switchable at runtime, with light, dark and system themes.',
      },
      {
        q: 'Where is my data stored?',
        a: 'In your system data directory by default, or anywhere you choose via --data-dir or --portable — built for locked-down machines. Settings, logs, cache and more can each be relocated with a migration preview.',
      },
      {
        q: 'Does it support Gerrit code review?',
        a: 'Yes. Push to refs/for/<branch> for review, with topic, reviewers, WIP, private and more as separate options. A missing commit-msg hook is detected with a one-click install.',
      },
    ],
  },
  footer: {
    tagline: 'A multi-repository Git desktop client for cross-repo workflows.',
    product: 'Product',
    platforms: 'Platforms',
    legal: 'Legal',
    featuresLink: 'Features',
    downloadLink: 'Download',
    faqLink: 'FAQ',
    win: 'Windows 10 1809+',
    mac: 'macOS 12+',
    linux: 'Linux x64 / arm64',
    license: 'MIT License',
    copyright: '© {year} sxw. All rights reserved.',
  },
};
