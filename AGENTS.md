# MultiGitGui 官网 — Agent 工作约定

## 版本发布流程（用户说"更新版本"时执行）

1. 从 `installer/` 目录获取最新离线安装包（如 `MultiGitGui-Setup-<version>.exe`）。
2. 分片：`node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads`
   （脚本输出 `{ file, size, parts, chunkSize, sha256 }`，并自动清理同名旧分片）。
3. 手动删除 `public/downloads/` 中旧版本的分片文件（脚本只清理同名残留）。
4. 校验：用 Node 合并分片计算 SHA-256，与源文件哈希比对。
5. 更新 `lib/installer.ts`：`file`、`size`、`parts`、`chunkSize`、`sha256`，
   并拼接直链 `directUrl: 'https://multigit.shenxw.cn/<文件名>'`。
6. 更新版本号引用（旧版 → 新版）：
   - `lib/locales/zh.ts` 与 `lib/locales/en.ts`：hero 徽章、`download.windows.file`
   - `components/landing/download-section.tsx`：版本徽章（`v<版本>`）
7. `npm run build` 验证构建。
8. `git add -A && git commit && git push origin main`（自动触发 EdgeOne Pages 部署）。

## 其他约定

- 网站不包含任何 GitHub 链接（用户明确要求）。
- 软件不开源：不得在页面/README 中出现"开源 / MIT / open source"等表述。
- 安装包主下载走 CDN 直链（`directUrl`），备用下载走分片合并（前端弹窗）。
