# KNOWHERE Landing Page 设计规范

以当前 Landing 为基准，规定字体、颜色、布局、组件与交互表现。视觉以清晰排版、细边框、克制的表面层级和绿／青色体系为主。

- **优先级**：本次明确要求 → 组件局部规则 → 全局规则。复用现有字体、组件和 token。
- **范围**：Landing 及其嵌入演示；同站应用仅沿用明确共享的设计规则。
- **标记**：“扩展建议”不代表组件已实现；局部实现差异单独注明。
- **单位**：尺寸为 px；文字为“字号 / 行高”；四向间距为“上 / 右 / 下 / 左”。参考视口为桌面 1280 × 720、手机 390 × 844。

## 1. 字体与排版

### 1.1 字体分工

| 内容 | 字体 | 规则 |
| --- | --- | --- |
| 英文、数字 | Geist Sans（CSS：`Geist`） | 默认字体 |
| 中文 | Frex Sans GB VF | 标题、正文、导航及组件均使用 Frex |
| 局部等宽文字 | Geist Mono | 仅用于明确指定的作用域，不因代码、价格或对齐需求自动启用 |

当前局部 Mono 作用域包括章节标签、导航主按钮、Product 终端代码、SDK 代码框（含 Tab 与复制反馈）。这些局部设置不扩展到其他文字。导航主按钮保留 Geist Mono、13 / 20、500，并使用 Frex 中文回退；完整字体栈见下表。

常用字重为 400、500、600，按文字角色设置。章节标签保留原有方括号与英文大写；Logo、第三方标志和图片内文字保留素材形态。

### 1.2 字体资源与变量

| 字体 | 字重 | 资源 |
| --- | --- | --- |
| Geist Sans | 100–900 | Google Fonts；接入见 [index.html](./index.html) |
| Geist Mono | 100–900 | Google Fonts；400 提供本地 [Latin 子集](./public/fonts/GeistMono-Regular.woff2)及[授权](./public/fonts/GeistMono-OFL.txt) |
| Frex Sans GB VF | 100–700 | 本地[可变字体](./public/fonts/FrexSansGB-VF.woff2) |

| 变量 | 字体栈 / 引用 |
| --- | --- |
| `--sans` | `"Geist", "Frex Sans GB VF", sans-serif` |
| `--mono` | `"Geist Mono", "Frex Sans GB VF", monospace` |
| `--serif`、`--figma-display` | `var(--sans)`，仅保留兼容名称 |
| `--figma-mono` | `var(--mono)` |

字体使用 `font-display: swap`。通用 `sans-serif` / `monospace` 仅作加载兜底；图标字体仅用于图标。中英混排、Canvas 与独立演示遵循同一字体分工。

### 1.3 字号层级

中文沿用对应角色的字号、行高和字重。

| 文字角色 / 定位 | 桌面字号 / 行高 | 手机字号 / 行高 | 字重 | 字距：桌面 → 手机 |
| --- | --- | --- | ---: | --- |
| Hero 标题 · `#hero-title` | 44 / 48 | 32 / 36 | 400 | −0.75 → −0.6 |
| 区块标题 · Product / Process / Comparison / Integration / Pricing / Enterprise / FAQ | 40 / 44 | 32 / 36 | 400 | −0.7 |
| Capabilities 区块标题 · `#formats-title` | 40 / 44 | 32 / 36 | 500 | −0.7 |
| 结尾 CTA 标题 · `#final-title` | 44 / 48 | 31 / 36 | 400 | −0.75 |
| Hero 说明 · `.hero-copy .lede` | 18 / 27 | 16 / 24 | 400 | normal |
| 区块说明 · `.section-heading` 下的说明段落 | 18 / 27 | 15 / 22 | 400 | normal |
| 功能卡片标题 · `.format-feature h3` | 18 / 24 | 18 / 24 | 400 | normal |
| FAQ 问题 · `#faq summary` | 18 / 24 | 16 / 24 | 500 | normal |
| Hero 按钮 · `.hero-copy .button` | 15 / 24 | 15 / 24 | 500 | normal |
| 章节标签 · `.section-no` · Geist Mono | 15 / 24 | 15 / 24 | 400 | normal |
| 结尾 CTA 标签 · `#final-cta .section-no` · Geist Mono | 14 / 20 | 14 / 20 | 400 | normal |
| 导航链接 · `.kh-header-links a` | 14 / 21.7 | 菜单链接 18 / 24 | 400 | normal |
| SDK 代码示例 · Geist Mono | 12 / 16 | 8.775 / 11.7585 | 400 | normal |
| 页脚版权 · `.kh-footer-copyright` | 12 / normal | 12 / normal | 400 | 0.96 |

