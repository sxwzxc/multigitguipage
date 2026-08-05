/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 *
 * directUrl 为 CDN 直链（主下载通道）；分片（public/downloads/）为备用下载通道。
 */
export const windowsInstaller = {
  file: 'MultiGitGui-Setup-1.3.20.exe',
  size: 76014080,
  parts: 4,
  chunkSize: 20971520,
  sha256: '105f03e57ca3cf05ae1310f7df78f7276588bdb141d42eec929e007c568a8222',
  directUrl: 'https://multigit.shenxw.cn/MultiGitGui-Setup-1.3.20.exe',
} as const;
