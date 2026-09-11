export const siteLinks = {
  landing: "https://knowhere-landing.knowhere-landing.workers.dev/",
  pricing: "https://knowhere-pricing.knowhere-landing.workers.dev/",
  blog: "https://knowhere-blog.knowhere-landing.workers.dev/",
  docs: "https://docs.knowhereto.ai/",
  login: "https://knowhere-login.knowhere-landing.workers.dev/",
};
export function navigationLinks(page: string) {
  return [
    ["Comparison", "对比", page === "landing" ? "#comparison" : siteLinks.landing + "#comparison"],
    ["Pricing", "价格", siteLinks.pricing],
    ["Docs", "文档", siteLinks.docs],
    ["Blog", "博客", siteLinks.blog],
  ];
}
