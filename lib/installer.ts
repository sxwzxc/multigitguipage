/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 *
 * directUrl 为 CDN 直链（主下载通道）；分片（public/downloads/）为备用下载通道。
 */
export const windowsInstaller = {
  file: 'MultiGitGui-Setup-3.3.4.exe',
  size: 87314432,
  parts: 5,
  chunkSize: 20971520,
  sha256: '90d5a383caafa04acec1f710ffaab26da8a8f46f82894e885ef1c8d564b22b5e',
  directUrl: 'https://multigit.shenxw.cn/MultiGitGui-Setup-3.3.4.exe',
} as const;
