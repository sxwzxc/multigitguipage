/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 *
 * directUrl 为 CDN 直链（主下载通道）；分片（public/downloads/）为备用下载通道。
 */
export const windowsInstaller = {
  file: 'MultiGitGui-Setup-3.4.9.exe',
  size: 87578624,
  parts: 5,
  chunkSize: 20971520,
  sha256: '5f63af5e045cb62a6e97ef0f424ad4d434fae674c35757d5a33db3c143a808cb',
  directUrl: 'https://multigit.shenxw.cn/MultiGitGui-Setup-3.4.9.exe',
} as const;

export function installerVersion(): string {
  const match = windowsInstaller.file.match(/MultiGitGui-Setup-(.+)\.exe$/i);
  return match?.[1] ?? windowsInstaller.file;
}
