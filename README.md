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

- Windows 安装包 `MultiGitGui-Setup-<version>.exe` 放在 `public/downloads/`，随 EdgeOne Pages 静态托管分发，下载链接为 `/downloads/MultiGitGui-Setup-<version>.exe`。
- 发布新版本时：将新安装包复制到 `public/downloads/`（删除旧文件），并同步更新 `lib/locales/zh.ts` 与 `en.ts` 中的文件名与版本号（hero 徽章、下载区徽章、Windows 文件名）。
- 源安装包目录 `installer/` 已被 `.gitignore` 忽略，仅跟踪 `public/downloads/` 中的发布副本。

## 维护提示

- **版本号**：字典中下载区的文件名、版本徽章与 hero 徽章需随软件版本更新。
- **macOS/Linux 上线后**：将 `components/landing/download-section.tsx` 中两个禁用按钮替换为真实下载链接即可。