SDK 在 ≤479 使用 `clamp(7px, 2.25vw, 10px)`、行高 1.34；480 以上为 12 / 16。Product 终端为 14 / 22、400。导航主按钮为 13 / 20、500。示意图微型文字使用组件局部字号。

Product 文档卡片内边距为 24px，Section / Sheet 标签使用 Mono 12 / 18，标题和段落使用 Sans 16 / 24，并保持左对齐。Word 上层沿用 PDF 的两个独立 Section 卡片，每个卡片展示对应的原始 DOCX 页面截图，保留原文版式，下层 Text 展示短句提取；Excel 上层用一个带行列编号、单元格网格和 Sheet 切换的完整工作表视图，下层单独展示提取的 Table。格式 Tab 使用官方图标，按钮高度为 36px；手机端切换框内边距与间隔均为 3px，含边框总高为 44px。手机文档卡片铺满可用宽度，高度由内容撑开，不继承桌面的 540px 最小高度；页面截图保持原比例，页码不换行。

Excel 工作表居中显示 A–D 列及第 1–11 行，内容不可编辑或选中；亮色模式下，表头、行列标题和 Sheet 栏底色使用 `#F7F7F7`。Sheet 切换不显示绿色下划线，不提供 Open workbook 链接。桌面和平板上，从工作表底部中央引出一条连线，再分成三条连接下方 Table。

三个格式的 API 输出框顶部仅保留窗口圆点。所有视口下，代码按内容自然展开、长行自动换行，随页面纵向滚动；不设置固定高度或内部滚动区域。示例保持精简、可读的缩进结构。

Source-backed context 来源卡片在亮色下使用 3% 黑色边框，外层大框填充 50% 透明度白色（`--white-50`）；标题为 Sans 12 / 18、Medium 500，辅助文本为 Sans 12 / 18、Regular 400。保留卡片原有宽度，标题和辅助文本各限单行，超出显示省略号。

## 2. 颜色与主题

### 2.1 基础色板

基础 Hex 以 [colors.js](./src/colors.js) 的 `colorHex` 为准；OKLCH 用于颜色运算。`mist-white/300` 对应 `--mist-white-300`，其他色板同理。

| 色板 | 品牌色 500 | 用途 |
| --- | --- | --- |
| Mist White · 雾白 | `#F0F2E6` | 中性表面、文字与灰阶 |
| Mineral Green · 矿物绿 | `#19A88B` | 品牌、操作、正向状态与数据强调 |
| Coral Signal · 珊瑚红 | `#FF634A` | 提示、异常与信号强调 |
| Deep Teal · 深海青 | `#083B3A` | 暗色背景与表面层级 |

| 色阶 | Mist White | Mineral Green | Coral Signal | Deep Teal |
| ---: | --- | --- | --- | --- |
| 50 | `#FFFFFF` | `#CAFFEE` | `#FFF0EF` | `#6DFDFA` |
| 100 | `#FCFCFA` | `#7EFEDD` | `#FFE1DF` | `#3BE8E4` |
| 200 | `#F9FAF5` | `#27EFC6` | `#FFC7C3` | `#2FBAB8` |
| 300 | `#F6F7EF` | `#23D6B1` | `#FFA79F` | `#208C8A` |
| 400 | `#F3F5EA` | `#1DBE9D` | `#FF897D` | `#156462` |
| 500 | `#F0F2E6` | `#19A88B` | `#FF634A` | `#083B3A` |
| 600 | `#BBBCB3` | `#12846C` | `#DD3B00` | `#073231` |
| 700 | `#888A82` | `#0A6351` | `#A42900` | `#042626` |
| 800 | `#595A55` | `#054437` | `#731A00` | `#021D1D` |
| 900 | `#2E2E2C` | `#01251D` | `#420B00` | `#011110` |
| 950 | `#1B1C1A` | `#011711` | `#2D0500` | `#010909` |

