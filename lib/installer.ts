/**
 * Windows 安装包元数据。
 *
 * 由 scripts/split-installer.mjs 生成，发布新版本时重新运行脚本并同步此文件：
 *   node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
 */
export const windowsInstaller = {
  file: 'MultiGitGui-Setup-1.1.5.exe',
  size: 74030080,
  parts: 4,
  chunkSize: 20971520,
  sha256: 'd3648b4983951345462f57e87afb924458ee368245ade8407f72957ea571dfbd',
} as const;
