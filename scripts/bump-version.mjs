/**
 * 发布版本更新脚本：根据新安装包元数据更新 lib/installer.ts、全站版本号引用，
 * 并将 release 的 CHANGELOG.md 入库（仓库根 CHANGELOG.md）、生成更新检测/获取 API 端点。
 *
 * 用法:
 *   node scripts/bump-version.mjs <新文件名> <size> <parts> <sha256> \
 *     [--changelog <CHANGELOG.md 路径>] [--published-at <ISO 时间>]
 *
 * 示例:
 *   node scripts/bump-version.mjs MultiGitGui-Setup-1.4.0.exe 74152448 4 a6af1729... \
 *     --changelog /tmp/CHANGELOG.md --published-at 2025-06-01T10:00:00Z
 *
 * 行为:
 *   1. 重写 lib/installer.ts（file/size/parts/chunkSize/sha256/directUrl）
 *   2. 精确替换 lib/locales/zh.ts、lib/locales/en.ts、
 *      components/landing/download-section.tsx 中的旧版本号（文件名 + v<版本>）
 *   3. 传入 --changelog 时：把内容以 "## <版本> (<日期>)" 段落写入仓库根 CHANGELOG.md
 *      （同版本段落存在则替换，否则置顶插入）；未传入时跳过入库，仅重建端点。
 *   4. 从 CHANGELOG.md 全量重建 API 端点（幂等，自动清理孤儿版本文件）：
 *      public/api/latest.json、public/api/versions.json、
 *      public/api/versions/<版本>.json、public/api/changelog/<版本>.md、
 *      public/api/changelog.md（即 CHANGELOG.md 副本）
 * 全部以 UTF-8 读写（勿用 PowerShell Set-Content 改写含中文文件）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE_RE = /^MultiGitGui-Setup-(\d+\.\d+\.\d+)\.exe$/;

// ---- 参数解析：前 4 个位置参数 + 可选 --changelog / --published-at ----
const args = process.argv.slice(2);
const positional = [];
const flags = {};
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--changelog' || a === '--published-at') {
    flags[a.slice(2)] = args[++i];
  } else if (a.startsWith('--')) {
    console.error(`未知参数: ${a}`);
    process.exit(1);
  } else {
    positional.push(a);
  }
}
const [fileArg, sizeArg, partsArg, shaArg] = positional;
if (!fileArg || !sizeArg || !partsArg || !shaArg) {
  console.error('用法: node scripts/bump-version.mjs <文件名> <size> <parts> <sha256> [--changelog <路径>] [--published-at <ISO时间>]');
  process.exit(1);
}
const m = FILE_RE.exec(fileArg);
if (!m) {
  console.error(`文件名不符合规则 MultiGitGui-Setup-<版本>.exe: ${fileArg}`);
  process.exit(1);
}
const newVersion = m[1];
const size = Number(sizeArg);
const parts = Number(partsArg);
const sha256 = shaArg;
if (!Number.isInteger(size) || size <= 0 || !Number.isInteger(parts) || parts <= 0) {
  console.error(`size/parts 非法: size=${sizeArg} parts=${partsArg}`);
  process.exit(1);
}
const chunkSize = 20 * 1024 * 1024;
const directUrl = `https://multigit.shenxw.cn/${fileArg}`;
const changelogArg = flags.changelog; // 可选：release 的 CHANGELOG.md 文件路径
// 可选：release published_at（ISO 8601）；空串或 "null" 视为未提供
const publishedAtArg =
  flags['published-at'] && flags['published-at'] !== 'null' ? flags['published-at'] : null;
const releasedDate = publishedAtArg ? String(publishedAtArg).slice(0, 10) : null;

const installerMeta = {
  version: newVersion,
  file: fileArg,
  size,
  parts,
  chunkSize,
  sha256,
  directUrl,
};

// 从 lib/installer.ts 提取旧版本
const installerPath = path.join(root, 'lib', 'installer.ts');
const installerSrc = fs.readFileSync(installerPath, 'utf8');
const oldMatch = /file: 'MultiGitGui-Setup-(\d+\.\d+\.\d+)\.exe'/.exec(installerSrc);
if (!oldMatch) {
  console.error('无法从 lib/installer.ts 提取旧版本号');
  process.exit(1);
}
const oldVersion = oldMatch[1];

// 重写 lib/installer.ts
const installerTemplate = `/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 *
 * directUrl 为 CDN 直链（主下载通道）；分片（public/downloads/）为备用下载通道。
 */
