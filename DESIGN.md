# KNOWHERE Landing Page 设计规范

适用于 Landing Page、页面组件及嵌入文档演示。视觉以清晰排版、细边框、克制的表面层级和绿／青色体系为主；文档、结构图与来源关联用于说明产品能力。

## 1. 字体与排版

### 1.1 字体分工

| 内容 | 唯一指定字体 | 使用范围 |
| --- | --- | --- |
| 英文与数字的默认字体 | **Geist Sans** | 所有未被使用者明确指定为 Mono 的英文和数字 |
| 使用者明确指定的 Mono 文字 | **Geist Mono** | 章节标签，以及其他由使用者明确指定的文字、区域或组件；不扩展到其他位置 |
| 中文文字 | **Frex Sans GB VF** | 所有中文标题、正文、导航和组件文字 |

混排时，英文与数字默认使用 Geist Sans，中文使用 Frex。**只有使用者明确指定某段文字、区域或组件使用 Mono 时，才使用 Geist Mono。** 章节标签现已明确指定使用 Geist Mono；代码、技术标识、价格和对齐需求仍不构成自动启用 Mono 的理由，不得仅凭内容类型、HTML 标签或 AI 判断套用 Mono。未明确指定时保持默认字体。

- 常用字重：`400 Regular`、`500 Medium`、`600 SemiBold`。具体角色见下表，不把所有标题统一加粗。
- 章节标签统一使用 Geist Mono，保留现有方括号与英文大写；中文回退到 Frex。普通标题保留页面原有大小写。
- `sans-serif` / `monospace` 只是加载失败时的通用兜底，不是新增设计字体。
- 已有 Logo、第三方标志与原始文档图片中的文字保持素材本身的形态，不据此扩展网页字体体系。

### 1.2 字体接入

