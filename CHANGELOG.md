## 2.1.7 (2026-08-26)

# Unreleased

- 移除 Overview 自动刷新提示条；自动刷新仍可在设置/菜单/状态栏切换，默认关闭
- 推送、拉取、变基等写入操作与 Quick Terminal 结束后，对应仓库的状态与 History/Refs/Files 会自动刷新，无需刷新提示

# 2.1.1 - 2026-08-25

## 修复

- 修复：`SettingsStore.Changed` 按字段差分触发主题/字体/玻璃效果，`AutoRefreshHintDismissed`/`SetupWizardCompleted`/布局尺寸/更新时间戳不再触发整窗 chrome；`TransparencyLevelHint` 已为 `Transparent` 时不再重赋值，`Background`/`TransparencyBackgroundFallback` 同理；`UiThread.Post` 统一 marshal，避免后台 `Save` 跨线程碰界面
- 修复：向导 `AnimationsEnabled` 改为 `!ReduceMotion` 种子（`_animationsEnabled` 默认 `true`，与注释“Both default to on”对齐），首装点“跳过”不再把 `ReduceMotion` 从 `false` 误改 `true`
- 修复：macOS 主窗 `NSWindow` 透明化（`/usr/lib/libobjc.A.dylib`、`setOpaque:` 复用、`clearColor`/`windowBackgroundColor` 区分常态与最大化），圆角外不再露灰直角；仅经 `ApplyNativeWindowShape → MacWindowChrome.TryApply` 进入；`respondsToSelector:` 守卫并在 handle 已是 `NSWindow` 时不再发送 `window`，避免安装后启动 `objc_exception_throw`/`abort`
- 修复：从 DMG 安装后进程名显示为「Avalonia Application」——`App.Name`、`ApplicationTitle` 与 `Info.plist` `CFBundleDevelopmentRegion` 对齐为 MultiGitGui
- 修复：`DiffToolLauncher` 按平台解析 `MultiGitGuiDiff.exe`/`MultiGitGuiDiff`，`PATH` 扫到即返回不再跑 `which`，Unix 不再调用 `where.exe`
- 修复：macOS 简体中文系统界面仍显示英文——`Info.plist` 声明 `CFBundleLocalizations`（en、zh-Hans），语言解析优先读取 `AppleLanguages`
- 修复：macOS 下新手引导点「跳过」、设置页切 tab 崩溃——根因是 `BackdropBlurBorder` 自绘毛玻璃在 Metal 后端调 `SKSurface.Snapshot()` 触发 `EXC_BAD_ACCESS`；改用原生 `NSVisualEffectView`（`TransparencyLevelHint=AcrylicBlur`），并加 `BackdropSampling` 进程级闩锁，首次采样失败后永久停采而不是继续崩（ADR-0035）
- 修复：macOS 毛玻璃在窗口失焦后变白——`MacWindowChrome` 经 Objective-C 把 vibrancy 材质设为 `UnderWindowBackground`、状态设为 `Active`，并按主题设置 appearance；该修正不再被最大化分支的提前 `return` 跳过
- 修复：macOS 快捷键用 `Ctrl` 而非 `Cmd`——XAML 手势改 `{OnPlatform 'Ctrl+X', macOS='Meta+X'}`，代码里的修饰键判断统一走 `PlatformCommandModifier`，全屏改 `Ctrl+Cmd+F`，并补 `Cmd+←/→/↑/↓` 行首行尾与文档首尾（ADR-0036）
- 修复：macOS 缺系统菜单栏、Dock 菜单与红绿灯，关窗后进程驻留——补 `NativeMenu`（应用菜单含 About/Preferences ⌘,、窗口菜单镜像 Workspace/View/Help 并加 Edit）、Dock 菜单，`WindowDecorations.Full` 交还系统红绿灯，`ShutdownMode.OnMainWindowClose` 且关窗即退出；设置页的托盘项在 macOS 隐藏（macOS 无系统托盘）
- 修复：独立 Diff 工具从 Finder/Dock 启动时报找不到 Git——app bundle 继承的 `PATH` 不含 Homebrew，改经 `GitExecutableLocator` 探测并按进程缓存；`DiffToolHost`/`RepoModeWindow` 打开文件与目录改走 `PlatformShellLaunch`（macOS 用 `open`），路径始终作为独立实参传递
- 修复：`SingleInstanceCoordinator` 次实例可能在主实例的命名管道建好之前就发激活信号——监听侧在 `NamedPipeServerStream` 构造后立即置位就绪事件
- 修复：UI 线程与后台未捕获异常此前静默丢失——统一路由到 `CrashReporter` 与 `IOperationLog`，并在启动时无条件落 `startup-environment.log` 环境快照（渲染后端、语言链、chrome 模式），便于只能装 DMG 的用户回传诊断
- 修复：Windows 标题栏左侧被 macOS 红绿灯 78px 留白误伤——`UpdateTitleBarLeadingMargin` 现仅在 macOS 原生红绿灯（`IsMacOS() && UseNativeTrafficLights`）时才取 `WindowDecorationMargin.Left`，Windows 保持 `10,0,8,0` 的 `OnPlatform` 默认与 `WindowChromeMetrics`
- 修复：Windows 设置「外观」切 tab 卡死——`IsChecked="{Binding !ReduceMotion}"` 改为 `AnimationsEnabled` 绑定（`ReduceMotion = !AnimationsEnabled`），语言下拉由 `SelectedValue/SelectedValueBinding(Id)` 改为 `SelectedItem/SelectedLanguage`，避免系统语言 `Id=null` 的 `ComboBox` 循环导致 `ApplyStyles` 栈溢出；对话框冻结期间 `Bounds` 不再触发毛玻璃重采样

## 优化

- 优化：`ShellAppearance` 拆 `EnableVisualEffects`/`ReduceMotion`/`WallpaperPath` 细粒度谓词，仅改动画时不重刷玻璃与壁纸（`ApplyVisualEffects`/`ApplyWallpaper`/`RefreshBackdrop`）
- 优化：macOS DMG 改为按 `.app` 体积分配 HFS+ UDRW 暂存 → `ditto` 拷入 `.app` → 挂载卷上 `/Applications` 链接 → `osascript` Finder 拖放布局（540×380、128px 图标、隐藏工具栏/状态栏、item 级隐藏扩展名，`build/macos/dmg-background.png` 箭头底图）→ `hdiutil convert` UDZO → **`hdiutil verify`**；`detach` 遇 Resource busy 重试；`.app` 组包与 Diff 拷贝亦用 `ditto`（ADR-0034）
- 优化：macOS DMG 文件名带版本号（`MultiGitGui-<version>-<rid>.dmg`），与 Windows 安装包命名一致，避免重复下载互相覆盖
- 优化：`Info.plist` 补充桌面/文档/下载/可移动卷 TCC 用途描述；DMG 内附中文 `如何打开.txt` 说明 Gatekeeper 隔离解除步骤
- 优化：UI 字体栈追加 macOS 中文字面（PingFang SC、Hiragino Sans GB、Heiti SC）
- 优化：Blame 列表由 `DataGrid` 换成虚拟化 `ListBox`（Avalonia 12.1 的 `DataGrid` 无行虚拟化），大文件不再逐行实体化；列宽收敛到 `BlameViewLayout` 单一来源，表头与行共用同一定义并有测试防漂移
- 优化：Blame 虚拟化列表可拖列宽（表头 4px 拖动手柄，`BlameViewLayout` 像素列 + `BlameColumnSync` 同步，三端共用），长行可横向滚动（`ListBox` 自身 `ScrollViewer.HorizontalScrollBarVisibility="Auto"`，表头 `TranslateTransform` 跟随，文件列按最长行与视口仅增不减）
- 优化：`LoadingSpinner` 由每实例一个 16ms `DispatcherTimer` 改为共享 `LoadingSpinnerTickSource`，首个订阅时启动、最后一个退订时停止，多仓库总览页不再跑几十个 60Hz 定时器
- 优化：壁纸改为后台线程解码，窗口不再等大图解完才出现；并发请求以最后一次为准，乱序完成与关窗中途完成都会丢弃并释放位图
- 优化：`ShellService` 与 Diff 工具的路径打开逻辑合并到 `MultiGitGui.Core` 的 `PlatformShellLaunch`，平台分支成为可测纯函数（Windows 仍走 `UseShellExecute` 让系统按扩展名选处理程序）
- 优化：新增 `MULTIGITGUI_MACOS_RENDERER` 与 `MULTIGITGUI_MACOS_CHROME` 逃生开关，渲染后端与窗口 chrome 可在不重新打包的前提下回退验证
- 优化：`build/publish.sh` 去掉 `codesign 2>/dev/null` 吞错，`build/publish.sh`/`build/publish.ps1` 补末尾换行；`getExecutableFileName`/`FindOnPath` 抽取便于测试
- 优化：`build/publish.ps1`/`publish.sh`/`package.ps1` 不再内嵌跑测试，临时打包不再被全量测试拖住；测试改走 `build/run-tests.ps1`/`run-tests.sh`（`-Scope`/`CONFIGURATION`）

## 文档

- 文档：README（中英）发布段改为下载对应 `MultiGitGui-<version>-osx-arm64.dmg`/`osx-x64.dmg`、挂载拖入 Applications，保留 ad-hoc 与 Developer ID 说明，注明 Windows 交叉编译仅产开发用 `.app` 无 DMG
- 文档：README（中英）补充 Gatekeeper 隔离解除步骤（右键打开 / `xattr`）
- 文档：README（中英）发布段标明 publish/package 不跑测试，测试走 `build/run-tests.ps1`/`run-tests.sh`

# 2.1.0 - 2026-08-24

## 修复

- 修复：主界面 Diff 长文件可纵向滚完（视口高度不再等于全文高度）
- 修复：不勾选双栏视图时删除/新增行恢复整行红绿（unified 使用镜像行 Kind）
- 修复：查看路径历史后，侧栏改选其它仓库或项目会回到对应的普通历史；进入路径历史时侧栏跳到该文件所属仓库
- 修复：独立 Diff 对工作区文件不再复制到临时目录，保存写回真实工作区；启动失败会清掉 session 临时目录
- 修复：空文件对比时点击或 End 键不再因 0 行索引崩溃
- 修复：Git 写入成功但随后 status 刷新失败时，不再显示为成功
- 修复：`--repo` 模式以与文件对比相同的方式解码工作区文本（含 UTF-16/BOM），失败给出 Notice
- 修复：独立 Diff 的 Reload 在窗口关闭后不再碰界面，失败显示 Notice
- 修复：图像与二进制在打开探测阶段分流，不再当全文文本读入
- 修复：内容区最大化按钮的悬停提示随界面语言切换（中文「全窗口显示 (F11)」/「退出全窗口 (F11)」）

## 优化

- 优化：词级高亮文案改为「行内差异」，并说明与 Ctrl+F 搜索的区别
- 优化：对齐 Diff 绘制缓存折行表、最大列宽与 FormattedText，大文件鼠标移动与滚动不再每帧重建
- 优化：仓库 status 在 layout 之后并行读取 status 与 HEAD 摘要
- 优化：Changes 页行统计可取消上一轮，并限制同时进行的 git 数
- 优化：Diff 内搜索输入延迟 120ms 再全量扫描
- 优化：总览去掉仅重复标签名的分区条；提交页文件列表与历史过滤条去掉重复的内容区最大化按钮（还原仍在 Diff 工具栏；总览用 F11 / Esc）

# 2.0.38 - 2026-08-21

## 修复

- 修复：独立 Diff 打开无变更文本时显示原文；符号链接等不兼容内容显示「不支持的文件类型」，窗口不再退出

# 2.0.37 - 2026-08-21

## 优化

- 优化：`Info.plist` 的 `LSMinimumSystemVersion` 提升至 14.0；发布脚本 `build/publish.sh` 与 `build/publish.ps1` 在 macOS 上对 `MultiGitGui-*.app` 自动执行 `codesign --sign - --deep` ad-hoc 签名，Apple Silicon 可直接启动，Windows 交叉编译的 osx bundle 明确标注为开发产物（缺少可执行位与签名，无法在 Apple Silicon 运行）

## 文档

- 文档：README（中英）明确 macOS 14+ 要求，说明下载 `MultiGitGui-osx-arm64.app`（Apple Silicon）与 `MultiGitGui-osx-x64.app`（Intel，Apple Silicon 需 Rosetta）的区分，阐明 ad-hoc 签名与正式分发所需 Developer ID 签名/公证的区别
- 文档：新增 ADR-0033 固化提交页 Commit inclusion 约束（勾选不落暂存区、提交时 `restore --staged .` + `add --all` 对齐、不使用 `commit --all`）

# 2.0.34 - 2026-08-20

## 优化

- 优化：提交页以勾选决定提交与 stash 范围，不再用暂存/取消暂存按钮；提交时才对齐暂存区（`git restore --staged .` 后 `git add --all` 勾选路径，不再使用 `commit --all`）

# 2.0.29 - 2026-08-20

## 修复

- 修复：词级高亮与 In-diff search 在对齐视图主栏可见；忽略空白与上下文行数变更会重新读取差异；显示选项在冷启动时不再丢失

## 优化

- 优化：双栏视图、自动换行、其他选项、列标题对齐、行号槽随位数、代码区可过滚、双栏横向滚动按百分比同步
- 优化：Diff 窗口标题改为 `文件名 - 完整路径`（`--title-path` 或内容路径经 `ToolWindowChrome.FormatTitle`），长路径被裁切时文件名仍可见；`git difftool` 安装命令追加 `--title-path "$MERGED"` 以显示工作区路径而非临时文件

# 2.0.25 - 2026-08-21

## 修复

- 修复：提交页双击文件在独立 Diff 工具中打开后窗口不再立刻消失（手势结束后再启动 + 前台激活 + 加载异常兜底）

## 文档

- 文档：锁定 Ahead/Behind 为本机 upstream 本地计数（基于本地 remote-tracking refs，不含实时远端），Auto refresh 保持为定时静默本地状态读取（不含 fetch、不出 Result frame），与 Auto fetch 区分；同步 CONTEXT.md 与 docs/glossary.md 术语

# 2.0.20 - 2026-08-20

## 修复

- 修复：应用内更新下载不再被共享 HttpClient 的 30 秒超时打断；版本清单请求仍为 30 秒（ADR-0008）
- 修复：历史页在整页刷新未完成时点 Load More 会等待本次刷新，而不会取消刷新并把下一页接到旧列表后
- 修复：Files 页搜索走 git 索引（含未忽略的未跟踪文件），匹配仍为路径/文件名子串，避免扫盘进入忽略目录

## 优化

- 优化：总览未推送提交仅在展开或 ahead 时查询；侧栏项目徽章缓存；git 子进程输出缓冲池化
- 优化：安装向导背景动画在不可见时停止

# 2.0.8 - 2026-08-19

## 修复

- 修复：对齐视图 Display column 几何（ADR-0032）——统一 `DisplayColumns` 单一标尺，CJK/全角按 2 格、Tab 永远到下一个 4 格 stop，空白 glyph 仅改墨水不压缩宽度；命中、`Caret`/选区高亮、折行切段、内容宽度与横向滚动均按格子计算，`WhitespaceDisplay.ExpandSegment` 按绝对列展开 Tab 并补空格，键盘左右按完整 Unicode 标量跳过代理对

## 优化

- 优化：删除 `AlignedDiffWrapMap.ViewPositionFromScreen` 7 参数旧重载，`DisplayColumns` 抽取 `TabRemainingWidth`/`GetCodePointDisplayWidth` 消除重复 Tab 公式，`DisplayColumnsTests` 与 `WhitespaceDisplay` 补齐单测

# 2.0.6 - 2026-08-19

## 优化

- 优化：主程序与 MultiGitGuiDiff 发布启用 ReadyToRun，安装包与主程序共用一份 R2R 的 Avalonia/Core/Ui，降低独立 Diff 工具冷启动 JIT（ADR-0031）

# 2.0.4 - 2026-08-19

## 新增

- 新增：MultiGitGuiDiff 文件对比与仓库模式关闭窗口时若有未保存修改（含未写入的编码/换行），弹出与主程序相同的层内确认框（保存并退出 / 不保存并退出 / 取消）