### 2.2 页面亮暗色映射

按语义映射，基础色板保留原值。组件局部设置优先；透明线条不直接替换为不透明的 `--line`。

| 用途 / 变量 | 亮色 | 暗色 |
| --- | --- | --- |
| 页面背景 `--paper` | `#FFFFFF` | `#010909` |
| 主要文字 `--ink` | `#2E2E2C` | `#F9FAF5` |
| 次级文字 `--muted` | `#888A82` | `#BBBCB3` |
| 基础线条 `--line` | `#BBBCB3` | `#083B3A` |
| 品牌装饰 `--mineral-green-500` | `#19A88B` | `#1DBE9D` |
| 主操作 `--page-primary` / `--accent` | `#19A88B` | `#23D6B1`（primary） |
| 珊瑚信号 `--coral-signal-500` | `#FF634A` | `#FF897D`；错误另用 error |
| 控件底 / 悬停 / 按下 | `#FFFFFF` / `#F7F8F4` / 悬停色 97% 与黑色混合 | `#021D1D` / `#042626` / `#073231` |
| 控件文字 | `#2E2E2C` | `#F9FAF5` |
| 控件边框 / 悬停边框 | `#DEDFD9` / `#B1B7A9` | `#083B3A` / `#888A82` |
| Hero 主按钮底 / 文字 | `#1B1C1A` / `#FFFFFF` | `#23D6B1` / `#011711` |
| Hero 主按钮悬停 / 按下 | `#33483D` / `#011110` | primary 92% / 88% 与 on-primary 混合 |
| Hero 次按钮底 / 文字与边框 | 透明 / `#2E2E2C` | 透明 / `#F9FAF5` |
| Hero 次按钮悬停 / 按下 | black 3% / 6% | on-surface 6% / 10%，见 §2.3 |
| Formats 功能卡片底 | black 3% | `#021D1D` |
| Document Map 层级节点底 | `#FAFAFA` | `#021D1D` |
| Process 插图弱化表面 | mist-white/300 | 随组件局部主题映射 |
| 结尾 CTA 底 / 文字 | `#12846C` / `#FFFFFF` | `#011711` / `#FFFFFF` |
| 结尾 CTA 标签底 / 文字 | `#FF634A` / `#FFFFFF` | `#FF897D` / `#FFFFFF` |
| 结尾 CTA 白按钮底 / 文字 | `#FFFFFF` / `#2E2E2C` | `#FFFFFF` / `#2E2E2C` |
| 结尾 CTA 白按钮悬停 / 按下 | 控件悬停 / 按下色 | 白色 88% / 85% |

结尾 CTA 的白字与白按钮为局部固定色，不跟随白色表面 token 重绑定。导航与页脚使用 §2.5 的独立映射。

### 2.3 中性色与透明度

Black、White 均提供 **1、2、3、6、10、20、30、40、50、60、70、80、90、100%**，变量为 `--black-N` / `--white-N`。

| 变量 | 亮色 | 暗色 |
| --- | --- | --- |
| `--black-N` | 黑色 × N% | `#F9FAF5`（on-surface）× N%，保持透明度 |
| `--white-N`（3–100） | 白色 × N% | `#010909`（surface）× N%，保持透明度 |
| `--white-1` / `--white-2` | 白色 1% / 2% | 当前未重绑定，仍为白色 1% / 2% |
| `--mist-white-50 / 100 / 200` | 基础色板 | `#000000` / `#011110` / `#021D1D` |
| `--mist-white-300 / 400 / 500` | 基础色板 | `#042626` / `#042626` / `#073231` |
| `--mist-white-600 / 700 / 800` | 基础色板 | `#083B3A` / `#888A82` / `#BBBCB3` |
| `--mist-white-900 / 950` | 基础色板 | 均为 `#F9FAF5` |

