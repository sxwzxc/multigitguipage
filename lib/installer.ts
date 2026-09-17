/**
 * Windows 安装包元数据。
 *
 * 发布时由 scripts/bump-version.mjs 就地更新 windowsInstaller 字段
 * （file / size / parts / chunkSize / sha256 / directUrl），不会整文件覆盖，
 * 因此本文件中的其它导出（如 installerVersion）会被保留。
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
