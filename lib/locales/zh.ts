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
    goToGithub: string;
    githubNote: string;
    altLabel: string;
    assembling: string;
    failed: string;
    changelog: string;
    changelogDesc: string;
    changelogLoading: string;
    changelogFailed: string;
    changelogRetry: string;
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
    featuresLink: string;
    downloadLink: string;
    faqLink: string;
    win: string;
    mac: string;
    linux: string;
    copyright: string;
  };
  feedback: {
    button: string;
    title: string;
    desc: string;
    nickname: string;
    contact: string;
    os: string;
    content: string;
    extra: string;
    optional: string;
    submit: string;
    sending: string;
    success: string;
    failed: string;
    contentRequired: string;
  };
}

export const zh: Translation = {
  lang: 'zh',
  meta: {
    title: 'MultiGitGui — 一个软件，同时管理所有仓库',
    description:
      '面向一个项目同时包含多个仓库的开发者。支持 Windows、macOS 与 Linux。',
  },
  nav: {
    features: '特性',
    download: '下载',
    faq: '常见问题',
    switchLang: 'EN',
  },
  hero: {
    badge: 'v1.3.22 · 跨平台 · 免费',
    title1: '一个软件，',
    title2: '同时管理所有仓库',
    subtitle:
      'MultiGitGui 是一款为单项目存在多仓库管理而生的跨平台 Git 桌面客户端。把一项工作涉及的所有仓库编成一个项目，fetch、pull、push、切换分支、reset、stash 全部以项目为单位批量执行，同时尊重每个仓库自己的分支与状态。',
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
    title: '为单项目包含多代码库设计',
    subtitle:
      '大多数 Git GUI 围绕单个仓库设计。MultiGitGui 面向的是一项工作横跨多个仓库的场景——所有操作以项目为单位，每个仓库仍保持独立。',
    items: [
      {
        title: '快速定位改动',
        desc: '代码都是AI写，AI改完代码，自己连AI改了哪些代码库都不知道？跨仓查看未提交改动，让你在一个页面就能快速定位。',
      },
      {
        title: '一键清理代码库',
        desc: '拉取新代码后编译不通过？使用一键清理代码库功能，一键把项目重置到最新代码，并可选清理本地所有缓存。',
      },
      {
        title: '一键批量推送',
        desc: 'AI改代码、AI做提交，但AI推送总是遇到问题？手动推送又经常漏推送某个库导致编译失败？MultiGitGui提供了按项目推送所有代码库的功能。',
      },
      {
        title: 'Gerrit 评审推送',
        desc: '受够了每次推送前手动添加refs/for/前缀？MultiGitGui支持一键推送到Gerrit平台，topic、reviewer、WIP、private 等作为独立的 -o 参数传递。',
      },
      {
        title: '快速Bash终端',
        desc: '多个代码库需要CP提交，还在一个文件夹一个文件夹的右键Git Bash再右键粘贴？MultiGitGui支持快速切换仓库后ctrl+v粘贴终端命令，一键执行。',
      },
      {
        title: '归一化Git Log',
        desc: '拉取代码后编译失败，还在对每个代码库右键日志找害虫提交？聚合的历史视图，让你在一个页面就能按时间倒序所有改动。',
      },
      {
        title: '一键切换分支',
        desc: '又有bug需要切分支修？MultiGitGui支持一键切换当前项目所有代码库的分支。',
      },
      {
        title: '稳定的blame、history',
        desc: '某些代码库层级太深，部分Git GUI右键文件无法blame或查看日志？MultiGitGui针对性优化相关功能，让你在软件类就能享受稳定的blame、history功能。。',
      },
      {
        title: '现代化的UI界面',
        desc: 'MultiGitGui支持现代化的UI界面，支持暗色、浅色、半透明、毛玻璃多种外观组合，不用再忍受刺眼的RGB配色。',
      },
      {
        title: '原生应用开发',
        desc: '不用再忍受Web化的痛苦，坚持原生开发，提升性能节省内存的同时，依然可以保证完全免费。',
      },
    ],
  },
  download: {
    title: '下载',
    subtitle: 'Windows 安装包可直接下载；macOS 与 Linux 版本请前往 GitHub Releases 获取。',
    version: '当前版本',
    comingSoon: '即将推出',
    downloadNow: '立即下载',
    goToGithub: '前往 GitHub 下载',
    githubNote: '非 Windows 版本尚未配置快速下载，请暂时通过 GitHub 下载：',
    altLabel: '备用下载',
    assembling: '正在下载并合并安装包',
    failed: '下载失败，请重试',
    changelog: '更新日志',
    changelogDesc: '各版本的发布说明，来自官方 Release。',
    changelogLoading: '正在加载更新日志…',
    changelogFailed: '更新日志加载失败，请稍后重试',
    changelogRetry: '重试',
    dialogTitle: '下载 MultiGitGui',
    dialogNotice:
      '安装包分片将在浏览器内依次下载并合并。请勿关闭或刷新此页面，否则下载将中断。',
    merging: '正在合并安装包…',
    done: '下载完成',
    close: '关闭',
    speed: '速度',
    eta: '预计剩余',
    gitReq: '建议 Git 2.30 或更新版本（MultiGitGui 不内置 Git，驱动你选定的 Git，因此 credential helper、hooks 与 SSH 配置继续生效）。',
    windows: {
      name: 'Windows',
      file: 'MultiGitGui-Setup-1.3.22.exe',
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
        a: '完全免费，无需付费即可使用全部功能。',
      },
      {
        q: '我的C盘权限受限可以使用吗？',
        a: '针对权限受限场景单独优化，几乎所有数据、配置都可以手动指定位置。',
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
    featuresLink: '特性',
    downloadLink: '下载',
    faqLink: '常见问题',
    win: 'Windows 10 1809+',
    mac: 'macOS 12+',
    linux: 'Linux x64 / arm64',
    copyright: '© {year} sxw. 保留所有权利。',
  },
  feedback: {
    button: '意见反馈',
    title: '意见反馈',
    desc: '遇到问题或有建议?告诉我们,我们会认真阅读每一条反馈。',
    nickname: '昵称',
    contact: '联系方式',
    os: '系统信息',
    content: '反馈内容',
    extra: '其他补充',
    optional: '选填',
    submit: '提交反馈',
    sending: '提交中…',
    success: '感谢你的反馈!',
    failed: '提交失败,请稍后重试',
    contentRequired: '请填写反馈内容',
  },
};
