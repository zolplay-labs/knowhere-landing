# KNOWHERE Landing Page 设计规范

适用于 Landing Page、页面组件及嵌入文档演示。视觉以清晰排版、细边框、克制的表面层级和绿／青色体系为主；文档、结构图与来源关联用于说明产品能力。

## 1. 字体与排版

### 1.1 字体分工

| 内容 | 唯一指定字体 | 使用范围 |
| --- | --- | --- |
| 英文与数字的默认字体 | **Geist Sans** | 所有未被使用者明确指定为 Mono 的英文和数字 |
| 使用者明确指定的 Mono 文字 | **Geist Mono** | 仅限使用者明确指定的文字、区域或组件，不扩展到其他位置 |
| 中文文字 | **Frex Sans GB VF** | 所有中文标题、正文、导航和组件文字 |

混排时，英文与数字默认使用 Geist Sans，中文使用 Frex。**只有使用者明确指定某段文字、区域或组件使用 Mono 时，才使用 Geist Mono。** 代码、章节标签、技术标识、价格和对齐需求均不构成自动启用 Mono 的理由；不得仅凭内容类型、HTML 标签或 AI 判断套用 Mono。未明确指定时保持默认字体。

- 常用字重：`400 Regular`、`500 Medium`、`600 SemiBold`。具体角色见下表，不把所有标题统一加粗。
- 章节标签保留现有方括号与英文大写；普通标题保留页面原有大小写。
- `sans-serif` / `monospace` 只是加载失败时的通用兜底，不是新增设计字体。
- 已有 Logo、第三方标志与原始文档图片中的文字保持素材本身的形态，不据此扩展网页字体体系。

### 1.2 字体接入

