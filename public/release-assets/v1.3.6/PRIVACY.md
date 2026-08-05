# 隐私策略 / Privacy Policy

生效日期 / Effective date: 2026-08-03

本文档说明 MultiGitGui 如何处理您的数据。MultiGitGui 是一款本地运行的 Git
图形客户端，**不会收集、上传或共享任何个人数据**。

This document explains how MultiGitGui handles your data. MultiGitGui is a
locally running Git GUI client. It **does not collect, upload, or share any
personal data**.

---

## 1. 数据存储位置 / Where data is stored

MultiGitGui 是一款本地应用。除您主动发起的 Git 网络操作（fetch / pull /
push 等）外，它不会向网络发送任何数据。您的数据仅存储在您自己的计算机上：

MultiGitGui is a local application. Apart from Git network operations you
explicitly initiate (fetch / pull / push, etc.), it does not send any data
over the network. Your data stays on your own computer:

| 操作系统 OS | 默认数据目录 Default data directory |
| --- | --- |
| Windows | `%LOCALAPPDATA%\MultiGitGui` |
| macOS | `~/Library/Application Support/MultiGitGui` |
| Linux | `$XDG_DATA_HOME/MultiGitGui`（默认 `~/.local/share/MultiGitGui`） |

安装/卸载向导还会在安装目录写入配置；卸载时可以选择一并删除应用数据。
The installer/uninstaller also writes configuration into the installation
directory; you may choose to delete application data during uninstall.

## 2. 存储了哪些数据 / What data is stored

本地数据目录中包含：

The local data directory contains:

- **工作区（workspace）**：您添加的项目与仓库路径列表、每个仓库的名称与
  显示设置。
  **Workspace**: the list of projects and repository paths you added, plus
  per-repository display settings.
- **设置（settings.json）**：界面偏好（主题、语言、布局）、Git 环境选项、
  并发与自动刷新设置、日志选项、推送对话框的最近使用历史（如 Gerrit
  topic / reviewer 等最近值）。
  **Settings (settings.json)**: UI preferences (theme, language, layout),
  Git environment options, concurrency and auto-refresh settings, logging
  options, and recent-use history of the push dialog (such as recently used
  Gerrit topics/reviewers).
- **操作日志（logs/operations.log）**：您执行过的 Git 操作记录。日志在写入
  前会**自动脱敏**：URL 中的用户名密码、token、API key 等密钥都会被替换为
  `***`。您可以在设置中关闭日志写入或仅记录命令而不记录输出。
  **Operation log (logs/operations.log)**: a record of the Git operations you
  run. Before anything is written, the log is **automatically redacted**:
  credentials embedded in URLs, tokens, API keys and similar secrets are
  replaced with `***`. You can disable file logging, or log commands only
  without their output, in settings.
- **存储布局迁移状态（storage.json 等）**：仅用于在数据目录迁移时定位
  数据，不含您的仓库内容。
  **Storage-layout migration state (storage.json etc.)**: used only to locate
  your data during directory migrations; it does not contain your repository
  contents.

MultiGitGui **不存储**您的 Git 凭据。认证完全交由您自己的 Git 配置处理
（Git credential helper、SSH agent 或系统密钥链）。程序会把这些凭据作为
参数传给 Git，并在任何日志或界面输出中对它们进行脱敏。

MultiGitGui does **not store** your Git credentials. Authentication is handled
entirely by your own Git configuration (a Git credential helper, SSH agent, or
the system keychain). The program passes credentials through to Git and
redacts them from any log or UI output.

## 3. 网络通信 / Network communication

- MultiGitGui 本身**没有遥测、分析、崩溃上报或自动更新**功能，不访问任何
  自有服务器。
  MultiGitGui itself has **no telemetry, analytics, crash reporting, or
  auto-update** and never contacts its own servers.
- 仅当您执行 fetch / pull / push 等操作时，程序才会按照您的仓库配置连接
  您自己的 Git 远端。连接目标、认证方式与数据内容完全由您的仓库设置决定。
  Only when you run operations such as fetch / pull / push does the program
  connect to your own Git remotes, as configured in your repositories. The
  endpoints, authentication, and data transferred are entirely determined by
  your repository configuration.
- 如果您开启了自动 fetch，程序会在设定的时间间隔内向您已配置的远端发起
  同样的网络请求。
  If you enable auto-fetch, the program issues the same kind of requests to
  your configured remotes on the configured interval.

## 4. 数据保留与删除 / Retention and deletion

- 操作日志默认保留最近 5 个文件、每个文件最大 16 MB（可在设置中调整）；
  删除日志文件即可清除历史记录。
  The operation log keeps up to 5 files of at most 16 MB each by default
  (adjustable in settings); deleting the log files removes the history.
- 卸载 MultiGitGui 时，可以选择一并删除整个数据目录。
  When uninstalling MultiGitGui, you may choose to delete the entire data
  directory as well.

## 5. 第三方组件 / Third-party components

MultiGitGui 捆绑了遵循各自许可证的开源组件（MIT、Apache-2.0、SIL OFL 1.1、
GPL-2.0 附带链接例外等），完整清单与许可文本见随安装包分发的
`THIRD-PARTY-NOTICES` 文件。

MultiGitGui bundles open-source components under their own licenses (MIT,
Apache-2.0, SIL OFL 1.1, GPL-2.0 with linking exception, etc.). The complete
list and license texts ship with the installer as `THIRD-PARTY-NOTICES`.

## 6. 联系方式 / Contact

如对本隐私策略有任何疑问，请联系作者：sxw（`sxw@sxwzxc.cn`）。

For any questions about this policy, contact the author: sxw
(`sxw@sxwzxc.cn`).
