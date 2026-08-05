/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 *
 * directUrl 为 CDN 直链（主下载通道）；分片（public/downloads/）为备用下载通道。
 */
export const windowsInstaller = {
  file: 'MultiGitGui-Setup-1.3.6.exe',
  size: 75959296,
  parts: 4,
  chunkSize: 20971520,
  sha256: '63d23bc17e26692e82f0f15b9e0accca9102e1f14d26447451004ec02850b115',
  directUrl: 'https://multigit.shenxw.cn/MultiGitGui-Setup-1.3.6.exe',
} as const;