## 优化

- 优化：独立 Diff 工具文件对比 / 查看 / 合并先显示 Open shell（居中 LoadingSpinner），再加载并对齐（ADR-0030）

# 2.0.2 - 2026-08-19

## 新增

- 新增：MultiGitGuiDiff 进程启用 in-app glass 菜单（ADR-0029）——透明叠加层与毛玻璃飞出面一致，客户端区域仍全量绘制不透桌面
- 新增：Diff 编辑器视口 overscroll——末行可滚至视口约 30% 高处，便于导航后阅读
- 新增：Diff 编辑器窗格右键菜单——Use this/other/both 文本块、Mark/Unmark、剪贴板（Copy/Cut/Paste）

## 修复

- 修复：Diff 工具菜单毛玻璃——与主程序相同启用 `OverlayPopups`，并把窗口标为 `visualEffects`，弹出菜单才能采样并模糊编辑器（ADR-0029）
- 修复：内联视图（单栏）勾选后显示真单栏布局（删除在上、新增在下）；默认仍为双栏

## 优化

- 优化：Diff 编辑器 Locator 条独立右列（宽 24px、贴右对齐），移除垂直滚动条
- 优化：转到行/帮助弹窗支持轻触关闭与正确锚点定位（命令条隐藏时回退到菜单栏密度按钮）
- 优化：line-diff 底栏默认关闭（显示选项中仍可开启）
- 优化：Diff 编辑器快捷键——Ctrl+M 标记差异块、Ctrl+L 折叠差异块、Ctrl+D 切换内联视图

# 2.0.1 - 2026-08-18

## 新增

- 新增：MultiGitGuiDiff 文件对比窗口改用菜单栏 + 分组命令条（ADR-0028）——文件/查看/显示选项/工具/帮助迁至顶栏菜单；命令条仅保留编辑/导航/块操作与视图栏切换
- 新增：命令条密度三态循环（展开带标签 → 仅图标 → 隐藏 → 展开），Ctrl+T 与菜单栏右侧按钮切换；每次打开窗口重置为展开，菜单栏不受密度控制影响

## 优化

- 优化：命令条内 Previous/Next、使用左/右块、查找/转到行改为上下叠放；移除组标题与复制/粘贴/删除按钮；显示选项（空白字符、比较策略、折行、EOL、line-diff、内联视图、词级高亮）统一收入菜单

# 2.0.0 - 2026-08-18

## 新增

- 新增：自绘对齐差异视图（AlignedDiffView）——替换 ListBox + 单元格 TextBox 旧路径；常驻 Caret、跨行字符选区（Text span）与行号槽块选（Block selection）；对齐空格行留在视图层不入文件，键入不触发 LCS 重算（保存/重载才重算对齐）
- 新增：独立 Diff 工具、主程序 Diff 页并排视图与合并编辑器统一采用对齐视图；统一/单栏布局为只读，编辑在并排（及合并 Result）窗格完成
- 新增：对齐视图自动折行（Word wrap）及 Screen↔View 坐标映射，Caret/选区跨折行段正确
- 新增：差异 Locator 条与底栏 line-diff 条——点击/拖动快速跳转，与垂直滚动同步
- 新增：Moved block 检测与 gutter ↕ 标记；双击跳转到对侧对应块并选中 staging Block
- 新增：独立 Patch 应用窗口——打开 `.patch`/`.diff` 预览 diff 并 apply 到工作区（含按文件 apply）
- 新增：Diff 编辑器行尾（EOL）标记开关与 Marked blocks（标记行 + Keep only marked，单步撤销）
- 新增：合并编辑器 Result 窗格打字与 Accept 冲突块共享一条撤销时间线——Ctrl+Z 先撤最后一次编辑，撤 Accept 同步恢复冲突列表与三栏着色

## 优化

- 优化：删除废弃的 `CodeEditorView` 控件与 `CodeEditorTests`；Diff/Merge 编辑器不再走文档级撤销 fallback
- 优化：Patch 文件打开对话框类型名本地化，并增加「所有文件」筛选（拖放仍限 `.patch`/`.diff`）
- 新增：MultiGitGuiDiff 编辑器双栏等宽与共享横向滚动——左右两栏严格各占视口一半，行号槽与中缝固定不动，超长行通过底部共享横向滚动条在两栏内同步滚动（列表横向滚动已移除）；中缝改为贯穿整高竖线，行复制箭头仍保留在固定中缝槽内
- 新增：MultiGitGuiDiff 支持纯文本查看器——`MultiGitGuiDiff <单文件>` 以只读查看器打开单个文件（行号/语法高亮/状态栏），文件页右键菜单可「在文本查看器中查看」
- 新增：MultiGitGuiDiff 编辑器工具栏窄窗口自适应——窗口宽度不足 860px 时自动隐藏按钮文字与分组标题并收紧间距（不影响用户显式的展开/收起选择）；收起态按钮收紧为方形图标目标，分组标题随收起一并隐藏；窗口顶栏改为自动换行布局，窄窗口不再溢出
- 新增：MultiGitGuiDiff 使用自定义应用图标（深色圆角方块 + 红绿双栏 + 底部白色 chevron），窗口标题栏/任务栏与 exe 图标同步替换默认图标
- 新增：MultiGitGuiDiff 编辑器工具栏展开时按「编辑 / 导航 / 块 / 空白字符 / 视图」分类显示，每组带小标题（收起后隐藏标题与按钮文字）；状态栏行尾（LF/CRLF）改为下拉切换，保存时按所选行尾整体重写
- 新增：MultiGitGuiDiff 顶栏新增主题按钮，可循环切换 浅色 / 深色 / 跟随系统
- 新增：MultiGitGuiDiff 编辑器补齐 TortoiseGitMerge 风格行操作——点击行号选择、拖拽/Shift 范围多选、Ctrl 多选，「使用左边/右边文件块」整块复制（单步撤销）、删除选中行、Ctrl+A 全选
- 新增：MultiGitGuiDiff 编辑器差异导航（上一处/下一处差异、滚动并选中整个差异块），工具栏按 编辑/导航/块/空白字符/视图 分组
- 新增：MultiGitGuiDiff 编辑器查找（Ctrl+F，F3/Shift+F3 前后跳转，n/m 计数）与跳到行（Ctrl+G）
- 新增：MultiGitGuiDiff 编辑器底部状态栏（光标列、当前行预览、编码、EOL、Tab 宽度、+N −M 统计）
- 新增：MultiGitGuiDiff 编辑器字符级差异高亮（修改行仅标出实际变化的词）、差异块分隔线、「忽略空白字符」开关
- 新增：MultiGitGuiDiff 编辑器重新加载、复制/粘贴选中行到剪贴板；仓库模式下「标记为已解决」（git add 该文件）
- 新增：MultiGitGuiDiff 编辑器内嵌差异导航（Ctrl+Alt+↑/↓）与仓库模式「视图栏」切换文件列表
- 新增：MultiGitGuiDiff 编辑器补齐 TortoiseGitMerge 剩余功能——词级高亮开关、「比较空白字符」、文本级块复制（使用左/右边文本块）、冲突导航（⚔，识别冲突标记）、折叠/展开差异块（▾，Ctrl+M）、帮助弹窗（?）、状态栏编码下拉（UTF-8/UTF-8 BOM/UTF-16 LE/BE/ASCII，保存按所选编码写回）、状态栏双行预览
- 新增：MultiGitGuiDiff 编辑器「内联视图（单栏）」切换——工具栏开关按钮，开启后修改行按「删除行在上、新增行在下」堆叠为统一 diff 单栏显示，可正常编辑、行选择、块复制、折叠与搜索（选中与统计按会话行去重，不因展开重复计数）
- 新增：MultiGitGuiDiff 编辑器工具栏收起/展开——箭头按钮或 Ctrl+T 切换：展开（默认）按钮显示图标+文字并自动换行成多行；收起后仅显示图标、单行紧凑，为对比区省出纵向空间
- 新增：MultiGitGuiDiff 合并模式关闭窗口时若有未保存修改，先弹出内联确认条（保存并关闭 / 放弃修改并退出 / 继续编辑），不再静默丢弃并以退出码 0 告知 git「已解决」
- 新增：MultiGitGuiDiff 编辑器查找替换（Ctrl+H 或查找栏）——「替换」作用于当前匹配行（可写两侧、忽略大小写、替换后自动跳到下一处匹配），「全部替换」一次撤销整批完成；只读侧（如仓库模式 HEAD）自动跳过
- 新增：MultiGitGuiDiff 编辑器「使用左边/右边文件」整文件级采用（对齐折叠为一致内容，单步撤销，只读目标侧自动禁用）与「另存为…」（右侧结果另存到所选路径）
- 新增：MultiGitGuiDiff 编辑器快捷键补齐——Ctrl+C 复制选中行、Ctrl+V 粘贴到选中行（单元格编辑中仍为原生行为）、F8/Shift+F8 跳转下一处/上一处差异；帮助弹窗同步列出
- 新增：MultiGitGuiDiff 文件对比窗口与仓库模式窗口的顶栏支持收起/展开（左侧箭头按钮）；仓库模式收起后仍显示分支徽章与文件汇总
- 新增：推送对话框可勾选「提升推送兼容性」，为本次计划中的每条 git push 加上 --no-thin
- 新增：总览展开后的未推送提交可双击或按 Enter 跳到历史页，自动选中该提交并打开详情

## 优化

- 优化：并排 Diff 与 MultiGitGuiDiff 双栏编辑器明确左右语义——左侧标注「原始」、右侧标注「现在」，与 TortoiseGit 双文件对比一致；主程序并排 Diff 顶部增加两栏标题
- 优化：MultiGitGuiDiff 双栏改为完整窗格布局——左右两栏从标题条到底部始终有整列窗格底色（空侧不再透明）、行间无缝、中间贯穿竖直分隔线、复制箭头叠加在分隔线上、行高统一；左右各加与窗格同宽的标题条；状态栏显示左侧文件实际编码与行尾（如 UTF-8 · LF）
- 修复：MultiGitGuiDiff 双栏在横向滚动容器中右栏被推出可视区（左栏改为按内容宽度、右栏填充剩余宽度），并保留完整窗格底色与竖直分隔线
- 修复：MultiGitGuiDiff 文本查看器窗口启动时因 ThemeHost 控件字段未初始化而崩溃（改用 Avalonia 编译生成的 InitializeComponent）
- 优化：清理 MultiGitGuiDiff/主程序零引用的死图标（MggIconArrowUpward/Downward），Undo 图标改为 Reset 的别名；窗口顶栏图标资源改为 TryFindResource 安全解析，键缺失不再崩溃；窗口条带收起快捷键 Ctrl+T 在文件对比/仓库模式窗口级同样生效（与工具提示一致）
- 优化：MultiGitGuiDiff 修复——行间复制箭头的启用状态此前检查源侧而非目标侧（仓库模式下最有用的「→ 拷到工作区」被禁用、会写只读 HEAD 的「←」反而可用）；单行复制、右键菜单插入/删除此前绕过「启用编辑」开关与只读侧限制；Ctrl+Z 撤销已保存的修改后脏标记不恢复（界面显示与磁盘不一致却不能保存）。以上均按 TortoiseGitMerge 语义修正并附回归测试
- 优化：MultiGitGuiDiff 编辑器工具栏焕新——统一 Material 图标、按 编辑/导航/块/视图开关 分组，按钮默认带文字标签（可随工具栏收起为纯图标），查找栏同步美化
- 优化：MultiGitGuiDiff 编辑器选中行数与保存/提示状态并入底部状态栏右侧，工具栏不再拥挤；两侧文件标题改为徽章样式并带「只读」标记
- 优化：MultiGitGuiDiff 文件对比窗口顶栏焕新——「浏览/编辑」改为分段式切换，「安装为 git 工具 / 系统菜单集成」归入同一操作条；仓库模式顶栏改为分支徽章 + 汇总 + 分段切换 + 刷新图标按钮，合并模式取消按钮所在条带统一视觉
- 优化：历史页提交详情的说明、文件列表、Diff 可拖动调整高度（最小约一行），并记住上次大小
- 优化：改动页文件右键菜单新增「还原」（未暂存/未跟踪文件；勾选优先于当前行，确认框与工具栏一致）；工具栏「丢弃」同步改为「还原」
- 优化：改动标签页名称由「改动 / Changes」改为「提交 / Commit」
- 优化：发布/打包脚本检测到仓库内正在运行的开发实例时立即报错并提示关闭，不再以晦涩的文件占用错误（MSB3027）失败

## 新增

- 新增：Diff 页语法高亮（常见语言按扩展名/内容识别），词级高亮优先、搜索高亮置顶
- 新增：Diff 页文件头显示 +N/−M 统计，顶部汇总「N 个文件变更，+X −Y」
- 新增：Diff 导航——Ctrl+Alt+↑/↓ 跳转上一个/下一个 hunk，Ctrl+Alt+←/→ 跳转上一个/下一个文件，Ctrl+F 在差异内搜索（含高亮与计数），大差异可「显示更多行」增量加载
- 新增：并排视图支持多选行级暂存/还原，变更块按内容对齐，滚动时顶部悬浮当前 hunk 标题
- 新增：冲突文件可从「提交」页打开「合并编辑器」（我方/基线/对方三窗 + 可编辑结果），支持按冲突采用我方/对方/两边都保留、Ctrl+S 保存、保存后自动标记已解决
- 新增：独立 Diff/合并工具 MultiGitGuiDiff.exe——比较任意两个文件，或 --merge 三路合并；窗口内一键安装为 git difftool/mergetool；随发布脚本一同产出
- 新增：Diff 页「仅看变更」视图、连续上下文折叠（点击展开）、复制整个差异为补丁、后退/前进浏览历史（Alt+←/→）、位置书签（Ctrl+Shift+1..9 标记 / Ctrl+Alt+1..9 跳转）、状态栏行数/文件/统计
- 新增：MultiGitGuiDiff 支持 --repo 打开仓库未提交改动视图；可安装/移除 Windows 系统菜单集成（「发送到」对比两个文件、仓库文件夹右键查看改动），支持 --install-shell / --uninstall-shell
- 新增：主程序可唤起 MultiGitGuiDiff——提交页右键/双击文件「在 MultiGitGuiDiff 中打开」（工作区 vs HEAD），历史详情文件右键「在 MultiGitGuiDiff 中比较」（提交 vs 父提交），文件页右键「在 MultiGitGuiDiff 中打开」（HEAD vs 工作区）
- 新增：独立 Diff 工具测试抽为 MultiGitGui.DiffTool.Tests 单独项目；build/run-tests.ps1 按 git 改动自动只跑受影响的测试项目（-Scope diff/app/core/all 手动指定），避免无关模块的无效测试时长
- 新增：独立 Diff 工具的文件对比（MultiGitGuiDiff <left> <right> 与 --repo）改为可编辑双栏编辑器——左右两侧都能点击直接输入（Enter 换行、Shift+Enter 提交、Tab 下移、Escape 取消、空行 Backspace/Delete 删除行），中间复制箭头一键把行复制到另一侧，Ctrl+Z/Y 撤销重做，Ctrl+S 保存回文件（保留 BOM 与换行风格）；工具栏可显示空白字符（空格圆点、制表符箭头）与自动换行；--repo 模式左侧为 HEAD 只读、右侧为工作区，保存即写回工作区并刷新浏览视图；「浏览/编辑」可随时切回经典统一/并排 Diff（搜索、hunk 跳转、书签）
- 修复：Diff 与合并编辑器的行文本被渲染两遍（Avalonia 12 下 InlineCollection 会把 TextBlock 的 Text 提前转成一个 Run，与分段高亮 Run 叠加），修复后所有差异视图文字恢复正常
- 修复：独立 Diff 工具启动时 git 子进程不再闪出控制台窗口（CreateNoWindow），只出现一个工具窗口

## 优化

