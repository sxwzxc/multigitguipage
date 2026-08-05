/**
 * 发布版本更新脚本：根据新安装包元数据更新 lib/installer.ts 与全站版本号引用。
 *
 * 用法:
 *   node scripts/bump-version.mjs <新文件名> <size> <parts> <sha256>
 *
 * 示例:
 *   node scripts/bump-version.mjs MultiGitGui-Setup-1.4.0.exe 74152448 4 a6af1729...
 *
 * 行为:
 *   1. 重写 lib/installer.ts（file/size/parts/chunkSize/sha256/directUrl）
 *   2. 精确替换 lib/locales/zh.ts、lib/locales/en.ts、
 *      components/landing/download-section.tsx 中的旧版本号（文件名 + v<版本>）
 * 全部以 UTF-8 读写（勿用 PowerShell Set-Content 改写含中文文件）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE_RE = /^MultiGitGui-Setup-(\d+\.\d+\.\d+)\.exe$/;

const [fileArg, sizeArg, partsArg, shaArg] = process.argv.slice(2);
if (!fileArg || !sizeArg || !partsArg || !shaArg) {
  console.error('用法: node scripts/bump-version.mjs <文件名> <size> <parts> <sha256>');
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
      updated: [...targets, installerPath].map((p) => path.relative(root, p)),
    },
    null,
    2
  )
);
