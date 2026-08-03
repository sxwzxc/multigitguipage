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
public/              # Logo 与 favicon（来自 MultiGitGui 应用资源）
```

## 维护提示

- **版本号**：字典中下载区的文件名与 `v1.0.4` 徽章需随软件版本更新。
- **安装包上线后**：将 `components/landing/download-section.tsx` 中三个禁用按钮替换为真实下载链接即可。