- 优化：Diff 与编辑器代码抽入共享 MultiGitGui.Ui 库，主程序与独立工具渲染一致
- 优化：历史页提交详情的说明、文件列表、Diff 可拖动调整高度（最小约一行），并记住上次大小
- 优化：改动页文件右键菜单新增「还原」（未暂存/未跟踪文件；勾选优先于当前行，确认框与工具栏一致）；工具栏「丢弃」同步改为「还原」
- 优化：改动标签页名称由「改动 / Changes」改为「提交 / Commit」
- 优化：发布/打包脚本检测到仓库内正在运行的开发实例时立即报错并提示关闭，不再以晦涩的文件占用错误（MSB3027）失败

## 修复

- 修复：历史页文件右键「在 MultiGitGuiDiff 中比较」此前点击无反应——提交详情未携带仓库路径导致命令静默返回，现已修复并补集成测试

# 1.9.54 - 2026-08-14

## 修复

- 修复：添加存储库对话框勾选或取消「继续扫描存储库内部」等扫描选项后，立即按新选项重新扫描
## 2.1.4 (2026-08-25)

# 2.1.1 - 2026-08-25

## 修复

- 修复：`SettingsStore.Changed` 按字段差分触发主题/字体/玻璃效果，`AutoRefreshHintDismissed`/`SetupWizardCompleted`/布局尺寸/更新时间戳不再触发整窗 chrome；`TransparencyLevelHint` 已为 `Transparent` 时不再重赋值，`Background`/`TransparencyBackgroundFallback` 同理；`UiThread.Post` 统一 marshal，避免后台 `Save` 跨线程碰界面
- 修复：向导 `AnimationsEnabled` 改为 `!ReduceMotion` 种子（`_animationsEnabled` 默认 `true`，与注释“Both default to on”对齐），首装点“跳过”不再把 `ReduceMotion` 从 `false` 误改 `true`
- 修复：macOS 主窗 `NSWindow` 透明化（`/usr/lib/libobjc.A.dylib`、`setOpaque:` 复用、`clearColor`/`windowBackgroundColor` 区分常态与最大化），圆角外不再露灰直角；仅经 `ApplyNativeWindowShape → MacWindowChrome.TryApply` 进入；`respondsToSelector:` 守卫并在 handle 已是 `NSWindow` 时不再发送 `window`，避免安装后启动 `objc_exception_throw`/`abort`
- 修复：从 DMG 安装后进程名显示为「Avalonia Application」——`App.Name`、`ApplicationTitle` 与 `Info.plist` `CFBundleDevelopmentRegion` 对齐为 MultiGitGui
- 修复：`DiffToolLauncher` 按平台解析 `MultiGitGuiDiff.exe`/`MultiGitGuiDiff`，`PATH` 扫到即返回不再跑 `which`，Unix 不再调用 `where.exe`

## 优化

- 优化：`ShellAppearance` 拆 `EnableVisualEffects`/`ReduceMotion`/`WallpaperPath` 细粒度谓词，仅改动画时不重刷玻璃与壁纸（`ApplyVisualEffects`/`ApplyWallpaper`/`RefreshBackdrop`）
- 优化：macOS DMG 改为按 `.app` 体积分配 HFS+ UDRW 暂存 → `ditto` 拷入 `.app` → 挂载卷上 `/Applications` 链接 → `osascript` Finder 拖放布局（540×380、128px 图标、隐藏工具栏/状态栏、item 级隐藏扩展名，`build/macos/dmg-background.png` 箭头底图）→ `hdiutil convert` UDZO → **`hdiutil verify`**；`detach` 遇 Resource busy 重试；`.app` 组包与 Diff 拷贝亦用 `ditto`（ADR-0034）
- 优化：`build/publish.sh` 去掉 `codesign 2>/dev/null` 吞错，`build/publish.sh`/`build/publish.ps1` 补末尾换行；`getExecutableFileName`/`FindOnPath` 抽取便于测试
- 优化：`build/publish.ps1`/`publish.sh`/`package.ps1` 不再内嵌跑测试，临时打包不再被全量测试拖住；测试改走 `build/run-tests.ps1`/`run-tests.sh`（`-Scope`/`CONFIGURATION`）

## 文档

- 文档：README（中英）发布段改为下载对应 `MultiGitGui-osx-arm64.dmg`/`osx-x64.dmg`、挂载拖入 Applications，保留 ad-hoc 与 Developer ID 说明，注明 Windows 交叉编译仅产开发用 `.app` 无 DMG
- 文档：README（中英）发布段标明 publish/package 不跑测试，测试走 `build/run-tests.ps1`/`run-tests.sh`

# 2.1.0 - 2026-08-24

## 修复

- 修复：主界面 Diff 长文件可纵向滚完（视口高度不再等于全文高度）
- 修复：不勾选双栏视图时删除/新增行恢复整行红绿（unified 使用镜像行 Kind）
- 修复：查看路径历史后，侧栏改选其它仓库或项目会回到对应的普通历史；进入路径历史时侧栏跳到该文件所属仓库
- 修复：独立 Diff 对工作区文件不再复制到临时目录，保存写回真实工作区；启动失败会清掉 session 临时目录
- 修复：空文件对比时点击或 End 键不再因 0 行索引崩溃
- 修复：Git 写入成功但随后 status 刷新失败时，不再显示为成功
- 修复：`--repo` 模式以与文件对比相同的方式解码工作区文本（含 UTF-16/BOM），失败给出 Notice
- 修复：独立 Diff 的 Reload 在窗口关闭后不再碰界面，失败显示 Notice
- 修复：图像与二进制在打开探测阶段分流，不再当全文文本读入
- 修复：内容区最大化按钮的悬停提示随界面语言切换（中文「全窗口显示 (F11)」/「退出全窗口 (F11)」）

## 优化

- 优化：词级高亮文案改为「行内差异」，并说明与 Ctrl+F 搜索的区别
- 优化：对齐 Diff 绘制缓存折行表、最大列宽与 FormattedText，大文件鼠标移动与滚动不再每帧重建
- 优化：仓库 status 在 layout 之后并行读取 status 与 HEAD 摘要
- 优化：Changes 页行统计可取消上一轮，并限制同时进行的 git 数
- 优化：Diff 内搜索输入延迟 120ms 再全量扫描
- 优化：总览去掉仅重复标签名的分区条；提交页文件列表与历史过滤条去掉重复的内容区最大化按钮（还原仍在 Diff 工具栏；总览用 F11 / Esc）

# 2.0.38 - 2026-08-21

## 修复

- 修复：独立 Diff 打开无变更文本时显示原文；符号链接等不兼容内容显示「不支持的文件类型」，窗口不再退出

# 2.0.37 - 2026-08-21

## 优化

- 优化：`Info.plist` 的 `LSMinimumSystemVersion` 提升至 14.0；发布脚本 `build/publish.sh` 与 `build/publish.ps1` 在 macOS 上对 `MultiGitGui-*.app` 自动执行 `codesign --sign - --deep` ad-hoc 签名，Apple Silicon 可直接启动，Windows 交叉编译的 osx bundle 明确标注为开发产物（缺少可执行位与签名，无法在 Apple Silicon 运行）

## 文档

- 文档：README（中英）明确 macOS 14+ 要求，说明下载 `MultiGitGui-osx-arm64.app`（Apple Silicon）与 `MultiGitGui-osx-x64.app`（Intel，Apple Silicon 需 Rosetta）的区分，阐明 ad-hoc 签名与正式分发所需 Developer ID 签名/公证的区别
- 文档：新增 ADR-0033 固化提交页 Commit inclusion 约束（勾选不落暂存区、提交时 `restore --staged .` + `add --all` 对齐、不使用 `commit --all`）

# 2.0.34 - 2026-08-20

## 优化

- 优化：提交页以勾选决定提交与 stash 范围，不再用暂存/取消暂存按钮；提交时才对齐暂存区（`git restore --staged .` 后 `git add --all` 勾选路径，不再使用 `commit --all`）

# 2.0.29 - 2026-08-20

## 修复

- 修复：词级高亮与 In-diff search 在对齐视图主栏可见；忽略空白与上下文行数变更会重新读取差异；显示选项在冷启动时不再丢失

## 优化

- 优化：双栏视图、自动换行、其他选项、列标题对齐、行号槽随位数、代码区可过滚、双栏横向滚动按百分比同步
- 优化：Diff 窗口标题改为 `文件名 - 完整路径`（`--title-path` 或内容路径经 `ToolWindowChrome.FormatTitle`），长路径被裁切时文件名仍可见；`git difftool` 安装命令追加 `--title-path "$MERGED"` 以显示工作区路径而非临时文件

# 2.0.25 - 2026-08-21

## 修复

- 修复：提交页双击文件在独立 Diff 工具中打开后窗口不再立刻消失（手势结束后再启动 + 前台激活 + 加载异常兜底）

## 文档

- 文档：锁定 Ahead/Behind 为本机 upstream 本地计数（基于本地 remote-tracking refs，不含实时远端），Auto refresh 保持为定时静默本地状态读取（不含 fetch、不出 Result frame），与 Auto fetch 区分；同步 CONTEXT.md 与 docs/glossary.md 术语

# 2.0.20 - 2026-08-20

## 修复

- 修复：应用内更新下载不再被共享 HttpClient 的 30 秒超时打断；版本清单请求仍为 30 秒（ADR-0008）
- 修复：历史页在整页刷新未完成时点 Load More 会等待本次刷新，而不会取消刷新并把下一页接到旧列表后
- 修复：Files 页搜索走 git 索引（含未忽略的未跟踪文件），匹配仍为路径/文件名子串，避免扫盘进入忽略目录

## 优化

- 优化：总览未推送提交仅在展开或 ahead 时查询；侧栏项目徽章缓存；git 子进程输出缓冲池化
- 优化：安装向导背景动画在不可见时停止

# 2.0.8 - 2026-08-19

## 修复

- 修复：对齐视图 Display column 几何（ADR-0032）——统一 `DisplayColumns` 单一标尺，CJK/全角按 2 格、Tab 永远到下一个 4 格 stop，空白 glyph 仅改墨水不压缩宽度；命中、`Caret`/选区高亮、折行切段、内容宽度与横向滚动均按格子计算，`WhitespaceDisplay.ExpandSegment` 按绝对列展开 Tab 并补空格，键盘左右按完整 Unicode 标量跳过代理对

## 优化

- 优化：删除 `AlignedDiffWrapMap.ViewPositionFromScreen` 7 参数旧重载，`DisplayColumns` 抽取 `TabRemainingWidth`/`GetCodePointDisplayWidth` 消除重复 Tab 公式，`DisplayColumnsTests` 与 `WhitespaceDisplay` 补齐单测

# 2.0.6 - 2026-08-19

## 优化

- 优化：主程序与 MultiGitGuiDiff 发布启用 ReadyToRun，安装包与主程序共用一份 R2R 的 Avalonia/Core/Ui，降低独立 Diff 工具冷启动 JIT（ADR-0031）

# 2.0.4 - 2026-08-19

## 新增

- 新增：MultiGitGuiDiff 文件对比与仓库模式关闭窗口时若有未保存修改（含未写入的编码/换行），弹出与主程序相同的层内确认框（保存并退出 / 不保存并退出 / 取消）

## 优化

- 优化：独立 Diff 工具文件对比 / 查看 / 合并先显示 Open shell（居中 LoadingSpinner），再加载并对齐（ADR-0030）

# 2.0.2 - 2026-08-19

## 新增

- 新增：MultiGitGuiDiff 进程启用 in-app glass 菜单（ADR-0029）——透明叠加层与毛玻璃飞出面一致，客户端区域仍全量绘制不透桌面
- 新增：Diff 编辑器视口 overscroll——末行可滚至视口约 30% 高处，便于导航后阅读
- 新增：Diff 编辑器窗格右键菜单——Use this/other/both 文本块、Mark/Unmark、剪贴板（Copy/Cut/Paste）

## 修复

- 修复：Diff 工具菜单毛玻璃——与主程序相同启用 `OverlayPopups`，并把窗口标为 `visualEffects`，弹出菜单才能采样并模糊编辑器（ADR-0029）
- 修复：内联视图（单栏）勾选后显示真单栏布局（删除在上、新增在下）；默认仍为双栏

## 优化

- 优化：Diff 编辑器 Locator 条独立右列（宽 24px、贴右对齐），移除垂直滚动条
- 优化：转到行/帮助弹窗支持轻触关闭与正确锚点定位（命令条隐藏时回退到菜单栏密度按钮）
- 优化：line-diff 底栏默认关闭（显示选项中仍可开启）
- 优化：Diff 编辑器快捷键——Ctrl+M 标记差异块、Ctrl+L 折叠差异块、Ctrl+D 切换内联视图

# 2.0.1 - 2026-08-18

## 新增

- 新增：MultiGitGuiDiff 文件对比窗口改用菜单栏 + 分组命令条（ADR-0028）——文件/查看/显示选项/工具/帮助迁至顶栏菜单；命令条仅保留编辑/导航/块操作与视图栏切换
- 新增：命令条密度三态循环（展开带标签 → 仅图标 → 隐藏 → 展开），Ctrl+T 与菜单栏右侧按钮切换；每次打开窗口重置为展开，菜单栏不受密度控制影响

## 优化

- 优化：命令条内 Previous/Next、使用左/右块、查找/转到行改为上下叠放；移除组标题与复制/粘贴/删除按钮；显示选项（空白字符、比较策略、折行、EOL、line-diff、内联视图、词级高亮）统一收入菜单

# 2.0.0 - 2026-08-18

## 新增

- 新增：自绘对齐差异视图（AlignedDiffView）——替换 ListBox + 单元格 TextBox 旧路径；常驻 Caret、跨行字符选区（Text span）与行号槽块选（Block selection）；对齐空格行留在视图层不入文件，键入不触发 LCS 重算（保存/重载才重算对齐）
- 新增：独立 Diff 工具、主程序 Diff 页并排视图与合并编辑器统一采用对齐视图；统一/单栏布局为只读，编辑在并排（及合并 Result）窗格完成
- 新增：对齐视图自动折行（Word wrap）及 Screen↔View 坐标映射，Caret/选区跨折行段正确
- 新增：差异 Locator 条与底栏 line-diff 条——点击/拖动快速跳转，与垂直滚动同步
- 新增：Moved block 检测与 gutter ↕ 标记；双击跳转到对侧对应块并选中 staging Block
- 新增：独立 Patch 应用窗口——打开 `.patch`/`.diff` 预览 diff 并 apply 到工作区（含按文件 apply）
- 新增：Diff 编辑器行尾（EOL）标记开关与 Marked blocks（标记行 + Keep only marked，单步撤销）
- 新增：合并编辑器 Result 窗格打字与 Accept 冲突块共享一条撤销时间线——Ctrl+Z 先撤最后一次编辑，撤 Accept 同步恢复冲突列表与三栏着色

## 优化