暗色 `--black-N` 指 on-surface 透明色，不等于 `--white-N`。Hero 次按钮引用 `--black-6 / 10`，使悬停与按下在暗色背景上呈现浅色填充。

### 2.4 暗色语义 token

以 `html[data-theme="dark"]` 激活，变量前缀为 `--md-sys-color-`。以下完整对应 `materialDark`；映射引用 §2.1 的原始色板。

| 角色 | 基础 token |
| --- | --- |
| primary、surface-tint、primary-fixed-dim | mineral-green-300 |
| on-primary、on-primary-fixed | mineral-green-950 |
| primary-container、on-primary-fixed-variant | mineral-green-800 |
| on-primary-container、primary-fixed | mineral-green-100 |
| inverse-primary | mineral-green-600 |
| secondary、secondary-fixed-dim | deep-teal-200 |
| on-secondary、on-tertiary、on-secondary-fixed、on-tertiary-fixed | deep-teal-950 |
| secondary-container、on-secondary-fixed-variant、on-tertiary-fixed-variant | deep-teal-700 |
| on-secondary-container、on-tertiary-container、secondary-fixed、tertiary-fixed | deep-teal-50 |
| tertiary、tertiary-fixed-dim | deep-teal-100 |
| tertiary-container | deep-teal-600 |
| error / on-error | coral-signal-300 / coral-signal-950 |
| error-container / on-error-container | coral-signal-800 / coral-signal-100 |
| background、surface、surface-dim | deep-teal-950 |
| on-background、on-surface、inverse-surface | mist-white-200 |
| surface-variant、surface-bright、surface-container-high | deep-teal-700 |
| on-surface-variant | mist-white-600 |
| outline / outline-variant | mist-white-700 / deep-teal-500 |
| shadow、scrim、surface-container-lowest | black |
| inverse-on-surface、surface-container-low | deep-teal-900 |
| surface-container / surface-container-highest | deep-teal-800 / deep-teal-600 |

主题优先采用用户选择，否则跟随系统；页面、嵌入演示与 Canvas 保持一致。

### 2.5 导航与页脚颜色

共享样式使用 `--chrome-*`，保留其局部色值，不套用正文色替换。

| 变量 / 用途 | 亮色 | 暗色 |
| --- | --- | --- |
| paper · 背景 | `#FFFFFF` | `#010909` |
| ink · 文字与图标 | `#1B1C1A` | `#F2F5F5` |
| muted · 辅助文字 | `#7D817C` | `#9AAEAD` |
| line · 分隔线 | 黑色 10% | 白色 14% |
| surface · 导航链接与图标悬停底 | `#F7F8F9` | `#042626` |
| 导航主按钮底 / 文字 | `#1B1C1A` / `#FFFFFF` | `#23D6B1` / `#011711` |
| 导航主按钮悬停 | `#33483D` | primary 92% 与 on-primary 混合 |
| 导航主按钮按下 | `#011110`，保留悬停描边 | primary 88% 与 on-primary 混合，保留悬停描边 |
| 页脚链接悬停 | `#12846C` | `#1DBE9D` |
| 页脚大字标底色 | ink 3% | ink 3% |

桌面顶栏初始底线固定为黑色 6%；滚动后及 ≤1199 时使用 line。语言菜单选中底为黑色 6%，悬停／焦点底为黑色 3%，当前在两种主题下保持该值。菜单内主按钮与顶栏主按钮状态一致；按下下移 1px，键盘焦点使用主色 2px 外轮廓、间隔 4px，状态过渡 150ms，减少动态效果时取消过渡。

### 2.6 同站设计对齐

| 范围 | 共享规则与局部例外 |
| --- | --- |
| 同站页面 | 以 Landing 字体、页面语义色、品牌装饰及透明中性色为对齐基准；布局与组件尺寸沿用各自规范 |
| Pricing | 品牌装饰映射至 `#1DBE9D`，暗色主操作为 `#23D6B1 / #011711`；绿色面板保留白字、白图标与白底深字按钮；中性结尾 CTA 保留 black/3 表面 |
| Blog | 页面与正文采用 §2.2；暗色选中态为 `#23D6B1 / #011711`；封面图片与图内排版保留原配色 |

