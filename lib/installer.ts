/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 *
 * directUrl 为 CDN 直链（主下载通道）；分片（public/downloads/）为备用下载通道。
 */
export const windowsInstaller = {
  file: 'MultiGitGui-Setup-3.3.5.exe',
  size: 87314944,
  parts: 5,
  chunkSize: 20971520,
  sha256: 'b33add5b4bb4e17c6c90e28a1905516ba25bd0cdbcba3d24a5c553b2d0ed9f83',
  directUrl: 'https://multigit.shenxw.cn/MultiGitGui-Setup-3.3.5.exe',
} as const;
