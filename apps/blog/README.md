# knowhere-blog

A TanStack Start web app configured for Cloudflare Workers.

## Blog homepage

The `/` file route renders the Knowhere editorial homepage. Its visual styles
and article snapshot live in `src/blog`; document metadata and stylesheet
loading use the existing TanStack root route. Icons use the installed Tabler
package. No Next.js runtime or additional dependencies are required.

The page preserves the original blog's hero copy, three featured articles,
category browser, and original article / next-page URLs. The 12 article entries
are a static snapshot of `https://blog.knowhereto.ai/`, not a CMS integration.
Article covers are placeholders. The hero texture comes from the original
site's Noteslab theme (`nl-glass-effect-cells.png`), with brand-color treatment.

Deployment settings remain unchanged: Nitro's `cloudflare_module` preset,
the `knowhere-blog` Worker, and the generated configuration below. This page
does not change domain routes or platform repository bindings.

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Deploy

```bash
pnpm build
pnpm wrangler deploy --config .output/server/wrangler.json
```
