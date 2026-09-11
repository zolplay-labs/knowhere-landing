import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { syncSiteTheme, themeInitScript } from './theme.ts';

const key = 'knowhere-color-theme';
function page(jar: { cookie: string }, host: string, stored: string | null = null, systemDark = false) {
  const root = { dataset: {} as Record<string, string>, style: {} as Record<string, string> };
  const context = {
    document: {
      documentElement: root,
      get cookie() { return jar.cookie.split(';')[0]; },
      set cookie(value: string) { jar.cookie = value; },
    },
    localStorage: { getItem: () => stored, setItem: (_: string, value: string) => { stored = value; } },
    location: { hostname: host, protocol: 'https:' },
    matchMedia: () => ({ matches: systemDark }),
  };
  return { root, context, sync: (theme?: string) => runInNewContext(`(${syncSiteTheme.toString()})(${JSON.stringify(theme)})`, context) };
}

test('cross-app cookie wins over stale local preference in both directions', () => {
  const jar = { cookie: '' };
  const landing = page(jar, 'knowhere-landing.knowhere-landing.workers.dev');
  const blog = page(jar, 'knowhere-blog.knowhere-landing.workers.dev', 'light');
  const pricing = page(jar, 'knowhere-pricing.knowhere-landing.workers.dev', 'dark');
  landing.sync('dark');
  assert.match(jar.cookie, /Domain=knowhere-landing.workers.dev/);
  assert.equal(blog.sync(), 'dark');
  blog.sync('light');
  assert.equal(pricing.sync(), 'light');
  assert.equal(landing.sync(), 'light');
});

test('first-paint initializer and details inherit the shared preference', () => {
  const jar = { cookie: `${key}=dark` };
  const detail = page(jar, 'knowhere-blog.knowhere-landing.workers.dev', 'light');
  runInNewContext(themeInitScript, detail.context);
  assert.equal(detail.root.dataset.theme, 'dark');
  assert.equal(detail.root.style.colorScheme, 'dark');
});

test('system preference is not persisted until an explicit choice', () => {
  const jar = { cookie: '' };
  assert.equal(page(jar, 'localhost', null, true).sync(), 'dark');
  assert.equal(jar.cookie, '');
});

test('legacy preference migrates and formal domain uses its own cookie scope', () => {
  const jar = { cookie: '' };
  assert.equal(page(jar, 'blog.knowhereto.ai', 'dark').sync(), 'dark');
  assert.match(jar.cookie, /Domain=knowhereto.ai/);
  const local = { cookie: '' };
  page(local, 'localhost').sync('light');
  assert.doesNotMatch(local.cookie, /Domain=/);
});
