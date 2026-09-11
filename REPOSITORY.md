# KNOWHERE 应用仓库

四个应用集中管理代码，分别安装依赖、构建和部署。根目录保留 landing 的原有结构；三个导入应用完整保留各自的源码、内容、素材、锁文件、开发脚本和 Cloudflare 配置。

| 应用 | 工作目录 / 部署 Root directory | 技术栈 | Cloudflare Worker |
| --- | --- | --- | --- |
| Landing | `.` | React 18、Vite 6、npm | `knowhere-landing` |
| Blog | `apps/blog` | React 19、TanStack Start、Vite 8、Nitro、pnpm | `knowhere-blog` |
| Login | `apps/login` | React 19、TanStack Start、Vite 8、Nitro、pnpm | `knowhere-login` |
| Pricing | `apps/pricing` | React 19、TanStack Start、Vite 8、Nitro、pnpm | `knowhere-pricing` |

## 开发与构建

Landing 在仓库根目录运行，命令保持原样：

```bash
npm ci
npm run dev
npm run build
```

其他应用先进入对应目录，分别安装原有锁文件中的依赖。例如：

```bash
cd apps/blog
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

Login 和 Pricing 将上面的 `apps/blog` 分别换成 `apps/login`、`apps/pricing`。Blog 的 `packageManager` 固定为 `pnpm@12.0.0`；其他应用沿用自己的 pnpm 配置。使用支持各应用所锁定工具链的 Node 版本；本次验证环境为 Node 26.4.0，Blog 使用 pnpm 12.0.0，Login / Pricing 使用 pnpm 11.8.0。

三个子应用原来都在 3000 端口启动。需要同时开发时，可分别运行 `pnpm dev --port 3001`、`pnpm dev --port 3002`、`pnpm dev --port 3003`。这些仅是本地端口，不影响线上地址。

根目录的 `npm run build` 仍然只构建 landing。各应用不共享依赖目录或锁文件，也没有把 React 18 与 React 19 合并成一个运行时。

Landing、Blog 和 Pricing 的导航与 Footer 共用 `shared/site-chrome/` 下的组件、样式和品牌素材。所有跨站目标统一维护在 `links.ts`；各应用的 Vite 配置通过 `resolve.dedupe` 使用自身的 React。语言翻译保留在所属应用中，共享导航通过语言事件或回调通知页面。修改共享组件后需要分别构建、检查并部署这三个应用，单独部署 Landing 不会更新另外两个站点。

四个应用的语言偏好统一由 `shared/site-chrome/language.ts` 管理。`knowhere-language` Cookie 在 `knowhere-landing.workers.dev` 或 `knowhereto.ai` 的子域间共享，优先于各应用旧的 localStorage；本地同主机的不同端口也共享。没有已保存的选择时沿用英文默认值，首次选择后全站记住；刷新、前进后退和重新激活标签页时同步。两组不同根域名之间不共享 Cookie。修改此逻辑需要验证并分别部署四个应用；翻译内容仍由各应用维护。

## 保留原部署

Landing 继续使用根目录的 `wrangler.jsonc` 和 `dist`。三个子应用继续使用各自 `vite.config.ts` 中的 `cloudflare_module` preset、兼容日期、`nodeCompat` 和 Worker 名称；执行 `pnpm build` 会生成各自的 `.output/server/wrangler.json`。

`apps/wrangler.jsonc` 是空配置边界：阻止 Nitro 向上读取 landing 的账号、兼容日期和静态资源配置。不要删除它，也不要用它部署；部署使用对应应用生成的 `.output/server/wrangler.json`。

后续更新使用下方记录的 Cloudflare 账号与 Worker，保留已有域名、路由、环境变量和 secrets。代码合并不自动迁移这些平台设置，也不改写页面里的外链。

如果原项目通过 Git 自动部署，在原项目内将源码仓库改为 `zolplay-labs/knowhere-landing`，并把 Root directory 改成表格中的目录；保留原分支、安装 / 构建 / 部署命令及其他设置。若配置了构建监听路径，同步改为对应目录。平台上的仓库绑定需要在原部署账号中单独核对，Git 提交不会自动更改绑定。

Blog 原 README 的部署命令保留为：

```bash
cd apps/blog
pnpm build
pnpm wrangler deploy --config .output/server/wrangler.json
```

Login 的原 README 仍包含通用 Node 服务部署示例，但其实际 Vite 配置已经使用 Cloudflare preset；合并时保留两者原文，部署应按现有 Cloudflare 配置生成的 Worker 产物执行。

### 2026-09-08 部署记录

三个应用已从本仓库提交 `2f0f09d340065876ff5b1032e4d689ef19d0f443` 构建，并通过 Wrangler 发布到 landing 所在的 Cloudflare 账号 `de2cfcddb1691bd2a7fab82b25ba78f9`。该账号部署前只有 landing，本次按各应用原配置名称创建了三个 Worker。

| 应用 | 访问地址 | Cloudflare Version ID |
| --- | --- | --- |
| Blog | https://knowhere-blog.knowhere-landing.workers.dev | `cb0d3fd6-2be2-4ff1-a840-c093558121ab` |
| Login | https://knowhere-login.knowhere-landing.workers.dev | `76daf510-95c0-4b42-b234-55862b902497` |
| Pricing | https://knowhere-pricing.knowhere-landing.workers.dev | `40da0d0d-99ff-49b0-9b17-c1cea14507e8` |

Cloudflare 已确认三个版本均承接 100% 流量，且启用了 `workers.dev` 地址。三个应用均构建通过；使用系统现有代理访问时，三个首页均返回 HTTP 200。当前网络直接访问 `workers.dev` 会超时。

本次为手动部署，尚未设置 Git 推送自动部署。`knowhereto.ai`、`blog.knowhereto.ai` 等原域名、原页面外链和其他账号的部署均未改动。Login 保留原来的演示表单，尚未接入真实认证服务。

### 2026-09-08 Login 图形与试用入口更新

从 `eb83516` 的独立发布目录构建，仅加入 Login 的 `catenoid-field` 图形替换及素材、Landing 两处「Start free trial」链接更新。按钮现在指向 `https://knowhere-login.knowhere-landing.workers.dev`。工作区其他尚未提交的页面改动未包含在此次部署中。

