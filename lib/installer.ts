/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 *
 * directUrl 为 CDN 直链（主下载通道）；分片（public/downloads/）为备用下载通道。
 */
export const windowsInstaller = {
  file: 'MultiGitGui-Setup-1.3.22.exe',
  size: 76141568,
  parts: 4,
  chunkSize: 20971520,
  sha256: '74862452924fb6496f01f3bdf512154f2b77dc95e03f9f40a67758b3fae704ef',
  directUrl: 'https://multigit.shenxw.cn/MultiGitGui-Setup-1.3.22.exe',
} as const;
