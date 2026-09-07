# KNOWHERE Landing Page 设计规范

更新：2026-09-07 · 适用于当前 Landing Page

**对齐状态：尚未与运行时实现完全统一。** 本文包含已确认的设计规则和已核对的页面实测值；字体仍有待实现差异，详见第 7 节。核对基准为 main 的 `260a237` 本地预览，尚未核实线上部署是否与该版本一致。

本文件集中记录当前设计规则与页面设置。字体以本次确认的 **Geist Sans、Geist Mono、Frex Sans GB VF** 为准；字号、颜色和布局参考最新 main 的页面实测。旧版设计快照不再作为当前规范，历史内容通过 Git 历史查阅。

## 1. 使用方式与核对基准

| 项目 | 基准 |
| --- | --- |
| 代码版本 | [main / 260a237](https://github.com/zolplay-labs/knowhere-landing/tree/260a23793d0da7fb86eb7561a64aea201089171a) |
| 页面入口 | `index.html` → `src/main.jsx` → `src/App.jsx` → `src/landing/LandingPage.jsx` |
| 样式与响应式 | `src/landing/landing.css`，以最终层叠结果为准 |
| 字体、颜色默认设置 | `src/page-style-controller.jsx` |
| 颜色数据 | `src/colors.js`：`colorHex`、`colors`、`colorAlpha`、`materialDark` |
| 本次页面核对 | 最新 main 的本地预览；桌面 `1280 × 720`、手机 `390 × 844`；中英文切换、桌面浅色与深色 |
| 核对边界 | 记录主要文字与布局的 computed style，并抽查渲染效果；不代表逐字形字体来源、所有交互或线上部署均已验收 |

下文的“规范”表示应采用的规则；“实测”表示该版本页面的现状。两者有差异时，统一记录在第 7 节，不能把旧代码中的字体声明直接当成新的设计规则。本次更新范围为本文档。

## 2. 字体与排版

### 2.1 全局字体

| 内容 | 唯一指定字体 | 使用范围 |
| --- | --- | --- |
| 英文常规文字 | **Geist Sans** | 标题、正文、导航、按钮、卡片说明、FAQ |
| 英文等宽文字 | **Geist Mono** | 代码、章节标签、技术标识、需要等宽对齐的数据 |
| 中文文字 | **Frex Sans GB VF** | 所有中文标题、正文、导航和组件文字 |

混排按字符分工：英文与数字使用对应的 Geist 字体，中文使用 Frex。价格等数字不因“是数字”就一律切换为 Mono，应按所在组件的文字角色设置。

- 常用字重：`400 Regular`、`500 Medium`、`600 SemiBold`。具体角色见下表，不把所有标题统一加粗。
- 章节标签保留现有方括号与英文大写；普通标题保留页面原有大小写。
- `sans-serif` / `monospace` 只是加载失败时的通用兜底，不是新增设计字体。
- 已有 Logo、第三方标志与原始文档图片中的文字保持素材本身的形态，不据此扩展网页字体体系。

### 2.2 设计名称与 Web 接入名称

中文设计名称统一写 **Frex Sans GB VF**。当前代码的 CSS family 名称是 `"Frex Sans GB"`，加载以下文件：

| 文件 | 声明字重 | 声明样式 | 加载策略 |
| --- | ---: | --- | --- |
| `public/fonts/FrexSansGB-Regular.woff2` | 400 | normal | swap |
| `public/fonts/FrexSansGB-Medium.woff2` | 500 | normal | swap |
| `public/fonts/FrexSansGB-SemiBold.woff2` | 600 | normal | swap |

这是当前三个独立字重文件的接入记录，不能写成已加载单一 VF 文件，也不能据此假定支持完整的可变字重轴。设计字体名称与 CSS family 别名应保持明确映射。

以下是**规范目标映射**，不是对当前代码已全部实现的声明：

```css
:root {
  --sans: "Geist Sans", "Frex Sans GB", sans-serif;
  --mono: "Geist Mono", "Frex Sans GB", monospace;

  /* 兼容既有变量名；不会引入第四种字体。 */
  --serif: var(--sans);
  --figma-display: var(--sans);
  --figma-mono: var(--mono);
}
```

### 2.3 当前页面字号层级

单位均为 px；`字号 / 行高` 分别列出。尺寸来自上述两个视口的实测，字体按 2.1 的规范使用。中文沿用对应角色的字号和字重。

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
| 当前可见 SDK 代码示例 | 12 / 16 | — | 400 | normal |
| 页脚版权 · `.prototype-notice` | 12 / normal | — | 400 | 0.96 |

`—` 表示本次未单独记录该项的手机数值，不表示隐藏。SDK 代码应使用 Geist Mono，当前实现差异见第 7 节。示意图内部的微型文字、原始文档缩略图与 Canvas 标签属于各自组件，不作为全站正文的字号标准。

## 3. 颜色与主题

### 3.1 基础色板

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

### 3.2 页面语义色与实际使用

“品牌主色”和“每个按钮的实际背景”分开记录，不能用一个主色值覆盖所有组件。

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
| 结尾 CTA 标签 | `coral-signal/500` 底、白字 | 按该组件深色样式设置 |

局部表面不等于全页背景：Document Map 层级节点使用 `--trace-hierarchy-surface: #FAFAFA`；Process 插图的弱化表面使用 `mist-white/300`。这两个设置不替换全局 `--paper`。

### 3.3 黑白透明度

| 色系 | 可用透明度（%） | CSS 命名 |
| --- | --- | --- |
| Black | 1、2、3、6、10、20、30、40、50、60、70、80、90、100 | `--black-{opacity}` |
| White | 3、6、10、20、30、40、50、60、70、80、90、100 | `--white-{opacity}` |

用于边框、分隔线、覆盖层、阴影及深浅表面上的文字。Black 的 1% 和 2% 不能遗漏，也不要假定 White 存在相同色阶。组件已使用透明度线条时，不要直接改成不透明的 `--line`。

### 3.4 深色语义映射

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

显式主题选择存储于 `knowhere-color-theme`；没有显式选择时跟随 `prefers-color-scheme`。主题与语义变量同步至嵌入的文档演示。部分旧组件会在深色模式下重绑定基础变量，查验时应同时检查最终 computed style；新增主题规则优先使用语义 token。

## 4. 栅格、间距与响应式

### 4.1 页面栅格

| 档位 | 宽度 | 列数 | 列间距 | 页面基准边距 |
| --- | --- | ---: | ---: | ---: |
| Desktop | ≥1200 | 12 | 20 | 80 |
| Tablet | 768–1199 | 8 | 16 | 24 |
| Mobile | ≤767 | 4 | 16 | 16 |

| 设置 | 当前值 / 规则 |
| --- | --- |
| 内容最大宽度 | `--content-max: 1280px` |
| 栅格变量 | `--layout-grid-columns`、`--layout-grid-gap`、`--layout-grid-edge` |
| 内容宽度 | `min(1280px, 视口宽度 − 两侧基准边距)` |
| Mobile 默认排布 | 卡片与图文模块占满四列，按单列堆叠 |
| Tablet | 使用自己的八列布局；不把四列手机布局直接拉宽 |
| 全宽区块 | 外层允许铺满，内部内容按区块的栅格对齐 |

这是共用栅格基准，不表示每个区块都已完全服从。Hero、Integration、结尾 CTA 等有自己的边距设置；见下面的实测表。不要为了套用通用栅格而静默重排现有页面。

### 4.2 桌面 → 手机垂直间距映射

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

### 4.3 当前区块设置

下表是页面实测的具体设置，优先用于复现当前页面；不能把所有区块强制改成一个统一 padding。数值顺序均为 **上 / 右 / 下 / 左**。

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
- `#formats` 手机顶部 `40px` 是最新 main 的局部设置；外层滚动容器顶部 margin 为 0。
- 表中的顶部 margin 不等于两区块的最终视觉距离；还应计入相邻 padding、滚动容器与 sticky 区域占位。

## 5. 组件外观与状态

| 组件 / 属性 | 当前设置 | 使用说明 |
| --- | --- | --- |
| Hero 按钮 | 15 / 24，500；padding 8 × 16；圆角 1；桌面实测高 44 | 主按钮实色，次按钮描边；手机最小高度 44 |
| 手机 Hero 按钮组 | 两按钮同行、等分空间，gap 12 | 不沿用旧版整列堆叠描述 |
| 导航高度 | 桌面 nav 实测 67；Tablet 顶栏 CSS 72；Mobile nav 实测 64 | ≤1199 切换菜单导航 |
| Formats 功能卡片 | 桌面三列；padding 29 × 20；gap 12；圆角 4；边框 1 | 文字随内容自然撑高；手机默认单列 |
| Formats 主展示区域 | 圆角 8 | 与下方六张功能卡片的圆角分开记录 |
| SDK 示例 Tab | 高度 / 最小高度 44；圆角 2 | 选中态实色，未选中态透明底描边 |
| SDK 复制按钮 | 高度 / 最小高度 44；圆角 4 | 明确呈现复制结果，保持原有代码内容 |
| FAQ 问题行 | 上下 padding 20；实测最小高度 68；圆角 0 | 展开与收起状态保持可辨识 |
| 阴影 | 上述主要按钮、卡片和 FAQ 实测均为 none | 通过底色与细边框分层，不额外添加统一投影 |
| 焦点 | 使用既有 `:focus-visible` 样式 | 基础链接 / 按钮规则为 2px 外轮廓；局部组件按自身规则 |

圆角不是一个全局常量：当前存在 0、1、2、4、8 等不同组件值，应按角色保留。手机交互目标以至少 44px 为验收目标，图标视觉尺寸与可点击区域分开设置。

## 6. 动效与页面默认设置

| 设置 | 当前规则 / 来源 |
| --- | --- |
| 默认英文字体选项 | `font: 'geist'` |
| 默认中文字体选项 | `chineseFont: 'frex-sans-gb'` |
| 默认色板选项 | `palette: 'main-3'`，映射 Mineral Green |
| 样式持久化 | `knowhere-page-style`；核对默认效果时避免旧浏览器设置干扰 |
| 样式控制面板 | `.dialkit-panel` 隐藏，但字体 / 颜色设置逻辑仍执行 |
| 页面动效 | 沿用组件已有的进入、滚动与状态切换；不把旧版时间线当成全站统一时长 |
| 减少动态效果 | 遵循 `prefers-reduced-motion`；保留内容可见与基本操作 |
| Hero 粒子与管线 | `page-style-controller.jsx`、`landing-canvas.js`、对应 Hero 组件负责参数 |
| 结尾 CTA 螺旋 | `converging-helix.js` 与 `converging-helix-embed.jsx`；公开页面使用源码中设定的参数 |

手机布局单独适配；修改手机字号、间距或交互时，应写在对应断点内，保留桌面的既有结果。更换字体加载方式后，需要复查换行、数字宽度、代码对齐与中文混排。

## 7. 当前实现差异与维护检查

这些是待对齐项，**不属于允许扩展的设计选项**：

| 差异 | 本次证据 | 应对齐到的规则 |
| --- | --- | --- |
| 等宽变量被覆盖 | `applySettings()` 把 `--mono`、`--figma-mono` 与 Sans 一起写入同一字体栈；可见 SDK 代码的 computed family 为 Geist Sans | 等宽角色独立映射到 Geist Mono |
| Geist Mono 加载未建立完整证据 | 章节标签声明 Geist Mono，但依赖与本次可读样式表中未发现对应字体 face | 补齐或核实字体资源加载；不能仅凭 family 字符串认定实际字形使用了该字体 |
| 存在其他字体残留 | 入口有旧字体请求，源码有试验字体导入 / 局部覆盖；`#formats` 说明段落的 computed family 仍优先指定其他字体 | 网站正文、组件与控制器只使用 2.1 指定的字体体系 |
| 中文设计名称与资源形态不同 | 设计名为 Frex Sans GB VF；当前 family 别名为 Frex Sans GB，声明三个独立字重文件 | 按 2.2 维护映射；接入真正 VF 文件后再更新资源记录 |
| 布局存在局部例外 | Hero、Integration 与结尾 CTA 的实测边距不同于共用栅格；Formats 手机顶部为 40 | 以 4.3 的具体记录复现，不把通用栅格描述为所有组件的现状 |

后续更新本文时：

1. 写清代码版本、视口、语言与主题；从实际入口和最终层叠结果提取设置。
2. 字体分开核对“设计指定”“CSS family”“字体资源加载”；颜色从 `src/colors.js` 提取。
3. 桌面 / 手机分别列值，组件例外写在同一表内，避免在文档首尾不断追加互相覆盖的规则。
4. 只有运行时代码与页面核对都完成后，才将第 7 节对应差异标记为已对齐。