## 3. 栅格、间距与响应式

### 3.1 页面栅格

| 档位 | 宽度 | 列数 | 列间距 | 页面基准边距 |
| --- | --- | ---: | ---: | ---: |
| Desktop | ≥1200 | 12 | 20 | 80 |
| Tablet | 768–1199 | 8 | 16 | 24 |
| Mobile | ≤767 | 4 | 16 | 16 |

内容最大宽度为 `--content-max: 1280px`，内容宽度为 `min(1280px, 视口宽度 − 两侧边距)`。栅格使用 `--layout-grid-columns / gap / edge`。手机默认单列；平板保留八列布局。Hero、Integration、结尾 CTA、导航及页脚使用各自边距。

Product 文档演示使用局部断点：宽度 768–1439px，或宽度 ≥768px 且高度 ≤1099px 时，采用居中的 1280px 静态画布，按可用宽度等比缩小、不放大。三个来源区域保持三列，两个来源区域保持两列；宽度 ≥1440px 且高度 ≥1100px 时使用桌面滚动演示，手机保持单列。

### 3.2 垂直间距

仅映射垂直 margin、padding 与 row-gap，不用于水平边距、文字或组件尺寸。中间值取最近档位，如 60 → 32、100 → 48。

| 桌面间距 | 手机间距 |
| ---: | ---: |
| 8 | 8 |
| 12 | 8 |
| 16 | 12 |
| 24 | 16 |
| 32 | 20 |
| 40 | 24 |
| 48 | 24 |
| 64 | 32 |
| 80 | 40 |
| 96 | 48 |
| 120 | 56 |
| ≥160 | 64 |

映射结果最小为 8；原有 0 及小于 8 的微间距不变。平板无局部规则时保留桌面垂直间距。

### 3.3 区块布局

| 区块 | 桌面 padding | 手机 padding | 顶部 margin：桌面 → 手机 |
| --- | --- | --- | --- |
| Hero · `#top` | 110 / 32 / 124 / 32 | 104 / 16 / 56 / 16 | 0 → 0 |
| Product · `#playground` | 24 / 0 / 24 / 0 | 16 / 16 / 16 / 16 | 60 → 32 |
| Process · `#capabilities` | 60 / 80 / 60 / 80 | 32 / 16 / 32 / 16 | 0 → 0 |
| Capabilities · `#formats` | 60 / 80 / 60 / 80 | 40 / 16 / 32 / 16 | 0 → 0 |
| Comparison · `#comparison` | 60 / 80 / 60 / 80 | 32 / 16 / 32 / 16 | 60 → 32 |
| Integration · `#integration` | 60 / 0 / 60 / 0 | 32 / 16 / 32 / 16 | 60 → 32 |
| Pricing · `#pricing` | 60 / 80 / 60 / 80 | 32 / 16 / 32 / 16 | 60 → 32 |
| Enterprise · `#enterprise` | 60 / 80 / 60 / 80 | 32 / 16 / 32 / 16 | 100 → 48 |
| FAQ · `#faq` | 60 / 80 / 60 / 80 | 32 / 16 / 32 / 16 | 60 → 32 |
| 结尾 CTA · `#final-cta` | 95 / 80 / 95 / 80 | 64 / 20 / 64 / 20 | 60 → 32 |

| 间距 | 桌面 | 手机 |
| --- | --- | --- |
| 标题组到内容 | 60 | 32 |
| 标题组内部 | 10 | 8 |
| FAQ 标题组到内容 / 内部 | 0 / 10 | 0 / 10 |

手机间距 token 为 `--space-section-mobile: 32px`、`--space-section-compact-mobile: 16px`、`--space-heading-content-mobile: 32px`、`--space-heading-row-mobile: 8px`。实际区块距离还包含相邻 padding 和滚动占位。

## 4. 组件

主要按钮、功能卡片和 FAQ 默认无投影，以底色与细边框区分层级。[组件规范 HTML](./public/component-spec.html) 为可视化参考，本文为规范正文。

### 4.1 按钮与输入框

**尺寸**

