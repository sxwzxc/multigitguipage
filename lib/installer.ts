/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 *
 * directUrl 为 CDN 直链（主下载通道）；分片（public/downloads/）为备用下载通道。
 */
export const windowsInstaller = {
  file: 'MultiGitGui-Setup-1.4.4.exe',
  size: 76176896,
  parts: 4,
  chunkSize: 20971520,
  sha256: 'feaad7fda24cbebebb5caff08f75c7475e2ca088f0854c30f5d478b04117288a',
  directUrl: 'https://multigit.shenxw.cn/MultiGitGui-Setup-1.4.4.exe',
} as const;