export const windowsInstaller = {
  file: '${fileArg}',
  size: ${size},
  parts: ${parts},
  chunkSize: ${chunkSize},
  sha256: '${sha256}',
  directUrl: '${directUrl}',
} as const;
`;
fs.writeFileSync(installerPath, installerTemplate, 'utf8');

// 替换版本号引用（旧文件串与 v<旧版本> 完整匹配，避免子串误伤）
const targets = [
  path.join(root, 'lib', 'locales', 'zh.ts'),
  path.join(root, 'lib', 'locales', 'en.ts'),
  path.join(root, 'components', 'landing', 'download-section.tsx'),
];
const oldFile = `MultiGitGui-Setup-${oldVersion}.exe`;
const newFile = `MultiGitGui-Setup-${newVersion}.exe`;
const oldBadge = `v${oldVersion}`;
const newBadge = `v${newVersion}`;
for (const file of targets) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(oldFile)) content = content.split(oldFile).join(newFile);
  if (content.includes(oldBadge)) content = content.split(oldBadge).join(newBadge);
  fs.writeFileSync(file, content, 'utf8');
}

// ---- CHANGELOG 入库 ----
const changelogRoot = path.join(root, 'CHANGELOG.md');
const escVersion = newVersion.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let changelogUpdated = false;

// 按顶层版本段落切分：段落标题必须是 "## <版本> (<日期>)" 格式（版本号+括号日期）。
// 注意：release 资产的 CHANGELOG.md 常为全量历史（含 "# 总标题" 与 "## x.y.z - 日期"
// 子段落），这些子段落会作为 body 内容保留，不得作为切分点；
// 否则单版本 changelog 文件会被切得只剩标题。
// 另注意：V8 的 split 会跳过位置 0 的零宽匹配，文件以段落标题开头时
// 第一个段落会落在 parts[0]，需单独判断。
function splitSections(content) {
  const parts = content.split(/^(?=## \d+\.\d+\.\d+ \()/m);
  if (parts.length > 0 && /^## \d+\.\d+\.\d+ \(/.test(parts[0])) {
    return { header: '', sections: parts };
  }
  return { header: parts[0] ?? '', sections: parts.slice(1) };
}

if (changelogArg) {
  if (!fs.existsSync(changelogArg)) {
    console.error(`CHANGELOG 文件不存在: ${changelogArg}`);
    process.exit(1);
  }
  const body = fs.readFileSync(changelogArg, 'utf8').trim();
  if (!body) {
    console.error(`CHANGELOG 文件内容为空: ${changelogArg}`);
    process.exit(1);
  }
  const dateStr = releasedDate || new Date().toISOString().slice(0, 10);
  const section = `## ${newVersion} (${dateStr})\n\n${body}\n`;
  const content = fs.existsSync(changelogRoot)
    ? fs.readFileSync(changelogRoot, 'utf8').replace(/\r\n/g, '\n')
    : '';
  const { header, sections } = splitSections(content);
  // 移除全部同版本段落（含历史重复），再置顶插入新段落
  const sectionRe = new RegExp(`^## ${escVersion} \\(`);
  const kept = sections.filter((s) => !sectionRe.test(s));
  kept.unshift(section);
  fs.writeFileSync(
    changelogRoot,
    (header === '' ? '' : header.endsWith('\n') ? header : header + '\n') + kept.join(''),
    'utf8'
  );
  changelogUpdated = true;
}

