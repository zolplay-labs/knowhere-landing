import { useEffect, useRef } from "react";

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
  return <canvas ref={canvasRef} className="footer-flickering-grid" aria-hidden="true" />;
}

export function Footer() {
  return (
    <footer className="site-footer">
      <FooterGrid />
      <div className="footer-inner">
        <div className="footer-navigation">
          <a className="footer-brand" href="#overview" aria-label="Knowhere, back to top">
            <img src="/assets/knowhere-footer-mark.svg" width="37" height="42" alt="" />
          </a>
          <div className="footer-navigation-content">
            <nav className="footer-links" aria-label="Footer links">
              <a href="https://knowhere-landing.knowhere-landing.workers.dev/#comparison">Comparison</a>
              <a href="#overview">Pricing</a>
              <a href="https://docs.knowhereto.ai/" target="_blank" rel="noopener noreferrer">Docs</a>
              <a href="https://blog.knowhereto.ai/" target="_blank" rel="noopener noreferrer">Blog</a>
            </nav>
            <p className="footer-copyright">© {new Date().getFullYear()} Knowhere API. All rights reserved.</p>
          </div>
        </div>
        <span className="footer-wordmark" aria-hidden="true" />
      </div>
    </footer>
  );
}
