import type { Translation } from './zh';

export const en: Translation = {
  lang: 'en',
  meta: {
    title: 'MultiGitGui — Multi-repo Git desktop client',
    description:
      'MultiGitGui — also called MultiGit — is a free cross-platform Git GUI for multi-repository projects. Batch fetch, pull, push and checkout across every repo — for Windows, macOS and Linux.',
    keywords: [
      'MultiGitGui',
      'MultiGit',
      'multigitgui',
      'multigit',
      'Git GUI',
      'Git client',
      'Git desktop client',
      'multi-repo',
      'multi repository',
      'Gerrit',
      'Windows Git',
    ],
  },
  nav: {
    about: 'About',
    features: 'Features',
    download: 'Download',
    faq: 'FAQ',
    switchLang: '中',
  },
  hero: {
    name: 'MultiGitGui',
    aka: 'Also called MultiGit · free multi-repo Git desktop client',
    badge: 'v3.5.9 · Cross-platform · Free',
    title1: 'One project, ',
    title2: 'every repository',
    subtitle:
      'MultiGitGui is a cross-platform Git desktop client built for multi-repository workflows. Group every repository involved in one piece of work into a project, then fetch, pull, push, checkout, reset and stash run across the whole project — while each repository keeps its own branch, upstream and state.',
    ctaDownload: 'Download MultiGitGui',
    ctaFeatures: 'About MultiGitGui',
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
  about: {
    label: '01 · about',
    title: 'What is MultiGitGui',
    lead:
      'MultiGitGui is the full name of this app; it is also called MultiGit. It is a free, cross-platform Git desktop client for work that spans many repositories in one project.',
    body:
      'Group related repositories into a project, then fetch, pull, push, checkout, reset and stash run across the whole project — each repository keeps its own branch and state. MultiGitGui does not bundle Git; it drives the Git you already use, so credential helpers, hooks and SSH keep working. Available for Windows, macOS and Linux.',
    facts: [
      { title: 'Name', desc: 'Full name MultiGitGui, also called MultiGit.' },
      { title: 'Type', desc: 'A multi-repo Git GUI — a desktop Git client.' },
      { title: 'Platforms', desc: 'Native app for Windows, macOS and Linux.' },
      { title: 'License', desc: 'Free to use — no paid tiers or subscriptions.' },
    ],
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
    subtitle: 'The Windows installer is ready; get macOS and Linux builds from GitHub Releases.',
    version: 'Current version',
    comingSoon: 'Coming soon',
    downloadNow: 'Download now',
    goToGithub: 'Download from GitHub',
    githubNote: 'Quick download is not available for non-Windows yet — get it from GitHub:',
    altLabel: 'Alternate download',
    assembling: 'Downloading & assembling installer',
    failed: 'Download failed, please retry',
    changelog: 'Changelog',
    changelogDesc: 'Release notes for each version, from official releases.',
    changelogLoading: 'Loading changelog…',
    changelogFailed: 'Failed to load the changelog, please retry',
    changelogRetry: 'Retry',
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
      file: 'MultiGitGui-Setup-3.5.9.exe',
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
        q: 'Are MultiGit and MultiGitGui the same app?',
        a: 'Yes. MultiGitGui is the full name; MultiGit is the shorter name for the same free multi-repo Git desktop client, used to manage many Git repositories in one project.',
      },
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
        a: 'Yes, it is completely free to use — no paid tiers, no subscriptions.',
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
    tagline: 'MultiGitGui — also called MultiGit — is a multi-repository Git desktop client for cross-repo workflows.',
    product: 'Product',
    platforms: 'Platforms',
    aboutLink: 'About',
    featuresLink: 'Features',
    downloadLink: 'Download',
    faqLink: 'FAQ',
    win: 'Windows 10 1809+',
    mac: 'macOS 12+',
    linux: 'Linux x64 / arm64',
    copyright: '© {year}. All rights reserved.',
    botsAllowed: 'Search engines, crawlers, and automation are explicitly allowed — no restrictions',
  },
  feedback: {
    button: 'Feedback',
    title: 'Feedback',
    desc: 'Found a problem or have a suggestion? Tell us — every message is read.',
    nickname: 'Nickname',
    contact: 'Contact',
    os: 'System',
    content: 'Message',
    extra: 'Anything else',
    optional: 'optional',
    submit: 'Send feedback',
    sending: 'Sending…',
    success: 'Thanks for your feedback!',
    failed: 'Failed to submit, please retry',
    contentRequired: 'Please enter your message',
  },
};
