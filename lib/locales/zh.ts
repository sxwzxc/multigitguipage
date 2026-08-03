export type Lang = 'zh' | 'en';

export interface Translation {
  lang: Lang;
  meta: { title: string; description: string };
  nav: { features: string; download: string; faq: string; switchLang: string };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    ctaDownload: string;
    ctaFeatures: string;
    platformNote: string;
  };
  mockup: {
    windowTitle: string;
    sidebar: readonly string[];
    repo: string;
    branch: string;
    ahead: string;
    behind: string;
    status: string;
    synced: string;
    modified: string;
    conflict: string;
  };
  features: {
    title: string;
    subtitle: string;
    items: readonly { title: string; desc: string }[];
  };
  download: {
    title: string;
    subtitle: string;
    version: string;
    comingSoon: string;
    downloadNow: string;
    assembling: string;
    failed: string;
    shaLabel: string;
    dialogTitle: string;
    dialogNotice: string;
    merging: string;
    done: string;
    close: string;
    speed: string;
    eta: string;
    gitReq: string;
    windows: { name: string; file: string; desc: string };
    macos: { name: string; file: string; desc: string };
    linux: { name: string; file: string; desc: string };
  };
  faq: { title: string; items: readonly { q: string; a: string }[] };
  footer: {
    tagline: string;
    product: string;
    platforms: string;
    legal: string;
    featuresLink: string;
    downloadLink: string;
    faqLink: string;
    win: string;
    mac: string;
    linux: string;
    license: string;
    copyright: string;
  };
}