| 设计名称 | CSS family | 字重范围 | 字体来源 |
| --- | --- | --- | --- |
| Geist Sans | `"Geist"` | 100–900 | [Geist · Google Fonts](https://fonts.google.com/specimen/Geist) |
| Geist Mono | `"Geist Mono"` | 100–900 | [Geist Mono · Google Fonts](https://fonts.google.com/specimen/Geist+Mono) |
| Frex Sans GB VF | `"Frex Sans GB VF"` | 100–700 | `public/fonts/FrexSansGB-VF.woff2` |

Geist Sans 在 Google Fonts 中的字体名称为 **Geist**；CSS 使用 `"Geist"`。中文字体使用单一可变字体文件，字重通过 `font-weight` 设置。

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap" rel="stylesheet">
```

```css
@font-face {
  font-family: "Frex Sans GB VF";
  src: url("/fonts/FrexSansGB-VF.woff2") format("woff2");
  font-style: normal;
  font-weight: 100 700;
  font-display: swap;
}

:root {
  --sans: "Geist", "Frex Sans GB VF", sans-serif;
  --mono: "Geist Mono", "Frex Sans GB VF", monospace;
  --serif: var(--sans);
  --figma-display: var(--sans);
  --figma-mono: var(--mono);
}
```

`--serif`、`--figma-display`、`--figma-mono` 是兼容变量名，分别引用上述字体栈。加载 Geist Mono 或定义 `--mono` 只提供字体资源，不代表自动应用；只有使用者明确指定的目标才能引用 Mono 字体栈。样式控制器、中英文切换、Canvas 文字及独立 HTML 入口均遵守这一规则。图标字体只用于图标。

### 1.3 字号层级

单位为 px，格式为 `字号 / 行高`。参考视口：桌面 `1280 × 720`、手机 `390 × 844`。中文沿用对应角色的字号、行高和字重。

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
| 章节标签 · `.section-no` | 15 / 24 | 15 / 24 | 400 | normal |
| 结尾 CTA 标签 · `#final-cta .section-no` | 14 / 20 | 14 / 20 | 400 | normal |
| 桌面导航链接 · `.desktop-nav a` | 14 / 21.7 | 切换为菜单布局 | 400 | normal |
| SDK 代码示例 | 12 / 16 | 8.775 / 11.7585 | 400 | normal |
| 页脚版权 · `.footer-copyright` | 12 / normal | 12 / normal | 400 | 0.96 |

SDK 在 ≤479px 使用 `font-size: clamp(7px, 2.25vw, 10px)`、`line-height: 1.34`；480px 以上使用 12 / 16。示意图内部微型文字、文档缩略图与 Canvas 标签使用组件自身的字号。

## 2. 颜色与主题

### 2.1 基础色板

四组色板的 `500` 是固定品牌色；完整 Hex 以 `src/colors.js → colorHex` 为准。设计中的 `mist-white/300` 对应代码中的 `--mist-white-300`，其他色板同理。

| 色板 | 500 | 职责 |
| --- | --- | --- |
| Mist White · 雾白 | `#F0F2E6` | 中性表面、正文与灰阶层次 |
| Mineral Green · 矿物绿 | `#19A88B` | 品牌、主操作、正向状态、数据强调 |
| Coral Signal · 珊瑚红 | `#FF634A` | 提示、异常与信号强调；不替代主品牌绿 |
| Deep Teal · 深海青 | `#083B3A` | 深色主题的背景、结构与表面层级 |

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

`mist-white/50` 固定为 `#FFFFFF` / `oklch(1 0 0)`。OKLCH 数据供颜色运算使用；本页运行时注入 Hex，查阅与还原颜色优先使用 `colorHex`，不要从截图取近似色替代。

### 2.2 页面语义色与组件配色

品牌色、文字、表面与操作状态按各自的语义角色设置。

| 角色 | 浅色页面 | 深色页面 |
| --- | --- | --- |
| 页面背景 · `--paper` | `mist-white/50 · #FFFFFF` | `deep-teal/950 · #010909` |
| 主要文字 · `--ink` | `mist-white/900 · #2E2E2C` | `mist-white/200 · #F9FAF5` |
| 次级文字 · `--muted` | `mist-white/700 · #888A82` | `mist-white/600 · #BBBCB3` |
| 基础线条变量 · `--line` | `mist-white/600 · #BBBCB3` | `deep-teal/500 · #083B3A` |
| 品牌主色设置 · `--page-primary` | `mineral-green/500 · #19A88B` | 操作组件按 Material 语义色覆盖 |
| Hero 主按钮 | `mist-white/950` 底、白字 | `primary` 底、`on-primary` 字 |
| Hero 次按钮 | 透明底、深色边框与文字 | 透明底、浅色边框与文字 |
| Formats 功能卡片 | `black/3` 底与 `black/3` 细边框 | `surface-container · deep-teal/800` 底 |
| 结尾 CTA 背景 | `mineral-green/600 · #12846C` | `mineral-green/950 · #011711` |
| 结尾 CTA 标签 | `coral-signal/500` 底、白字 | `coral-signal/400 · #FF897D` 底、白字 |

局部表面不等于全页背景：Document Map 浅色层级节点使用 `--trace-hierarchy-surface: #FAFAFA`；Process 插图的弱化表面使用 `mist-white/300`。这两个设置不替换全局 `--paper`。

### 2.3 黑白透明度

| 色系 | 可用透明度（%） | CSS 命名 |
| --- | --- | --- |
| Black | 1、2、3、6、10、20、30、40、50、60、70、80、90、100 | `--black-{opacity}` |
| White | 1、2、3、6、10、20、30、40、50、60、70、80、90、100 | `--white-{opacity}` |

用于边框、分隔线、覆盖层、阴影及深浅表面上的文字。Black 与 White 使用相同的透明度色阶，均包含 1% 和 2%。组件已使用透明度线条时，不要直接改成不透明的 `--line`。

### 2.4 深色语义映射

以 `html[data-theme="dark"]` 激活深色主题。CSS 名称为 `--md-sys-color-{role}`；下表完整对应 `src/colors.js → materialDark`，值引用上面的基础色板，不新增独立色板。

| Material role | 对应基础 token |
| --- | --- |
| `primary` | `mineral-green-300` |
| `on-primary` | `mineral-green-950` |
| `primary-container` | `mineral-green-800` |
| `on-primary-container` | `mineral-green-100` |
| `inverse-primary` | `mineral-green-600` |
| `secondary` | `deep-teal-200` |
| `on-secondary` | `deep-teal-950` |
| `secondary-container` | `deep-teal-700` |
| `on-secondary-container` | `deep-teal-50` |
| `tertiary` | `deep-teal-100` |
| `on-tertiary` | `deep-teal-950` |
| `tertiary-container` | `deep-teal-600` |
| `on-tertiary-container` | `deep-teal-50` |
| `error` | `coral-signal-300` |
| `on-error` | `coral-signal-950` |
| `error-container` | `coral-signal-800` |
| `on-error-container` | `coral-signal-100` |
| `background` | `deep-teal-950` |
| `on-background` | `mist-white-200` |
| `surface` | `deep-teal-950` |
| `on-surface` | `mist-white-200` |
| `surface-variant` | `deep-teal-700` |
| `on-surface-variant` | `mist-white-600` |
| `outline` | `mist-white-700` |
| `outline-variant` | `deep-teal-500` |
| `shadow` | `black` |
| `scrim` | `black` |
| `inverse-surface` | `mist-white-200` |
| `inverse-on-surface` | `deep-teal-900` |
| `surface-tint` | `mineral-green-300` |
| `surface-dim` | `deep-teal-950` |
| `surface-bright` | `deep-teal-700` |
| `surface-container-lowest` | `black` |
| `surface-container-low` | `deep-teal-900` |
| `surface-container` | `deep-teal-800` |
| `surface-container-high` | `deep-teal-700` |
| `surface-container-highest` | `deep-teal-600` |
| `primary-fixed` | `mineral-green-100` |
| `primary-fixed-dim` | `mineral-green-300` |
| `on-primary-fixed` | `mineral-green-950` |
| `on-primary-fixed-variant` | `mineral-green-800` |
| `secondary-fixed` | `deep-teal-50` |
| `secondary-fixed-dim` | `deep-teal-200` |
| `on-secondary-fixed` | `deep-teal-950` |
| `on-secondary-fixed-variant` | `deep-teal-700` |
| `tertiary-fixed` | `deep-teal-50` |
| `tertiary-fixed-dim` | `deep-teal-100` |
| `on-tertiary-fixed` | `deep-teal-950` |
| `on-tertiary-fixed-variant` | `deep-teal-700` |

显式主题选择存储于 `knowhere-color-theme`；没有显式选择时跟随 `prefers-color-scheme`。主题与语义变量同步至嵌入的文档演示。组件主题配色优先使用语义 token。

## 3. 栅格、间距与响应式

### 3.1 页面栅格

| 档位 | 宽度 | 列数 | 列间距 | 页面基准边距 |
| --- | --- | ---: | ---: | ---: |
| Desktop | ≥1200 | 12 | 20 | 80 |
| Tablet | 768–1199 | 8 | 16 | 24 |
| Mobile | ≤767 | 4 | 16 | 16 |

| 设置 | 值 / 规则 |
| --- | --- |
| 内容最大宽度 | `--content-max: 1280px` |
| 栅格变量 | `--layout-grid-columns`、`--layout-grid-gap`、`--layout-grid-edge` |
| 内容宽度 | `min(1280px, 视口宽度 − 两侧基准边距)` |
| Mobile 默认排布 | 卡片与图文模块占满四列，按单列堆叠 |
| Tablet | 使用自己的八列布局；不把四列手机布局直接拉宽 |
| 全宽区块 | 外层允许铺满，内部内容按区块的栅格对齐 |

Hero、Integration 与结尾 CTA 使用各自的边距；区块设置优先于共用栅格。

### 3.2 桌面 → 手机垂直间距映射

仅用于垂直 `margin`、`padding` 与 `row-gap`。中间值按最接近的源档位映射，例如 `60 → 32`、`100 → 48`；不应用于水平边距、字号、行高或组件尺寸。

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

映射后的间距最小为 8px；原有小于 8px 的微间距保持原值，不放大，也不将零间距改成 8px。Tablet 没有单独规则时保留桌面垂直间距。

### 3.3 区块布局

参考视口：桌面 `1280 × 720`、手机 `390 × 844`。数值顺序为 **上 / 右 / 下 / 左**，单位 px。

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

- 常规区块标题到内容：桌面 `margin-bottom: 60px`，手机 `32px`；FAQ 的标题区域为 0，由外层布局控制距离。
- 常规标题组内部行距：桌面 `10px`，手机 `8px`；FAQ 保留 `10px`。
- 手机语义变量：`--space-section-mobile: 32px`、`--space-section-compact-mobile: 16px`、`--space-heading-content-mobile: 32px`、`--space-heading-row-mobile: 8px`。
- `#formats` 手机顶部为 `40px`；外层滚动容器顶部 margin 为 0。
- 表中的顶部 margin 不等于两区块的最终视觉距离；还应计入相邻 padding、滚动容器与 sticky 区域占位。

## 4. 组件外观

单位为 px。圆角按组件角色设置；主要按钮、功能卡片和 FAQ 使用底色与细边框分层，默认无投影。

| 组件 | 桌面设置 | 手机设置 | 外观与状态 |
| --- | --- | --- | --- |
| Hero 按钮 | 15 / 24，500；padding 8 × 16；高 44 | 高 44；两个按钮同行等宽，gap 12 | 圆角 1；主按钮实色，次按钮描边 |
| 导航 | nav 高 67 | nav 高 64 | ≤1199 使用菜单导航；Tablet 顶栏高 72 |
| Formats 六张功能卡片 | 三列；padding 29 × 20；内部 gap 12 | 单列，内容自然撑高 | 圆角 4；边框 1 |
| Formats 主展示区域 | 跨列展示 | 单列展示 | 圆角 8；与下方六张卡片分开设置 |
| SDK 示例 Tab | 高 44 | 高 26 | 圆角 2；选中态实色，未选中态透明底描边 |
| SDK 复制按钮 | 高 44 | 32 × 32；反馈文字允许横向扩展 | 圆角 4；复制后显示结果 |
| FAQ 问题行 | 上下 padding 20；单行高 68 | 上下 padding 20；单行高 68 | 圆角 0；长问题自然换行 |
| 键盘焦点 | `:focus-visible` | 同桌面 | 基础链接和按钮使用 2px 外轮廓；组件可定义自己的焦点样式 |

## 5. 交互与动效

| 模块 | 规则 |
| --- | --- |
| 中英文 | 英文与数字默认使用 Geist Sans；使用者明确指定的目标才使用 Geist Mono；中文使用 Frex；章节英文标签、品牌名与代码保留其表达形式 |
| 导航菜单 | 提供打开和关闭状态；支持 Escape 关闭及焦点返回 |
| SDK 示例 | Python、Node.js、CURL 切换对应代码；保留缩进、换行与代码区滚动；复制反馈对应所选代码；字体遵循显式指定规则 |
| FAQ | 原生展开和收起；问题行支持键盘操作 |
| 定价计算器 | 滑块输入与价格、文档数量同步；单位与结果明确显示 |
| 文档叙事 | 原始文档、结构、来源关联与汇总按阶段推进；手机手势按单个阶段切换 |
| 页面进入与滚动 | 使用组件各自的进入、文字揭示和滚动反馈；时长与节奏按组件定义 |
| 减少动态效果 | 遵循 `prefers-reduced-motion`，保留内容可见与基本操作 |
| 深浅主题 | 用户明确选择优先，否则跟随系统；主题与语义颜色同步至嵌入演示 |

## 6. 页面配置与实现入口

| 配置 | 值 |
| --- | --- |
| 英文字体 | `font: 'geist'` |
| 中文字体 | `chineseFont: 'frex-sans-gb'` |
| 品牌色板 | `palette: 'main-3'`，对应 Mineral Green |
| 样式设置存储 | `knowhere-page-style` |
| 主题选择存储 | `knowhere-color-theme` |
| 样式面板 | `.dialkit-panel` 隐藏，字体与颜色设置逻辑生效 |

| 内容 | 实现入口 |
| --- | --- |
| 页面结构与内容 | [LandingPage.jsx](./src/landing/LandingPage.jsx) |
| 全局样式、排版与响应式 | [landing.css](./src/landing/landing.css) |
| 字体接入与默认设置 | [index.html](./index.html)、[page-style-controller.jsx](./src/page-style-controller.jsx) |
| 色板与深色语义色 | [colors.js](./src/colors.js) |
| 导航、语言与页面交互 | [landing-interactions.js](./src/landing/landing-interactions.js) |
| 文档结构演示 | [document-map.jsx](./src/landing/document-map.jsx)、[document-scan-section.html](./document-scan-section.html) |
| Canvas 文字与图形 | [landing-canvas.js](./src/landing/landing-canvas.js) |
| Integration 代码与动效 | [catenoid-field-embed.jsx](./src/landing/catenoid-field-embed.jsx)、[catenoid-field-embed.css](./src/landing/catenoid-field-embed.css) |
| 结尾 CTA 螺旋 | [converging-helix.js](./src/landing/converging-helix.js)、[converging-helix-embed.jsx](./src/landing/converging-helix-embed.jsx) |

复用现有组件、字体变量与颜色 token。组件的明确设置优先于通用规则；手机和平板在各自断点内适配。Logo、素材、文案、内容顺序、导航目标与演示数据按页面定义保留。

## 7. 执行与验收要求

- **修改前**：读取相关设计规则与实现入口，检查已有工作区改动，简短说明修改范围和验证方式。
- **应用规则**：使用者本次明确要求优先，其次是组件的具体规定，再次是全局通用规则。未规定的属性优先沿用相近组件；不得自行扩展字体、色板或视觉风格。文档与代码不一致时说明差异，不擅改规则或批量覆盖实现；只有冲突影响本次结果且无法根据已有要求判断时才提问。
- **控制范围**：复用现有组件和 token，只修改任务涉及的内容。手机和平板调整放在各自断点内，并检查桌面结果；组件的明确尺寸不被通用建议替换。
- **验证界面**：运行时代码变更执行 `npm run build`，并在浏览器检查受影响区域。字体检查实际加载、渲染字体、换行与中英混排；响应式检查桌面 `1280 × 720`、手机 `390 × 844`，涉及平板时增加对应视口。涉及语言、主题或交互时检查对应切换与状态，涉及嵌入页或 Canvas 时分别核对。
- **仅改文档**：检查文件引用、规则一致性和 `git diff --check`，无需为文字变更启动页面或运行构建。
- **交付时**：说明修改内容、实际检查结果与未验证项。构建通过不等于视觉验收；未完成浏览器检查时明确说明，不把源码声明当作渲染结果。
