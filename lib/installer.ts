/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 *
 * directUrl 为 CDN 直链（主下载通道）；分片（public/downloads/）为备用下载通道。
 */
export const windowsInstaller = {
  file: 'MultiGitGui-Setup-2.1.8.exe',
  size: 86967296,
  parts: 5,
  chunkSize: 20971520,
  sha256: 'e6d26705af33da2ca1ee77dd10de168021fe6da3b294a5e738e65d841204d63f',
  directUrl: 'https://multigit.shenxw.cn/MultiGitGui-Setup-2.1.8.exe',
} as const;
