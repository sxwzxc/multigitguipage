/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 *
 * directUrl 为 CDN 直链（主下载通道）；分片（public/downloads/）为备用下载通道。
 */
export const windowsInstaller = {
  file: 'MultiGitGui-Setup-1.3.3.exe',
  size: 74152448,
  parts: 4,
  chunkSize: 20971520,
  sha256: 'a6af17295917e2b45620322939e52b609662eb3aed22dcfd565fb8e88155119b',
  directUrl: 'https://multigit.shenxw.cn/MultiGitGui-Setup-1.3.3.exe',
} as const;