| 组件 | 高度 | 圆角 / 描边 | 字号 / 行高 · 字重 | 水平内边距 | 状态 |
| --- | ---: | --- | --- | ---: | --- |
| 通用按钮 L | 46 | 2 / 1 | 15 / 24 · 500 | 13 | Landing 当前基础尺寸 |
| Hero 按钮 | 44 | 2 / 1 | 15 / 24 · 500 | 16 | 手机两按钮同行等宽，gap 12 |
| 通用按钮 M / S | 40 / 32 | 2 / 1 | 14 / 20、13 / 20 · 500 | 12 / 10 | 扩展建议 |
| 输入框 L | 46 | 2 / 1 | 桌面 18 / 27、手机 16 / 24 · 400 | 13 | 沿用表单基础规范 |
| 输入框 M / S | 40 / 32 | 2 / 1 | 16 / 24、14 / 20 · 400 | 12 / 10 | 扩展建议 |

按钮加载图标为 16；L 档图文间距白按钮 11、黑按钮 13，M / S 建议为 8 / 6。输入框辅助文本为 14 / 20，距输入框 8。M / S 不代表现有通用尺寸 API。

**按钮状态**

| 状态 | 规则 |
| --- | --- |
| 默认 / 悬停 / 按下 | 颜色按 §2.2；按下保留悬停描边并下移 1 |
| 白按钮按下（亮色） | `color-mix(in srgb, var(--control-surface-hover) 97%, #000)`，约 `#F0F1ED` |
| 键盘焦点 | 主色 2 外轮廓，间隔 4，保留当前底色 |
| 禁用 | 底 black/10、字 black/40、边 black/3；图标保留原色并降至 50% 透明度；无悬停、按下反馈 |
| 加载 | 保留默认配色，以 16 转圈图标替代原图标；尺寸不变，显示进行中状态 |

所有页面的普通操作按钮、Hero CTA、导航主按钮与矩形工具按钮统一使用 2px 圆角，各交互状态及响应式尺寸保持一致。

通用过渡为 150ms。禁用／加载阻止重复操作；可用时按下覆盖悬停，键盘焦点可叠加。加载图标 800ms 一圈，减少动态效果时保留静态忙碌指示。

Landing 已实现通用按钮颜色、按下与禁用样式；加载图标属于表单组件规范。导航 `.kh-button` 保留 §4.3 的尺寸和字体，主按钮颜色与交互按本节规则及 §2.5 映射实现。

**输入框状态（亮色规范）**

| 状态 | 底色 / 文字 / 边框 |
| --- | --- |
| 默认、已填写、自动填充 | 白底、`#2E2E2C` 字、`#DEDFD9` 边；占位 `#A2A49C` |
| 悬停 | 可编辑且无错误时，边框 `#B1B7A9` |
| 聚焦 | 原有 1px 边框改为 `#19A88B`，不叠加轮廓或阴影 |
| 错误 | 失焦边框及辅助文字为 `#DD3B00` |
| 错误时聚焦 | 绿色边框，保留红色辅助文字 |
| 只读 | 白底、正常文字；可选择与复制 |
| 禁用 | 底 black/6、字 `#888A82`、默认边框；无交互反馈 |

输入框状态优先级：禁用 → 聚焦 → 错误 → 悬停 → 默认。标签始终可见，错误反馈位于对应输入框下方。Login 与参考 HTML 的亮色输入框禁用底色均为 black/6，白按钮按下色均为悬停色 97% 与黑色混合；暗色使用各自主题映射。

表单成功反馈距按钮 16，绿色图标与 14 / 20 文字整体居中；无卡片底色、描边或关闭按钮。

### 4.2 SDK Tab

**尺寸与字体**

| 属性 | 当前 Landing | 扩展建议 |
| --- | --- | --- |
| 高 / 宽 | 桌面、手机均为 44 / 65 | M：36 / 65；S：26 / 65 |
| 圆角 / 描边 | 2 / 1 | 同当前 |
| 文字 | Geist Mono，12 / 16，400 | 其他 Tab 默认采用 §1 字体分工 |
| 内边距 / 项间距 | 4 × 6 / 10 | S 项间距 6 |

