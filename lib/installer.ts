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
  file: 'MultiGitGui-Setup-3.5.9.exe',
  size: 87740928,
  parts: 5,
  chunkSize: 20971520,
  sha256: '9e48c3f53aae527c85b3d018fa52ae2f4ef4b229f915ffee6c4fc75b4cf87270',
  directUrl: 'https://multigit.shenxw.cn/MultiGitGui-Setup-3.5.9.exe',
} as const;

export function installerVersion(): string {
  const match = windowsInstaller.file.match(/MultiGitGui-Setup-(.+)\.exe$/i);
  return match?.[1] ?? windowsInstaller.file;
}