export const zh: Translation = {
  lang: 'zh',
  meta: {
    title: 'MultiGitGui — 一个项目，同时管理所有仓库',
    description:
      '面向跨仓库工作流的跨平台 Git 桌面客户端。基于 .NET 10 与 Avalonia，支持 Windows、macOS 与 Linux。',
  },
  nav: {
    features: '特性',
    download: '下载',
    faq: '常见问题',
    switchLang: 'EN',
  },
  hero: {
    badge: 'v1.1.5 · 跨平台 · 免费开源',
    title1: '一个项目，',
    title2: '同时管理所有仓库',
    subtitle:
      'MultiGitGui 是一款为多仓库工作流而生的跨平台 Git 桌面客户端。把一项工作涉及的所有仓库编成一个项目，fetch、pull、push、切换分支、reset、stash 全部以项目为单位批量执行，同时尊重每个仓库自己的分支与状态。',
    ctaDownload: '下载 MultiGitGui',
    ctaFeatures: '了解特性',
    platformNote: 'Windows 10+ · macOS 12+ · Linux x64 / arm64',
  },
  mockup: {
    windowTitle: 'MultiGitGui — Overview',
    sidebar: ['Projects', 'Changes', 'History', 'Refs', 'Files', 'Blame', 'Search'],
    repo: '仓库',
    branch: '分支',
    ahead: '领先',
    behind: '落后',
    status: '状态',
    synced: '已同步',
    modified: '有改动',
    conflict: '冲突',
  },
  features: {
    title: '为真实的多仓工作流设计',
    subtitle:
      '大多数 Git GUI 围绕单个仓库设计。MultiGitGui 面向的是一项工作横跨多个仓库的场景——所有操作以项目为单位，每个仓库仍保持独立。',
    items: [
      {
        title: '项目 → 仓库',
        desc: '逐个添加仓库、扫描文件夹树或批量克隆。单个仓库可单独排除在批量操作之外。',
      },
      {
        title: '尊重每个仓库的批量操作',
        desc: 'push 使用各仓库自己的分支与 upstream；checkout 会先逐仓预检，明确告知哪些会切换、哪些会跟踪、哪些必须跳过。',
      },
      {
        title: 'Gerrit 评审推送',
        desc: 'refs/for/<branch> 按仓库推导或统一指定，topic、reviewer、WIP、private 等作为独立的 -o 参数传递。',
      },
      {
        title: '聚合视图',
        desc: 'Overview 表格逐仓显示分支与 ahead/behind；Changes 合并全部工作区改动；History 按提交时间归并所有仓库的提交。',
      },
      {
        title: '完整的单仓工作流',
        desc: '文件级、hunk 级与行级暂存，commit、amend、冲突解决，分支/标签/远端/stash/子模块管理，并排 diff 与可追溯的 blame。',
      },
      {
        title: '跨仓搜索与命令面板',
        desc: '搜索提交说明、作者、SHA、文件内容与文件名；命令面板与 Ctrl+1…Ctrl+7 让常用操作全部可用键盘完成。',
      },
      {
        title: '有预览的历史操作',
        desc: 'Merge 与 Rebase 执行前先显示逐仓计划；交互式变基支持重排与 pick/reword/edit/squash/fixup/drop。',
      },
      {
        title: '数据与 Git 均可移植',
        desc: '设置、工作区、日志、缓存、备份都有独立路径，迁移前先预览；Git 可执行文件与环境变量全部可配置。',
      },
      {
        title: '可审计的输出面板',
        desc: '每次 Git 调用记录脱敏后的命令行、退出码与输出。URL 凭据、token 与认证 header 永不进入日志或界面。',
      },
    ],
  },
  download: {
    title: '下载',
    subtitle: 'Windows 安装包已就绪；macOS 与 Linux 版本即将推出。',
    version: '当前版本',
    comingSoon: '即将推出',
    downloadNow: '立即下载',
    assembling: '正在下载并合并安装包',
    failed: '下载失败，请重试',
    shaLabel: 'SHA-256 校验和',
    dialogTitle: '下载 MultiGitGui',
    dialogNotice:
      '安装包分片将在浏览器内依次下载并合并。请勿关闭或刷新此页面，否则下载将中断。',
    merging: '正在合并安装包…',
    done: '下载完成',
    close: '关闭',
    speed: '速度',
    eta: '预计剩余',
    gitReq: '需要 Git 2.30 或更新版本（MultiGitGui 不内置 Git，驱动你选定的 Git，因此 credential helper、hooks 与 SSH 配置继续生效）。',
    windows: {
      name: 'Windows',
      file: 'MultiGitGui-Setup-1.1.5.exe',
      desc: '单文件安装向导（NativeAOT 编译，无需 .NET 运行时），支持自定义安装路径、开始菜单与桌面快捷方式。',
    },
    macos: {
      name: 'macOS',
      file: 'MultiGitGui-1.0.4.app',
      desc: '适用于 macOS 12 及更新版本。应用包签名与公证完成前暂不开放下载。',
    },
    linux: {
      name: 'Linux',
      file: 'MultiGitGui-linux-x64.tar.gz',
      desc: 'x64 / arm64 自包含归档，解压即用。需 X11、libICE、libSM 与 fontconfig 等常见桌面库。',
    },
  },
  faq: {
    title: '常见问题',
    items: [
      {
        q: '需要自己安装 Git 吗？',
        a: '需要。MultiGitGui 不内置 Git，而是驱动你选定的 Git（2.30 或更新版本），因此你的 credential helper、hooks 与 SSH 配置都继续生效。也可以在设置中直接指定 Git 可执行文件路径。',
      },
      {
        q: '支持哪些平台？',
        a: 'Windows 10 1809 及更新版本、macOS 12 及更新版本，以及现代 x64 或 arm64 Linux 桌面。',
      },
      {
        q: '免费吗？',
        a: '完全免费，使用 MIT 协议开源。可以自由使用、修改与分发。',
      },
      {
        q: '支持中文界面吗？',
        a: '支持。界面在运行时即可在简体中文与英文之间切换，并支持浅色、深色与跟随系统三种主题。',
      },
      {
        q: '数据存放在哪里？',
        a: '默认存放在系统数据目录，也可以通过 --data-dir 或 --portable 指定位置，适合系统盘不可写的受限环境。设置、日志、缓存等目录都可单独迁移，修改前会先显示迁移预览。',
      },
      {
        q: '支持 Gerrit 代码评审吗？',
        a: '支持。推送到 refs/for/<branch> 做评审，topic、reviewer、WIP、private 等选项独立传递；缺少 commit-msg hook 时会给出警告并提供一键安装。',
      },
    ],
  },
  footer: {
    tagline: '面向跨仓库工作流的多仓库 Git 桌面客户端。',
    product: '产品',
    platforms: '平台',
    legal: '法律',
    featuresLink: '特性',
    downloadLink: '下载',
    faqLink: '常见问题',
    win: 'Windows 10 1809+',
    mac: 'macOS 12+',
    linux: 'Linux x64 / arm64',
    license: 'MIT 协议',
    copyright: '© {year} sxw. 保留所有权利。',
  },
};