26px 仅保留为紧凑档位建议，不作为当前手机尺寸。

**状态规范**

| 状态 | 亮色外观 | 实现范围 |
| --- | --- | --- |
| 未选中 | 透明底，mineral-green/500 文字与描边 | 当前基础样式 |
| 悬停 | 透明底，mineral-green/700 文字与描边 | 已实现；选中项保持选中配色 |
| 选中 | mineral-green/500 实底及描边，白字 | 已实现 |
| 按下 | 控件按下底色，保留悬停文字与描边 | 已实现，优先于选中态 |
| 键盘焦点 | 主色 2 外轮廓，间隔建议 2 | 扩展建议 |
| 禁用 | 底 black/10、字 black/40、边 black/3 | 扩展建议 |

颜色过渡 140ms。暗色选中态使用 primary 实底及描边、on-primary 文字；未选中项悬停和按下使用 primary 文字与描边，按下底色使用控件按下色。交互使用普通按钮和 `aria-pressed`；完整 Tab 键盘模型见 §5 的扩展建议。

### 4.3 导航栏（Nav bar）

使用共享 `SiteHeader`，固定于顶部，层级 100；底线 1px，无投影。颜色见 §2.5。

| 属性 | 桌面 ≥1200 | 平板 768–1199 | 手机 ≤767 |
| --- | --- | --- | --- |
| 顶栏高 | 67 | 72 | 64 |
| 内容宽 | `min(1280px, 100% − 160px)` | `100% − 32px` | `100% − 32px` |
| Logo 宽 | 112 | 120 | 108 |
| 导航链接 | 横排；高 36，水平 padding 12，圆角 2，gap 8 | 收入菜单 | 收入菜单 |
| 顶栏主按钮 | 高 36，水平 padding 12，圆角 2 | 同桌面 | 收入菜单 |
| 工具按钮 | 常规 36 × 36；语言 40 × 36；主题 44 × 44 | 44 × 44 | 语言、菜单 44 × 44；其余收入菜单 |
| 展开菜单 | 不显示 | 铺满顶栏下方；左右 padding 20 | 铺满顶栏下方；左右 padding 16 |
| 菜单链接 | — | 最小高 60，padding 18 × 8 | 最小高 58，padding 16 × 8 |

导航链接 14 / 21.7、400；菜单链接 18 / 24、400；主按钮 Geist Mono、13 / 20、500。操作区 gap 10，矩形工具按钮圆角 2。语言菜单宽 148、padding 4、圆角 8，选项圆角 2、最小高 44、文字 14 / 20，选中项字重 500。

菜单底部工具区为 `44 / 44 / 剩余宽度` 三列，gap 8。菜单按钮两线以 220ms 旋转为关闭图标；Escape 关闭并返回触发按钮焦点，展开时限制背景滚动及焦点范围。

### 4.4 页脚（Footer）

使用共享 `SiteFooter`，颜色见 §2.5。

| 属性 | 桌面 | 手机 |
| --- | --- | --- |
| 定位 / 高度 | sticky / 555 | 文档流 / 内容撑高 |
| padding | 上 80、下 60；水平至少 80，内容最大宽 1280 | 72 / 20 / 0 / 20 |
| 图标 | 37 × 42 | 同桌面 |
| 图标到导航内容 | 48 | 40 |
| 链接文字 | 18 / 24.8，400 | 14 / 24.8，400；点击区域最小高 44 |
| 链接间距 | 48 | `clamp(12px, 4vw, 40px)` |
| 大字标 | 1280 : 183，ink 3% | 同比例，顶部 margin 72 |

平板水平 padding 为 48。版权 12px、400、字距 0.08em、居中大写；背景点阵从顶部向下渐隐。

### 4.5 卡片与折叠项

| 组件 | 桌面 | 手机 | 外观 |
| --- | --- | --- | --- |
| Formats 功能卡片 | 三列；padding 29 × 20；gap 12 | 单列，内容撑高 | 圆角 4、边框 1 |
| Formats 主展示区 | 跨列 | 单列 | 圆角 8 |
| FAQ 问题行 | 上下 padding 20；单行高 68 | 同桌面 | 圆角 0；长文字自然换行 |