| 设计名称 | CSS family | 字重范围 | 字体来源 |
| --- | --- | --- | --- |
| Geist Sans | `"Geist"` | 100–900 | [Geist · Google Fonts](https://fonts.google.com/specimen/Geist) |
| Geist Mono | `"Geist Mono"` | 100–900 | [Geist Mono · Google Fonts](https://fonts.google.com/specimen/Geist+Mono) |
| Frex Sans GB VF | `"Frex Sans GB VF"` | 100–700 | `public/fonts/FrexSansGB-VF.woff2` |

Geist Sans 在 Google Fonts 中的字体名称为 **Geist**；CSS 使用 `"Geist"`。中文字体使用单一可变字体文件，字重通过 `font-weight` 设置。

Geist Mono Regular（400）另提供 Google Fonts 官方 Latin 子集的本地兜底文件 [GeistMono-Regular.woff2](./public/fonts/GeistMono-Regular.woff2)，授权见 [GeistMono-OFL.txt](./public/fonts/GeistMono-OFL.txt)；原有 Google Fonts 100–900 可变字重接入保留。

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
| 章节标签 · `.section-no` · Geist Mono | 15 / 24 | 15 / 24 | 400 | normal |
| 结尾 CTA 标签 · `#final-cta .section-no` · Geist Mono | 14 / 20 | 14 / 20 | 400 | normal |
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

### 2.2.1 Landing 亮暗色映射：同站页面对齐基准

共享 Nav bar 的暗色主按钮统一使用 primary `#23D6B1` / on-primary `#011711`，与 Hero 主按钮保持相同的默认、hover、pressed 映射；所有应用从 `shared/site-chrome/` 复用该设置。

以下依据 `src/colors.js` 与 `src/landing/landing.css` 的实际主题及按钮覆盖。按用途映射，不按浅色色值全局替换；基础色板保持原始 Hex。

| 用途 / 变量 | 亮色 | 暗色 |
| --- | --- | --- |
| 品牌装饰、图标 `--mineral-green-500` | `#19A88B` | `#1DBE9D`（400） |
| 主操作、数据强调 `--page-primary` / `--accent` | `#19A88B` | `#23D6B1`（primary / 300） |
| 主操作前景 | 白色；Hero 黑底按钮为白字 | `#011711`（on-primary） |
| 主操作 hover / pressed | 按组件：Hero `#33483D` / `#011110` | primary 92% / 88% 与 on-primary 混合 |
| 珊瑚信号 `--coral-signal-500` | `#FF634A` | `#FF897D`（400）；错误语义另用 error |
| 普通控件底 / hover / pressed | `#FFFFFF` / `#F7F8F4` / hover 97% 与黑色混合 | `#021D1D` / `#042626` / `#073231` |
| 普通控件边框 / hover 边框 | `#DEDFD9` / `#B1B7A9` | `#083B3A` / `#888A82` |
| Hero 透明次按钮 hover / pressed | black 3% / 6% | on-surface 6% / 10%（组件明确状态） |
| 中性透明色 black/N | 黑色 × N% | `#F9FAF5`（on-surface）× N%；不是纯白 |
| 白色透明表面 white/N | 白色 × N% | `#010909`（surface）× N%；明确白字须局部保留 |
| 基础 mist-white 50 / 100 / 200 | 对应基础色板 | `#000000` / `#011110` / `#021D1D` |
| 基础 mist-white 300 / 400 / 500 | 对应基础色板 | `#042626` / `#042626` / `#073231` |
| 基础 mist-white 600 / 700 / 800 | 对应基础色板 | `#083B3A` / `#888A82` / `#BBBCB3` |
| 基础 mist-white 900 / 950 | 对应基础色板 | 均为 `#F9FAF5` |

页面 `paper / ink / muted` 使用 2.2 的语义映射，优先于基础 mist-white 表面重绑定。Landing 结尾 CTA 是局部特例：绿色背景 `#12846C → #011711`，白色按钮保持白底深字；不套用到普通中性区块。

Pricing 对齐：`--green` 用品牌装饰映射，`--green-dark` 用暗色 primary；主按钮分别绑定默认、hover、pressed 与前景，不能用全局 `.button:hover` 覆盖组件状态。珊瑚色与中性透明色跟随上表。Pricing 现有中性结尾 CTA 保留 black/3 表面；其绿色按钮遵循主操作映射。收费说明与企业绿色面板跟随品牌色；收费说明的文字与图标在亮暗模式均使用白色，其按钮保持白底深字及白色组件的 hover / pressed 状态。企业卡片的文字与图标在亮暗模式均使用白色，卡片按钮保持白底深字。Pricing 暗色导航主按钮的 `--chrome-primary` / `--chrome-on-primary` 绑定页面主操作变量，默认、hover、pressed 与页面主按钮一致；其他共享导航与 Footer 规则继续使用 `shared/site-chrome/`。

Blog 对齐：正文容器随 `html[data-theme]` 切换，页面背景 `#FFFFFF → #010909`、标题 `#2E2E2C / #1B1C1A → #F9FAF5`、正文与辅助文字暗色为 `#BBBCB3`；透明线条保持原透明度并映射为 on-surface。品牌装饰使用 `#1DBE9D`，导航主按钮、筛选选中态与分页当前项使用 primary `#23D6B1` / on-primary `#011711`。首页与文章详情共用映射，封面图片与封面内排版保留各自配色。

### 2.3 黑白透明度

| 色系 | 可用透明度（%） | CSS 命名 |
| --- | --- | --- |
| Black | 1、2、3、6、10、20、30、40、50、60、70、80、90、100 | `--black-{opacity}` |
| White | 1、2、3、6、10、20、30、40、50、60、70、80、90、100 | `--white-{opacity}` |

用于边框、分隔线、覆盖层、阴影及深浅表面上的文字。Black 与 White 使用相同的透明度色阶，均包含 1% 和 2%。组件已使用透明度线条时，不要直接改成不透明的 `--line`。

主题切换时，透明中性色保持相同透明度：浅色模式使用的 `black/N`，在暗色模式必须映射为 `white/N`，例如 `black/3 → white/3`、`black/6 → white/6`、`black/10 → white/10`。不得在切换色相的同时擅自提高或降低透明度。实现中继续使用 `--black-{opacity}` 语义变量，并在 `html[data-theme="dark"]` 下将其重绑定到 `on-surface` 的同档透明度；不要在组件选择器中散落 `rgba(0, 0, 0, …)` 与单独的暗色补丁。

该字体与透明中性色规则同时适用于明确要求与 Landing 对齐的同站应用；当前 Blog 已采用，其他 Blog 布局、尺寸和组件设置仍遵守自身实现，不由本条批量覆盖。

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

显式主题选择统一存储于 `knowhere-color-theme` Cookie（当前 Workers 站点共享 `knowhere-landing.workers.dev` 域，正式同站域名共享 `knowhereto.ai`），各应用 localStorage 仅作兼容回退。共享 Cookie 优先于应用旧偏好；没有显式选择时跟随 `prefers-color-scheme`。首次渲染、页面返回、窗口重新聚焦时读取统一偏好，Blog 详情页使用同一初始化逻辑。主题与语义变量同步至嵌入的文档演示。组件主题配色优先使用语义 token。

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

按钮、输入框与 Tab 的尺寸和状态可在 [组件规范 HTML](./public/component-spec.html) 中对照查看。本文为规范正文，HTML 为可视化参考；标为“扩展建议”的档位或交互尚未正式确定，不视为业务组件已经支持。

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

### 4.1 按钮与输入框

本节以 Login 的输入框、白底按钮和黑底按钮为基础，作为 Login 与 Landing 后续统一通用按钮、输入框的规范。浅色黑底主按钮、白底次按钮采用本节的状态与 token；Hero 的高度、圆角、透明描边次按钮等明确局部设置仍按上表及 §2.2 保留。深色页面继续使用 §2.4 的语义色，不据此推导尚未定义的 Login 深色状态；其他独立应用不自动套用。

实现入口：[form-controls.tsx](./apps/login/src/components/form-controls.tsx)、[form-controls.css](./apps/login/src/components/form-controls.css)。组件分别为 `Input`、`Button variant="white"` 和 `Button variant="black"`。可在 Login 应用的 `/components` 页面查看全部状态和实际交互；正式登录页不增加状态控制器。

#### 大、中、小尺寸

高度包含描边，单位为 px；文字格式为“字号 / 行高”。表单按钮字重 500，输入框字重 400；三档共用圆角 2、描边 1、默认无投影。

| 组件 | 档位 | 高度 | 字号 / 行高 | 水平内边距 | 图标与间距 / 辅助文本 | 状态 |
| --- | --- | ---: | --- | ---: | --- | --- |
| 按钮 | L 大号 | 46 | 15 / 24 | 13 | 加载图标 16；图文间距白 11、黑 13 | 现有 Login 基础尺寸 |
| 按钮 | M 中号 | 40 | 14 / 20 | 12 | 图标 16；图文间距 8 | 扩展建议：常规表单、工具栏 |
| 按钮 | S 小号 | 32 | 13 / 20 | 10 | 图标 16；图文间距 6 | 扩展建议：桌面紧凑操作 |
| 输入框 | L 大号 | 46 | 桌面 18 / 27；手机 16 / 24 | 13 | 辅助文本 14 / 20；距框 8 | 现有 Login 基础尺寸 |
| 输入框 | M 中号 | 40 | 16 / 24 | 12 | 辅助文本 14 / 20；距框 8 | 扩展建议：常规数据录入 |
| 输入框 | S 小号 | 32 | 14 / 20 | 10 | 辅助文本 14 / 20；距框 8 | 扩展建议：桌面紧凑筛选 |

L / M / S 是本次整理的档位名称；现有 `Button`、`Input` 尚未提供通用 `size` 属性。HTML 中的 M / S 通过预览样式展示，不自动替换 Landing 已有组件的局部尺寸。

#### L 档基础尺寸与 token

| 属性 | 输入框 | 白底按钮 | 黑底按钮 |
| --- | --- | --- | --- |
| 高度 / 圆角 / 描边 | 46 / 2 / 1，绑定 `--control-height`、`--control-radius`、`--control-border-width` | 同输入框 | 同输入框 |
| 水平内边距 | 13，绑定 `--control-padding-inline` | 同输入框 | 同输入框 |
| 文字 | 桌面 18 / 27，手机 16 / 24，400；`--type-body-*` | 15 / 24，500；`--type-control-*`、`--font-weight-medium` | 同白底按钮 |
| 图标与文字间距 | 不强制内置图标 | 11 | 13 |
| 默认底色 | `--control-surface · #FFFFFF` | 同输入框 | `--control-black-surface · #1B1C1A` |
| 默认文字 | `--control-ink · #2E2E2C` | 同输入框 | `--control-surface · #FFFFFF` |
| 默认描边 | `--control-border · #DEDFD9` | 同输入框 | 与黑底同色 |
| 占位文字 | `--control-placeholder · #A2A49C`，字号与输入文字相同 | — | — |
| 阴影 | 无 | 无 | 无 |

字体继承 `--font-sans`：英文和数字为 Geist，中文为 Frex。颜色使用组件语义 token；上表中的局部色值保留 Login 已确认的外观，不反向改写全局色板。背景、文字与边框过渡使用 `--control-motion-duration · 150ms`。

已有基础色优先引用：白底及输入框只读底 → `mist-white/50`，正文 → `mist-white/900`，黑底 → `mist-white/950`，输入框禁用底 → `black/6`，输入框禁用文字 → `mist-white/700`。白按钮按下填充色在悬停色上叠加 3% 黑色，保留悬停的色相与描边，不再使用 `mist-white/300`。按钮禁用底色 → `black/10`、文字 → `black/40`、描边 → `black/3`；图标保留原色并使用 `--control-disabled-icon-opacity: 0.5`。输入框与白按钮已确认的局部边框、占位和悬停色保留为组件 token。

```css
--control-surface-hover: #F7F8F4;
--control-surface-pressed: color-mix(in srgb, var(--control-surface-hover) 97%, #000);
--control-disabled-surface: var(--black-6); /* rgba(0, 0, 0, 0.06) */
```

白按钮按下填充色约为 `#F0F1ED`，以混色表达式为准；输入框禁用使用背景色的 6% 黑色透明度，不给整个组件设置 `opacity: 0.06`。以上两项及 §4.2 的 Tab 按下填充色已按 2026-09-09 的反馈在 HTML 中修订，Login 与 Landing 业务实现尚待同步；记录规范不等于业务页面已应用。

#### 输入框状态

| 状态 | 视觉与行为 |
| --- | --- |
| 默认 / 空值 | 显示占位文字；标签始终可见 |
| 已填写 / 自动填充 | 使用正文色，保持 `--control-surface · #FFFFFF` 白底，不新增填充色；用白色内嵌覆盖层消除浏览器自动填充底色，不产生额外描边 |
| 悬停 | 可编辑且无错误时，描边为 `--control-border-hover · #B1B7A9` |
| 聚焦 | 仅将原有 1px 描边改成 `--control-focus → --mineral-green-500 · #19A88B`；`outline: none`、`box-shadow: none`，鼠标和键盘聚焦都不得叠加第二层描边 |
| 错误 | 失焦时描边使用 `--control-error → --login-error-color → --coral-signal-600 · #DD3B00`；输入框下方 8px 显示同色辅助文本，字号 / 行高绑定 `--type-meta-* · 14 / 20` |
| 错误时聚焦 | 描边仍为主色绿，红色辅助文本保留；修正为有效值后清除错误 |
| 只读 | 原生 `readOnly`；底色 `--control-readonly-surface → --control-surface · #FFFFFF`，保留正常文字；可聚焦、选择和复制，不能编辑 |
| 禁用 | 原生 `disabled`；底色 `--control-disabled-surface → black/6 · rgba(0, 0, 0, 0.06)`、文字 `--control-disabled-ink · #888A82`、默认描边；不可编辑或进入 Tab 顺序，无悬停反馈 |

状态优先级为禁用 → 聚焦 → 错误 → 悬停 → 默认。校验失败时使用 `aria-invalid`，辅助文本用 `aria-describedby` 关联、`role="alert"` 宣告；提交空邮箱或错误格式后聚焦该输入框。错误通过当前表单内的红色辅助文本展示，不使用浏览器气泡、Toast 或第二步页面。

#### 按钮状态

| 状态 | 白底按钮 | 黑底按钮 |
| --- | --- | --- |
| 默认 | 白底、深色文字、1px 浅色描边 | 黑底、白字、同色描边 |
| 悬停 | `--control-surface-hover · #F7F8F4` 底，`--control-border-hover` 描边 | `--control-black-hover · #33483D` 底和描边 |
| 按下 | `--control-surface-pressed`：悬停底色叠加 3% 黑色，约 `#F0F1ED`；保留悬停描边与文字，下移 1px | `--control-black-pressed → --deep-teal-900 · #011110` 底，悬停描边，下移 1px |
| 键盘聚焦 | 保留当前底色，使用主色绿 2px 外轮廓、间隔 4px | 同白底按钮；输入框的单层描边例外不覆盖按钮的键盘焦点规范 |
| 禁用 | 原生 `disabled`；底色 `--control-button-disabled-surface → black/10`、文字 `--control-button-disabled-ink → black/40`、描边 `--control-button-disabled-border → black/3`；图标原色透明度为 50%，禁止悬停 / 按下反馈 | 同白底按钮 |
| 加载 | `loading` 同时设置 `disabled` 与 `aria-busy`；保留默认配色，以 16px 转圈图标替代原图标；调用方传入“发送中…”等进行中文案 | 同白底按钮 |

状态优先级：加载 / 禁用阻止交互；可用时按下覆盖悬停；键盘焦点轮廓可与当前可用状态叠加。按钮宽高在状态变化时保持不变。加载与禁用不能触发点击回调或重复提交；恢复后重新允许操作。加载指示器以 800ms 一圈旋转，系统开启减少动态效果时停止旋转，保留图标、进行中文案及忙碌语义。操作结果由表单展示，失败在输入框下方提示，不把按钮改成长期红色或绿色。

#### Login 表单流程

正式接入后，只在真实异步请求期间启用加载态。`/components` 中的加载开关仅用于组件验收；Login 当前用 1.4 秒模拟异步请求演示发送流程，不实际发送邮件。

Google、GitHub 按钮尚未接入 OAuth；点击时不显示 preview 或未接入认证的提示，也不改变邮箱表单状态。

邮箱按钮默认文案为 `Sign in with Email` / `使用邮箱登录`。有效邮箱提交后显示 `Sending…` / `发送中…` 和转圈图标，设置 `disabled`、`aria-busy`，禁止重复点击或回车提交。发送期间邮箱只读，Google、GitHub 按钮保持可用；邮箱发送按钮独立禁用以防止重复提交。请求完成后恢复操作，按钮显示 `Resend email` / `重新发送邮件`；再次发送沿用相同的发送状态。正式接入后，必须在服务确认发送成功后展示成功结果，失败仍使用输入框下方的红色提示。

成功反馈常驻在邮箱按钮下方，间距 16px，图标与文字作为整体相对页面水平居中，仅保留左侧绿色成功图标和 `Magic link sent, please check your email` / `登录链接已发送，请查收邮件` 一句话，无卡片底色、描边、邮箱地址或额外辅助文字。使用 `role="status"` 礼貌宣告；不自动消失、不提供关闭按钮，也不新增第二步页面或临时 Toast。修改邮箱后清除之前的发送结果，按钮恢复初始文案。14 / 20 字号、文字颜色及绿色成功图标绑定现有组件与颜色 token。

### 4.2 SDK Tab

沿用 SDK 示例的矩形 Tab，不采用胶囊圆角。实现入口：[catenoid-field-embed.css](./src/landing/catenoid-field-embed.css)、[catenoid-field-embed.jsx](./src/landing/catenoid-field-embed.jsx)；页面局部尺寸覆盖位于 [landing.css](./src/landing/landing.css)。字体遵循 §1，英文和数字默认 Geist Sans，中文 Frex，不因代码示例而自动使用 Mono。

#### 大、中、小尺寸

三档共用圆角 2、描边 1、字重 400，默认无投影。高度依据 §4，宽度、文字及间距依据 SDK 的局部样式；M 为补齐档位的扩展建议。

| 档位 | 高度 / 宽度 | 字号 / 行高 | 上下 / 水平内边距 | 项间距 | 状态 |
| --- | --- | --- | --- | ---: | --- |
| L 大号 | 44 / 65 | 12 / 16 | 4 / 6 | 10 | 现有桌面规范 |
| M 中号 | 36 / 65 | 12 / 16 | 4 / 6 | 10 | 扩展建议 |
| S 小号 | 26 / 65 | 12 / 16 | 4 / 6 | 6 | 现有手机局部规范 |

26px 是 SDK 局部视觉高度。若扩展到一般触摸界面，建议扩大点击区域，不直接将紧凑视觉高度作为触摸目标；页面断点的 `min-height` 覆盖需在接入时核对，不据此改写本表尺寸。

#### 状态

| 状态 | 外观与行为 | 依据 / 状态 |
| --- | --- | --- |
| 默认 / 未选中 | 透明底；文字与 1px 描边为 `mineral-green/500 · #19A88B` | 现有 SDK 样式 |
| 悬停 | 未选中项的文字与描边加深为 `mineral-green/700 · #0A6351`，保持透明底 | 现有 SDK 样式 |
| 选中 | `mineral-green/500 · #19A88B` 实底及同色描边，白字；显示对应面板 | 现有 SDK 样式 |
| 按下 | 未选中且可用时，填充复用 `--control-surface-pressed`，即白按钮的悬停底色叠加 3% 黑色；保留悬停的深绿文字与描边，激活后进入选中态 | 本次反馈确认；HTML 已实现 |
| 键盘聚焦 | 保留当前底色，使用主色绿 2px 外轮廓；轮廓间隔建议 2px | 2px 轮廓沿用项目规则；间隔为扩展建议 |
| 禁用 | 建议复用按钮 token：底 `black/10`、字 `black/40`、边 `black/3`；原生 `disabled`，不进入切换顺序，无悬停 / 按下反馈 | 扩展建议；HTML 已演示 |

禁用优先阻止交互；选中态保留实色底，未选中项的按下反馈覆盖悬停；键盘焦点轮廓可与可用状态叠加。颜色与描边过渡为 140ms；遵循减少动态效果设置。当前没有独立 Tab 加载态；异步数据的加载反馈建议放在对应内容面板中。

#### 键盘与语义

完整 Tab 交互作为扩展建议，在 HTML 中演示以下行为：

- 容器、切换项与面板分别使用 `role="tablist"`、`role="tab"`、`role="tabpanel"`。
- `aria-selected` 表示当前选中项，`aria-controls` 与面板 `id` 对应，面板用 `aria-labelledby` 关联 Tab；仅显示当前面板，其余设置 `hidden`。
- 当前 Tab 的 `tabindex="0"`，其余为 `-1`；Tab 键进入当前选中项，左右方向键循环切换并移动焦点，Home / End 跳至首个 / 末个可用项，跳过禁用项。
- 示例中的 Ruby 仅用于禁用态展示，不代表产品计划支持。

SDK 当前业务实现使用普通按钮、`is-active` 与 `aria-pressed`，尚未实现以上完整 Tab 键盘语义。Landing 旧代码示例的方向键 / Home / End 逻辑可参考 [landing-interactions.js](./src/landing/landing-interactions.js) 中的 `setupTabs`；不可将 HTML 的演示能力记为 SDK 已上线能力。

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
