/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 *
 * directUrl 为 CDN 直链（主下载通道）；分片（public/downloads/）为备用下载通道。
 */
export const windowsInstaller = {
  file: 'MultiGitGui-Setup-1.1.7.exe',
  size: 74047488,
  parts: 4,
  chunkSize: 20971520,
  sha256: 'a29898a574954ec77aacab7ccaf05079b4c8aec3d311db906f6c6db4344c386e',
  directUrl: 'https://multigit.shenxw.cn/MultiGitGui-Setup-1.1.7.exe',
} as const;