- 优化：删除废弃的 `CodeEditorView` 控件与 `CodeEditorTests`；Diff/Merge 编辑器不再走文档级撤销 fallback
- 优化：Patch 文件打开对话框类型名本地化，并增加「所有文件」筛选（拖放仍限 `.patch`/`.diff`）
- 新增：MultiGitGuiDiff 编辑器双栏等宽与共享横向滚动——左右两栏严格各占视口一半，行号槽与中缝固定不动，超长行通过底部共享横向滚动条在两栏内同步滚动（列表横向滚动已移除）；中缝改为贯穿整高竖线，行复制箭头仍保留在固定中缝槽内
- 新增：MultiGitGuiDiff 支持纯文本查看器——`MultiGitGuiDiff <单文件>` 以只读查看器打开单个文件（行号/语法高亮/状态栏），文件页右键菜单可「在文本查看器中查看」
- 新增：MultiGitGuiDiff 编辑器工具栏窄窗口自适应——窗口宽度不足 860px 时自动隐藏按钮文字与分组标题并收紧间距（不影响用户显式的展开/收起选择）；收起态按钮收紧为方形图标目标，分组标题随收起一并隐藏；窗口顶栏改为自动换行布局，窄窗口不再溢出
- 新增：MultiGitGuiDiff 使用自定义应用图标（深色圆角方块 + 红绿双栏 + 底部白色 chevron），窗口标题栏/任务栏与 exe 图标同步替换默认图标
- 新增：MultiGitGuiDiff 编辑器工具栏展开时按「编辑 / 导航 / 块 / 空白字符 / 视图」分类显示，每组带小标题（收起后隐藏标题与按钮文字）；状态栏行尾（LF/CRLF）改为下拉切换，保存时按所选行尾整体重写
- 新增：MultiGitGuiDiff 顶栏新增主题按钮，可循环切换 浅色 / 深色 / 跟随系统
- 新增：MultiGitGuiDiff 编辑器补齐 TortoiseGitMerge 风格行操作——点击行号选择、拖拽/Shift 范围多选、Ctrl 多选，「使用左边/右边文件块」整块复制（单步撤销）、删除选中行、Ctrl+A 全选
- 新增：MultiGitGuiDiff 编辑器差异导航（上一处/下一处差异、滚动并选中整个差异块），工具栏按 编辑/导航/块/空白字符/视图 分组
- 新增：MultiGitGuiDiff 编辑器查找（Ctrl+F，F3/Shift+F3 前后跳转，n/m 计数）与跳到行（Ctrl+G）
- 新增：MultiGitGuiDiff 编辑器底部状态栏（光标列、当前行预览、编码、EOL、Tab 宽度、+N −M 统计）
- 新增：MultiGitGuiDiff 编辑器字符级差异高亮（修改行仅标出实际变化的词）、差异块分隔线、「忽略空白字符」开关
- 新增：MultiGitGuiDiff 编辑器重新加载、复制/粘贴选中行到剪贴板；仓库模式下「标记为已解决」（git add 该文件）
- 新增：MultiGitGuiDiff 编辑器内嵌差异导航（Ctrl+Alt+↑/↓）与仓库模式「视图栏」切换文件列表
- 新增：MultiGitGuiDiff 编辑器补齐 TortoiseGitMerge 剩余功能——词级高亮开关、「比较空白字符」、文本级块复制（使用左/右边文本块）、冲突导航（⚔，识别冲突标记）、折叠/展开差异块（▾，Ctrl+M）、帮助弹窗（?）、状态栏编码下拉（UTF-8/UTF-8 BOM/UTF-16 LE/BE/ASCII，保存按所选编码写回）、状态栏双行预览
- 新增：MultiGitGuiDiff 编辑器「内联视图（单栏）」切换——工具栏开关按钮，开启后修改行按「删除行在上、新增行在下」堆叠为统一 diff 单栏显示，可正常编辑、行选择、块复制、折叠与搜索（选中与统计按会话行去重，不因展开重复计数）
- 新增：MultiGitGuiDiff 编辑器工具栏收起/展开——箭头按钮或 Ctrl+T 切换：展开（默认）按钮显示图标+文字并自动换行成多行；收起后仅显示图标、单行紧凑，为对比区省出纵向空间
- 新增：MultiGitGuiDiff 合并模式关闭窗口时若有未保存修改，先弹出内联确认条（保存并关闭 / 放弃修改并退出 / 继续编辑），不再静默丢弃并以退出码 0 告知 git「已解决」
- 新增：MultiGitGuiDiff 编辑器查找替换（Ctrl+H 或查找栏）——「替换」作用于当前匹配行（可写两侧、忽略大小写、替换后自动跳到下一处匹配），「全部替换」一次撤销整批完成；只读侧（如仓库模式 HEAD）自动跳过
- 新增：MultiGitGuiDiff 编辑器「使用左边/右边文件」整文件级采用（对齐折叠为一致内容，单步撤销，只读目标侧自动禁用）与「另存为…」（右侧结果另存到所选路径）
- 新增：MultiGitGuiDiff 编辑器快捷键补齐——Ctrl+C 复制选中行、Ctrl+V 粘贴到选中行（单元格编辑中仍为原生行为）、F8/Shift+F8 跳转下一处/上一处差异；帮助弹窗同步列出
- 新增：MultiGitGuiDiff 文件对比窗口与仓库模式窗口的顶栏支持收起/展开（左侧箭头按钮）；仓库模式收起后仍显示分支徽章与文件汇总
- 新增：推送对话框可勾选「提升推送兼容性」，为本次计划中的每条 git push 加上 --no-thin
- 新增：总览展开后的未推送提交可双击或按 Enter 跳到历史页，自动选中该提交并打开详情

## 优化

- 优化：并排 Diff 与 MultiGitGuiDiff 双栏编辑器明确左右语义——左侧标注「原始」、右侧标注「现在」，与 TortoiseGit 双文件对比一致；主程序并排 Diff 顶部增加两栏标题
- 优化：MultiGitGuiDiff 双栏改为完整窗格布局——左右两栏从标题条到底部始终有整列窗格底色（空侧不再透明）、行间无缝、中间贯穿竖直分隔线、复制箭头叠加在分隔线上、行高统一；左右各加与窗格同宽的标题条；状态栏显示左侧文件实际编码与行尾（如 UTF-8 · LF）
- 修复：MultiGitGuiDiff 双栏在横向滚动容器中右栏被推出可视区（左栏改为按内容宽度、右栏填充剩余宽度），并保留完整窗格底色与竖直分隔线
- 修复：MultiGitGuiDiff 文本查看器窗口启动时因 ThemeHost 控件字段未初始化而崩溃（改用 Avalonia 编译生成的 InitializeComponent）
- 优化：清理 MultiGitGuiDiff/主程序零引用的死图标（MggIconArrowUpward/Downward），Undo 图标改为 Reset 的别名；窗口顶栏图标资源改为 TryFindResource 安全解析，键缺失不再崩溃；窗口条带收起快捷键 Ctrl+T 在文件对比/仓库模式窗口级同样生效（与工具提示一致）
- 优化：MultiGitGuiDiff 修复——行间复制箭头的启用状态此前检查源侧而非目标侧（仓库模式下最有用的「→ 拷到工作区」被禁用、会写只读 HEAD 的「←」反而可用）；单行复制、右键菜单插入/删除此前绕过「启用编辑」开关与只读侧限制；Ctrl+Z 撤销已保存的修改后脏标记不恢复（界面显示与磁盘不一致却不能保存）。以上均按 TortoiseGitMerge 语义修正并附回归测试
- 优化：MultiGitGuiDiff 编辑器工具栏焕新——统一 Material 图标、按 编辑/导航/块/视图开关 分组，按钮默认带文字标签（可随工具栏收起为纯图标），查找栏同步美化
- 优化：MultiGitGuiDiff 编辑器选中行数与保存/提示状态并入底部状态栏右侧，工具栏不再拥挤；两侧文件标题改为徽章样式并带「只读」标记
- 优化：MultiGitGuiDiff 文件对比窗口顶栏焕新——「浏览/编辑」改为分段式切换，「安装为 git 工具 / 系统菜单集成」归入同一操作条；仓库模式顶栏改为分支徽章 + 汇总 + 分段切换 + 刷新图标按钮，合并模式取消按钮所在条带统一视觉
- 优化：历史页提交详情的说明、文件列表、Diff 可拖动调整高度（最小约一行），并记住上次大小
- 优化：改动页文件右键菜单新增「还原」（未暂存/未跟踪文件；勾选优先于当前行，确认框与工具栏一致）；工具栏「丢弃」同步改为「还原」
- 优化：改动标签页名称由「改动 / Changes」改为「提交 / Commit」
- 优化：发布/打包脚本检测到仓库内正在运行的开发实例时立即报错并提示关闭，不再以晦涩的文件占用错误（MSB3027）失败

## 新增

- 新增：Diff 页语法高亮（常见语言按扩展名/内容识别），词级高亮优先、搜索高亮置顶
- 新增：Diff 页文件头显示 +N/−M 统计，顶部汇总「N 个文件变更，+X −Y」
- 新增：Diff 导航——Ctrl+Alt+↑/↓ 跳转上一个/下一个 hunk，Ctrl+Alt+←/→ 跳转上一个/下一个文件，Ctrl+F 在差异内搜索（含高亮与计数），大差异可「显示更多行」增量加载
- 新增：并排视图支持多选行级暂存/还原，变更块按内容对齐，滚动时顶部悬浮当前 hunk 标题
- 新增：冲突文件可从「提交」页打开「合并编辑器」（我方/基线/对方三窗 + 可编辑结果），支持按冲突采用我方/对方/两边都保留、Ctrl+S 保存、保存后自动标记已解决
- 新增：独立 Diff/合并工具 MultiGitGuiDiff.exe——比较任意两个文件，或 --merge 三路合并；窗口内一键安装为 git difftool/mergetool；随发布脚本一同产出
- 新增：Diff 页「仅看变更」视图、连续上下文折叠（点击展开）、复制整个差异为补丁、后退/前进浏览历史（Alt+←/→）、位置书签（Ctrl+Shift+1..9 标记 / Ctrl+Alt+1..9 跳转）、状态栏行数/文件/统计
- 新增：MultiGitGuiDiff 支持 --repo 打开仓库未提交改动视图；可安装/移除 Windows 系统菜单集成（「发送到」对比两个文件、仓库文件夹右键查看改动），支持 --install-shell / --uninstall-shell
- 新增：主程序可唤起 MultiGitGuiDiff——提交页右键/双击文件「在 MultiGitGuiDiff 中打开」（工作区 vs HEAD），历史详情文件右键「在 MultiGitGuiDiff 中比较」（提交 vs 父提交），文件页右键「在 MultiGitGuiDiff 中打开」（HEAD vs 工作区）
- 新增：独立 Diff 工具测试抽为 MultiGitGui.DiffTool.Tests 单独项目；build/run-tests.ps1 按 git 改动自动只跑受影响的测试项目（-Scope diff/app/core/all 手动指定），避免无关模块的无效测试时长
- 新增：独立 Diff 工具的文件对比（MultiGitGuiDiff <left> <right> 与 --repo）改为可编辑双栏编辑器——左右两侧都能点击直接输入（Enter 换行、Shift+Enter 提交、Tab 下移、Escape 取消、空行 Backspace/Delete 删除行），中间复制箭头一键把行复制到另一侧，Ctrl+Z/Y 撤销重做，Ctrl+S 保存回文件（保留 BOM 与换行风格）；工具栏可显示空白字符（空格圆点、制表符箭头）与自动换行；--repo 模式左侧为 HEAD 只读、右侧为工作区，保存即写回工作区并刷新浏览视图；「浏览/编辑」可随时切回经典统一/并排 Diff（搜索、hunk 跳转、书签）
- 修复：Diff 与合并编辑器的行文本被渲染两遍（Avalonia 12 下 InlineCollection 会把 TextBlock 的 Text 提前转成一个 Run，与分段高亮 Run 叠加），修复后所有差异视图文字恢复正常
- 修复：独立 Diff 工具启动时 git 子进程不再闪出控制台窗口（CreateNoWindow），只出现一个工具窗口

## 优化

- 优化：Diff 与编辑器代码抽入共享 MultiGitGui.Ui 库，主程序与独立工具渲染一致
- 优化：历史页提交详情的说明、文件列表、Diff 可拖动调整高度（最小约一行），并记住上次大小
- 优化：改动页文件右键菜单新增「还原」（未暂存/未跟踪文件；勾选优先于当前行，确认框与工具栏一致）；工具栏「丢弃」同步改为「还原」
- 优化：改动标签页名称由「改动 / Changes」改为「提交 / Commit」
- 优化：发布/打包脚本检测到仓库内正在运行的开发实例时立即报错并提示关闭，不再以晦涩的文件占用错误（MSB3027）失败

## 修复

- 修复：历史页文件右键「在 MultiGitGuiDiff 中比较」此前点击无反应——提交详情未携带仓库路径导致命令静默返回，现已修复并补集成测试

# 1.9.54 - 2026-08-14

## 修复

- 修复：添加存储库对话框勾选或取消「继续扫描存储库内部」等扫描选项后，立即按新选项重新扫描
## 2.1.2 (2026-08-25)

# MultiGitGui 更新日志

<!-- 提交时若钩子自动将 VersionPrefix +1，请将标题中的 2.1.0 改为钩子后的实际版本 -->

## 2.1.1 - 2026-08-25

### 修复

- 修复：`SettingsStore.Changed` 按字段差分触发主题/字体/玻璃效果，`AutoRefreshHintDismissed`/`SetupWizardCompleted`/布局尺寸/更新时间戳不再触发整窗 chrome；`TransparencyLevelHint` 已为 `Transparent` 时不再重赋值，`Background`/`TransparencyBackgroundFallback` 同理；`UiThread.Post` 统一 marshal，避免后台 `Save` 跨线程碰界面
- 修复：向导 `AnimationsEnabled` 改为 `!ReduceMotion` 种子（`_animationsEnabled` 默认 `true`，与注释“Both default to on”对齐），首装点“跳过”不再把 `ReduceMotion` 从 `false` 误改 `true`
- 修复：macOS 主窗 `NSWindow` 透明化（`/usr/lib/libobjc.A.dylib`、`setOpaque:` 复用、`clearColor`/`windowBackgroundColor` 区分常态与最大化），圆角外不再露灰直角；仅经 `ApplyNativeWindowShape → MacWindowChrome.TryApply` 进入
- 修复：`DiffToolLauncher` 按平台解析 `MultiGitGuiDiff.exe`/`MultiGitGuiDiff`，`PATH` 扫到即返回不再跑 `which`，Unix 不再调用 `where.exe`

### 优化

- 优化：`ShellAppearance` 拆 `EnableVisualEffects`/`ReduceMotion`/`WallpaperPath` 细粒度谓词，仅改动画时不重刷玻璃与壁纸（`ApplyVisualEffects`/`ApplyWallpaper`/`RefreshBackdrop`）
- 优化：macOS 产物改为 `hdiutil` UDZO DMG（`MultiGitGui.app` 不带 RID + `/Applications` 链接，`hdiutil create -volname MultiGitGui -srcfolder -ov -format UDZO`），`.app` 组好后拷入 `MultiGitGuiDiff`/`MultiGitGuiDiff.*` 再 `chmod +x` 后 `codesign --force --sign - --deep`；CI/Release 仅上传 `*.dmg`，不再把整个 `artifacts/` 或 `ditto` zip 当下载物（ADR-0034）
- 优化：`build/publish.sh` 去掉 `codesign 2>/dev/null` 吞错，`build/publish.sh`/`build/publish.ps1` 补末尾换行；`getExecutableFileName`/`FindOnPath` 抽取便于测试
- 优化：`build/publish.ps1`/`publish.sh`/`package.ps1` 不再内嵌跑测试，临时打包不再被全量测试拖住；测试改走 `build/run-tests.ps1`/`run-tests.sh`（`-Scope`/`CONFIGURATION`）

### 文档

- 文档：README（中英）发布段改为下载对应 `MultiGitGui-osx-arm64.dmg`/`osx-x64.dmg`、挂载拖入 Applications，保留 ad-hoc 与 Developer ID 说明，注明 Windows 交叉编译仅产开发用 `.app` 无 DMG
- 文档：README（中英）发布段标明 publish/package 不跑测试，测试走 `build/run-tests.ps1`/`run-tests.sh`

## 2.1.0 - 2026-08-24

### 修复

- 修复：主界面 Diff 长文件可纵向滚完（视口高度不再等于全文高度）
- 修复：不勾选双栏视图时删除/新增行恢复整行红绿（unified 使用镜像行 Kind）
- 修复：查看路径历史后，侧栏改选其它仓库或项目会回到对应的普通历史；进入路径历史时侧栏跳到该文件所属仓库
- 修复：独立 Diff 对工作区文件不再复制到临时目录，保存写回真实工作区；启动失败会清掉 session 临时目录
- 修复：空文件对比时点击或 End 键不再因 0 行索引崩溃
- 修复：Git 写入成功但随后 status 刷新失败时，不再显示为成功
- 修复：`--repo` 模式以与文件对比相同的方式解码工作区文本（含 UTF-16/BOM），失败给出 Notice
- 修复：独立 Diff 的 Reload 在窗口关闭后不再碰界面，失败显示 Notice
- 修复：图像与二进制在打开探测阶段分流，不再当全文文本读入
- 修复：内容区最大化按钮的悬停提示随界面语言切换（中文「全窗口显示 (F11)」/「退出全窗口 (F11)」）

