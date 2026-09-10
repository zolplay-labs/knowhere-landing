import { useEffect, useRef, useState } from "react";
import { GlobalIcon, GitHubIcon } from "./HeaderIcons";
import { AnimatedThemeToggler } from "./AnimatedThemeToggler";
import { observePricingLanguage } from "./pricing-language";

const landingHome = import.meta.env.DEV
  ? "http://localhost:4173/"
  : "https://knowhere-landing.knowhere-landing.workers.dev/";
const links = [
  ["Comparison", "对比", `${landingHome}#comparison`],
  ["Pricing", "定价", "#overview"],
  ["Docs", "文档", "https://docs.knowhereto.ai/"],
  ["Blog", "博客", "https://blog.knowhereto.ai/"],
];

export function Header() {
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
      const saved = localStorage.getItem("knowhere-color-theme");
      setDark(saved ? saved === "dark" : media.matches);
    };
    updateTheme();
    setLanguage(localStorage.getItem("knowhere-language") === "zh" ? "zh" : "en");
    const onScroll = () => setScrolled(window.scrollY > 16);
    const onPointer = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setLanguageOpen(false);
    };
    const onResize = () => { if (window.innerWidth >= 1200) setMenuOpen(false); };
    onScroll();
    media.addEventListener("change", updateTheme);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      media.removeEventListener("change", updateTheme);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#010909" : "#FFFFFF");
  }, [dark]);

  useEffect(() => observePricingLanguage(language), [language]);

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
    localStorage.setItem("knowhere-color-theme", dark ? "light" : "dark");
    setDark(!dark);
  }
  function closeMenu() {
    setMenuOpen(false);
    menuTrigger.current?.focus();
  }
  function chooseLanguage(value: string) {
    setLanguage(value);
    localStorage.setItem("knowhere-language", value);
    setLanguageOpen(false);
    languageTrigger.current?.focus();
  }
  const themeButton = (
    <AnimatedThemeToggler className="header-icon theme-toggle" type="button" onClick={toggleTheme}
      aria-pressed={dark} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
      <svg className="theme-icon theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" /></svg>
      <svg className="theme-icon theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.1A8.5 8.5 0 0 1 8.9 4a8.5 8.5 0 1 0 11.1 11.1Z" /></svg>
    </AnimatedThemeToggler>
  );
  const github = <a className="header-icon github-link" href="https://knowhereto.ai/github" aria-label="GitHub"><GitHubIcon /></a>;

  return (
    <header ref={header} className={`pricing-header${scrolled ? " scrolled" : ""}${menuOpen ? " menu-open" : ""}`}
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
      <nav className="shell header-nav" aria-label="Main navigation">
        <a className="header-wordmark" href={landingHome} aria-label="Knowhere home">
          <img src="/assets/knowhere-back-to-top.svg" width="132" height="52" alt="Knowhere" />
        </a>
        <div className="header-links">
          {links.map(([en, cn, href]) => <a key={en} href={href} aria-current={en === "Pricing" ? "page" : undefined}>{zh ? cn : en}</a>)}
        </div>
        <div className="header-actions">
          <div className="desktop-utility">{github}</div>
          <div className="header-language">
            <button ref={languageTrigger} className="header-icon" type="button" aria-label="Choose language" aria-haspopup="menu" aria-expanded={languageOpen} aria-controls="language-options"
              onClick={() => setLanguageOpen(!languageOpen)}><GlobalIcon /></button>
            <div ref={languageMenu} id="language-options" className="header-language-options" role="menu" aria-label="Language" hidden={!languageOpen}
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
          <div className="desktop-utility">{themeButton}</div>
          <a className="button header-api" href="https://knowhere-login.knowhere-landing.workers.dev">{zh ? "获取 API Key" : "Get API Key"}</a>
          <button ref={menuTrigger} className="header-menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-menu"
            onClick={() => { setLanguageOpen(false); setMenuOpen(!menuOpen); }}><span><i /><i /></span></button>
        </div>
      </nav>
      <div ref={mobileMenu} id="mobile-menu" className="header-mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          {links.map(([en, cn, href]) => <a key={en} href={href} onClick={closeMenu}>{zh ? cn : en}</a>)}
        </nav>
        <div className="header-mobile-utilities">
          {github}{themeButton}
          <a className="button" href="https://knowhere-login.knowhere-landing.workers.dev">{zh ? "获取 API Key" : "Get API Key"}</a>
        </div>
      </div>
    </header>
  );
}