| 应用 | Cloudflare Version ID |
| --- | --- |
| Login | `de52b84c-2d3a-4223-8bed-05fd4a80f1dc` |
| Landing | `4aaa3016-2c42-4988-99a1-32aed81ce776` |

两个应用构建通过，Wrangler 确认部署成功。通过系统代理核验了线上登录页 HTML、SVG 内容与 Landing 发布脚本中的两个按钮目标。浏览器自动化加载超时，尚未完成线上实际点击验证。

### 2026-09-09 Login 布局与表单状态更新

Login 从 main 提交 `4d4d52dadcc97b19d1ff8587da3c832c9453b612` 的独立工作树安装锁定依赖、构建并部署，包含居中布局、动态背景、静态底部数据纹理、语言菜单和表单组件状态。本次仅发布 Login，工作区其他应用的改动未包含在部署中。

- 访问地址：https://knowhere-login.knowhere-landing.workers.dev
- Cloudflare Version ID：`a3f69a76-5442-4815-926d-37461cf275bb`
- Deployment ID：`5fa95288-ad0e-4c80-8b7c-2504faa02457`，承接 100% 流量。
- 使用现有账号和 Worker，通过 `--keep-vars` 保留环境变量。

锁定依赖安装、生产构建和 TypeScript 检查均通过。线上首页返回 HTTP 200，核心 CSS 与路由脚本已与独立构建产物逐字节核对一致。浏览器自动化读取超时，尚未完成本次线上交互复核。邮箱发送仍为演示状态，未接入真实邮件服务或 OAuth。

### 2026-09-09 Login 动态纹理与标题更新

Login 从 main 提交 `30c5e4a` 的独立工作树构建并部署。保留居中版，标题改为 `Sign in to Knowhere` 并居中；背景进度连续推进，修复循环归零时的跳帧；底部数据块内部流动，控制器隐藏，参数固定在源码中。

- Cloudflare Version ID：`14aac9eb-03b3-41c8-8f24-326a16fba67d`
- Deployment ID：`37c02793-3240-4933-8c25-659de6781c5e`，承接 100% 流量。
- 地址沿用 https://knowhere-login.knowhere-landing.workers.dev ，部署保留现有环境变量。
- 固定参数：速度 2.9、扭曲 0.65、相位 33.7、块大小 5、密度 0.9、强度 1.1、高度 1.2、横向疏密 4.1、水平位置 -300。

锁定依赖安装、构建与 TypeScript 检查通过。线上首页 HTTP 200，标题与 9 个参数已核对；8 个线上 CSS / JavaScript 资源与构建产物逐字节一致，包括隐藏控制器样式和动态渐变脚本。本地页面已完成交互及响应式检查；线上浏览器自动化加载超时，未完成线上交互复核。

## 来源与内容核对

导入版本记录在 [apps/sources.json](./apps/sources.json)。初次导入时，每个应用目录的 Git tree 与对应源提交的根 tree 完全相同，包含文件内容、路径及可执行权限。源仓库保留。

可用 `git rev-parse HEAD:apps/blog`（以及 `apps/login`、`apps/pricing`）与记录的 `tree` 核对本次导入快照；后续正常开发会改变 tree。

Blog 初次导入的源版本只有 `Zolplay.` 占位页；提交 `2f0f09d` 已在本仓库加入 Blog 首页、12 条文章摘要、分类与搜索。文章正文和下一页仍链接到原博客，未接入 CMS。