// ---- 解析 CHANGELOG.md -> 版本条目 ----
function parseChangelog(content) {
  // 按 "## " 行切分，每个段落匹配 "## <版本> (<日期>)\r?\n<body>"（兼容 CRLF）
  return splitSections(content.replace(/\r\n/g, '\n'))
    .sections.map((s) => /^## (\d+\.\d+\.\d+) \(([\d-]+)\)\r?\n([\s\S]*)$/.exec(s))
    .filter(Boolean)
    .map((m) => ({ version: m[1], date: m[2], body: m[3].trim() }));
}

// ---- 生成 API 端点（幂等） ----
function semverCompare(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

function genApi() {
  const apiDir = path.join(root, 'public', 'api');
  const versionsDir = path.join(apiDir, 'versions');
  const changelogDir = path.join(apiDir, 'changelog');
  fs.mkdirSync(versionsDir, { recursive: true });
  fs.mkdirSync(changelogDir, { recursive: true });

  const changelogFull = fs.existsSync(changelogRoot)
    ? fs.readFileSync(changelogRoot, 'utf8')
    : '';
  const entries = parseChangelog(changelogFull);

  // 版本集合：changelog 条目 + 当前安装包版本（可能尚未入库）
  const byVersion = new Map(entries.map((e) => [e.version, e]));
  if (!byVersion.has(newVersion)) {
    byVersion.set(newVersion, { version: newVersion, date: releasedDate, body: null });
  }
  const versions = [...byVersion.values()].sort((a, b) => semverCompare(b.version, a.version));

  const currentEntry = byVersion.get(newVersion);
  const latestPublishedAt =
    publishedAtArg || (currentEntry?.date ? `${currentEntry.date}T00:00:00Z` : null);

  // public/api/latest.json — 更新检测端点
  const latest = {
    version: newVersion,
    publishedAt: latestPublishedAt,
    changelogUrl: `/api/changelog/${newVersion}.md`,
    installer: { ...installerMeta },
  };
  fs.writeFileSync(path.join(apiDir, 'latest.json'), JSON.stringify(latest, null, 2) + '\n', 'utf8');

  // public/api/win32.json + public/api/win32 — Windows 安装包固定直链端点
  // （URL 永远不变，内容随最新版本更新；客户端可直接用 directUrl 下载）
  const win32 = {
    platform: 'win32',
    version: newVersion,
    publishedAt: latestPublishedAt,
    file: installerMeta.file,
    size: installerMeta.size,
    sha256: installerMeta.sha256,
    directUrl: installerMeta.directUrl,
    changelogUrl: `/api/changelog/${newVersion}.md`,
  };
  const win32Json = JSON.stringify(win32, null, 2) + '\n';
  fs.writeFileSync(path.join(apiDir, 'win32.json'), win32Json, 'utf8');
  fs.writeFileSync(path.join(apiDir, 'win32'), win32Json, 'utf8');

  // public/api/versions.json — 版本历史列表
  const list = versions.map((e) => ({
    version: e.version,
    publishedAt: e.date,
    changelogUrl: `/api/changelog/${e.version}.md`,
  }));
  fs.writeFileSync(
    path.join(apiDir, 'versions.json'),
    JSON.stringify({ latest: newVersion, versions: list }, null, 2) + '\n',
    'utf8'
  );

  // public/api/versions/<版本>.json — 指定版本详情（当前版本含安装包元数据）
  for (const e of versions) {
    const detail = {
      version: e.version,
      publishedAt: e.date,
      changelogUrl: `/api/changelog/${e.version}.md`,
      installer: e.version === newVersion ? { ...installerMeta } : null,
    };
    fs.writeFileSync(path.join(versionsDir, `${e.version}.json`), JSON.stringify(detail, null, 2) + '\n', 'utf8');
  }

  // public/api/changelog/<版本>.md — 每版本 changelog 原文
  for (const e of versions) {
    const body = e.body ?? `- 本版本更新内容请以官方发布说明为准。\n`;
    fs.writeFileSync(path.join(changelogDir, `${e.version}.md`), body + '\n', 'utf8');
  }

  // public/api/changelog.md — 合并版 changelog（CHANGELOG.md 副本）
  fs.writeFileSync(
    path.join(apiDir, 'changelog.md'),
    changelogFull || `# Changelog\n\n`,
    'utf8'
  );

  // 清理孤儿版本文件（changelog 中已不存在的版本）
  const keepVersionNames = new Set(versions.map((v) => `${v.version}.json`));
  for (const f of fs.readdirSync(versionsDir)) {
    if (/^\d+\.\d+\.\d+\.json$/.test(f) && !keepVersionNames.has(f)) {
      fs.unlinkSync(path.join(versionsDir, f));
    }
  }
  const keepChangelogNames = new Set(versions.map((v) => `${v.version}.md`));
  for (const f of fs.readdirSync(changelogDir)) {
    if (/^\d+\.\d+\.\d+\.md$/.test(f) && !keepChangelogNames.has(f)) {
      fs.unlinkSync(path.join(changelogDir, f));
    }
  }

  return {
    latest: 'public/api/latest.json',
    win32: 'public/api/win32.json',
    win32Alias: 'public/api/win32',
    versions: 'public/api/versions.json',
    versionDetails: versions.map((v) => `public/api/versions/${v.version}.json`),
    changelogFiles: versions.map((v) => `public/api/changelog/${v.version}.md`),
    changelogAll: 'public/api/changelog.md',
  };
}
const apiFiles = genApi();

console.log(
  JSON.stringify(
    {
      oldVersion,
      newVersion,
      file: fileArg,
      size,
      parts,
      chunkSize,
      sha256,
      directUrl,
      changelog: {
        updated: changelogUpdated,
        entries: parseChangelog(fs.existsSync(changelogRoot) ? fs.readFileSync(changelogRoot, 'utf8') : '').length,
      },
      api: apiFiles,
      updated: [...targets, installerPath].map((p) => path.relative(root, p)),
    },
    null,
    2
  )
);
