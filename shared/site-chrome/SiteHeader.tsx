import { useEffect, useRef, useState } from "react";
import { GlobalIcon, GitHubIcon } from "./HeaderIcons";
import { AnimatedThemeToggler } from "./AnimatedThemeToggler";
import { syncSiteTheme } from "./theme";
import { observeSiteLanguage, syncSiteLanguage } from "./language";
import { siteLinks, navigationLinks } from "./links";
import headerLogo from "./assets/knowhere-back-to-top.svg";
import "./site-chrome.css";



export function SiteHeader({ page = "landing", onThemeChange, onLanguageChange }: {
  page?: "landing" | "blog" | "pricing";
  onThemeChange?: (theme: string) => void;
  onLanguageChange?: (language: string) => void | (() => void);
}) {
  const landingHome = page === "landing" ? "#top" : siteLinks.landing;
  const links = navigationLinks(page);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const languageTrigger = useRef<HTMLButtonElement>(null);
  const mobileMenu = useRef<HTMLDivElement>(null);
  const languageMenu = useRef<HTMLDivElement>(null);
  const zh = language === "zh";

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => {
      setDark(syncSiteTheme() === "dark");
    };
    updateTheme();
    const stopLanguage = observeSiteLanguage(setLanguage);
    const onScroll = () => setScrolled(window.scrollY > 16);
    const onPointer = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setLanguageOpen(false);
    };
    const onResize = () => { if (window.innerWidth >= 1200) setMenuOpen(false); };
    setReady(true);
    onScroll();
    media.addEventListener("change", updateTheme);
    window.addEventListener("focus", updateTheme);
    window.addEventListener("pageshow", updateTheme);
    window.addEventListener("storage", updateTheme);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      stopLanguage();
      media.removeEventListener("change", updateTheme);
      window.removeEventListener("focus", updateTheme);
      window.removeEventListener("pageshow", updateTheme);
      window.removeEventListener("storage", updateTheme);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    onThemeChange?.(dark ? "dark" : "light");
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#010909" : "#FFFFFF");
  }, [dark, ready, onThemeChange]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.body.dataset.language = language;
    window.dispatchEvent(new CustomEvent("knowhere-language-change", { detail: { language } }));
    return onLanguageChange?.(language);
  }, [language, ready, onLanguageChange]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileMenu.current?.querySelector<HTMLElement>("a")?.focus();
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen]);

  useEffect(() => {
    if (languageOpen) languageMenu.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
  }, [languageOpen]);

  function toggleTheme() {
    syncSiteTheme(dark ? "light" : "dark");
    setDark(!dark);
  }
  function closeMenu() {
    setMenuOpen(false);
    menuTrigger.current?.focus();
  }
  function chooseLanguage(value: string) {
    setLanguage(syncSiteLanguage(value));
    setLanguageOpen(false);
    languageTrigger.current?.focus();
  }
  const themeButton = (
    <AnimatedThemeToggler className="kh-header-icon kh-theme-toggle" type="button" onClick={toggleTheme}
      aria-pressed={dark} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
      <svg className="kh-theme-icon kh-theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" /></svg>
      <svg className="kh-theme-icon kh-theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.1A8.5 8.5 0 0 1 8.9 4a8.5 8.5 0 1 0 11.1 11.1Z" /></svg>
    </AnimatedThemeToggler>
  );
  const github = <a className="kh-header-icon github-link" href="https://knowhereto.ai/github" aria-label="GitHub"><GitHubIcon /></a>;

  return (
    <header ref={header} data-no-translate className={`kh-site-header${scrolled ? " kh-scrolled" : ""}${menuOpen ? " kh-menu-open" : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          if (languageOpen) { setLanguageOpen(false); languageTrigger.current?.focus(); }
          else if (menuOpen) closeMenu();
        }
        if (event.key === "Tab" && menuOpen && !languageOpen) {
          const focusable = [menuTrigger.current, ...Array.from(mobileMenu.current?.querySelectorAll<HTMLElement>("a,button") || [])].filter(Boolean) as HTMLElement[];
          const first = focusable[0], last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
      }}>
      <nav className="kh-shell kh-header-nav" aria-label="Main navigation">
        <a className="kh-header-wordmark" href={landingHome} aria-label="Knowhere home">
          <img src={headerLogo} width="132" height="52" alt="Knowhere" />
        </a>
        <div className="kh-header-links">
          {links.map(([en, cn, href]) => <a key={en} href={href} target={en === "Docs" ? "_blank" : undefined} rel={en === "Docs" ? "noopener noreferrer" : undefined} aria-current={en.toLowerCase() === page ? "page" : undefined}>{zh ? cn : en}</a>)}
        </div>
        <div className="kh-header-actions">
          <div className="kh-desktop-utility">{github}</div>
          <div className="kh-header-language">
            <button ref={languageTrigger} className="kh-header-icon" type="button" aria-label="Choose language" aria-haspopup="menu" aria-expanded={languageOpen} aria-controls="language-options"
              onClick={() => setLanguageOpen(!languageOpen)}><GlobalIcon /></button>
            <div ref={languageMenu} id="language-options" className="kh-header-language-options" role="menu" aria-label="Language" hidden={!languageOpen}
              onKeyDown={(event) => {
                const items = Array.from(languageMenu.current?.querySelectorAll<HTMLButtonElement>("button") || []);
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  const next = (items.indexOf(document.activeElement as HTMLButtonElement) + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
                  items[next]?.focus();
                }
                if (event.key === "Tab") setLanguageOpen(false);
              }}>
              <button type="button" role="menuitemradio" aria-checked={!zh} onClick={() => chooseLanguage("en")}>English</button>
              <button type="button" role="menuitemradio" aria-checked={zh} onClick={() => chooseLanguage("zh")}>中文</button>
            </div>
          </div>
          <div className="kh-desktop-utility">{themeButton}</div>
          <a className="kh-button kh-header-api" href={siteLinks.login}>{zh ? "获取 API Key" : "Get API Key"}</a>
          <button ref={menuTrigger} className="kh-header-menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-menu"
            onClick={() => { setLanguageOpen(false); setMenuOpen(!menuOpen); }}><span><i /><i /></span></button>
        </div>
      </nav>
      <div ref={mobileMenu} id="mobile-menu" className="kh-header-mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          {links.map(([en, cn, href]) => <a key={en} href={href} onClick={closeMenu}>{zh ? cn : en}</a>)}
        </nav>
        <div className="kh-header-mobile-utilities">
          {github}{themeButton}
          <a className="kh-button" href={siteLinks.login}>{zh ? "获取 API Key" : "Get API Key"}</a>
        </div>
      </div>
    </header>
  );
}
