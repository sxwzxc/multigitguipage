# MultiGitGui 官网 — Agent 工作约定

## 版本发布入口

**优先使用 GitHub Actions**：在仓库 Actions 页手动运行 `Update installer from MultiGitGui release`
（workflow_dispatch）——自动获取 `sxwzxc/MultiGitGui` 最新 Release、按 `MultiGitGui-Setup-*.exe`
匹配安装包资产、下载 → 分片入库 → 更新直链与版本号 → 构建验证 → 提交推送，全程无需本地操作。
该 workflow 只更新代码与分片，**直链服务器（multigit.shenxw.cn）上的安装包与 index.html 仍需
通过 FTP 另行同步**（见下）。

以下为本地手动流程（workflow 不可用或需要手工干预时执行）：

## 版本发布流程（用户说"更新版本 / 更新安装包"时执行）

从 `installer/` 目录获取最新离线安装包（如 `MultiGitGui-Setup-<version>.exe`），
依次完成 **FTP 直链通道** 与 **分片备用通道**，最后推送部署。两通道都要做，缺一不可。

### 1. FTP 直链通道（multigit.shenxw.cn，整包上传、不分片）

服务器信息（主机、账号、密码）**由用户在会话中以变量方式提供**（例如 `FTP_HOST` / `FTP_USER` / `FTP_PASS`），
不得将凭据写入任何入库文件。首次执行 FTP 操作前先向用户确认变量值。

- 目录为 FTP 根目录，内含：当前版本安装包、`index.html`（展示下载链接与版本号）、`404.html`
- 全部操作使用 Windows 自带 `curl.exe`（不是 PowerShell 的 `Invoke-WebRequest`）

步骤（`$FTP_HOST` / `$FTP_USER` / `$FTP_PASS` 为用户提供的变量）：
1. 列出目录、确认旧安装包版本号：
   `curl.exe -s --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/"`
2. 删除旧安装包：
   `curl.exe -s --user "$FTP_USER:$FTP_PASS" -Q "DELE MultiGitGui-Setup-<旧版本>.exe" "ftp://$FTP_HOST/"`
3. 上传新安装包（先删后传，避免旧文件残留）：
   `curl.exe -s --user "$FTP_USER:$FTP_PASS" -T installer/MultiGitGui-Setup-<新版本>.exe "ftp://$FTP_HOST/"`
4. 更新 `index.html` 中的版本号（现模板共 2 处：`<h3>` 内的 https 链接、`<a href>` 链接）：
   - 下载到临时目录：`curl.exe -s --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/index.html" -o <临时文件>`
   - 把 `<旧版本>` 全部替换为 `<新版本>`，保持 **UTF-8 无 BOM**（禁止 Set-Content，见踩坑点）
   - 上传覆盖：`curl.exe -s --user "$FTP_USER:$FTP_PASS" -T <临时文件> "ftp://$FTP_HOST/index.html"`
5. 校验：重新下载新安装包对比大小，应与 `installer/` 源文件一致。

### 2. 分片备用通道（代码库 public/downloads）

1. 分片：`node scripts/split-installer.mjs installer/MultiGitGui-Setup-<新版本>.exe public/downloads`
   （脚本输出 `{ file, size, parts, chunkSize, sha256 }`，仅清理同名旧分片）
2. 手动删除 `public/downloads/` 中旧版本分片：`MultiGitGui-Setup-<旧版本>.exe.part*`
3. 校验：用 Node 合并全部分片计算 SHA-256，须与源文件哈希一致，且合并大小等于 `size`。

### 3. 更新代码

1. `lib/installer.ts`：更新 `file`、`size`、`parts`、`chunkSize`、`sha256`（取脚本输出），
   拼接直链 `directUrl: 'https://multigit.shenxw.cn/<文件名>'`。
2. 更新版本号引用（旧版 → 新版）：
   - `lib/locales/zh.ts` 与 `lib/locales/en.ts`：`hero.badge`、`download.windows.file`
   - `components/landing/download-section.tsx`：版本徽章（`v<版本>`）
3. `npm run build` 验证构建（`/` 与 `/en` 静态导出成功、无类型错误）。
4. `git add -A && git commit && git push origin main`（自动触发 EdgeOne Pages 部署）。

### 踩坑点

- 字典文件为 UTF-8 含中文，**禁止用 PowerShell `Set-Content`（默认 ANSI）改写**——
  会损坏编码并导致 build 报 `stream did not contain valid UTF-8`；应使用 Edit 工具，
  或 `[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))`。
- 旧分片 / FTP 旧安装包必须按版本号精确删除，防止新旧版本文件并存。
- 直链域名固定为 `multigit.shenxw.cn`，文件命名规则 `MultiGitGui-Setup-<version>.exe`。
- `installer/` 目录已被 `.gitignore` 忽略：仅跟踪 `public/downloads/` 中的分片副本。

## 其他约定

- 网站不包含任何 GitHub 链接（用户明确要求）。
- 软件不开源：不得在页面/README 中出现"开源 / MIT / open source"等表述。
- 安装包主下载走 CDN 直链（`directUrl`），备用下载走分片合并（前端弹窗）。
- 严禁将服务器凭据、密码、密钥提交到仓库；凭据一律以会话变量方式提供。
