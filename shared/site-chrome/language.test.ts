import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { syncSiteLanguage } from './language.ts';

const key = 'knowhere-language';
function page(jar: { cookie: string }, host: string, stored: string | null = null, blockedStorage = false) {
  const root = { lang: '' };
  const body = { dataset: {} as Record<string, string> };
  const context = {
    document: {
      documentElement: root, body,
      get cookie() { return jar.cookie.split(';')[0]; },
      set cookie(value: string) { jar.cookie = value; },
    },
    localStorage: {
      getItem: () => { if (blockedStorage) throw new Error('Blocked'); return stored; },
      setItem: (_: string, value: string) => { if (blockedStorage) throw new Error('Blocked'); stored = value; },
    },
    location: { hostname: host, protocol: host === 'localhost' ? 'http:' : 'https:' },
  };
  return {
    root, body,
    stored: () => stored,
    sync: (language?: string) => runInNewContext(`(${syncSiteLanguage.toString()})(${JSON.stringify(language)})`, context),
  };
}

test('Pricing choice overrides stale Blog, Landing and Login settings in both directions', () => {
  const jar = { cookie: '' };
  const apps = ['pricing', 'blog', 'landing', 'login'].map(app => page(jar, `knowhere-${app}.knowhere-landing.workers.dev`, 'en'));
  apps[0].sync('zh');
  assert.match(jar.cookie, /Domain=knowhere-landing.workers.dev/);
  assert.match(jar.cookie, /Path=\/; Max-Age=31536000; SameSite=Lax/);
  assert.match(jar.cookie, /; Secure$/);
  for (const app of apps) {
    assert.equal(app.sync(), 'zh');
    assert.equal(app.root.lang, 'zh-CN');
    assert.equal(app.body.dataset.language, 'zh');
    assert.equal(app.stored(), 'zh');
  }
  apps[3].sync('en');
  for (const app of apps) assert.equal(app.sync(), 'en');
});

test('legacy choices migrate while a first visit does not override a later choice', () => {
  const jar = { cookie: '' };
  const fresh = page(jar, 'blog.knowhereto.ai');
  assert.equal(fresh.sync(), 'en');
  assert.equal(jar.cookie, '');
  assert.equal(fresh.stored(), null);
  page(jar, 'knowhereto.ai', 'zh').sync();
  assert.match(jar.cookie, /Domain=knowhereto.ai/);
  assert.equal(fresh.sync(), 'zh');
});

test('local previews share a host cookie without HTTPS or a production domain', () => {
  const jar = { cookie: '' };
  page(jar, 'localhost').sync('zh');
  assert.doesNotMatch(jar.cookie, /Domain=|Secure/);
  assert.equal(page(jar, 'localhost', 'en').sync(), 'zh');
});

test('shared language and explicit switches work when localStorage is blocked', () => {
  const jar = { cookie: `${key}=zh` };
  const app = page(jar, 'blog.knowhereto.ai', null, true);
  assert.equal(app.sync(), 'zh');
  assert.equal(app.sync('en'), 'en');
  assert.match(jar.cookie, /^knowhere-language=en;/);
});

test('invalid preferences are ignored and unrelated hosts never receive the site domain', () => {
  const jar = { cookie: `${key}=invalid` };
  const app = page(jar, 'notknowhereto.ai', 'invalid');
  assert.equal(app.sync('invalid'), 'en');
  app.sync('zh');
  assert.doesNotMatch(jar.cookie, /Domain=/);
});
