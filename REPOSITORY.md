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

## 保留原部署

Landing 继续使用根目录的 `wrangler.jsonc` 和 `dist`。三个子应用继续使用各自 `vite.config.ts` 中的 `cloudflare_module` preset、兼容日期、`nodeCompat` 和 Worker 名称；执行 `pnpm build` 会生成各自的 `.output/server/wrangler.json`。

`apps/wrangler.jsonc` 是空配置边界：阻止 Nitro 向上读取 landing 的账号、兼容日期和静态资源配置。不要删除它，也不要用它部署；部署使用对应应用生成的 `.output/server/wrangler.json`。

在原 Cloudflare 账号、原 Worker 下部署，继续使用原有域名、路由、环境变量和 secrets。代码合并不迁移这些平台设置，不创建替代 Worker，也不改写页面里的外链。

如果原项目通过 Git 自动部署，在原项目内将源码仓库改为 `zolplay-labs/knowhere-landing`，并把 Root directory 改成表格中的目录；保留原分支、安装 / 构建 / 部署命令及其他设置。若配置了构建监听路径，同步改为对应目录。平台上的仓库绑定需要在原部署账号中单独核对，Git 提交不会自动更改绑定。

Blog 原 README 的部署命令保留为：

```bash
cd apps/blog
pnpm build
pnpm wrangler deploy --config .output/server/wrangler.json
```

Login 的原 README 仍包含通用 Node 服务部署示例，但其实际 Vite 配置已经使用 Cloudflare preset；合并时保留两者原文，部署应按现有 Cloudflare 配置生成的 Worker 产物执行。

本次可访问的 Cloudflare 账号只查到 `knowhere-landing`，没有查到另外三个 Worker；源仓库也未登记其线上 URL。因此，三个应用的原部署链接和平台仓库绑定尚未核验或修改。

## 来源与内容核对

导入版本记录在 [apps/sources.json](./apps/sources.json)。每个应用目录的 Git tree 与对应源提交的根 tree 完全相同，包含文件内容、路径及可执行权限。源仓库保留。

可用 `git rev-parse HEAD:apps/blog`（以及 `apps/login`、`apps/pricing`）与记录的 `tree` 核对本次导入快照；后续正常开发会改变 tree。

Blog 的源版本目前只有显示 `Zolplay.` 的初始页面，尚未包含文章列表或详情页。本次合并保留这一状态。
