/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 *
 * directUrl 为 CDN 直链（主下载通道）；分片（public/downloads/）为备用下载通道。
 */
export const windowsInstaller = {
  file: 'MultiGitGui-Setup-1.3.15.exe',
  size: 75969024,
  parts: 4,
  chunkSize: 20971520,
  sha256: '700c544b49a303ef8d58c17e5c4191f30fc6664fb5fdcbeb72f30110b9397962',
  directUrl: 'https://multigit.shenxw.cn/MultiGitGui-Setup-1.3.15.exe',
} as const;
