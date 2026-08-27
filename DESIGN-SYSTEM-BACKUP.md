# KNOWHERE Landing Page Design System Backup

Snapshot date: 2026-08-19 (Asia/Shanghai)
Current color-system update: 2026-08-27 (Asia/Shanghai)

## Current approved color system

This section is the current source of truth for product color decisions and supersedes the legacy Figma color ramps preserved later in this document. The machine-readable OKLCH and exact Hex tokens live in `src/colors.js`.

The four approved `500` swatches are fixed brand decisions. The remaining `50–950` swatches use the same generated color ramps and must not be replaced with similarly named legacy colors.

| Palette | Token | Approved `500` | Primary role |
| --- | --- | --- | --- |
| Mist White 雾白 | `mist-white` | `#F0F2E6` | Page background and warm neutral surface |
| Mineral Green 矿物绿 | `mineral-green` | `#19A88B` | Brand, primary action, positive state, and data highlight |
| Coral Signal 珊瑚红 | `coral-signal` | `#FF634A` | Attention, warning, error, and exceptional data point |
| Deep Teal 深海青 | `deep-teal` | `#083B3A` | Primary text, dark surface, navigation, and high-contrast structure |

Color ramps (`50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`), light to dark:

| Token | Hex values |
| --- | --- |
| `mist-white` | `#FFFFFF`, `#FCFCFA`, `#F9FAF5`, `#F6F7EF`, `#F3F5EA`, `#F0F2E6`, `#BBBCB3`, `#888A82`, `#595A55`, `#2E2E2C`, `#1B1C1A` |
| `mineral-green` | `#CAFFEE`, `#7EFEDD`, `#27EFC6`, `#23D6B1`, `#1DBE9D`, `#19A88B`, `#12846C`, `#0A6351`, `#054437`, `#01251D`, `#011711` |
| `coral-signal` | `#FFF0EF`, `#FFE1DF`, `#FFC7C3`, `#FFA79F`, `#FF897D`, `#FF634A`, `#DD3B00`, `#A42900`, `#731A00`, `#420B00`, `#2D0500` |
| `deep-teal` | `#6DFDFA`, `#3BE8E4`, `#2FBAB8`, `#208C8A`, `#156462`, `#083B3A`, `#073231`, `#042626`, `#021D1D`, `#011110`, `#010909` |

`mist-white/50` is explicitly normalized to `oklch(1 0 0)` / `#FFFFFF`. Generated OKLCH values may round back to a Hex value that differs by one channel step; the approved Hex value always wins at `500`.

### Role constraints

- Mineral Green is the main brand and action family. Use `500` for brand emphasis and `600–700` when stronger action contrast is required.
- Coral Signal is reserved for attention, warning, error, and exceptional states. It is not an alternative primary brand color.
- Deep Teal owns structural dark surfaces and high-contrast hierarchy.
- Mist White owns warm neutral surfaces. A page may intentionally use pure white instead, but that implementation choice does not remove the approved Mist White family from the system.

## Legacy snapshot sources

Sources:

- Figma: `qGdz49VGZZJRUQbKAludMz`, linked node `3:1655`, variable collection `3:891`
- Web implementation: `index.html`
- Verified preview: `http://127.0.0.1:4173/`
- Browser audit viewport: `1280 x 577`

This is a read-only snapshot of the current design inputs. It does not normalize or merge Figma and code. Differences are recorded explicitly so future pages can choose the intended source rather than silently mixing systems.

## 1. Figma variables

Figma currently contains 95 local variables in four collections. All collections have one mode only.

### `basic color` (`VariableCollectionId:3:891`)

Core colors:

| Variable | Value |
| --- | --- |
| `orange/500` | `#FF6600` |
| `gray` | `#FFFFFF` |
| `black` / `black/100` | `#000000` |
| `white` / `white/100` | `#FFFFFF` |
| `black/2` | `#00000005` |
| `black/3` | `#00000008` |
| `black/6` | `#0000000F` |

Opacity scales:

- `black/0–100`: `#00000000`, `#0000001A`, `#00000033`, `#0000004D`, `#00000066`, `#00000080`, `#00000099`, `#000000B2`, `#000000CC`, `#000000E5`, `#000000`
- `white/0–100`: `#FFFFFF00`, `#FFFFFF1A`, `#FFFFFF33`, `#FFFFFF4D`, `#FFFFFF66`, `#FFFFFF80`, `#FFFFFF99`, `#FFFFFFB2`, `#FFFFFFCC`, `#FFFFFFE5`, `#FFFFFF`

Color ramps (`50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`):

| Ramp | Values, light to dark |
| --- | --- |
| `primary` | `#F5F6FA`, `#E9EBF3`, `#D5D9EA`, `#BFC6DF`, `#ACB5D6`, `#96A2CB`, `#6D80B6`, `#4E5D88`, `#343F5E`, `#1B2134`, `#101523` |
| `red` | `#F9F5F5`, `#F2E9E9`, `#E8D6D6`, `#DDC0C0`, `#D4ADAD`, `#CB9696`, `#BE6969`, `#8E4B4B`, `#623232`, `#361919`, `#250F0F` |
| `green` | `#F2FCF6`, `#DEF7E8`, `#C1F0D4`, `#A9E4C2`, `#A0D8B8`, `#96CBAC`, `#759F87`, `#547461`, `#384E41`, `#1B2921`, `#101A14` |
| `yellow` | `#FBF9F3`, `#F6F0E1`, `#F0E5C5`, `#E5D7AA`, `#D9CBA1`, `#CBBE96`, `#A09575`, `#756D55`, `#4E4938`, `#29261B`, `#1A1710` |
| `blue` | `#F4F7F9`, `#EAEEF4`, `#D4DEE9`, `#BFCEDE`, `#ADC0D6`, `#96B0CB`, `#748BA3`, `#536577`, `#374350`, `#1D242C`, `#11161C` |