### 优化

- 优化：词级高亮文案改为「行内差异」，并说明与 Ctrl+F 搜索的区别
- 优化：对齐 Diff 绘制缓存折行表、最大列宽与 FormattedText，大文件鼠标移动与滚动不再每帧重建
- 优化：仓库 status 在 layout 之后并行读取 status 与 HEAD 摘要
- 优化：Changes 页行统计可取消上一轮，并限制同时进行的 git 数
- 优化：Diff 内搜索输入延迟 120ms 再全量扫描
- 优化：总览去掉仅重复标签名的分区条；提交页文件列表与历史过滤条去掉重复的内容区最大化按钮（还原仍在 Diff 工具栏；总览用 F11 / Esc）

## 2.0.38 - 2026-08-21

### 修复

- 修复：独立 Diff 打开无变更文本时显示原文；符号链接等不兼容内容显示「不支持的文件类型」，窗口不再退出

## 2.0.37 - 2026-08-21

### 优化

- 优化：`Info.plist` 的 `LSMinimumSystemVersion` 提升至 14.0；发布脚本 `build/publish.sh` 与 `build/publish.ps1` 在 macOS 上对 `MultiGitGui-*.app` 自动执行 `codesign --sign - --deep` ad-hoc 签名，Apple Silicon 可直接启动，Windows 交叉编译的 osx bundle 明确标注为开发产物（缺少可执行位与签名，无法在 Apple Silicon 运行）

### 文档

- 文档：README（中英）明确 macOS 14+ 要求，说明下载 `MultiGitGui-osx-arm64.app`（Apple Silicon）与 `MultiGitGui-osx-x64.app`（Intel，Apple Silicon 需 Rosetta）的区分，阐明 ad-hoc 签名与正式分发所需 Developer ID 签名/公证的区别
- 文档：新增 ADR-0033 固化提交页 Commit inclusion 约束（勾选不落暂存区、提交时 `restore --staged .` + `add --all` 对齐、不使用 `commit --all`）

## 2.0.34 - 2026-08-20

### 优化

- 优化：提交页以勾选决定提交与 stash 范围，不再用暂存/取消暂存按钮；提交时才对齐暂存区（`git restore --staged .` 后 `git add --all` 勾选路径，不再使用 `commit --all`）

## 2.0.29 - 2026-08-20

### 修复

- 修复：词级高亮与 In-diff search 在对齐视图主栏可见；忽略空白与上下文行数变更会重新读取差异；显示选项在冷启动时不再丢失

### 优化

- 优化：双栏视图、自动换行、其他选项、列标题对齐、行号槽随位数、代码区可过滚、双栏横向滚动按百分比同步
- 优化：Diff 窗口标题改为 `文件名 - 完整路径`（`--title-path` 或内容路径经 `ToolWindowChrome.FormatTitle`），长路径被裁切时文件名仍可见；`git difftool` 安装命令追加 `--title-path "$MERGED"` 以显示工作区路径而非临时文件

## 2.0.25 - 2026-08-21

### 修复

- 修复：提交页双击文件在独立 Diff 工具中打开后窗口不再立刻消失（手势结束后再启动 + 前台激活 + 加载异常兜底）

### 文档

- 文档：锁定 Ahead/Behind 为本机 upstream 本地计数（基于本地 remote-tracking refs，不含实时远端），Auto refresh 保持为定时静默本地状态读取（不含 fetch、不出 Result frame），与 Auto fetch 区分；同步 CONTEXT.md 与 docs/glossary.md 术语

## 2.0.20 - 2026-08-20

### 修复

- 修复：应用内更新下载不再被共享 HttpClient 的 30 秒超时打断；版本清单请求仍为 30 秒（ADR-0008）
- 修复：历史页在整页刷新未完成时点 Load More 会等待本次刷新，而不会取消刷新并把下一页接到旧列表后
- 修复：Files 页搜索走 git 索引（含未忽略的未跟踪文件），匹配仍为路径/文件名子串，避免扫盘进入忽略目录

### 优化

- 优化：总览未推送提交仅在展开或 ahead 时查询；侧栏项目徽章缓存；git 子进程输出缓冲池化
- 优化：安装向导背景动画在不可见时停止

## 2.0.8 - 2026-08-19

### 修复

- 修复：对齐视图 Display column 几何（ADR-0032）——统一 `DisplayColumns` 单一标尺，CJK/全角按 2 格、Tab 永远到下一个 4 格 stop，空白 glyph 仅改墨水不压缩宽度；命中、`Caret`/选区高亮、折行切段、内容宽度与横向滚动均按格子计算，`WhitespaceDisplay.ExpandSegment` 按绝对列展开 Tab 并补空格，键盘左右按完整 Unicode 标量跳过代理对

### 优化

- 优化：删除 `AlignedDiffWrapMap.ViewPositionFromScreen` 7 参数旧重载，`DisplayColumns` 抽取 `TabRemainingWidth`/`GetCodePointDisplayWidth` 消除重复 Tab 公式，`DisplayColumnsTests` 与 `WhitespaceDisplay` 补齐单测

## 2.0.6 - 2026-08-19

### 优化

- 优化：主程序与 MultiGitGuiDiff 发布启用 ReadyToRun，安装包与主程序共用一份 R2R 的 Avalonia/Core/Ui，降低独立 Diff 工具冷启动 JIT（ADR-0031）

## 2.0.4 - 2026-08-19

### 新增

- 新增：MultiGitGuiDiff 文件对比与仓库模式关闭窗口时若有未保存修改（含未写入的编码/换行），弹出与主程序相同的层内确认框（保存并退出 / 不保存并退出 / 取消）

### 优化

- 优化：独立 Diff 工具文件对比 / 查看 / 合并先显示 Open shell（居中 LoadingSpinner），再加载并对齐（ADR-0030）

## 2.0.2 - 2026-08-19

### 新增

- 新增：MultiGitGuiDiff 进程启用 in-app glass 菜单（ADR-0029）——透明叠加层与毛玻璃飞出面一致，客户端区域仍全量绘制不透桌面
- 新增：Diff 编辑器视口 overscroll——末行可滚至视口约 30% 高处，便于导航后阅读
- 新增：Diff 编辑器窗格右键菜单——Use this/other/both 文本块、Mark/Unmark、剪贴板（Copy/Cut/Paste）

### 修复

- 修复：Diff 工具菜单毛玻璃——与主程序相同启用 `OverlayPopups`，并把窗口标为 `visualEffects`，弹出菜单才能采样并模糊编辑器（ADR-0029）
- 修复：内联视图（单栏）勾选后显示真单栏布局（删除在上、新增在下）；默认仍为双栏

### 优化

- 优化：Diff 编辑器 Locator 条独立右列（宽 24px、贴右对齐），移除垂直滚动条
- 优化：转到行/帮助弹窗支持轻触关闭与正确锚点定位（命令条隐藏时回退到菜单栏密度按钮）
- 优化：line-diff 底栏默认关闭（显示选项中仍可开启）
- 优化：Diff 编辑器快捷键——Ctrl+M 标记差异块、Ctrl+L 折叠差异块、Ctrl+D 切换内联视图

## 2.0.1 - 2026-08-18

### 新增

- 新增：MultiGitGuiDiff 文件对比窗口改用菜单栏 + 分组命令条（ADR-0028）——文件/查看/显示选项/工具/帮助迁至顶栏菜单；命令条仅保留编辑/导航/块操作与视图栏切换
- 新增：命令条密度三态循环（展开带标签 → 仅图标 → 隐藏 → 展开），Ctrl+T 与菜单栏右侧按钮切换；每次打开窗口重置为展开，菜单栏不受密度控制影响

### 优化

- 优化：命令条内 Previous/Next、使用左/右块、查找/转到行改为上下叠放；移除组标题与复制/粘贴/删除按钮；显示选项（空白字符、比较策略、折行、EOL、line-diff、内联视图、词级高亮）统一收入菜单

## 2.0.0 - 2026-08-18

### 新增

- 新增：自绘对齐差异视图（AlignedDiffView）——替换 ListBox + 单元格 TextBox 旧路径；常驻 Caret、跨行字符选区（Text span）与行号槽块选（Block selection）；对齐空格行留在视图层不入文件，键入不触发 LCS 重算（保存/重载才重算对齐）
- 新增：独立 Diff 工具、主程序 Diff 页并排视图与合并编辑器统一采用对齐视图；统一/单栏布局为只读，编辑在并排（及合并 Result）窗格完成
- 新增：对齐视图自动折行（Word wrap）及 Screen↔View 坐标映射，Caret/选区跨折行段正确
- 新增：差异 Locator 条与底栏 line-diff 条——点击/拖动快速跳转，与垂直滚动同步
- 新增：Moved block 检测与 gutter ↕ 标记；双击跳转到对侧对应块并选中 staging Block
- 新增：独立 Patch 应用窗口——打开 `.patch`/`.diff` 预览 diff 并 apply 到工作区（含按文件 apply）
- 新增：Diff 编辑器行尾（EOL）标记开关与 Marked blocks（标记行 + Keep only marked，单步撤销）
- 新增：合并编辑器 Result 窗格打字与 Accept 冲突块共享一条撤销时间线——Ctrl+Z 先撤最后一次编辑，撤 Accept 同步恢复冲突列表与三栏着色

### 优化

- 优化：删除废弃的 `CodeEditorView` 控件与 `CodeEditorTests`；Diff/Merge 编辑器不再走文档级撤销 fallback
- 优化：Patch 文件打开对话框类型名本地化，并增加「所有文件」筛选（拖放仍限 `.patch`/`.diff`）
- 新增：MultiGitGuiDiff 编辑器双栏等宽与共享横向滚动——左右两栏严格各占视口一半，行号槽与中缝固定不动，超长行通过底部共享横向滚动条在两栏内同步滚动（列表横向滚动已移除）；中缝改为贯穿整高竖线，行复制箭头仍保留在固定中缝槽内
- 新增：MultiGitGuiDiff 支持纯文本查看器——`MultiGitGuiDiff <单文件>` 以只读查看器打开单个文件（行号/语法高亮/状态栏），文件页右键菜单可「在文本查看器中查看」
- 新增：MultiGitGuiDiff 编辑器工具栏窄窗口自适应——窗口宽度不足 860px 时自动隐藏按钮文字与分组标题并收紧间距（不影响用户显式的展开/收起选择）；收起态按钮收紧为方形图标目标，分组标题随收起一并隐藏；窗口顶栏改为自动换行布局，窄窗口不再溢出
- 新增：MultiGitGuiDiff 使用自定义应用图标（深色圆角方块 + 红绿双栏 + 底部白色 chevron），窗口标题栏/任务栏与 exe 图标同步替换默认图标
- 新增：MultiGitGuiDiff 编辑器工具栏展开时按「编辑 / 导航 / 块 / 空白字符 / 视图」分类显示，每组带小标题（收起后隐藏标题与按钮文字）；状态栏行尾（LF/CRLF）改为下拉切换，保存时按所选行尾整体重写
- 新增：MultiGitGuiDiff 顶栏新增主题按钮，可循环切换 浅色 / 深色 / 跟随系统
- 新增：MultiGitGuiDiff 编辑器补齐 TortoiseGitMerge 风格行操作——点击行号选择、拖拽/Shift 范围多选、Ctrl 多选，「使用左边/右边文件块」整块复制（单步撤销）、删除选中行、Ctrl+A 全选
- 新增：MultiGitGuiDiff 编辑器差异导航（上一处/下一处差异、滚动并选中整个差异块），工具栏按 编辑/导航/块/空白字符/视图 分组
- 新增：MultiGitGuiDiff 编辑器查找（Ctrl+F，F3/Shift+F3 前后跳转，n/m 计数）与跳到行（Ctrl+G）
- 新增：MultiGitGuiDiff 编辑器底部状态栏（光标列、当前行预览、编码、EOL、Tab 宽度、+N −M 统计）
- 新增：MultiGitGuiDiff 编辑器字符级差异高亮（修改行仅标出实际变化的词）、差异块分隔线、「忽略空白字符」开关
- 新增：MultiGitGuiDiff 编辑器重新加载、复制/粘贴选中行到剪贴板；仓库模式下「标记为已解决」（git add 该文件）
- 新增：MultiGitGuiDiff 编辑器内嵌差异导航（Ctrl+Alt+↑/↓）与仓库模式「视图栏」切换文件列表
- 新增：MultiGitGuiDiff 编辑器补齐 TortoiseGitMerge 剩余功能——词级高亮开关、「比较空白字符」、文本级块复制（使用左/右边文本块）、冲突导航（⚔，识别冲突标记）、折叠/展开差异块（▾，Ctrl+M）、帮助弹窗（?）、状态栏编码下拉（UTF-8/UTF-8 BOM/UTF-16 LE/BE/ASCII，保存按所选编码写回）、状态栏双行预览
- 新增：MultiGitGuiDiff 编辑器「内联视图（单栏）」切换——工具栏开关按钮，开启后修改行按「删除行在上、新增行在下」堆叠为统一 diff 单栏显示，可正常编辑、行选择、块复制、折叠与搜索（选中与统计按会话行去重，不因展开重复计数）
- 新增：MultiGitGuiDiff 编辑器工具栏收起/展开——箭头按钮或 Ctrl+T 切换：展开（默认）按钮显示图标+文字并自动换行成多行；收起后仅显示图标、单行紧凑，为对比区省出纵向空间
- 新增：MultiGitGuiDiff 合并模式关闭窗口时若有未保存修改，先弹出内联确认条（保存并关闭 / 放弃修改并退出 / 继续编辑），不再静默丢弃并以退出码 0 告知 git「已解决」
- 新增：MultiGitGuiDiff 编辑器查找替换（Ctrl+H 或查找栏）——「替换」作用于当前匹配行（可写两侧、忽略大小写、替换后自动跳到下一处匹配），「全部替换」一次撤销整批完成；只读侧（如仓库模式 HEAD）自动跳过
- 新增：MultiGitGuiDiff 编辑器「使用左边/右边文件」整文件级采用（对齐折叠为一致内容，单步撤销，只读目标侧自动禁用）与「另存为…」（右侧结果另存到所选路径）
- 新增：MultiGitGuiDiff 编辑器快捷键补齐——Ctrl+C 复制选中行、Ctrl+V 粘贴到选中行（单元格编辑中仍为原生行为）、F8/Shift+F8 跳转下一处/上一处差异；帮助弹窗同步列出
- 新增：MultiGitGuiDiff 文件对比窗口与仓库模式窗口的顶栏支持收起/展开（左侧箭头按钮）；仓库模式收起后仍显示分支徽章与文件汇总
- 新增：推送对话框可勾选「提升推送兼容性」，为本次计划中的每条 git push 加上 --no-thin
- 新增：总览展开后的未推送提交可双击或按 Enter 跳到历史页，自动选中该提交并打开详情

### 优化

