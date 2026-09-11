import { navigationLinks } from "./links";
import footerLogo from "./assets/knowhere-footer-mark.svg";
import "./site-chrome.css";
import { useEffect, useRef, useState } from "react";

// The landing footer's 4px flickering grid, initialized on the client for SSR.
function FooterGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let columns = 0;
    let rows = 0;
    let squares = new Float32Array(0);
    let maxOpacity = 0.05;
    let frame = 0;
    let lastTime = 0;
    let visible = false;
    let color = "";

    function draw(delta = 0) {
      context!.clearRect(0, 0, canvas.width, canvas.height);
      context!.fillStyle = color;
      for (let column = 0; column < columns; column++) {
        for (let row = 0; row < rows; row++) {
          const index = column * rows + row;
          if (Math.random() < 0.1 * delta) squares[index] = Math.random() * maxOpacity;
          context!.globalAlpha = squares[index];
          context!.fillRect(column * 10, row * 10, 4, 4);
        }
      }
    }
    function resize() {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(width / 10);
      rows = Math.ceil(height / 10);
      color = getComputedStyle(canvas).color;
      maxOpacity = document.documentElement.dataset.theme === "dark" ? 0.16 : 0.05;
      squares = Float32Array.from({ length: columns * rows }, () => Math.random() * maxOpacity);
      draw();
    }
    function animate(time: number) {
      draw(lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0);
      lastTime = time;
      frame = requestAnimationFrame(animate);
    }
    function updateMotion() {
      cancelAnimationFrame(frame);
      lastTime = 0;
      if (visible && !reducedMotion.matches) frame = requestAnimationFrame(animate);
    }
    const resizeObserver = new ResizeObserver(resize);
    const themeObserver = new MutationObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateMotion();
    });
    resize();
    resizeObserver.observe(canvas);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    intersectionObserver.observe(canvas);
    reducedMotion.addEventListener("change", updateMotion);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotion.removeEventListener("change", updateMotion);
    };
  }, []);
  return <canvas ref={canvasRef} className="kh-footer-flickering-grid" aria-hidden="true" />;
}

export function SiteFooter({ page = "landing" }: { page?: "landing" | "blog" | "pricing" }) {
  const [language, setLanguage] = useState("en");
  useEffect(() => {
    setLanguage(localStorage.getItem("knowhere-language") || "en");
    const update = (event: Event) => setLanguage((event as CustomEvent).detail.language);
    window.addEventListener("knowhere-language-change", update);
    return () => window.removeEventListener("knowhere-language-change", update);
  }, []);
  const links = navigationLinks(page);
  return (
    <footer className="kh-site-footer" data-no-translate>
      <FooterGrid />
      <div className="kh-footer-inner">
        <div className="kh-footer-navigation">
          <a className="kh-footer-brand" href={page === "pricing" ? "#overview" : "#top"} aria-label="Knowhere, back to top">
            <img src={footerLogo} width="37" height="42" alt="" />
          </a>
          <div className="kh-footer-navigation-content">
            <nav className="kh-footer-links" aria-label="Footer links">
              {links.map(([en, cn, href]) => <a key={en} href={href} target={en === "Docs" || en === "Blog" ? "_blank" : undefined} rel={en === "Docs" || en === "Blog" ? "noopener noreferrer" : undefined}>{language === "zh" ? cn : en}</a>)}
            </nav>
            <p className="kh-footer-copyright">© {new Date().getFullYear()} Knowhere API. All rights reserved.</p>
          </div>
        </div>
        <span className="kh-footer-wordmark" aria-hidden="true" />
      </div>
    </footer>
  );
}