### `color token` (`VariableCollectionId:3:896`)

These are semantic aliases, not independent colors:

| Semantic token | Alias | Resolved value |
| --- | --- | --- |
| `text/high` | `black/90` | `#000000E5` |
| `text/medium` | `black/60` | `#00000099` |
| `text/low` | `black/40` | `#00000066` |
| `primary/500` | basic `primary/600` | `#6D80B6` |
| `border/0` | `black/0` | `#00000000` |
| `border/3` | `black/3` | `#00000008` |
| `border/6` | `black/6` | `#0000000F` |
| `border/10` | `black/10` | `#0000001A` |

### `font family` (`VariableCollectionId:3:1656`)

- `Fellix-TRIAL`
- `Geist Mono`
- `Roboto`

The collection named `--` is currently empty.

## 2. Figma local text styles

There are 70 local text styles. Fellix styles provide four weights: `Regular`, `Medium`, `SemiBold`, and `Bold`.

| Tier | Size / line height | Letter spacing | Family |
| --- | --- | --- | --- |
| `Display 3` | `104 / 112` | `-0.4px` | Fellix-TRIAL |
| `Display 2` | `88 / 96` | `-0.4px` | Fellix-TRIAL |
| `Display 1` | `76 / 80` | `-0.4px` | Fellix-TRIAL |
| `Heading 6` | `62 / 68` | `-0.2px` | Fellix-TRIAL |
| `Heading 5` | `50 / 56` | `-0.2px` | Fellix-TRIAL |
| `Heading 4` | `42 / 48` | `-0.2px` | Fellix-TRIAL |
| `Heading 3` | `32 / 40` | `-0.2px` | Fellix-TRIAL |
| `Heading 2` | `25 / 36` | `-0.2px` | Fellix-TRIAL |
| `Heading 1` | `22 / 28` | `-0.2px` | Fellix-TRIAL |
| `Title 2` | `18 / 24` | `0` | Fellix-TRIAL |
| `Title 1` | `15 / 24` | `0` | Fellix-TRIAL |
| `Body 2` | `15 / 24` | `0` | Fellix-TRIAL |
| `Body 1` | `13 / 24` | `0` | Fellix-TRIAL |
| `Para` | `13 / 20` | `0` | Fellix-TRIAL |
| `Caption 2` | `12 / 16` | `0` | Fellix-TRIAL |
| `Caption 1` | `10 / 16` | `0` | Fellix-TRIAL |
| `Overline` | `11 / 12` | `1px` | Fellix-TRIAL |
| `Body 2/mono` | `15 / 24` | `0%` | Geist Mono Regular |
| `Caption 2/mono` | `12 / 16` | `0%` | Geist Mono Regular |

## 3. Web code typography

### Font sources and stacks

The page loads Google Fonts for `Inter` (`400–800`) and `Space Grotesk` (`300–700`). It also embeds `Geist Sans` and declares a local variable font face for `ABC Schengen Greek Variable Trial` (`100–900`).

The live page uses the same stack for `--sans`, `--serif`, and `--mono`:

```css
"ABC Schengen Greek Variable Trial",
"Space Grotesk",
"Noto Sans SC",
"Noto Sans CJK SC",
"PingFang SC",
sans-serif
```

Exceptions:

- ASCII, `pre`, and `code`: `ui-monospace, SFMono-Regular, Consolas, monospace`
- Style controller: `Geist Sans, Inter, -apple-system, system-ui, Segoe UI, sans-serif`

At the verified desktop preview, ABC Schengen and Geist Sans were loaded. Google-font faces were declared but not needed because ABC Schengen resolved first.

### Representative computed styles at 1280px

| Role | Size / line height | Weight | Tracking / transform |
| --- | --- | --- | --- |
| Body | `18 / 27.9` | `400` | normal |
| Desktop nav | `13 / 20.15` | `400` | normal |
| Hero H1 | `56 / 60.48` | `300` | `0.5px` |
| Hero lede | `18 / 27.9` | `300` | normal |
| Hero button | `14 / 21.7` | `400` | normal |
| Section number | `12 / 15.6` | `400` | `0.96px`, uppercase |
| Section One H2 | `48 / 51.84` | `300` | `0.5px` |
| Section One intro | `18 / 27` | `300` | normal |
| General section H2 | `48 / 51.84` | `400` | `-2.16px` |
| Integration step H3 | `20 / 23` | `700` | normal |
| FAQ summary | `18 / 27.9` | `500` | normal |
| Footer link | `16 / 24.8` | `400` | normal |
| Footer metadata | `12 / normal` | `400` | normal |

### Core code colors

| Token | Current relevant value |
| --- | --- |
| `--paper` | `#FDFCFC` (later override; an earlier declaration is `#FAF9F5`) |
| `--ink` | `#181818` |
| `--muted` | `#5F5E5C` |
| `--line` | `#BABABA` |
| `--page-primary` | `#181818` |
| `--page-primary-foreground` | `#FFFFFF` |
| `--accent` | resolves to `--page-primary` in the final cascade |

## 4. Important alignment note

Figma and the current web page are not using the same primary typeface:

- Figma text styles: `Fellix-TRIAL` plus `Geist Mono`
- Current landing page: `ABC Schengen Greek Variable Trial` first, then `Space Grotesk` fallbacks

Do not silently substitute one for the other in future pages. Treat the Figma variable/text-style library as the product-system reference and the computed web styles above as the exact landing-page implementation snapshot until a typography migration is explicitly approved.

Figma variables currently use broad `ALL_SCOPES` and have no code syntax mappings. This backup preserves the current state; it does not imply those settings are ideal.
