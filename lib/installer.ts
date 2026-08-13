/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 *
 * directUrl 为 CDN 直链（主下载通道）；分片（public/downloads/）为备用下载通道。
 */
export const windowsInstaller = {
  file: 'MultiGitGui-Setup-1.9.40.exe',
  size: 76384768,
  parts: 4,
  chunkSize: 20971520,
  sha256: '1c02f4dbf8f5427103a92af06db3239b6a6bb2780520c2b2bf57b41288a1f758',
  directUrl: 'https://multigit.shenxw.cn/MultiGitGui-Setup-1.9.40.exe',
} as const;
