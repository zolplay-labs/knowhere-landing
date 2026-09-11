// Self-contained so the same initializer can run before SSR hydration.
export function syncSiteTheme(preference?: string) {
  const key = 'knowhere-color-theme';
  const valid = (value: unknown) => value === 'light' || value === 'dark';
  const cookie = document.cookie.split('; ').find(value => value.startsWith(`${key}=`))?.split('=')[1];
  let stored: string | null = null;
  try { stored = localStorage.getItem(key); } catch { /* Storage may be unavailable. */ }
  const saved = valid(preference) ? preference : valid(cookie) ? cookie : valid(stored) ? stored : null;
  const theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (saved) {
    const host = location.hostname;
    const domain = ['knowhere-landing.workers.dev', 'knowhereto.ai'].find(value => host === value || host.endsWith(`.${value}`));
    document.cookie = `${key}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax${domain ? `; Domain=${domain}` : ''}${location.protocol === 'https:' ? '; Secure' : ''}`;
    try { localStorage.setItem(key, theme); } catch { /* The shared cookie remains available. */ }
  }
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  return theme;
}

export const themeInitScript = `(${syncSiteTheme.toString()})()`;