## 5. 交互与动效

| 对象 | 设计规则 |
| --- | --- |
| 主题切换 | 从触发按钮中心圆形展开，400ms、ease-in-out；减少动态效果时直接切换 |
| 语言切换 | 保持字体分工、文字层级和组件尺寸，检查混排与换行 |
| 按钮与表单 | 状态变化不改变尺寸；禁用不可聚焦；错误和忙碌状态具有可访问语义 |
| Tab | 选中项对应可见面板；扩展建议：方向键切换、Home / End 首尾定位、跳过禁用项，并采用 tablist / tab / tabpanel 语义 |
| 折叠项 | 原生展开／收起，支持键盘操作 |
| 复制反馈 | 在原控件内反馈；手机可横向扩展反馈文字 |
| 内容进入与滚动 | 沿用组件节奏；文字揭示、卡片进入与插图动效不遮挡基本操作 |
| Hero 入场 | 扫描线覆盖整个视窗高度；Hero 标题、说明、按钮和视窗内的 Product 标题区随扫描线到达各自位置逐步显露，共用扫描进度，不叠加淡入、位移或独立计时的入场动画。视窗下方内容沿用滚动出场节奏；直接进入下方内容时不等待扫描。减少动态效果时直接显示 |
| Product 格式出场 | 顶部请求代码的文字揭示在每次切换格式 Tab 时重播。容器淡入和卡片像素动效仅在各格式 Tab 首次显示时播放，切回已显示的 Tab 不重播；刷新页面后重置。遵循减少动态效果设置 |
| 减少动态效果 | 遵循 `prefers-reduced-motion`，保留内容、状态与基本操作 |

## 6. 页面配置与实现入口

仅列设计实现位置；组件局部样式与主题覆盖需一并核对。

| 内容 | 入口 |
| --- | --- |
| 页面结构 | [LandingPage.jsx](./src/landing/LandingPage.jsx) |
| 排版、布局、组件与主题覆盖 | [landing.css](./src/landing/landing.css) |
| 字体接入与默认字体 | [index.html](./index.html)、[page-style-controller.jsx](./src/page-style-controller.jsx) |
| 基础色板与暗色语义 | [colors.js](./src/colors.js) |
| 共享导航与页脚 | [SiteHeader.tsx](./shared/site-chrome/SiteHeader.tsx)、[SiteFooter.tsx](./shared/site-chrome/SiteFooter.tsx)、[site-chrome.css](./shared/site-chrome/site-chrome.css) |
| 主题过渡 | [AnimatedThemeToggler.tsx](./shared/site-chrome/AnimatedThemeToggler.tsx) |
| 页面交互与 Canvas | [landing-interactions.js](./src/landing/landing-interactions.js)、[landing-canvas.js](./src/landing/landing-canvas.js) |
| 文档演示 | [document-map.jsx](./src/landing/document-map.jsx)、[document-scan-section.html](./document-scan-section.html) |
| SDK 与插图 | [catenoid-field-embed.jsx](./src/landing/catenoid-field-embed.jsx)、[catenoid-field-embed.css](./src/landing/catenoid-field-embed.css) |
| 结尾插图 | [converging-helix-embed.jsx](./src/landing/converging-helix-embed.jsx)、[converging-helix.js](./src/landing/converging-helix.js) |
| 表单视觉参考 | [form-controls.css](./apps/login/src/components/form-controls.css)、[form-controls.tsx](./apps/login/src/components/form-controls.tsx) |
| 组件可视化参考 | [component-spec.html](./public/component-spec.html) |

## 7. 执行与验收要求

- **视觉改动**：构建通过后，浏览器核对桌面、手机及涉及的平板视口；检查实际字体、换行、颜色、间距和溢出。
- **状态改动**：检查亮暗色、中英文、悬停、按下、焦点、禁用与减少动态效果；涉及嵌入页或 Canvas 时分别检查。
- **仅改文档**：核对引用、规则一致性与 `git diff --check`，无需构建。
- **验收边界**：源码声明、设计目标与浏览器渲染分开记录；未完成的视觉检查不记为通过。
