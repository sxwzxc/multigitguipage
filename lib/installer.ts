/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 *
 * directUrl 为 CDN 直链（主下载通道）；分片（public/downloads/）为备用下载通道。
 */
export const windowsInstaller = {
  file: 'MultiGitGui-Setup-2.1.4.exe',
  size: 86808576,
  parts: 5,
  chunkSize: 20971520,
  sha256: '575b8f4294e77c042fc018e2b88c86949d72a4d3496bb77a9ce89c0be3d05c99',
  directUrl: 'https://multigit.shenxw.cn/MultiGitGui-Setup-2.1.4.exe',
} as const;
