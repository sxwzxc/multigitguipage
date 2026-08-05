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
public/api/          # 更新检测/获取 API 端点（由 scripts/bump-version.mjs 发布时生成）
CHANGELOG.md         # 版本更新日志（由 scripts/bump-version.mjs 从 Release 入库）
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
  # 3. 更新元数据与版本号：从 Release 下载 CHANGELOG.md，连同 published_at 一并入库并生成 API 端点
  node scripts/bump-version.mjs MultiGitGui-Setup-<version>.exe <size> <parts> <sha256> \
    --changelog /path/to/CHANGELOG.md --published-at <ISO时间>
  #    （不传 --changelog 时跳过入库，仅重建 API 端点；lib/installer.ts 与全站版本号始终更新）
  # 4. 同步更新 lib/locales/zh.ts 与 en.ts 中的版本号（hero 徽章、下载区徽章、Windows 文件名）
  ```

- 源安装包目录 `installer/` 已被 `.gitignore` 忽略，仅跟踪 `public/downloads/` 中的分片副本。
- 用户下载后可在终端用 `Get-FileHash` / `sha256sum` 与页面展示的 SHA-256 校验和比对，确认文件完整。

## 更新检测 / 更新获取 API

网站为静态导出，无服务端路由；以下端点均为 `public/api/` 下的静态文件，随部署发布，
可供 MultiGitGui 客户端做「检查更新」与「获取更新信息」，也可在浏览器直接访问：

| 端点 | 用途 |
|---|---|
| `GET /api/latest.json` | 更新检测：最新版本 + 安装包元数据（文件名/大小/SHA-256/直链/分片）+ changelog 链接 |
| `GET /api/versions.json` | 版本历史列表（`latest` + 全部版本及 changelog 链接） |
| `GET /api/versions/<版本>.json` | 指定版本详情（当前最新版本含安装包元数据，历史版本仅基础信息） |
| `GET /api/changelog/<版本>.md` | 指定版本 changelog 原文（markdown） |
| `GET /api/changelog.md` | 全部版本合并 changelog（即 `CHANGELOG.md` 副本） |

`latest.json` 响应示例：

```json
{
  "version": "1.3.15",
  "publishedAt": "2025-06-01T10:00:00Z",
  "changelogUrl": "/api/changelog/1.3.15.md",
  "installer": {
    "file": "MultiGitGui-Setup-1.3.15.exe",
    "size": 75969024,
    "parts": 4,
    "chunkSize": 20971520,
    "sha256": "700c544b…",
    "directUrl": "https://multigit.shenxw.cn/MultiGitGui-Setup-1.3.15.exe"
  }
}
```

- `changelogUrl` 为相对路径，客户端请基于其请求 `latest.json` 的 base URL 拼接。
- 页面下载区的「更新日志」弹窗即通过 `latest.json → changelogUrl` 拉取并渲染。
- **不要手改 `public/api/` 下的文件**：它们由 `scripts/bump-version.mjs` 幂等生成（同版本段落替换、
  置顶插入、孤儿版本文件自动清理），下次运行会覆盖。

## 维护提示

- **版本号**：字典中下载区的文件名、版本徽章与 hero 徽章需随软件版本更新；`lib/installer.ts` 需随分片脚本重新生成并同步直链。
- **macOS/Linux 上线后**：同样分片 + 提供直链，然后在 `components/landing/download-section.tsx` 中启用对应卡片的主按钮与备用按钮（填入直链即可）。
