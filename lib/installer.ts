/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 *
 * directUrl 为 CDN 直链（主下载通道）；分片（public/downloads/）为备用下载通道。
 */
export const windowsInstaller = {
  file: 'MultiGitGui-Setup-2.1.7.exe',
  size: 86918144,
  parts: 5,
  chunkSize: 20971520,
  sha256: 'bf31ac48bc224207403ce77d0c7de665bee1cc1090556919faa911e6e98d3040',
  directUrl: 'https://multigit.shenxw.cn/MultiGitGui-Setup-2.1.7.exe',
} as const;
