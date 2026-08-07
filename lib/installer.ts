/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 *
 * directUrl 为 CDN 直链（主下载通道）；分片（public/downloads/）为备用下载通道。
 */
export const windowsInstaller = {
  file: 'MultiGitGui-Setup-1.5.0.exe',
  size: 76204544,
  parts: 4,
  chunkSize: 20971520,
  sha256: '1526d281fbead990da4d1da3a0ac55266b6707ed6ae34410de55f9efb531b98e',
  directUrl: 'https://multigit.shenxw.cn/MultiGitGui-Setup-1.5.0.exe',
} as const;