- 优化：并排 Diff 与 MultiGitGuiDiff 双栏编辑器明确左右语义——左侧标注「原始」、右侧标注「现在」，与 TortoiseGit 双文件对比一致；主程序并排 Diff 顶部增加两栏标题
- 优化：MultiGitGuiDiff 双栏改为完整窗格布局——左右两栏从标题条到底部始终有整列窗格底色（空侧不再透明）、行间无缝、中间贯穿竖直分隔线、复制箭头叠加在分隔线上、行高统一；左右各加与窗格同宽的标题条；状态栏显示左侧文件实际编码与行尾（如 UTF-8 · LF）
- 修复：MultiGitGuiDiff 双栏在横向滚动容器中右栏被推出可视区（左栏改为按内容宽度、右栏填充剩余宽度），并保留完整窗格底色与竖直分隔线
- 修复：MultiGitGuiDiff 文本查看器窗口启动时因 ThemeHost 控件字段未初始化而崩溃（改用 Avalonia 编译生成的 InitializeComponent）
- 优化：清理 MultiGitGuiDiff/主程序零引用的死图标（MggIconArrowUpward/Downward），Undo 图标改为 Reset 的别名；窗口顶栏图标资源改为 TryFindResource 安全解析，键缺失不再崩溃；窗口条带收起快捷键 Ctrl+T 在文件对比/仓库模式窗口级同样生效（与工具提示一致）
- 优化：MultiGitGuiDiff 修复——行间复制箭头的启用状态此前检查源侧而非目标侧（仓库模式下最有用的「→ 拷到工作区」被禁用、会写只读 HEAD 的「←」反而可用）；单行复制、右键菜单插入/删除此前绕过「启用编辑」开关与只读侧限制；Ctrl+Z 撤销已保存的修改后脏标记不恢复（界面显示与磁盘不一致却不能保存）。以上均按 TortoiseGitMerge 语义修正并附回归测试
- 优化：MultiGitGuiDiff 编辑器工具栏焕新——统一 Material 图标、按 编辑/导航/块/视图开关 分组，按钮默认带文字标签（可随工具栏收起为纯图标），查找栏同步美化
- 优化：MultiGitGuiDiff 编辑器选中行数与保存/提示状态并入底部状态栏右侧，工具栏不再拥挤；两侧文件标题改为徽章样式并带「只读」标记
- 优化：MultiGitGuiDiff 文件对比窗口顶栏焕新——「浏览/编辑」改为分段式切换，「安装为 git 工具 / 系统菜单集成」归入同一操作条；仓库模式顶栏改为分支徽章 + 汇总 + 分段切换 + 刷新图标按钮，合并模式取消按钮所在条带统一视觉
- 优化：历史页提交详情的说明、文件列表、Diff 可拖动调整高度（最小约一行），并记住上次大小
- 优化：改动页文件右键菜单新增「还原」（未暂存/未跟踪文件；勾选优先于当前行，确认框与工具栏一致）；工具栏「丢弃」同步改为「还原」
- 优化：改动标签页名称由「改动 / Changes」改为「提交 / Commit」
- 优化：发布/打包脚本检测到仓库内正在运行的开发实例时立即报错并提示关闭，不再以晦涩的文件占用错误（MSB3027）失败

### 新增

- 新增：Diff 页语法高亮（常见语言按扩展名/内容识别），词级高亮优先、搜索高亮置顶
- 新增：Diff 页文件头显示 +N/−M 统计，顶部汇总「N 个文件变更，+X −Y」
- 新增：Diff 导航——Ctrl+Alt+↑/↓ 跳转上一个/下一个 hunk，Ctrl+Alt+←/→ 跳转上一个/下一个文件，Ctrl+F 在差异内搜索（含高亮与计数），大差异可「显示更多行」增量加载
- 新增：并排视图支持多选行级暂存/还原，变更块按内容对齐，滚动时顶部悬浮当前 hunk 标题
- 新增：冲突文件可从「提交」页打开「合并编辑器」（我方/基线/对方三窗 + 可编辑结果），支持按冲突采用我方/对方/两边都保留、Ctrl+S 保存、保存后自动标记已解决
- 新增：独立 Diff/合并工具 MultiGitGuiDiff.exe——比较任意两个文件，或 --merge 三路合并；窗口内一键安装为 git difftool/mergetool；随发布脚本一同产出
- 新增：Diff 页「仅看变更」视图、连续上下文折叠（点击展开）、复制整个差异为补丁、后退/前进浏览历史（Alt+←/→）、位置书签（Ctrl+Shift+1..9 标记 / Ctrl+Alt+1..9 跳转）、状态栏行数/文件/统计
- 新增：MultiGitGuiDiff 支持 --repo 打开仓库未提交改动视图；可安装/移除 Windows 系统菜单集成（「发送到」对比两个文件、仓库文件夹右键查看改动），支持 --install-shell / --uninstall-shell
- 新增：主程序可唤起 MultiGitGuiDiff——提交页右键/双击文件「在 MultiGitGuiDiff 中打开」（工作区 vs HEAD），历史详情文件右键「在 MultiGitGuiDiff 中比较」（提交 vs 父提交），文件页右键「在 MultiGitGuiDiff 中打开」（HEAD vs 工作区）
- 新增：独立 Diff 工具测试抽为 MultiGitGui.DiffTool.Tests 单独项目；build/run-tests.ps1 按 git 改动自动只跑受影响的测试项目（-Scope diff/app/core/all 手动指定），避免无关模块的无效测试时长
- 新增：独立 Diff 工具的文件对比（MultiGitGuiDiff <left> <right> 与 --repo）改为可编辑双栏编辑器——左右两侧都能点击直接输入（Enter 换行、Shift+Enter 提交、Tab 下移、Escape 取消、空行 Backspace/Delete 删除行），中间复制箭头一键把行复制到另一侧，Ctrl+Z/Y 撤销重做，Ctrl+S 保存回文件（保留 BOM 与换行风格）；工具栏可显示空白字符（空格圆点、制表符箭头）与自动换行；--repo 模式左侧为 HEAD 只读、右侧为工作区，保存即写回工作区并刷新浏览视图；「浏览/编辑」可随时切回经典统一/并排 Diff（搜索、hunk 跳转、书签）
- 修复：Diff 与合并编辑器的行文本被渲染两遍（Avalonia 12 下 InlineCollection 会把 TextBlock 的 Text 提前转成一个 Run，与分段高亮 Run 叠加），修复后所有差异视图文字恢复正常
- 修复：独立 Diff 工具启动时 git 子进程不再闪出控制台窗口（CreateNoWindow），只出现一个工具窗口

### 优化

- 优化：Diff 与编辑器代码抽入共享 MultiGitGui.Ui 库，主程序与独立工具渲染一致
- 优化：历史页提交详情的说明、文件列表、Diff 可拖动调整高度（最小约一行），并记住上次大小
- 优化：改动页文件右键菜单新增「还原」（未暂存/未跟踪文件；勾选优先于当前行，确认框与工具栏一致）；工具栏「丢弃」同步改为「还原」
- 优化：改动标签页名称由「改动 / Changes」改为「提交 / Commit」
- 优化：发布/打包脚本检测到仓库内正在运行的开发实例时立即报错并提示关闭，不再以晦涩的文件占用错误（MSB3027）失败

### 修复

- 修复：历史页文件右键「在 MultiGitGuiDiff 中比较」此前点击无反应——提交详情未携带仓库路径导致命令静默返回，现已修复并补集成测试

## 1.9.54 - 2026-08-14

### 修复

- 修复：添加存储库对话框勾选或取消「继续扫描存储库内部」等扫描选项后，立即按新选项重新扫描
## 1.9.40 (2026-08-13)

# MultiGitGui 更新日志

## 1.9.40 - 2026-08-13

### 优化

- 优化：列表中内容为空的条目不再弹出空白悬浮提示

## 1.9.39 - 2026-08-13

### 修复

- 修复：后台抓取被挂起后立即恢复时，旧抓取线程可能携带已取消的令牌重新处理重排任务，导致该仓库永远收不到完成状态（打包门禁超时）

## 1.9.37 - 2026-08-13

### 新增

- 新增：历史页「在此创建分支」可勾选「切换到新分支」（默认勾选）

## 1.9.35 - 2026-08-13

### 修复

- 修复：切换对话框中点击「选择现有分支」的候选后，分支名写回输入框并关闭浮层

## 1.9.23 - 2026-08-13

### 优化

- 优化：作用域工具栏增加「更多」菜单，将交互式变基、贮藏、弹出、清理收入其中；主条在变基与重置之间分组，重置与一键清理同组

## 1.9.10 - 2026-08-12

### 优化

- 优化：toast 恢复两行布局——「正在处理」小字回到标题下方独立一行，与计数徽章同行；卡片固定高度由 100 加高到 124，两行内容完整显示、不再溢出卡片（1.9.9 曾改为跟在标题后同行显示，已撤回）

## 1.9.9 - 2026-08-12

### 优化

- 优化：刷新进行中，当前仓库名小字（"正在处理：xxx"）改为跟在卡片标题后同一行显示，标题不再被挤占

## 1.9.8 - 2026-08-12

### 修复

- 修复：批量操作汇总表的悬浮提示改为纯文本绑定——此前元素型 tooltip 在共享弹层复用时可能触发界面崩溃
- 修复：刷新进行中的卡片显示当前正在获取的仓库名（"正在处理：xxx"），卡住时一眼可定位是哪个仓库
- 修复：崩溃转储日志改为写入数据目录的 logs 下（此前未指定目录，散落在临时目录）

## 1.9.7 - 2026-08-12

### 修复

- 修复：后台获取排空循环意外退出时，尚未完成的仓库统一标记为失败并记录仓库名——不再有仓库永久停留在「获取中」且无终态
- 修复：进度卡片超过获取超时后按当前计数自动收尾，并把始终未上报结果的仓库路径写入操作日志，便于后续排查

## 1.9.6 - 2026-08-12

### 修复

- 修复：OpenSSH 主机密钥变更横幅（@@@@@@@ ASCII 边框）不再作为错误首行原样显示——错误列表只展示解包后的真正内容行
- 修复：批量操作失败行的悬浮提示显示完整脱敏 stderr（最长 16000 字符、自动换行），而非只有第一行

## 1.9.5 - 2026-08-12

### 修复

- 修复：自动刷新在本地读取或获取进行中时跳过本次周期——不再每 30 秒取消一次正在进行的慢速批量获取

## 1.9.4 - 2026-08-12

### 修复

- 修复：进度卡片增加超时保险丝——获取超过后台超时时间（默认 120 秒）+ 60 秒余量后按当前计数结束，进度条不再卡在 98% 永不收尾

## 1.9.3 - 2026-08-12

### 修复

- 修复：后台获取中被取消的仓库在排空循环空闲时自动重新入队继续获取——不再需要下一次前台刷新触发，每个仓库必然到达终态

## 1.9.2 - 2026-08-12

### 修复

- 修复：URL 凭据含 `@` 字符（如 `https://user:p@ss@host`）时脱敏失效，错误文本可能残留 `@` 串——现在能正确掩去密码部分，且不会误伤路径中的 `@`

## 1.9.1 - 2026-08-12

### 修复

- 修复：本地读取失败 + 网络同步瞬间完成时，刷新结果卡片可能误判为全部成功——合并计数在同步完成时即快照，而本地读取的失败信号仍在上报队列中；现在每次轮询实时重算合并计数，结果帧的徽章与颜色始终与最终逐仓库结果一致（ADR-0012）
- 修复：打包（Release 全量测试）在高负载下偶发超时——后台同步恢复测试的启动等待放宽到 20 秒，不再被并行测试抢占拖垮

## 1.9.0 - 2026-08-12

### 新增

- 新增：批量操作按仓库捕获命令实录——每个仓库执行的每条 git 命令（命令行、退出码、耗时与脱敏后的输出）在执行时记录，成功或失败均可核对实际运行了什么；后台读取命令也计入，且不受「记录命令输出」设置与操作日志保留策略影响（ADR-0020）
- 新增：操作汇总对话框改为主从布局——上方为逐仓库结果表（成功仓库也列出），下方显示选中仓库的命令实录，首个失败命令默认展开；支持复制所选命令、整份实录或汇总表
- 新增：「最近一次操作」——最近一次操作的汇总与各仓库命令实录在结果卡片消失后仍可从「视图」菜单或命令面板打开；意外失败的操作同样留有实录
- 新增：失败或需人工处理的结果卡片常驻，手动关闭后才消失；全部成功或全部跳过的卡片仍 4 秒自动消失
- 新增：刷新失败卡片常驻，点击直接在输出面板打开并勾选「仅显示问题」
- 新增：总览页状态列改为「活动」列——批量操作期间显示实时状态（等待中/预检中/进行中）与 Git 中断标记，操作结束后自动清空，不再残留成功/失败结果（ADR-0019）

### 修复

- 修复：结果卡片此前只有空白区可点——标题、「点击查看详情」提示与计数徽章处点击均无效，内容层拦截了指针事件；现在整卡都是打开操作汇总的命中目标（ADR-0007 修订）

### 说明

- 说明：操作结果只存在于操作汇总与「最近一次操作」，不再作为仓库行的常驻状态展示；Result frame、Operation summary、Operation outcome、Repository run、Command transcript、Last operation record 术语已补入术语表

## 1.8.1 - 2026-08-12

### 优化

- 优化：输出面板（终端）默认高度从 200 提高到 300——首次打开即可看到完整内容（默认 1280x800 窗口下约 12-15 行），已保存过布局的用户不受影响
- 优化：总览页「领先」列加宽（70→80）——8 位短哈希在常见等宽字体下不再截断（70px 时恰好贴边，字体回退下会溢出）

## 1.8.0 - 2026-08-12

### 新增

- 新增：内容区最大化按钮补全到全部内容页工具栏——概述、引用、文件页此前只有 F11 快捷键，没有可见入口；现在七个内容页工具栏右侧都有统一的全窗口角标按钮（悬浮提示随状态切换并注明 F11），一处控件全页复用（ADR-0014）
- 新增：切换对话框的分支候选选择器改为「选择现有分支」按钮触发——不再因聚焦或点击输入框而自动弹出，按钮与「获取后刷新」并列，减少误触；候选弹层换用全局统一的毛玻璃表面，开启视觉效果时不再透出桌面壁纸
- 新增：引用、文件、追溯标签只在选中单个仓库时显示——选中项目节点、多个仓库或未选择时自动隐藏，避免合并范围下展示语义不明的数据；显示时绑定所选仓库本身（Primary repository，ADR-0017）

### 修复

- 修复：切换对话框的分支候选弹层关闭后无法再次打开——弹层 IsOpen 改为双向绑定，按钮重开恢复正常
- 修复：历史详情面板在内容区最大化下会把临时星号宽度写回记住的宽度——进入最大化先持久化当前宽度，退出还原后不再回跳（ADR-0014）
- 修复：长提交说明不再挤压差异视图——历史详情元数据区限高（正文 30%，130-320px）内部滚动，文件列表改为让步式 1\*/2\* 布局，最大化时清除最小高度

### 说明

- 说明：精简无头视觉冒烟测试——移除控件外观、弹层毛玻璃、toast 视觉、滚动条主题 4 个测试文件共 21 个用例，ShellSmokeTests 同步精简 11 个视觉/外观用例（36→25），保留启动/对话框/布局行为；无头渲染不出像素，外观回归交给真实 UI 检查（ADR-0018）

## 1.7.24 - 2026-08-11

### 新增

- 新增：批量「切换」对话框的分支输入框旁出现候选列表——按覆盖数展示所选库中的分支并集（含本地 / 仅远端拆分），打字即过滤，从列表选中即重新计算计划；输入 `origin/feature/x` 形式的名称可全局指定远端（ADR-0016）
- 新增：切换对话框内可直接「获取后刷新」——无需关闭对话框即可发现服务器上新推送的分支并切换为跟踪分支，进度显示在对话框活动条，部分失败可点开摘要

### 修复

- 修复：切换对话框手输分支名后「切换」按钮不再变灰——未加载预览也可确认，由确认后的实时校验兜底
- 修复：修改分支名后不再误弹「计划已变更」——陈旧基线已随预览一同清除

### 说明

- 说明：切换对话框标签由「分支或版本」改为「分支」；tag / commit 不支持批量切换

## 1.7.14 - 2026-08-11

### 新增

- 新增：侧栏按路径展示嵌套存储库——同一项目内路径包含的仓库以 Containing / Nested 树形展示，任意深度；包含子孙的仓库节点支持折叠，`IsExpanded` 状态持久化（ADR-0015）
- 新增：选中含子孙的仓库节点时，操作范围（刷新 / 批量操作 / 移除）自动包含全部嵌套子孙，与展开/收起无关；移除 Containing 仓库会连同整棵嵌套子树一并从项目移除

### 优化

- 优化：扫描开启「继续扫描存储库内部」时，若受深度上限或忽略目录名（vendor、node_modules 等）影响，结果中明确提示嵌套存储库可能未被发现

### 说明

- 说明：`DescendIntoRepositories` 默认仍为关闭，本版本未改动该默认值

## 1.7.0 - 2026-08-11

### 新增

- 新增：改动、历史、追溯、搜索页支持内容区最大化（工具栏按钮 / F11）——隐藏侧边栏、作用域工具栏、标签栏、输出面板与页内同级面板，让代码区占满窗口；Esc 或再次 F11 还原；切换标签自动退出；最大化为临时状态，不改变已保存的布局偏好

