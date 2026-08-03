# MultiGitGui 官网

MultiGitGui 软件官方网站，基于 Next.js 与 Tailwind CSS 构建，部署于 EdgeOne Pages（push 到 main 分支自动部署）。

## 技术栈

- **框架**：Next.js 13（App Router，`output: 'export'` 静态导出）
- **样式**：Tailwind CSS + shadcn/ui
- **类型**：TypeScript

## 页面

- `/` 中文首页
- `/en` 英文首页

中英文共享同一套落地页组件，文案字典位于 `lib/locales/zh.ts` 与 `lib/locales/en.ts`。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 静态导出到 out/
```

## 目录结构

```
app/                 # App Router 页面（/ 与 /en）与根布局
components/landing/  # 落地页组件（Header、Hero、Features、下载、FAQ、Footer）
components/ui/       # shadcn/ui 基础组件
lib/locales/         # 中英文文案字典
public/              # Logo、favicon 与安装包
public/downloads/    # 安装包（随仓库托管，部署后可直接下载）
```

## 下载与安装包

下载区为每个平台提供**双通道**：

- **主下载**：直链（`windowsInstaller.directUrl`，CDN：`https://multigit.shenxw.cn/<文件名>`），页面主按钮直接跳转。
- **备用下载**：分片方式。EdgeOne Pages 限制单个文件最大 25MiB，因此安装包以**分片**形式托管（`<file>.part1..N`，每片 20MiB），前端下载时并行拉取全部分片、在浏览器内合并为完整 exe 后保存（弹窗显示进度/速度/剩余时间）。

- 分片位于 `public/downloads/`，元数据（文件名、分片数、SHA-256、直链）在 `lib/installer.ts`。
- 发布新版本时：

  ```bash
  # 1. 源安装包放入 installer/ 目录后分片（自动清理同名旧分片，输出元数据与校验和）
  node scripts/split-installer.mjs installer/MultiGitGui-Setup-<version>.exe public/downloads
  # 2. 手动删除 public/downloads/ 中旧版本的分片文件
  # 3. 将脚本输出的元数据更新到 lib/installer.ts，并更新 directUrl 直链
  # 4. 同步更新 lib/locales/zh.ts 与 en.ts 中的版本号（hero 徽章、下载区徽章、Windows 文件名）
  ```

- 源安装包目录 `installer/` 已被 `.gitignore` 忽略，仅跟踪 `public/downloads/` 中的分片副本。
- 用户下载后可在终端用 `Get-FileHash` / `sha256sum` 与页面展示的 SHA-256 校验和比对，确认文件完整。

## 维护提示

- **版本号**：字典中下载区的文件名、版本徽章与 hero 徽章需随软件版本更新；`lib/installer.ts` 需随分片脚本重新生成并同步直链。
- **macOS/Linux 上线后**：同样分片 + 提供直链，然后在 `components/landing/download-section.tsx` 中启用对应卡片的主按钮与备用按钮（填入直链即可）。
