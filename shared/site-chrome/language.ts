// The shared cookie takes precedence over each app's legacy local preference.
export function syncSiteLanguage(preference?: string) {
  const key = 'knowhere-language';
  const valid = (value: unknown) => value === 'en' || value === 'zh';
  const cookie = document.cookie.split(';').map(value => value.trim()).find(value => value.startsWith(`${key}=`))?.split('=')[1];
  let stored: string | null = null;
  try { stored = localStorage.getItem(key); } catch { /* Storage may be unavailable. */ }
  const saved = valid(preference) ? preference : valid(cookie) ? cookie : valid(stored) ? stored : null;
  const language = saved || 'en';
  if (saved) {
    const host = location.hostname;
    const domain = ['knowhere-landing.workers.dev', 'knowhereto.ai'].find(value => host === value || host.endsWith(`.${value}`));
    document.cookie = `${key}=${language}; Path=/; Max-Age=31536000; SameSite=Lax${domain ? `; Domain=${domain}` : ''}${location.protocol === 'https:' ? '; Secure' : ''}`;
    try { localStorage.setItem(key, language); } catch { /* The shared cookie remains available. */ }
  }
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.body.dataset.language = language;
  return language;
}

export function observeSiteLanguage(onChange: (language: string) => void) {
  const sync = () => onChange(syncSiteLanguage());
  const onVisible = () => { if (!document.hidden) sync(); };
  sync();
  window.addEventListener('focus', sync);
  window.addEventListener('pageshow', sync);
  window.addEventListener('storage', sync);
  document.addEventListener('visibilitychange', onVisible);
  return () => {
    window.removeEventListener('focus', sync);
    window.removeEventListener('pageshow', sync);
    window.removeEventListener('storage', sync);
    document.removeEventListener('visibilitychange', onVisible);
  };
}