## 1.6.0 - 2026-08-08

### 新增

- 新增：批量添加仓库后显示网络同步（fetch）进度 toast——本地状态读取完成的结果卡片出现后，紧接着显示"正在同步仓库（N 个）…"进度条逐仓库推进，全部同步完成后原地变为结果卡片，存在失败仓库时提示失败数量
- 新增：手动刷新（刷新全部、单个仓库或项目）改为单张进度 toast 贯穿全程——本地状态读取按仓库推进 x/y 进度，随后同一张卡片切换为"正在同步仓库（N 个）…"并重新计数，全部仓库同步结束才显示结果帧（有失败为红色问题帧、全部跳过为琥珀帧），不再在同步中途闪现完成卡片
- 新增：刷新与同步的结果 toast 只在所有仓库的转圈动画都停止后出现——结果卡片不会再盖在仍在转圈的项目树上方；成功/失败/跳过计数统一由卡片上的徽章承载，标题保持简短；本地读取失败与网络同步失败按仓库合并计数，徽章与结果帧颜色始终一致；进度条与"转圈彻底停止的仓库个数"挂钩——有仓库还在转圈时进度条不会提前到 100%，100% 即表示全部仓库的转圈都已停止
- 新增：仓库行转圈指示覆盖本地读取与网络同步全过程，每个仓库的网络同步完成即停自己的转圈，先完成的仓库先停止
- 新增：批量添加仓库的刷新进度并入同一张卡片——"正在添加仓库（N 个）…"的本地读取进度结束后，同一张卡片切换为"正在同步仓库（N 个）…"，全部仓库同步完成且工作区安静后才显示结果帧，不再先弹出一张独立的"已添加 N 个仓库"完成卡片
- 新增：变基窗口打开不再后台加载——打开瞬间显示共享缓存中的仓库状态预览，尚未解析的行标记为"待读取"，所有加载都发生在确定变基之后的进度 toast 阶段；窗口内的 Refresh 按钮是唯一的对话框内加载入口，点击才逐仓库读取最新状态
- 新增：变基确认后的进度 toast 按"每仓 2 步"推进——先逐仓实时校验（每仓完成 +1），再逐仓变基执行（每仓终态再 +1），总进度为所选仓库数 × 2；被实时校验拦下的仓库以"跳过"补齐自己的执行步，中途拒绝计划变化或全部被阻塞时进度条也能走到终点，不会停在半格

### 优化

- 优化：批量添加数十到数百个仓库时界面不再冻结——状态快照合并为 50ms 批量应用、Changes 页每批只重建一次、未推送提交查询限制并发并改为后台解析，git 输出解析不再占用 UI 线程
- 优化：行级刷新指示的更新从全树扫描 O(N²) 降为 O(N)，仓库众多时不再拖慢界面
- 优化：未刷新过预览就直接确认变基时，不再弹出"计划已更新"确认框——从未解析的预览没有已确认的事实，确定变基后直接在进度 toast 中实时解析并执行；手动刷新过的预览仍按需提示计划变化
- 优化：未推送提交详情刷新改为并行执行（并发上限 4），大型工作区不再串行等待每个仓库的 git 查询
- 优化：进度 toast 无取消回调时隐藏取消按钮；批量添加进度按仓库路径去重
- 优化：警告/错误结果 toast 从"常驻等待手动关闭"改为自动消失（鼠标悬停暂停倒计时），与成功 toast 统一 4 秒

### 修复

- 修复：批量添加仓库时转圈动画不再整批一起停止，也不再出现"停了又转"的闪烁——本地读取完成后行灯保持到网络同步接手，网络同步逐仓库完成后各自停止
- 修复：批量添加存在失败仓库时进度 toast 显示红色问题帧并提示失败数量
- 修复：无新提交的仓库推送时不再"推送后失败"——Gerrit（Review）模式下 Ahead==0 的仓库同样判定为"已是最新"并跳过，显示琥珀色跳过汇总而非红色失败
- 修复：批量添加后的网络同步进度 toast 每个仓库只计数一次，重复完成事件不再导致提前结束或结果帧被覆盖；仓库移除后重新添加不再误读上一次同步的旧结果
- 修复：同步批次整体失败或被取消时，仓库行的转圈动画不再卡在转圈状态——失败的进度事件先于滞留的"进行中"事件到达界面，转圈必然随结果帧一同停止
- 修复：仓库在刷新/同步期间被移除时，"刷新全部"按钮的转圈指示不再卡在转圈状态

### 重构与稳定性

- 重构：刷新与导入两条流程的结果 toast 契约收敛为共享实现——"批次终态齐 + 全局转圈停止"的完成判定（Quiescence）、进度条与转圈状态挂钩、计数徽章化与红/琥珀/绿结果帧渲染由同一套代码承担，两条流程不会再各自漂移
- 重构：导入与手动刷新共用同一个 RefreshSession 反馈会话——导入的两张进度卡收敛为与手动刷新相同的单卡两阶段（添加→同步），静默判定、合并计数与结果帧渲染不再分属两套实现
- 重构：网络同步状态到仓库行转圈指示的桥接移入刷新协调器（实现 IRepositoryActivity），主窗口不再转发 fetch 事件；UI 线程调度统一走 IUiDispatcher / UiThread.Post，删除两处重复的 OnUiThread

## 1.5.8 - 2026-08-08

### 新增

- 新增：添加仓库后的状态刷新显示进度 toast——按仓库显示"x/y"进度条，刷新完成后原地变为结果卡片，存在失败仓库时提示失败数量

### 优化

- 优化：仓库状态刷新（启动/手动/自动/添加后）全部在后台线程执行，git 进程启动与输出解析不再占用 UI 线程，仓库众多或工作区庞大时界面不再卡住
- 优化：文件删除与重命名改为后台执行并显示进度提示，递归删除大目录（如 node_modules）不再冻结界面
- 优化：安装 Gerrit commit-msg 钩子时的 chmod 等待不再阻塞 UI 线程（macOS/Linux）

## 1.5.3 - 2026-08-08

### 新增

- 新增：Git 弹窗即时响应——Fetch/Pull/Push/Checkout/Merge/Rebase/交互式 Rebase/储藏选择器/Clean/Sparse/Fixup/Init 全部改为"先显示、后加载"，任何 Git I/O 不再阻塞弹窗首帧
- 新增：共享元数据快照缓存（remotes/branches/stashes/sparse/最近提交/init.defaultBranch），跨页面复用、写操作后统一失效，重复访问不再启动重复 Git 进程
- 新增：弹窗非阻塞活动条——已知仓库总数显示"完成数/总数"确定进度，单条命令显示不确定进度；刷新期间表单保持可编辑、主操作保持可用
- 新增：执行前材料变化确认——Push/Checkout/Merge/Rebase/储藏/清理在点击主操作时取消后台预览并实时重校验，仅当 HEAD/分支/远程/目标引用/储藏条目/清理清单等实质事实变化时弹出只读差异确认
- 新增：确认后防漂移保护——每个仓库在执行前于调度器租约内复核已确认的 identity，确认后发生漂移的仓库安全跳过并在汇总中标记，绝不执行旧目标
- 新增：Push 弹窗重做——remote 候选为全部目标仓库并集、Specific Branch 惰性加载全量分支并集且始终可手输、编辑 Gerrit/参数仅做快照内纯重建（零 Git 进程）、显式刷新才强制实时读取、关闭后不再二次构建计划
- 新增：Push 预览改为可编辑的按仓库计划表——每行可直接修改推送分支、topic、评论与额外推送选项，单元格提交即按行重建参数，取消编辑恢复提交前状态；左侧表单变更仍批量覆盖所有行，推送时按行状态叠加左侧其余评审选项生成最终计划
- 新增：评审标签建议列表——内置 Gerrit 标准投票集（Code-Review/Verified/Workflow）与历史标签的并集，从下拉选择即追加到文本（重复自动跳过）、仍可手输；补丁集说明字段更名为 Comment（评论）

### 优化

- 优化：弹窗后台刷新失败不再污染全局状态快照，保留最后一次成功值并标记陈旧，下次读取自动重试
- 优化：储藏应用/弹出按条目 commit id 匹配，堆栈被重排时跳过而非误应用其他条目

### 重构与稳定性

- 重构：新增 `AsyncGitDialogViewModelBase` 统一弹窗生命周期、预览/最终校验取消令牌、输入版本与活动条状态
- 重构：`BatchOperationRunner` 支持执行前 identity 复核；Push 执行冻结的确认计划
- 重构：Core 新增 typed `OperationPlan`/`PreparedOperation`/`MaterialIdentity` 与 ordinary/material/blocking 差异模型，各操作保留强类型 planner
- 新增 ADR-0010 记录弹窗即时响应与安全提速设计

## 1.5.0 - 2026-08-07

### 修复

- 修复：侧边栏树重建（添加/删除/重排/重命名/扫描导入/克隆入库/拖放）后选中高亮丢失，重建后自动恢复原选中节点
- 修复：删除或添加仓库后，状态栏的仓库计数立即刷新，不再停留在旧值
- 修复：删除仓库条目后立即从树中移除，不再等待后台资源清理完成
- 修复：取消中的后台操作不再被遗留子进程拖住，操作返回时间有界
- 修复：仓库调度器的孤儿门竞态——仓库被移除时正在排队的工作不再与新建门并行执行
- 修复：未观察的任务异常改为上报崩溃报告器，不再被静默丢弃
- 修复：注册表卸载信息的打开键正确释放，不再泄漏

### 优化

- 优化：删除仓库时同步清理其调度器门、状态快照与身份映射，长时间会话不再累积无用资源
- 优化：diff 差异表改用交错数组，大文件差异渲染更快
- 优化：对话框模板按类型拆分到独立资源文件，加载更轻、维护更清晰
- 优化：侧边栏宽度/底部面板高度同步时不再重复写入相同的布局值
- 优化：自动刷新计时器保留 5 秒下限，与状态栏显示保持一致

### 重构与稳定性

- 重构：主窗口视图模型拆分为职责单一的组件（侧边栏、操作控制器、刷新协调器、窗口布局、对话框工厂），界面行为保持不变
- 重构：Git 查询/命令服务、仓库操作服务与多个视图模型按领域拆分到独立文件
- 重构：设置对象的深拷贝方法改为源生成器自动生成，新增设置项自动同步
- 重构：对话框模板（31 个）完整迁移到独立文件，渲染结果与之前完全一致
- 重构：测试基础设施整合为共享库，git 测试沙箱隔离 HOME 与全局配置，消除环境依赖
- 重构：计时类测试改为确定性时钟与采样窗口断言，测试更稳定、更严格
- 修复：取消命令的进程树测试断言修正，真正验证取消后命令不被遗留进程拖死

### 其他

- 版本：1.4.x → 1.5.0
- 构建：每次提交自动递增补丁版本号的机制保持不变

## 1.4.5 - 2026-08-06

- 优化：可编辑下拉框的预览查询加入防抖，停止输入 500ms 后才发起查询（push 目标、checkout、rebase、merge 等对话框及搜索/引用面板）
- 修复：取消或超时的后台读取不再被当作故障状态发布，取消预览或切换仓库不会清空、污染已加载数据
- 修复：切换仓库时 Refs 面板正确重置加载状态，迟到的旧加载结果不再覆盖新仓库内容

## 1.4.4 - 2026-08-06

- 优化：标题栏最小化/最大化/关闭按钮整体左移 4px
- 优化：移除状态栏更新文案的tooltip
- 优化：设置页固定高度，切换标签页不再改变对话框大小，内容超出时在页内滚动
- 优化：对话框毛玻璃色调调整为蓝色系

## 1.4.0 - 2026-08-06

- 功能：检测到新版本后后台自动下载安装包，下载完成后才弹出更新提醒；点击“立即更新”时若已下载完成则直接安装，否则接续下载进度后安装
- 修复：更新对话框打开期间（如正在下载安装包），后台自动检查不再弹出第二个更新窗口，全局仅保留一个检查更新弹窗

## 1.3.22 - 2026-08-06

- 功能：在帮助菜单新增意见反馈入口，支持提交昵称、联系方式、系统信息与反馈内容

## 1.3.20 - 2026-08-06

- 功能：新增应用内更新检查、更新日志展示与状态栏更新链接
- 功能：Windows 安装包支持断点续传、SHA-256 校验及 `--update` 自动安装模式

## 1.3.15 - 2026-08-05

- 功能：操作进度与结果统一为可交互的 toast 卡片
- 修复：push 预览的参数列按内容自适应宽度，并支持横向滚动
- 修复：可编辑 ComboBox 的输入文本与下拉玻璃面板对齐
- 修复：托盘图标圆角保持在画布内
- 优化：侧边栏树重建后保持各节点展开状态
- 优化：toast 卡片内边距收紧

## 1.3.6 - 2026-08-05

- 功能：对话框与弹出层加入毛玻璃（frosted glass）拟态
- 功能：Changes 面板紧凑化，滚轮可跨网格边缘连续滚动
- 功能：扫描结果导入时可选目标项目
- 修复：弹出层阴影不再被裁剪，托盘菜单增加回退方案
- 修复：过滤 Windows IME 组合输入产生的重复文本
- 性能：背景毛玻璃自适应降采样优化

## 1.2.5 - 2026-08-04

- 功能：新增"一键清理"工具栏动作
- 功能：侧边栏"添加仓库 / 扫描文件夹"改用独立图标
- 功能：加入双语隐私政策并随所有发布产物分发；
- 修复：单实例激活在慢启动监听下更健壮
- 修复：对话框复选框与默认按钮恢复悬停反馈
- 修复：本地读取与拉取期间刷新指示器保持旋转
- 修复：对话框反馈、键盘访问与批量成功提示加固
- 其他：toast 的时钟与调度器可注入，便于自动化测试

## 1.1.5 - 2026-08-03

- 功能：文件浏览器支持以系统默认应用打开所选文件
- 功能：侧边栏支持拖拽排序项目与仓库
- 功能：Changes 分割窗格可填满窗口并在缩放后保持
- 修复：Overview 首次状态刷新覆盖全部仓库
- 修复：忽略表头双击，避免排序意外缩小范围

## 1.1.0 - 2026-08-03

整合自 0.1.0 起步、历经 1.0.x 版本的完整功能集：

- 核心：基于 Avalonia 的多仓库 Git 图形界面；自绘窗口框架与壁纸玻璃拟态；连续圆角界面元素与统一主题令牌；Material 风格共享图标集；窗口初始适配屏幕工作区
## 1.5.0 (2026-08-07)

# MultiGitGui 更新日志

## 1.5.0 - 2026-08-07

### 修复

- 修复：侧边栏树重建（添加/删除/重排/重命名/扫描导入/克隆入库/拖放）后选中高亮丢失，重建后自动恢复原选中节点
- 修复：删除或添加仓库后，状态栏的仓库计数立即刷新，不再停留在旧值
- 修复：删除仓库条目后立即从树中移除，不再等待后台资源清理完成
- 修复：取消中的后台操作不再被遗留子进程拖住，操作返回时间有界
- 修复：仓库调度器的孤儿门竞态——仓库被移除时正在排队的工作不再与新建门并行执行
- 修复：未观察的任务异常改为上报崩溃报告器，不再被静默丢弃
- 修复：注册表卸载信息的打开键正确释放，不再泄漏

### 优化

- 优化：删除仓库时同步清理其调度器门、状态快照与身份映射，长时间会话不再累积无用资源
- 优化：diff 差异表改用交错数组，大文件差异渲染更快
- 优化：对话框模板按类型拆分到独立资源文件，加载更轻、维护更清晰
- 优化：侧边栏宽度/底部面板高度同步时不再重复写入相同的布局值
- 优化：自动刷新计时器保留 5 秒下限，与状态栏显示保持一致

### 重构与稳定性

- 重构：主窗口视图模型拆分为职责单一的组件（侧边栏、操作控制器、刷新协调器、窗口布局、对话框工厂），界面行为保持不变
- 重构：Git 查询/命令服务、仓库操作服务与多个视图模型按领域拆分到独立文件
- 重构：设置对象的深拷贝方法改为源生成器自动生成，新增设置项自动同步
- 重构：对话框模板（31 个）完整迁移到独立文件，渲染结果与之前完全一致
- 重构：测试基础设施整合为共享库，git 测试沙箱隔离 HOME 与全局配置，消除环境依赖
- 重构：计时类测试改为确定性时钟与采样窗口断言，测试更稳定、更严格
- 修复：取消命令的进程树测试断言修正，真正验证取消后命令不被遗留进程拖死

### 其他

- 版本：1.4.x → 1.5.0
- 构建：每次提交自动递增补丁版本号的机制保持不变

## 1.4.5 - 2026-08-06

- 优化：可编辑下拉框的预览查询加入防抖，停止输入 500ms 后才发起查询（push 目标、checkout、rebase、merge 等对话框及搜索/引用面板）
- 修复：取消或超时的后台读取不再被当作故障状态发布，取消预览或切换仓库不会清空、污染已加载数据
- 修复：切换仓库时 Refs 面板正确重置加载状态，迟到的旧加载结果不再覆盖新仓库内容

## 1.4.4 - 2026-08-06

- 优化：标题栏最小化/最大化/关闭按钮整体左移 4px
- 优化：移除状态栏更新文案的tooltip
- 优化：设置页固定高度，切换标签页不再改变对话框大小，内容超出时在页内滚动
- 优化：对话框毛玻璃色调调整为蓝色系

## 1.4.0 - 2026-08-06

- 功能：检测到新版本后后台自动下载安装包，下载完成后才弹出更新提醒；点击“立即更新”时若已下载完成则直接安装，否则接续下载进度后安装
- 修复：更新对话框打开期间（如正在下载安装包），后台自动检查不再弹出第二个更新窗口，全局仅保留一个检查更新弹窗

## 1.3.22 - 2026-08-06

- 功能：在帮助菜单新增意见反馈入口，支持提交昵称、联系方式、系统信息与反馈内容

## 1.3.20 - 2026-08-06

- 功能：新增应用内更新检查、更新日志展示与状态栏更新链接
- 功能：Windows 安装包支持断点续传、SHA-256 校验及 `--update` 自动安装模式

## 1.3.15 - 2026-08-05

- 功能：操作进度与结果统一为可交互的 toast 卡片
- 修复：push 预览的参数列按内容自适应宽度，并支持横向滚动
- 修复：可编辑 ComboBox 的输入文本与下拉玻璃面板对齐
- 修复：托盘图标圆角保持在画布内
- 优化：侧边栏树重建后保持各节点展开状态
- 优化：toast 卡片内边距收紧

## 1.3.6 - 2026-08-05

- 功能：对话框与弹出层加入毛玻璃（frosted glass）拟态
- 功能：Changes 面板紧凑化，滚轮可跨网格边缘连续滚动
- 功能：扫描结果导入时可选目标项目
- 修复：弹出层阴影不再被裁剪，托盘菜单增加回退方案
- 修复：过滤 Windows IME 组合输入产生的重复文本
- 性能：背景毛玻璃自适应降采样优化

## 1.2.5 - 2026-08-04

- 功能：新增"一键清理"工具栏动作
- 功能：侧边栏"添加仓库 / 扫描文件夹"改用独立图标
- 功能：加入双语隐私政策并随所有发布产物分发；
- 修复：单实例激活在慢启动监听下更健壮
- 修复：对话框复选框与默认按钮恢复悬停反馈
- 修复：本地读取与拉取期间刷新指示器保持旋转
- 修复：对话框反馈、键盘访问与批量成功提示加固
- 其他：toast 的时钟与调度器可注入，便于自动化测试

## 1.1.5 - 2026-08-03

- 功能：文件浏览器支持以系统默认应用打开所选文件
- 功能：侧边栏支持拖拽排序项目与仓库
- 功能：Changes 分割窗格可填满窗口并在缩放后保持
- 修复：Overview 首次状态刷新覆盖全部仓库
- 修复：忽略表头双击，避免排序意外缩小范围

## 1.1.0 - 2026-08-03

整合自 0.1.0 起步、历经 1.0.x 版本的完整功能集：

- 核心：基于 Avalonia 的多仓库 Git 图形界面；自绘窗口框架与壁纸玻璃拟态；连续圆角界面元素与统一主题令牌；Material 风格共享图标集；窗口初始适配屏幕工作区
## 1.4.4 (2026-08-06)

# MultiGitGui 更新日志

## 1.4.4 - 2026-08-06

- 优化：标题栏最小化/最大化/关闭按钮整体左移 4px
- 优化：移除状态栏更新文案的tooltip
- 优化：设置页固定高度，切换标签页不再改变对话框大小，内容超出时在页内滚动
- 优化：对话框毛玻璃色调调整为蓝色系

## 1.4.0 - 2026-08-06

- 功能：检测到新版本后后台自动下载安装包，下载完成后才弹出更新提醒；点击“立即更新”时若已下载完成则直接安装，否则接续下载进度后安装
- 修复：更新对话框打开期间（如正在下载安装包），后台自动检查不再弹出第二个更新窗口，全局仅保留一个检查更新弹窗

## 1.3.22 - 2026-08-06

- 功能：在帮助菜单新增意见反馈入口，支持提交昵称、联系方式、系统信息与反馈内容

## 1.3.20 - 2026-08-06

- 功能：新增应用内更新检查、更新日志展示与状态栏更新链接
- 功能：Windows 安装包支持断点续传、SHA-256 校验及 `--update` 自动安装模式

## 1.3.15 - 2026-08-05

- 功能：操作进度与结果统一为可交互的 toast 卡片
- 修复：push 预览的参数列按内容自适应宽度，并支持横向滚动
- 修复：可编辑 ComboBox 的输入文本与下拉玻璃面板对齐
- 修复：托盘图标圆角保持在画布内
- 优化：侧边栏树重建后保持各节点展开状态
- 优化：toast 卡片内边距收紧

## 1.3.6 - 2026-08-05

- 功能：对话框与弹出层加入毛玻璃（frosted glass）拟态
- 功能：Changes 面板紧凑化，滚轮可跨网格边缘连续滚动
- 功能：扫描结果导入时可选目标项目
- 修复：弹出层阴影不再被裁剪，托盘菜单增加回退方案
- 修复：过滤 Windows IME 组合输入产生的重复文本
- 性能：背景毛玻璃自适应降采样优化

## 1.2.5 - 2026-08-04

- 功能：新增"一键清理"工具栏动作
- 功能：侧边栏"添加仓库 / 扫描文件夹"改用独立图标
- 功能：加入双语隐私政策并随所有发布产物分发；
- 修复：单实例激活在慢启动监听下更健壮
- 修复：对话框复选框与默认按钮恢复悬停反馈
- 修复：本地读取与拉取期间刷新指示器保持旋转
- 修复：对话框反馈、键盘访问与批量成功提示加固
- 其他：toast 的时钟与调度器可注入，便于自动化测试

## 1.1.5 - 2026-08-03

- 功能：文件浏览器支持以系统默认应用打开所选文件
- 功能：侧边栏支持拖拽排序项目与仓库
- 功能：Changes 分割窗格可填满窗口并在缩放后保持
- 修复：Overview 首次状态刷新覆盖全部仓库
- 修复：忽略表头双击，避免排序意外缩小范围

## 1.1.0 - 2026-08-03

整合自 0.1.0 起步、历经 1.0.x 版本的完整功能集：

- 核心：基于 Avalonia 的多仓库 Git 图形界面；自绘窗口框架与壁纸玻璃拟态；连续圆角界面元素与统一主题令牌；Material 风格共享图标集；窗口初始适配屏幕工作区
## 1.3.22 (2026-08-06)

# MultiGitGui 更新日志

## 1.3.22 - 2026-08-06

- 功能：在帮助菜单新增意见反馈入口，支持提交昵称、联系方式、系统信息与反馈内容
- 隐私：明确说明更新检查与用户主动提交反馈时的网络通信及服务端记录的 IP、时间

## 1.3.20 - 2026-08-06

- 功能：新增应用内更新检查、更新日志展示与状态栏更新链接
- 功能：Windows 安装包支持断点续传、SHA-256 校验及 `--update` 自动安装模式
- 优化：后台每 60 分钟检查一次更新，并支持按版本与“永不提醒”抑制自动弹窗

## 1.3.15 - 2026-08-05

- 功能：操作进度与结果统一为可交互的 toast 卡片
- 修复：push 预览的参数列按内容自适应宽度，并支持横向滚动
- 修复：可编辑 ComboBox 的输入文本与下拉玻璃面板对齐
- 修复：托盘图标圆角保持在画布内
- 优化：侧边栏树重建后保持各节点展开状态
- 优化：toast 卡片内边距收紧
- 其他：Setup 项目补充 PopupShadowSpace 转换器；发布流程按通配符定位安装器并支持 FTP 部署

## 1.3.6 - 2026-08-05

- 功能：对话框与弹出层加入毛玻璃（frosted glass）拟态
- 功能：Changes 面板紧凑化，滚轮可跨网格边缘连续滚动
- 功能：扫描结果导入时可选目标项目
- 修复：弹出层阴影不再被裁剪，托盘菜单增加回退方案
- 修复：过滤 Windows IME 组合输入产生的重复文本
- 性能：背景毛玻璃自适应降采样优化
- 其他：发布流程合并多平台产物并新增 FTP 部署

## 1.2.5 - 2026-08-04

- 功能：新增"一键清理"工具栏动作
- 功能：侧边栏"添加仓库 / 扫描文件夹"改用独立图标
- 功能：加入双语隐私政策并随所有发布产物分发；切换为专有许可证并附带第三方声明
- 修复：单实例激活在慢启动监听下更健壮
- 修复：对话框复选框与默认按钮恢复悬停反馈
- 修复：单元格 tooltip 覆盖完整区域，宽网格可横向滚动
- 修复：本地读取与拉取期间刷新指示器保持旋转
- 修复：对话框反馈、键盘访问与批量成功提示加固
- 性能：悬停反馈即时化，背景模糊在交互时冻结
- 其他：toast 的时钟与调度器可注入，便于自动化测试

## 1.1.5 - 2026-08-03

- 功能：文件浏览器支持以系统默认应用打开所选文件
- 功能：侧边栏支持拖拽排序项目与仓库
- 功能：Changes 分割窗格可填满窗口并在缩放后保持
- 修复：Overview 首次状态刷新覆盖全部仓库
- 修复：忽略表头双击，避免排序意外缩小范围

## 1.1.0 - 2026-08-03

整合自 0.1.0 起步、历经 1.0.x 版本的完整功能集：

- 核心：基于 Avalonia 的多仓库 Git 图形界面；自绘窗口框架与壁纸玻璃拟态；连续圆角界面元素与统一主题令牌；Material 风格共享图标集；窗口初始适配屏幕工作区
- 仓库与项目：侧边栏以"项目 / 仓库"两级组织（移除分组）；首次导入自动创建项目，含快速操作与空状态引导；单实例运行；系统托盘图标与重置默认设置；支持后台静默拉取与本地优先刷新
- Git 工作流：分作用域刷新（全部 / 项目 / 仓库）与加载遮罩；多仓库 Git 读取并行化与 CPU 自适应并行度；Overview 可展开未推送提交详情（作者、时间、短 ID）；Changes 文件类型图标；搜索、LFS、更丰富的历史 / Diff 界面；Gerrit review push（记住字段、更多选项、commit-msg 钩子安装）；push 默认直推、History 模式随侧边栏选择、rebase 上游默认 @{upstream}
- 效率与体验：可配置字体、文件标签页、应用内快速终端；可折叠 shell 面板（侧栏 / 输出面板）并持久化布局；默认深色主题；DataGrid 表头紧凑与可调整列宽
- 安装与向导：可跳过、可重跑的设置向导（数据目录与 Git）；玻璃 / 动画开关与性能提示；自定义 Windows 安装器并借 NativeAOT 精简体积；版本自动 bump 与发布元数据
- 稳定性：毛玻璃 overlay 稳定化（裁剪快照与加载冻结）；修复 Changes 滚动卡顿（DataGrid 分组常驻并升级 Avalonia 12.1.1）
## 1.3.20 (2026-08-05)

# MultiGitGui 更新日志

## 1.3.15 - 2026-08-05

- 功能：操作进度与结果统一为可交互的 toast 卡片
- 修复：push 预览的参数列按内容自适应宽度，并支持横向滚动
- 修复：可编辑 ComboBox 的输入文本与下拉玻璃面板对齐
- 修复：托盘图标圆角保持在画布内
- 优化：侧边栏树重建后保持各节点展开状态
- 优化：toast 卡片内边距收紧
- 其他：Setup 项目补充 PopupShadowSpace 转换器；发布流程按通配符定位安装器并支持 FTP 部署

## 1.3.6 - 2026-08-05

- 功能：对话框与弹出层加入毛玻璃（frosted glass）拟态
- 功能：Changes 面板紧凑化，滚轮可跨网格边缘连续滚动
- 功能：扫描结果导入时可选目标项目
- 修复：弹出层阴影不再被裁剪，托盘菜单增加回退方案
- 修复：过滤 Windows IME 组合输入产生的重复文本
- 性能：背景毛玻璃自适应降采样优化
- 其他：发布流程合并多平台产物并新增 FTP 部署

## 1.2.5 - 2026-08-04

- 功能：新增"一键清理"工具栏动作
- 功能：侧边栏"添加仓库 / 扫描文件夹"改用独立图标
- 功能：加入双语隐私政策并随所有发布产物分发；切换为专有许可证并附带第三方声明
- 修复：单实例激活在慢启动监听下更健壮
- 修复：对话框复选框与默认按钮恢复悬停反馈
- 修复：单元格 tooltip 覆盖完整区域，宽网格可横向滚动
- 修复：本地读取与拉取期间刷新指示器保持旋转
- 修复：对话框反馈、键盘访问与批量成功提示加固
- 性能：悬停反馈即时化，背景模糊在交互时冻结
- 其他：toast 的时钟与调度器可注入，便于自动化测试

## 1.1.5 - 2026-08-03

- 功能：文件浏览器支持以系统默认应用打开所选文件
- 功能：侧边栏支持拖拽排序项目与仓库
- 功能：Changes 分割窗格可填满窗口并在缩放后保持
- 修复：Overview 首次状态刷新覆盖全部仓库
- 修复：忽略表头双击，避免排序意外缩小范围

## 1.1.0 - 2026-08-03

整合自 0.1.0 起步、历经 1.0.x 版本的完整功能集：

- 核心：基于 Avalonia 的多仓库 Git 图形界面；自绘窗口框架与壁纸玻璃拟态；连续圆角界面元素与统一主题令牌；Material 风格共享图标集；窗口初始适配屏幕工作区
- 仓库与项目：侧边栏以"项目 / 仓库"两级组织（移除分组）；首次导入自动创建项目，含快速操作与空状态引导；单实例运行；系统托盘图标与重置默认设置；支持后台静默拉取与本地优先刷新
- Git 工作流：分作用域刷新（全部 / 项目 / 仓库）与加载遮罩；多仓库 Git 读取并行化与 CPU 自适应并行度；Overview 可展开未推送提交详情（作者、时间、短 ID）；Changes 文件类型图标；搜索、LFS、更丰富的历史 / Diff 界面；Gerrit review push（记住字段、更多选项、commit-msg 钩子安装）；push 默认直推、History 模式随侧边栏选择、rebase 上游默认 @{upstream}
- 效率与体验：可配置字体、文件标签页、应用内快速终端；可折叠 shell 面板（侧栏 / 输出面板）并持久化布局；默认深色主题；DataGrid 表头紧凑与可调整列宽
- 安装与向导：可跳过、可重跑的设置向导（数据目录与 Git）；玻璃 / 动画开关与性能提示；自定义 Windows 安装器并借 NativeAOT 精简体积；版本自动 bump 与发布元数据
- 稳定性：毛玻璃 overlay 稳定化（裁剪快照与加载冻结）；修复 Changes 滚动卡顿（DataGrid 分组常驻并升级 Avalonia 12.1.1）
